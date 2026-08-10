param(
    [string]$DatabaseUrl = $null,
    [int]$Port = 8080
)

# start-local.ps1
# Safe helper to install dependencies and start frontend + API in two PowerShell windows.
# It accepts an optional DatabaseUrl and sets it only for this run.

$ErrorActionPreference = 'Stop'

$repo = (Get-Location).Path
Write-Host "Repo: $repo"

$env:Path += ";C:\Program Files\Git\bin"
Set-Location $repo

if (-not $DatabaseUrl -and -not $env:SUPABASE_DATABASE_URL -and -not $env:DATABASE_URL) {
    try {
        $DatabaseUrl = Read-Host -Prompt "Enter SUPABASE_DATABASE_URL (leave empty to run without DB)"
    } catch {
        Write-Host "Interactive prompt unavailable; continuing without DB URL."
    }
}

if (-not [string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    $env:SUPABASE_DATABASE_URL = $DatabaseUrl
    Write-Host "SUPABASE_DATABASE_URL is set for this run. DB-backed routes should now work if the URL is valid."
} elseif ($env:SUPABASE_DATABASE_URL) {
    Write-Host "Using SUPABASE_DATABASE_URL from the current environment."
} elseif ($env:DATABASE_URL) {
    Write-Host "Using DATABASE_URL from the current environment."
} else {
    Write-Host "No DB URL provided - API will run in degraded mode (no DB). Only non-DB routes and the frontend preview will work."
}

$frontendPort = 3000
$apiPort = $Port

$needsInstall = -not (Test-Path .\node_modules)

if ($needsInstall) {
    Write-Host "Cleaning common transient install artifacts (node_modules + pnpm esbuild temp dirs)..."
    Remove-Item -Recurse -Force .\node_modules -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force .\artifacts\steamshare\node_modules -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force .\artifacts\api-server\node_modules -ErrorAction SilentlyContinue

    if (Test-Path .\node_modules\.pnpm) {
        Get-ChildItem -Path .\node_modules\.pnpm -Directory -Filter "esbuild@*" -ErrorAction SilentlyContinue | ForEach-Object {
            try { Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue } catch {}
        }
    }

    Write-Host "Installing dependencies (this may prompt to approve build scripts)..."
    try {
        pnpm install
    } catch {
        Write-Host "pnpm install failed with exit code $($LASTEXITCODE)."
        Write-Host "If pnpm prompts to approve builds, run: pnpm approve-builds and select 'esbuild'."
        Write-Host "Run PowerShell as Administrator or temporarily disable antivirus if you see EPERM file-lock errors."
        throw
    }
} else {
    Write-Host "Dependencies are already installed. Skipping pnpm install."
}

Write-Host "Dependencies installed. Starting frontend and API in two new PowerShell windows..."

$previousPort = $env:PORT
$env:PORT = "$frontendPort"
Start-Process powershell.exe -ArgumentList '-NoExit', '-Command', "pnpm --filter @workspace/steamshare run dev" -WorkingDirectory $repo

$env:PORT = "$apiPort"
Start-Process powershell.exe -ArgumentList '-NoExit', '-Command', "pnpm --filter @workspace/api-server run dev" -WorkingDirectory $repo

if ($previousPort) {
    $env:PORT = $previousPort
} else {
    Remove-Item Env:PORT -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Frontend: http://localhost:$frontendPort"
Write-Host "API (health): http://localhost:$apiPort/api/healthz"
Write-Host ""
Write-Host "Note: This script sets SUPABASE_DATABASE_URL only for this run and does not persist it."
Write-Host "If you want to pass your DB URL directly, run: .\start-local.ps1 -DatabaseUrl 'YOUR_DB_URL'"
