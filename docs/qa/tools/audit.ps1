<#
  audit.ps1 - measured (not eyeballed) page audit over CDP. Same zero-dependency plumbing as capture.ps1.

  Per route it records:
    * initial payload: heavy local assets (models / videos / images) requested BEFORE any scroll
    * contrast: every visible text node, its colour composited over the nearest opaque ancestor
      background, WCAG 2.1 ratio, and whether it clears AA (4.5:1, or 3:1 for large text).
      Text whose backdrop is an image, gradient, video or canvas cannot be resolved from CSS and is
      counted separately as "unresolved" rather than guessed.
    * font weights actually rendered (computed font-weight histogram by text length)

  Usage: powershell -ExecutionPolicy Bypass -File audit.ps1 -BaseUrl http://localhost:4173 -OutFile audit.json
#>
param(
  [string]$BaseUrl = "http://localhost:4173",
  [Parameter(Mandatory = $true)][string]$OutFile,
  [string]$Chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe",
  [int]$DebugPort = 9334,
  [string]$ProfileDir = (Join-Path $env:TEMP "pa-audit-chrome-profile"),
  [string[]]$Routes = @("/", "/products", "/industries", "/applications", "/technology", "/downloads",
                        "/case-studies", "/career", "/faq", "/about", "/management-team", "/quality", "/contact"),
  [int]$Width = 1440, [int]$Height = 900,
  [string]$PublicDir,
  [int]$ReadyTimeoutSec = 75
)
$ErrorActionPreference = "Stop"; $ProgressPreference = "SilentlyContinue"
$Routes = @($Routes | ForEach-Object { $_ -split "," } | ForEach-Object { $_.Trim() } | Where-Object { $_ })

$script:ws = $null; $script:msgId = 0
function Receive-CdpMessage {
  $ms = New-Object System.IO.MemoryStream; $buf = New-Object byte[] 1048576
  $seg = New-Object System.ArraySegment[byte] -ArgumentList @(, $buf)
  do { $r = $script:ws.ReceiveAsync($seg, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
       if ($r.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Close) { throw "CDP socket closed" }
       $ms.Write($buf, 0, $r.Count) } while (-not $r.EndOfMessage)
  [Text.Encoding]::UTF8.GetString($ms.ToArray())
}
function Invoke-Cdp { param([string]$Method, [hashtable]$Params = @{})
  $script:msgId++; $id = $script:msgId
  $bytes = [Text.Encoding]::UTF8.GetBytes((@{ id = $id; method = $Method; params = $Params } | ConvertTo-Json -Depth 12 -Compress))
  $seg = New-Object System.ArraySegment[byte] -ArgumentList @(, $bytes)
  [void]$script:ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
  $prefix = '{"id":' + $id
  while ($true) { $msg = Receive-CdpMessage; if ($msg.StartsWith($prefix + ',') -or $msg.StartsWith($prefix + '}')) { return ($msg | ConvertFrom-Json) } }
}
function Invoke-Js { param([string]$Expression, [int]$TimeoutMs = 90000)
  $r = Invoke-Cdp "Runtime.evaluate" @{ expression = $Expression; awaitPromise = $true; returnByValue = $true; timeout = $TimeoutMs }
  if ($r.result.exceptionDetails) { throw "JS error: $($r.result.exceptionDetails.exception.description)" }
  $r.result.result.value
}
function Wait-Js { param([string]$Expression, [int]$TimeoutSec = 60)
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) { try { if (Invoke-Js $Expression) { return $true } } catch { }; Start-Sleep -Milliseconds 400 }
  $false
}

$JS_BOOTED = '(() => { const h = !!document.getElementById("pa-error"); if (h && !window.__ready) return false; if (document.getElementById("pa-boot")) return false; const r = document.getElementById("root"); return !!r && r.children.length > 0 && document.readyState === "complete"; })()'
$JS_CONTENT_READY = '(() => document.querySelectorAll(".animate-pulse").length === 0 && document.fonts.status === "loaded")()'
$JS_NETWORK_QUIET = @'
(async () => { const quietMs = 2500, maxMs = 45000, t0 = performance.now(); let n = performance.getEntriesByType("resource").length, since = performance.now();
  while (performance.now() - t0 < maxMs) { await new Promise(r => setTimeout(r, 250)); const m = performance.getEntriesByType("resource").length;
    if (m !== n) { n = m; since = performance.now(); } else if (performance.now() - since >= quietMs) break; } return n; })()
