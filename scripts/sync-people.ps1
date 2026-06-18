# sync-people.ps1
# Windows Task Scheduler wrapper for the people sync automation.
# Scans calendar attendees and creates person stubs in people/
#
# Usage:
#   .\scripts\sync-people.ps1
#   .\scripts\sync-people.ps1 -days 30

param(
    [int]$days = 14
)

$root = Split-Path -Parent $PSScriptRoot
$script = Join-Path $root "scripts\google-calendar\sync-people.js"
$logFile = Join-Path $root "people\sync.log"

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

try {
    $output = node $script --days $days 2>&1
    Add-Content -Path $logFile -Value "[$timestamp] sync-people run (${days}d lookback)"
    $output | ForEach-Object { Add-Content -Path $logFile -Value "[$timestamp] $_" }
    Write-Host $output
} catch {
    $errMsg = "ERROR: $_"
    Add-Content -Path $logFile -Value "[$timestamp] $errMsg"
    Write-Error $errMsg
    exit 1
}
