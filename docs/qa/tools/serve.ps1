<#
  serve.ps1 - read-only local server for screenshotting the Product Armor site without Node.

  Two modes:
    -Dist <path>   serve a production build (artifacts/productarmor-site/dist/public) with SPA fallback
    (default)      serve the in-browser preview shell from -Harness (index.html compiles src/ with Babel),
                   exactly like _harness/serve.ps1

  In both modes it stands in for the API server's public, read-only endpoints so every route renders
  with real data:
    GET /api/content            -> artifacts/api-server/data/content.json
    GET /api/management-team    -> data/management-team.json, active members sorted by displayOrder
    GET /api/uploads/<file>     -> data/uploads/<file>   (team photos)
    GET /api/healthz
  Everything else under /api answers 503. Nothing is ever written.

  Usage:  powershell -ExecutionPolicy Bypass -File serve.ps1 -Repo <repo root> [-Harness <dir>] [-Dist <dir>] [-Port 4173]
#>
param(
  [Parameter(Mandatory = $true)][string]$Repo,
  [string]$Harness,
  [string]$Dist,
  [int]$Port = 4173
)
$ErrorActionPreference = "Stop"
$Repo = (Resolve-Path -LiteralPath $Repo).Path
if (-not $Harness) { $Harness = Join-Path $Repo "_harness" }
$site = Join-Path $Repo "artifacts\productarmor-site"
$data = Join-Path $Repo "artifacts\api-server\data"
$shell = if ($Dist) { Join-Path $Dist "index.html" } else { Join-Path $Harness "index.html" }
if (-not (Test-Path -LiteralPath $shell -PathType Leaf)) { throw "app shell not found: $shell" }

$mime = @{
  ".html"="text/html; charset=utf-8"; ".js"="text/javascript; charset=utf-8"; ".mjs"="text/javascript; charset=utf-8";
  ".ts"="text/plain; charset=utf-8"; ".tsx"="text/plain; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".json"="application/json"; ".yaml"="text/plain; charset=utf-8"; ".glb"="model/gltf-binary"; ".wasm"="application/wasm";
  ".mp4"="video/mp4"; ".webm"="video/webm"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".png"="image/png";
  ".svg"="image/svg+xml"; ".webp"="image/webp"; ".avif"="image/avif"; ".ico"="image/x-icon"; ".pdf"="application/pdf";
  ".txt"="text/plain; charset=utf-8"; ".woff2"="font/woff2"; ".map"="application/json"
}
function Send-Text($res, [int]$code, [string]$type, [string]$body) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($body)
  $res.StatusCode = $code; $res.ContentType = $type; $res.ContentLength64 = $bytes.Length
  $res.OutputStream.Write($bytes, 0, $bytes.Length); $res.Close()
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "serving $Repo  ($(if ($Dist) { 'production build' } else { 'in-browser preview shell' }))  at http://localhost:$Port/"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request; $res = $ctx.Response
  try {
    $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
    if ($path.Contains("..")) { Send-Text $res 400 "text/plain" "bad path"; continue }
    $res.Headers["Cache-Control"] = "no-store"
    $file = $null

    if ($path.StartsWith("/api/")) {
      if ($req.HttpMethod -ne "GET") { Send-Text $res 503 "application/json" '{"error":"read-only preview"}'; continue }
      if ($path -eq "/api/content") { $file = Join-Path $data "content.json" }
      elseif ($path -eq "/api/healthz") { Send-Text $res 200 "application/json" '{"status":"ok"}'; continue }
      elseif ($path -eq "/api/management-team") {
        # PS 5.1's ConvertFrom-Json emits a JSON array as ONE pipeline object; assign first so the next pipe enumerates it.
        $members = Get-Content -Raw -LiteralPath (Join-Path $data "management-team.json") -Encoding UTF8 | ConvertFrom-Json
        $active = @($members | Where-Object { $_.status -eq "active" } | Sort-Object displayOrder)
        Send-Text $res 200 "application/json" (ConvertTo-Json -InputObject $active -Depth 6 -Compress); continue
      }
      elseif ($path.StartsWith("/api/uploads/")) { $file = Join-Path (Join-Path $data "uploads") ($path.Substring(13).Replace("/", "\")) }
      else { Send-Text $res 503 "application/json" '{"error":"The API server is not running in this local preview."}'; continue }
      if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { Send-Text $res 404 "application/json" '{"error":"not found"}'; continue }
    } else {
      $rel = $path.TrimStart("/").Replace("/", "\")
      $candidates = @()
      if ($Dist) { if ($rel) { $candidates += Join-Path $Dist $rel } }
      elseif ($path.StartsWith("/src/")) { $candidates += Join-Path $site $rel }
      elseif ($path.StartsWith("/lib/")) { $candidates += Join-Path $Repo $rel }
      elseif ($path -eq "/package.json") { $candidates += Join-Path $site "package.json" }
      elseif ($path -eq "/pnpm-workspace.yaml") { $candidates += Join-Path $Repo "pnpm-workspace.yaml" }
      elseif ($rel) { $candidates += (Join-Path $Harness $rel); $candidates += (Join-Path (Join-Path $site "public") $rel) }
      $file = $candidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
      if (-not $file) {
        # Client-side routes (/products, /about ...) fall back to the app shell; real misses 404.
        if ([System.IO.Path]::GetExtension($path) -eq "" -and -not $path.StartsWith("/src/") -and -not $path.StartsWith("/lib/")) { $file = $shell }
        else { Send-Text $res 404 "text/plain" "not found"; continue }
      }
    }

    $ext = [System.IO.Path]::GetExtension($file).ToLower()
    $type = $mime[$ext]; if (-not $type) { $type = "application/octet-stream" }
    $res.ContentType = $type
    $res.Headers["Accept-Ranges"] = "bytes"
    $fs = [System.IO.File]::OpenRead($file)
    try {
      $total = $fs.Length; $start = 0; $end = $total - 1
      $range = $req.Headers["Range"]
      if ($range -and $range -match "bytes=(\d*)-(\d*)") {
        if ($Matches[1]) { $start = [int64]$Matches[1] }
        if ($Matches[2]) { $end = [int64]$Matches[2] }
        if ($end -ge $total) { $end = $total - 1 }
        $res.StatusCode = 206
        $res.Headers["Content-Range"] = "bytes $start-$end/$total"
      }
      $len = $end - $start + 1
      $res.ContentLength64 = $len
      $null = $fs.Seek($start, "Begin")
      $buf = New-Object byte[] 65536
      while ($len -gt 0) {
        $n = $fs.Read($buf, 0, [Math]::Min($buf.Length, $len))
        if ($n -le 0) { break }
        $res.OutputStream.Write($buf, 0, $n)
        $len -= $n
      }
    } finally { $fs.Close() }
    $res.Close()
  } catch {
    try { $res.Abort() } catch {}
  }
}
