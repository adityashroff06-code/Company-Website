<#
  reveal-probe.ps1 - measures the Reveal states on a route: how many Reveal elements are hidden
  2.5 s after boot (and where they sit relative to the fold), and how many are still hidden after
  one scroll pass. Also counts 404 responses during the visit. Same zero-dependency CDP plumbing
  as capture.ps1; Reveal elements are the ones carrying an inline `opacity`, excluding anything
  inside a pinned stage (section[aria-label][style*="vh"]), whose captions are scroll-driven.

  Expect: every hidden element to sit below the fold at load, and 0 hidden after the scroll pass.

  Usage: powershell -ExecutionPolicy Bypass -File reveal-probe.ps1 -BaseUrl http://localhost:4173 -Routes /,/technology
#>
param(
  [string]$BaseUrl = "http://localhost:4173",
  [int]$DebugPort = 9350,
  [string]$ProfileDir = (Join-Path $env:TEMP "pa-probe-profile"),
  [string]$Chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe",
  [string[]]$Routes = @("/", "/products", "/industries", "/applications", "/technology", "/downloads",
                        "/case-studies", "/career", "/faq", "/about", "/management-team", "/quality", "/contact"),
  [int]$Width = 1440, [int]$Height = 900
)
$ErrorActionPreference = "Stop"; $ProgressPreference = "SilentlyContinue"
$Routes = @($Routes | ForEach-Object { $_ -split "," } | ForEach-Object { $_.Trim() } | Where-Object { $_ })
$script:ws = $null; $script:msgId = 0; $script:events = New-Object System.Collections.Generic.List[string]

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
  while ($true) {
    $msg = Receive-CdpMessage
    if ($msg.StartsWith($prefix + ',') -or $msg.StartsWith($prefix + '}')) { return ($msg | ConvertFrom-Json) }
    if ($msg.Contains('"method":"Network.responseReceived"')) { $script:events.Add($msg) }
  }
}
function Invoke-Js { param([string]$Expression, [int]$TimeoutMs = 60000)
  $r = Invoke-Cdp "Runtime.evaluate" @{ expression = $Expression; awaitPromise = $true; returnByValue = $true; timeout = $TimeoutMs }
  if ($r.result.exceptionDetails) { throw "JS error: $($r.result.exceptionDetails.exception.description)" }
  $r.result.result.value
}
function Wait-Js { param([string]$Expression, [int]$TimeoutSec = 40, [string]$What = "condition")
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  while ((Get-Date) -lt $deadline) { try { if (Invoke-Js $Expression) { return $true } } catch { }; Start-Sleep -Milliseconds 300 }
  Write-Host "    ! timed out waiting for $What"; return $false
}

$JS_COUNT = @'
(() => {
  // Reveal elements only: the pinned stages drive their captions' inline opacity from scroll refs.
  const els = [...document.querySelectorAll('[style*="opacity"]')].filter(e => !e.closest('section[aria-label][style*="vh"]'));
  const op = e => getComputedStyle(e).opacity;
  const top = e => e.getBoundingClientRect().top;
  return JSON.stringify({
    total: els.length,
    hidden: els.filter(e => op(e) === '0').length,
    mid: els.filter(e => { const o = +op(e); return o > 0 && o < 1; }).length,
    aboveFoldVisible: els.filter(e => top(e) < innerHeight && op(e) === '1').length,
    belowFoldVisible: els.filter(e => top(e) >= innerHeight && op(e) === '1').length,
    features: performance.getEntriesByType('resource').some(r => /features-/.test(r.name)),
    scrollY: Math.round(scrollY)
  });
})()
'@
$JS_SCROLL = @'
(async () => {
  const H = () => document.documentElement.scrollHeight;
  const step = Math.max(200, Math.round(innerHeight * 0.7));
  for (let y = 0; y < H(); y += step) { window.scrollTo({ top: y, behavior: "instant" }); await new Promise(r => setTimeout(r, 160)); }
  window.scrollTo({ top: H(), behavior: "instant" });
  await new Promise(r => setTimeout(r, 1500));
  return H();
})()
'@

$chromeArgs = @(
  "--headless=new", "--remote-debugging-port=$DebugPort", "--user-data-dir=`"$ProfileDir`"",
  "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-sync",
  "--hide-scrollbars", "--mute-audio", "--autoplay-policy=no-user-gesture-required",
  "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader", "--force-color-profile=srgb",
  "--window-size=$Width,$Height", "about:blank"
)
$proc = Start-Process -FilePath $Chrome -ArgumentList $chromeArgs -PassThru -WindowStyle Hidden
try {
  $version = $null
  for ($i = 0; $i -lt 40 -and -not $version; $i++) { try { $version = Invoke-RestMethod -Uri "http://127.0.0.1:$DebugPort/json/version" -TimeoutSec 3 } catch { Start-Sleep -Milliseconds 500 } }
  if (-not $version) { throw "DevTools endpoint did not come up on $DebugPort" }
  $target = Invoke-RestMethod -Method Put -Uri "http://127.0.0.1:$DebugPort/json/new?about:blank" -TimeoutSec 10
  $script:ws = New-Object System.Net.WebSockets.ClientWebSocket
  [void]$script:ws.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
  Invoke-Cdp "Page.enable" | Out-Null; Invoke-Cdp "Runtime.enable" | Out-Null; Invoke-Cdp "Network.enable" | Out-Null
  Invoke-Cdp "Emulation.setDeviceMetricsOverride" @{ width = $Width; height = $Height; deviceScaleFactor = 1; mobile = $false } | Out-Null

  foreach ($route in $Routes) {
    $script:events.Clear()
    Invoke-Cdp "Page.navigate" @{ url = ($BaseUrl.TrimEnd("/") + $route) } | Out-Null
    Wait-Js 'document.title.includes("Product Armor") && document.querySelectorAll("[style*=opacity]").length > 0' -What "app boot" | Out-Null
    Start-Sleep -Milliseconds 2500
    $before = Invoke-Js $JS_COUNT
    Invoke-Js $JS_SCROLL -TimeoutMs 90000 | Out-Null
    $after = Invoke-Js $JS_COUNT
    $notFound = @($script:events | Where-Object { $_ -match '"status":404' }).Count
    Write-Output "$route"
    Write-Output "  at load  : $before"
    Write-Output "  scrolled : $after"
    Write-Output "  404 responses: $notFound"
  }
} finally {
  try { $script:ws.Dispose() } catch { }
  try { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue } catch { }
  try { Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*$ProfileDir*" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } } catch { }
}
