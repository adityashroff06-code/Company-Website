<#
  capture.ps1 - headless-Chrome screenshot harness for the Product Armor site.

  Zero dependencies: drives an installed Chrome/Edge over the DevTools protocol (CDP) from
  Windows PowerShell 5.1, so it works on a machine without Node/Playwright.

  For every route x viewport it:
    1. emulates the viewport (and prefers-reduced-motion when -ReducedMotion is passed)
    2. loads the page and waits for app boot, CMS content, fonts and a quiet network
    3. scrolls the whole page once so IntersectionObserver reveals and lazy media fire
    4. saves   <viewport>/<slug>.fold.jpg   - the first viewport, exactly WxH
               <viewport>/<slug>.full.jpg   - the full page (device scale factor 1)
               <viewport>/pinned/<slug>.pNNN.jpg - pinned stages at progress 0/.25/.5/.75/1
    5. records diagnostics (console errors, failed requests, WebGL renderer, horizontal
       overflow, heavy local assets requested) into capture-log.json

  Usage:
    powershell -ExecutionPolicy Bypass -File capture.ps1 -BaseUrl http://localhost:4173 -OutDir docs\baseline\screenshots
    ... -Viewports desktop,tablet,mobile -ReducedMotion -Routes /,/products
#>
param(
  [string]$BaseUrl = "http://localhost:4173",
  [Parameter(Mandatory = $true)][string]$OutDir,
  [string]$Chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe",
  [int]$DebugPort = 9333,
  [string]$ProfileDir = (Join-Path $env:TEMP "pa-capture-chrome-profile"),
  [string[]]$Routes = @("/", "/products", "/industries", "/applications", "/technology", "/downloads",
                        "/case-studies", "/career", "/faq", "/about", "/management-team", "/quality", "/contact"),
  [string[]]$Viewports = @("desktop", "mobile"),
  [switch]$ReducedMotion,
  [switch]$NoPinned,
  [switch]$NoWebGL,
  # The site's public/ folder; used only to look up sizes of range-requested media for the log.
  [string]$PublicDir,
  [int]$ReadyTimeoutSec = 75,
  # How long to let a pinned stage ease to rest after an instant jump to a progress point.
  [int]$PinnedSettleMs = 4000,
  [int]$JpegQuality = 82
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# `powershell -File` hands "a,b" over as one string rather than an array; accept both spellings.
$Viewports = @($Viewports | ForEach-Object { $_ -split "," } | ForEach-Object { $_.Trim() } | Where-Object { $_ })
$Routes    = @($Routes    | ForEach-Object { $_ -split "," } | ForEach-Object { $_.Trim() } | Where-Object { $_ })

$VIEWPORT_DEFS = @{
  desktop = @{ width = 1440; height = 900;  dsf = 1; mobile = $false }
  tablet  = @{ width = 768;  height = 1024; dsf = 1; mobile = $true  }
  mobile  = @{ width = 390;  height = 844;  dsf = 2; mobile = $true  }
}
$MOBILE_UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36"

# Tall scroll tracks with a sticky stage inside; captured at fixed progress points.
$PINNED_SELECTOR = 'section[aria-label][style*="vh"]'

# ---------------------------------------------------------------- CDP plumbing
$script:ws = $null
$script:msgId = 0
$script:events = New-Object System.Collections.Generic.List[string]

function Receive-CdpMessage {
  $ms = New-Object System.IO.MemoryStream
  $buf = New-Object byte[] 1048576
  $seg = New-Object System.ArraySegment[byte] -ArgumentList @(, $buf)
  do {
    $r = $script:ws.ReceiveAsync($seg, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    if ($r.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Close) { throw "CDP socket closed by browser" }
    $ms.Write($buf, 0, $r.Count)
  } while (-not $r.EndOfMessage)
  return [Text.Encoding]::UTF8.GetString($ms.ToArray())
}

function Invoke-Cdp {
  param([string]$Method, [hashtable]$Params = @{}, [switch]$Raw)
  $script:msgId++
  $id = $script:msgId
  $payload = @{ id = $id; method = $Method; params = $Params } | ConvertTo-Json -Depth 12 -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($payload)
  $seg = New-Object System.ArraySegment[byte] -ArgumentList @(, $bytes)
  [void]$script:ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
  $prefix = '{"id":' + $id
  while ($true) {
    $msg = Receive-CdpMessage
    if ($msg.StartsWith($prefix + ',') -or $msg.StartsWith($prefix + '}')) {
      if ($msg.Contains('"error":{') -and -not $msg.Contains('"result":{')) { throw "CDP $Method failed: $($msg.Substring(0, [Math]::Min(400, $msg.Length)))" }
      if ($Raw) { return $msg }
      return ($msg | ConvertFrom-Json)
    }
    # An event. Keep only the ones the diagnostics care about (raw; parsed lazily).
    if ($msg.Contains('"method":"Runtime.exceptionThrown"') -or
        $msg.Contains('"method":"Network.loadingFailed"') -or
        $msg.Contains('"method":"Network.responseReceived"') -or
        ($msg.Contains('"method":"Runtime.consoleAPICalled"') -and $msg.Contains('"type":"error"')) -or
        ($msg.Contains('"method":"Log.entryAdded"') -and $msg.Contains('"level":"error"'))) {
      $script:events.Add($msg)
    }
  }
}

function Invoke-Js {
  param([string]$Expression, [int]$TimeoutMs = 60000)
  $r = Invoke-Cdp "Runtime.evaluate" @{ expression = $Expression; awaitPromise = $true; returnByValue = $true; timeout = $TimeoutMs }
  if ($r.result.exceptionDetails) { throw "JS error: $($r.result.exceptionDetails.exception.description)" }
  return $r.result.result.value
}

function Wait-Js {
  param([string]$Expression, [int]$TimeoutSec = 60, [int]$PollMs = 400, [string]$What = "condition")
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) {
    try { if (Invoke-Js $Expression) { return $true } } catch { }
    Start-Sleep -Milliseconds $PollMs
  }
  Write-Host "    ! timed out waiting for $What" -ForegroundColor Yellow
  return $false
}

function Save-Screenshot {
  param([string]$Path, [hashtable]$Clip)
  $p = @{ format = "jpeg"; quality = $JpegQuality; fromSurface = $true }
  if ($Clip) { $p.clip = $Clip; $p.captureBeyondViewport = $true }
  $raw = Invoke-Cdp "Page.captureScreenshot" $p -Raw
  $m = [regex]::Match($raw, '"data":"([^"]+)"')
  if (-not $m.Success) { throw "no image data in captureScreenshot response" }
  [IO.File]::WriteAllBytes($Path, [Convert]::FromBase64String($m.Groups[1].Value))
}

function Get-Slug([string]$route) { if ($route -eq "/") { "home" } else { $route.Trim("/").Replace("/", "_") } }

# ---------------------------------------------------------------- page scripts
$JS_BOOTED = @'
(() => {
  const harness = !!document.getElementById("pa-error");
  if (harness && !window.__ready) return false;
  if (document.getElementById("pa-boot")) return false;
  const root = document.getElementById("root");
  return !!root && root.children.length > 0 && document.readyState === "complete";
})()
'@

$JS_CONTENT_READY = @'
(() => document.querySelectorAll(".animate-pulse").length === 0 && document.fonts.status === "loaded")()
'@

# Resolves once no new resource entry has appeared for `quietMs`.
$JS_NETWORK_QUIET = @'
(async () => {
  const quietMs = 1800, maxMs = 45000, t0 = performance.now();
  let n = performance.getEntriesByType("resource").length, since = performance.now();
  while (performance.now() - t0 < maxMs) {
    await new Promise(r => setTimeout(r, 250));
    const m = performance.getEntriesByType("resource").length;
    if (m !== n) { n = m; since = performance.now(); }
    else if (performance.now() - since >= quietMs) break;
  }
  return n;
})()
'@

# One pass down the page so reveals, lazy images and lazily-attached video all fire, then home.
$JS_WARM_SCROLL = @'
(async () => {
  const H = () => document.documentElement.scrollHeight;
  const step = Math.max(200, Math.round(innerHeight * 0.7));
  for (let y = 0; y < H(); y += step) {
    window.scrollTo({ top: y, left: 0, behavior: "instant" });
    await new Promise(r => setTimeout(r, 160));
  }
  window.scrollTo({ top: H(), left: 0, behavior: "instant" });
  await new Promise(r => setTimeout(r, 300));
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  await new Promise(r => setTimeout(r, 1200));
  return H();
})()
'@

$JS_DIAGNOSTICS = @'
(() => {
  const de = document.documentElement;
  let renderer = null;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (gl) { const ext = gl.getExtension("WEBGL_debug_renderer_info"); renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "webgl (renderer masked)"; }
  } catch (e) { renderer = "error: " + e.message; }
  const heavy = performance.getEntriesByType("resource")
    .filter(e => /\/(models|videos|images)\//.test(new URL(e.name).pathname) && new URL(e.name).origin === location.origin)
    .map(e => ({ path: new URL(e.name).pathname, bytes: e.encodedBodySize || e.decodedBodySize || 0 }));
  const overflowing = [];
  if (de.scrollWidth > innerWidth + 1) {
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.right > innerWidth + 1 && r.width > 0 && overflowing.length < 8) {
        overflowing.push((el.tagName.toLowerCase() + "." + String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className).split(/\s+/).slice(0, 4).join(".")).slice(0, 120) + " right=" + Math.round(r.right));
      }
    }
  }
  return JSON.stringify({
    title: document.title,
    innerWidth, innerHeight,
    scrollWidth: de.scrollWidth, scrollHeight: de.scrollHeight,
    horizontalOverflowPx: Math.max(0, de.scrollWidth - innerWidth),
    overflowing,
    canvases: document.querySelectorAll("canvas").length,
    webglRenderer: renderer,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    revealPending: document.querySelectorAll(".reveal:not(.visible), .career-reveal:not(.career-revealed)").length,
    videos: [...document.querySelectorAll("video")].map(v => ({ src: (v.currentSrc || "").replace(location.origin, ""), readyState: v.readyState, paused: v.paused, poster: (v.poster || "").replace(location.origin, "") })),
    brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.currentSrc || i.src),
    harnessErrors: (window.__errors || []).slice(0, 5),
    heavy
  });
})()
'@