'@
$JS_HEAVY = @'
(() => JSON.stringify(performance.getEntriesByType("resource")
  .filter(e => new URL(e.name).origin === location.origin && /\/(models|videos|images)\//.test(new URL(e.name).pathname))
  .map(e => ({ path: new URL(e.name).pathname, bytes: e.encodedBodySize || e.decodedBodySize || 0 }))))()
'@
$JS_WARM_SCROLL = @'
(async () => { const H = () => document.documentElement.scrollHeight; const step = Math.max(200, Math.round(innerHeight * 0.7));
  for (let y = 0; y < H(); y += step) { window.scrollTo({ top: y, left: 0, behavior: "instant" }); await new Promise(r => setTimeout(r, 140)); }
  window.scrollTo({ top: 0, left: 0, behavior: "instant" }); await new Promise(r => setTimeout(r, 900)); return H(); })()
'@

# The contrast walk. Runs with the page scrolled to top after one warm pass (so reveals are visible).
$JS_CONTRAST = @'
(() => {
  // Tailwind v4 emits oklab()/color-mix(), so computed colours are not always rgb(): let a canvas normalise any CSS colour to sRGB.
  const cvs = document.createElement("canvas"); cvs.width = cvs.height = 1;
  const cx = cvs.getContext("2d", { willReadFrequently: true }); const colorCache = new Map();
  const parse = (c) => {
    if (colorCache.has(c)) return colorCache.get(c);
    let out = null;
    const m = c.match(/^rgba?\(([^)]+)\)$/);
    if (m) { const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); out = { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
    else {
      cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#010203"; cx.fillStyle = c;
      if (cx.fillStyle !== "#010203") { cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; out = { r: d[0], g: d[1], b: d[2], a: d[3] / 255 }; }
    }
    colorCache.set(c, out); return out;
  };
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const over = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
  const hex = (c) => "#" + [c.r, c.g, c.b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
  // Nearest opaque backdrop: composite translucent layers on the way up; bail out on anything CSS can't resolve.
  const backdrop = (el) => {
    const layers = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return { unresolved: "background-image" };
      if (n.tagName === "VIDEO" || n.tagName === "CANVAS") return { unresolved: n.tagName.toLowerCase() };
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) { layers.push(bg); if (bg.a >= 0.999) break; }
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    if (layers.length && layers[layers.length - 1].a >= 0.999) base = layers.pop();
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return { color: base };
  };
  // Text laid over media by absolute positioning has no media ancestor; detect a sibling stack instead.
  const overMedia = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) { const cs = getComputedStyle(n);
      if ((cs.position === "absolute" || cs.position === "fixed" || cs.position === "sticky") && n.parentElement && n.parentElement.querySelector(":scope > video, :scope > canvas, :scope > img, :scope > div > video, :scope > div > canvas")) return true; } return false; };
  const seen = new Map(); const weights = {}; let total = 0, unresolved = 0, passed = 0, unparsed = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    const text = t.nodeValue.replace(/\s+/g, " ").trim(); if (text.length < 2) continue;
    const el = t.parentElement; if (!el || el.closest("script,style,noscript,[aria-hidden='true'],#pa-error,#pa-boot")) continue;
    const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    let op = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) op *= parseFloat(getComputedStyle(n).opacity || "1"); if (op < 0.05) continue;
    total++;
    const w = cs.fontWeight; weights[w] = (weights[w] || 0) + text.length;
    const fg0 = parse(cs.color); if (!fg0) { unparsed++; continue; }
    const bd = overMedia(el) ? { unresolved: "over media" } : backdrop(el);
    if (bd.unresolved) { unresolved++; continue; }
    const fg = over({ ...fg0, a: fg0.a * op }, bd.color);
    const L1 = lum(fg), L2 = lum(bd.color); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(cs.fontSize); const large = px >= 24 || (px >= 18.66 && parseInt(w, 10) >= 700);
    const need = large ? 3 : 4.5;
    if (ratio >= need) { passed++; continue; }
    const cls = String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className);
    const tw = (cls.match(/(?:^|\s)((?:hover:)?text-[^\s]+)/g) || []).map(s => s.trim()).filter(s => !/^text-(xs|sm|base|lg|xl|\dxl|center|left|right|\[\d)/.test(s)).join(" ");
    const key = hex(fg) + " on " + hex(bd.color) + " | " + Math.round(px) + "px/" + w + " | " + (tw || "(inherited)");
    const e = seen.get(key) || { pair: hex(fg) + " on " + hex(bd.color), ratio: Math.round(ratio * 100) / 100, need, fontPx: Math.round(px), weight: w, classes: tw || "(inherited)", count: 0, sample: text.slice(0, 70) };
    e.count++; seen.set(key, e);
  }
  const failures = [...seen.values()].sort((a, b) => b.count - a.count);
  return JSON.stringify({ textNodes: total, passed, unresolved, unparsed, failing: failures.reduce((s, f) => s + f.count, 0), failures: failures.slice(0, 40), fontWeights: weights });
})()
'@

