# daily-log-bootstrap.ps1
# Creates today's daily log file from the template if it doesn't exist yet.
# Idempotent — safe to run multiple times.
#
# Usage:
#   From PersonalOS root: .\scripts\daily-log-bootstrap.ps1
#   Or pin to a shell profile / pi session_start hook.

$root = Split-Path -Parent $PSScriptRoot
$today = Get-Date -Format "yyyy-MM-dd"
$targetFile = Join-Path $root "daily\$today.md"
$templateFile = Join-Path $root "resources\templates\daily.md"

if (Test-Path $targetFile) {
    Write-Host "Daily log already exists: daily/$today.md" -ForegroundColor Green
    exit 0
}

if (-not (Test-Path $templateFile)) {
    Write-Error "Template not found: resources/templates/daily.md"
    exit 1
}

# Read template, replace placeholder with today's date
$content = Get-Content $templateFile -Raw
$content = $content -replace "YYYY-MM-DD", $today

# Write today's log
Set-Content -Path $targetFile -Value $content -Encoding UTF8
Write-Host "Created: daily/$today.md" -ForegroundColor Cyan