function Get-PinnedTracksJs { @"
(() => JSON.stringify([...document.querySelectorAll('$PINNED_SELECTOR')].filter(s => s.offsetHeight > innerHeight * 1.5).map((s, i) => ({ i, label: s.getAttribute("aria-label"), heightVh: Math.round(s.offsetHeight / innerHeight * 100) }))))()
"@ }

function Get-ScrollToProgressJs([int]$index, [double]$p) { @"
(async () => {
  const s = [...document.querySelectorAll('$PINNED_SELECTOR')].filter(s => s.offsetHeight > innerHeight * 1.5)[$index];
  const travel = s.offsetHeight - innerHeight;
  const top = s.getBoundingClientRect().top + scrollY;
  window.scrollTo({ top: top + travel * $($p.ToString([Globalization.CultureInfo]::InvariantCulture)), left: 0, behavior: "instant" });
  await new Promise(r => setTimeout(r, $PinnedSettleMs));
  return Math.round(scrollY);
})()
"@ }

# ---------------------------------------------------------------- launch Chrome
if (-not (Test-Path -LiteralPath $Chrome)) { throw "Chrome not found at $Chrome (pass -Chrome <path to chrome.exe or msedge.exe>)" }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$OutDir = (Resolve-Path -LiteralPath $OutDir).Path
New-Item -ItemType Directory -Force -Path $ProfileDir | Out-Null

$chromeArgs = @(
  "--headless=new", "--remote-debugging-port=$DebugPort", "--user-data-dir=`"$ProfileDir`"",
  "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-sync",
  "--hide-scrollbars", "--mute-audio", "--autoplay-policy=no-user-gesture-required",
  "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader", "--force-color-profile=srgb",
  "--window-size=1440,900", "about:blank"
)
if ($NoWebGL) { $chromeArgs = @("--disable-3d-apis") + $chromeArgs }
$proc = Start-Process -FilePath $Chrome -ArgumentList $chromeArgs -PassThru -WindowStyle Hidden
Write-Host "chrome pid $($proc.Id), debug port $DebugPort"

try {
  $version = $null
  for ($i = 0; $i -lt 40 -and -not $version; $i++) {
    try { $version = Invoke-RestMethod -Uri "http://127.0.0.1:$DebugPort/json/version" -TimeoutSec 3 } catch { Start-Sleep -Milliseconds 500 }
  }
  if (-not $version) { throw "Chrome DevTools endpoint did not come up on port $DebugPort" }
  Write-Host "browser: $($version.Browser)"
  $target = Invoke-RestMethod -Method Put -Uri "http://127.0.0.1:$DebugPort/json/new?about:blank" -TimeoutSec 10

  $script:ws = New-Object System.Net.WebSockets.ClientWebSocket
  $script:ws.Options.KeepAliveInterval = [TimeSpan]::FromSeconds(20)
  [void]$script:ws.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()

  Invoke-Cdp "Page.enable" | Out-Null
  Invoke-Cdp "Runtime.enable" | Out-Null
  Invoke-Cdp "Network.enable" | Out-Null
  Invoke-Cdp "Log.enable" | Out-Null

  $log = New-Object System.Collections.Generic.List[object]
  $motionValue = if ($ReducedMotion) { "reduce" } else { "no-preference" }

  foreach ($vpName in $Viewports) {
    $vp = $VIEWPORT_DEFS[$vpName]
    if (-not $vp) { throw "unknown viewport '$vpName'" }
    $vpDir = Join-Path $OutDir $vpName
    New-Item -ItemType Directory -Force -Path $vpDir | Out-Null
    if (-not $NoPinned) { New-Item -ItemType Directory -Force -Path (Join-Path $vpDir "pinned") | Out-Null }

    foreach ($route in $Routes) {
      $slug = Get-Slug $route
      $t0 = Get-Date
      Write-Host ("[{0}] {1}" -f $vpName, $route)
      $script:events.Clear()

      Invoke-Cdp "Emulation.setDeviceMetricsOverride" @{ width = $vp.width; height = $vp.height; deviceScaleFactor = $vp.dsf; mobile = $vp.mobile } | Out-Null
      Invoke-Cdp "Emulation.setTouchEmulationEnabled" @{ enabled = $vp.mobile } | Out-Null
      if ($vp.mobile) { Invoke-Cdp "Emulation.setUserAgentOverride" @{ userAgent = $MOBILE_UA } | Out-Null }
      else { Invoke-Cdp "Emulation.setUserAgentOverride" @{ userAgent = "" } | Out-Null }
      Invoke-Cdp "Emulation.setEmulatedMedia" @{ features = @(@{ name = "prefers-reduced-motion"; value = $motionValue }) } | Out-Null

      # The no-Node preview shell pulls React/three from a CDN, so a network blip can kill a boot: retry.
      $booted = $false
      for ($attempt = 1; $attempt -le 3 -and -not $booted; $attempt++) {
        if ($attempt -gt 1) { Write-Host "    ! boot failed, retry $attempt/3" -ForegroundColor Yellow; $script:events.Clear() }
        Invoke-Cdp "Page.navigate" @{ url = ($BaseUrl.TrimEnd("/") + $route) } | Out-Null
        $booted = Wait-Js $JS_BOOTED -TimeoutSec $ReadyTimeoutSec -What "app boot"
      }
      $content = Wait-Js $JS_CONTENT_READY -TimeoutSec 45 -What "CMS content + fonts"
      try { Invoke-Js $JS_NETWORK_QUIET -TimeoutMs 60000 | Out-Null } catch { Write-Host "    ! network-quiet wait failed: $_" -ForegroundColor Yellow }
      $pageHeight = Invoke-Js $JS_WARM_SCROLL -TimeoutMs 120000
      try { Invoke-Js $JS_NETWORK_QUIET -TimeoutMs 60000 | Out-Null } catch { }

      # 1. the fold, exactly the viewport
      Save-Screenshot -Path (Join-Path $vpDir "$slug.fold.jpg")

      # 2. pinned stages at fixed progress
      $pinned = @()
      if (-not $NoPinned) {
        $tracks = (Invoke-Js (Get-PinnedTracksJs)) | ConvertFrom-Json
        foreach ($tr in @($tracks)) {
          if ($null -eq $tr) { continue }
          foreach ($p in 0, 0.25, 0.5, 0.75, 1) {
            Invoke-Js (Get-ScrollToProgressJs $tr.i $p) -TimeoutMs 30000 | Out-Null
            $suffix = if (@($tracks).Count -gt 1) { "-t$($tr.i)" } else { "" }
            $name = "{0}{1}.p{2:000}.jpg" -f $slug, $suffix, [int]($p * 100)
            Save-Screenshot -Path (Join-Path (Join-Path $vpDir "pinned") $name)
          }
          $pinned += @{ label = $tr.label; heightVh = $tr.heightVh }
        }
        Invoke-Js 'window.scrollTo({ top: 0, left: 0, behavior: "instant" }); new Promise(r => setTimeout(r, 900))' | Out-Null
      }

      # 3. diagnostics (before the DSF change below re-lays things out)
      $diag = (Invoke-Js $JS_DIAGNOSTICS) | ConvertFrom-Json

      # 4. full page at device scale factor 1
      if ($vp.dsf -ne 1) {
        Invoke-Cdp "Emulation.setDeviceMetricsOverride" @{ width = $vp.width; height = $vp.height; deviceScaleFactor = 1; mobile = $vp.mobile } | Out-Null
        Start-Sleep -Milliseconds 700
      }
      $metrics = Invoke-Cdp "Page.getLayoutMetrics"
      $cw = [int][Math]::Ceiling($metrics.result.cssContentSize.width)
      $ch = [int][Math]::Ceiling($metrics.result.cssContentSize.height)
      $fullNote = $null
      try { Save-Screenshot -Path (Join-Path $vpDir "$slug.full.jpg") -Clip @{ x = 0; y = 0; width = $cw; height = $ch; scale = 1 } }
      catch { $fullNote = "full-page capture failed: $_"; Write-Host "    ! $fullNote" -ForegroundColor Yellow }

      # 5. fold network/console events
      # The no-Node preview harness resolves imports by probing extensions (/src/App, /src/App.tsx ...),
      # so 404s under /src/ and /lib/ are its own noise, not site errors. A real build never emits them.
      $probe = [regex]'https?://[^/"]+/(src|lib)/'
      $failed = @(); $httpErrors = @(); $consoleErrors = @()
      foreach ($e in $script:events) {
        if ($e.Contains('"method":"Network.responseReceived"')) {
          $m = [regex]::Match($e, '"response":\{"url":"([^"]+)","status":(\d+)')
          if ($m.Success -and [int]$m.Groups[2].Value -ge 400 -and -not $probe.IsMatch($m.Groups[1].Value)) { $httpErrors += ("{0} {1}" -f $m.Groups[2].Value, $m.Groups[1].Value) }
        } elseif ($e.Contains('"method":"Network.loadingFailed"')) {
          $m = [regex]::Match($e, '"errorText":"([^"]*)"'); $c = [regex]::Match($e, '"canceled":(true|false)')
          if ($c.Groups[1].Value -ne "true") { $failed += $m.Groups[1].Value }
        } else {
          $u = [regex]::Match($e, '"url":"([^"]+)"')
          if ($u.Success -and $probe.IsMatch($u.Groups[1].Value) -and $e.Contains('status of 404')) { continue }
          $m = [regex]::Match($e, '"(?:description|text|value)":"((?:[^"\\]|\\.){0,300})')
          if ($m.Success) { $consoleErrors += ($m.Groups[1].Value + $(if ($u.Success) { "  <" + $u.Groups[1].Value + ">" } else { "" })) }
        }
      }

      # Media is fetched with range requests, so the Resource Timing size is 0: read it from disk instead.
      $heavy = @()
      foreach ($h in @($diag.heavy)) {
        if ($null -eq $h) { continue }
        $bytes = [int64]$h.bytes
        if ($bytes -eq 0 -and $PublicDir) {
          $f = Join-Path $PublicDir ($h.path.TrimStart("/").Replace("/", "\"))
          if (Test-Path -LiteralPath $f -PathType Leaf) { $bytes = (Get-Item -LiteralPath $f).Length }
        }
        $heavy += [ordered]@{ path = $h.path; bytes = $bytes }
      }
      $heavyTotal = ($heavy | ForEach-Object { $_.bytes } | Measure-Object -Sum).Sum

      $entry = [ordered]@{
        route = $route; viewport = $vpName; size = "$($vp.width)x$($vp.height)@$($vp.dsf)x"; reducedMotion = [bool]$ReducedMotion
        booted = $booted; contentReady = $content
        pageHeightCss = $ch; pageWidthCss = $cw
        horizontalOverflowPx = $diag.horizontalOverflowPx; overflowing = $diag.overflowing
        canvases = $diag.canvases; webglRenderer = $diag.webglRenderer
        revealPending = $diag.revealPending
        pinnedStages = $pinned
        videos = $diag.videos; brokenImages = $diag.brokenImages
        heavyAssetBytes = $heavyTotal; heavyAssets = $heavy
        httpErrors = @($httpErrors | Select-Object -Unique); loadFailures = @($failed | Select-Object -Unique)
        consoleErrors = @($consoleErrors | Select-Object -Unique | Select-Object -First 8); harnessErrors = $diag.harnessErrors
        note = $fullNote
        seconds = [Math]::Round(((Get-Date) - $t0).TotalSeconds, 1)
      }
      $log.Add($entry)
      Write-Host ("    ok  h={0}px canvases={1} overflow={2}px httpErr={3} consoleErr={4}  ({5}s)" -f $ch, $diag.canvases, $diag.horizontalOverflowPx, $httpErrors.Count, $consoleErrors.Count, $entry.seconds)
    }
  }

  $logPath = Join-Path $OutDir ("capture-log" + $(if ($ReducedMotion) { ".reduced-motion" } else { "" }) + $(if ($NoWebGL) { ".no-webgl" } else { "" }) + ".json")
  [ordered]@{
    capturedAt = (Get-Date).ToString("s"); baseUrl = $BaseUrl; browser = $version.Browser
    reducedMotion = [bool]$ReducedMotion; webglDisabled = [bool]$NoWebGL; pages = $log
  } | ConvertTo-Json -Depth 8 | Out-File -LiteralPath $logPath -Encoding utf8
  Write-Host "log -> $logPath"
}
finally {
  try { if ($script:ws) { $script:ws.Dispose() } } catch { }
  try { if ($proc -and -not $proc.HasExited) { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue } } catch { }
  # headless chrome spawns children under the same profile; make sure none linger.
  # Match the profile dir exactly (closing quote / whitespace / end) so a sibling tool whose profile
  # path merely starts the same way is never reaped.
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and ($_.CommandLine -match ([regex]::Escape($ProfileDir) + '(["\s]|$)')) } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
}