if (-not (Test-Path -LiteralPath $Chrome)) { throw "Chrome not found at $Chrome" }
New-Item -ItemType Directory -Force -Path $ProfileDir | Out-Null
$chromeArgs = @("--headless=new", "--remote-debugging-port=$DebugPort", "--user-data-dir=`"$ProfileDir`"", "--no-first-run", "--no-default-browser-check",
  "--disable-extensions", "--disable-sync", "--hide-scrollbars", "--mute-audio", "--autoplay-policy=no-user-gesture-required",
  "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader", "--force-color-profile=srgb", "--window-size=$Width,$Height", "about:blank")
$proc = Start-Process -FilePath $Chrome -ArgumentList $chromeArgs -PassThru -WindowStyle Hidden
try {
  $version = $null
  for ($i = 0; $i -lt 40 -and -not $version; $i++) { try { $version = Invoke-RestMethod -Uri "http://127.0.0.1:$DebugPort/json/version" -TimeoutSec 3 } catch { Start-Sleep -Milliseconds 500 } }
  if (-not $version) { throw "DevTools endpoint did not come up" }
  $target = Invoke-RestMethod -Method Put -Uri "http://127.0.0.1:$DebugPort/json/new?about:blank" -TimeoutSec 10
  $script:ws = New-Object System.Net.WebSockets.ClientWebSocket
  [void]$script:ws.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
  Invoke-Cdp "Page.enable" | Out-Null; Invoke-Cdp "Runtime.enable" | Out-Null
  Invoke-Cdp "Emulation.setDeviceMetricsOverride" @{ width = $Width; height = $Height; deviceScaleFactor = 1; mobile = $false } | Out-Null
  Invoke-Cdp "Emulation.setEmulatedMedia" @{ features = @(@{ name = "prefers-reduced-motion"; value = "no-preference" }) } | Out-Null

  $out = New-Object System.Collections.Generic.List[object]
  foreach ($route in $Routes) {
    Write-Host "[audit] $route"
    $booted = $false
    for ($a = 1; $a -le 3 -and -not $booted; $a++) { Invoke-Cdp "Page.navigate" @{ url = ($BaseUrl.TrimEnd("/") + $route) } | Out-Null; $booted = Wait-Js $JS_BOOTED -TimeoutSec $ReadyTimeoutSec }
    Wait-Js $JS_CONTENT_READY -TimeoutSec 45 | Out-Null
    Invoke-Js $JS_NETWORK_QUIET | Out-Null
    # --- initial payload: nothing has been scrolled yet
    $initial = @()
    # Assign before iterating: PS 5.1's ConvertFrom-Json emits a JSON array as one pipeline object.
    $heavyList = (Invoke-Js $JS_HEAVY) | ConvertFrom-Json
    foreach ($h in $heavyList) {
      if ($null -eq $h) { continue }
      $bytes = [int64]$h.bytes
      if ($bytes -eq 0 -and $PublicDir) { $f = Join-Path $PublicDir ($h.path.TrimStart("/").Replace("/", "\")); if (Test-Path -LiteralPath $f -PathType Leaf) { $bytes = (Get-Item -LiteralPath $f).Length } }
      $initial += [ordered]@{ path = $h.path; bytes = $bytes }
    }
    $initialBytes = ($initial | ForEach-Object { $_.bytes } | Measure-Object -Sum).Sum
    Invoke-Js $JS_WARM_SCROLL -TimeoutMs 120000 | Out-Null
    $c = (Invoke-Js $JS_CONTRAST) | ConvertFrom-Json
    $out.Add([ordered]@{ route = $route; booted = $booted; initialHeavyBytes = $initialBytes; initialHeavyAssets = $initial
      textNodes = $c.textNodes; contrastPass = $c.passed; contrastFail = $c.failing; contrastUnresolved = $c.unresolved; contrastUnparsed = $c.unparsed
      failures = $c.failures; fontWeights = $c.fontWeights })
    Write-Host ("    text={0} pass={1} FAIL={2} unresolved={3}  initial heavy={4:N1} MB" -f $c.textNodes, $c.passed, $c.failing, $c.unresolved, ($initialBytes / 1MB))
  }
  [ordered]@{ auditedAt = (Get-Date).ToString("s"); baseUrl = $BaseUrl; viewport = "${Width}x${Height}"; browser = $version.Browser; pages = $out } |
    ConvertTo-Json -Depth 8 | Out-File -LiteralPath $OutFile -Encoding utf8
  Write-Host "audit -> $OutFile"
}
finally {
  try { if ($script:ws) { $script:ws.Dispose() } } catch { }
  try { if ($proc -and -not $proc.HasExited) { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue } } catch { }
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -and ($_.CommandLine -match ([regex]::Escape($ProfileDir) + '(["\s]|$)')) } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
}
