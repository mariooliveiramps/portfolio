Param(
  [int]$Port = 8080,
  [string]$Root = (Get-Location)
)

Add-Type -AssemblyName System.Net.HttpListener
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Static server running at $prefix serving '$Root'" -ForegroundColor Green

function Get-ContentType($path) {
  switch ([System.IO.Path]::GetExtension($path).ToLower()) {
    '.html' { 'text/html' }
    '.htm'  { 'text/html' }
    '.css'  { 'text/css' }
    '.js'   { 'application/javascript' }
    '.json' { 'application/json' }
    '.png'  { 'image/png' }
    '.jpg'  { 'image/jpeg' }
    '.jpeg' { 'image/jpeg' }
    '.svg'  { 'image/svg+xml' }
    default { 'application/octet-stream' }
  }
}

try {
  while ($true) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    # Handle binary upload to assets/img via POST /upload?filename=<name>
    if ($request.HttpMethod -eq 'POST' -and $request.Url.AbsolutePath -eq '/upload') {
      try {
        $filename = $request.QueryString['filename']
        if ([string]::IsNullOrWhiteSpace($filename)) { $filename = 'upload.bin' }

        $assetsDir = Join-Path $Root 'assets'
        $imgDir = Join-Path $assetsDir 'img'
        if (-not (Test-Path $imgDir)) { [System.IO.Directory]::CreateDirectory($imgDir) | Out-Null }

        $originalName = [System.IO.Path]::GetFileName($filename)
        $safeName = ([DateTime]::UtcNow.Ticks).ToString() + '_' + $originalName
        $savePath = Join-Path $imgDir $safeName

        $fs = [System.IO.File]::Open($savePath, [System.IO.FileMode]::Create)
        try {
          $buffer = New-Object byte[] 8192
          while (($read = $request.InputStream.Read($buffer, 0, $buffer.Length)) -gt 0) {
            $fs.Write($buffer, 0, $read)
          }
          $fs.Flush()
        } finally {
          $fs.Close()
        }

        $relPath = 'assets/img/' + $safeName
        $json = '{"path":"' + $relPath + '"}'
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
        $response.ContentType = 'application/json'
        $response.StatusCode = 200
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
      } catch {
        $response.StatusCode = 500
        $errorBytes = [System.Text.Encoding]::UTF8.GetBytes("Upload error: $($_.Exception.Message)")
        $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
      }
      $response.OutputStream.Close()
      continue
    }

    $localPath = $request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($localPath)) { $localPath = 'index.html' }
    $filePath = Join-Path $Root $localPath

    if (-not (Test-Path $filePath)) {
      # Try default documents for directories
      if (Test-Path (Join-Path $filePath 'index.html')) {
        $filePath = Join-Path $filePath 'index.html'
      }
    }

    if (Test-Path $filePath) {
      try {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentType = Get-ContentType $filePath
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.StatusCode = 200
      } catch {
        $response.StatusCode = 500
        $errorBytes = [System.Text.Encoding]::UTF8.GetBytes("Server error: $($_.Exception.Message)")
        $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
      }
    } else {
      $response.StatusCode = 404
      $errorBytes = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
      $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
    }

    $response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
}