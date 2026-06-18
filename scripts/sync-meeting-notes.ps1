# sync-meeting-notes.ps1
# Windows Task Scheduler wrapper for the meeting notes automation.
# Run manually or via Task Scheduler — logs output to automations/meeting-notes/sync.log
#
# Usage:
#   .\scripts\sync-meeting-notes.ps1
#   .\scripts\sync-meeting-notes.ps1 --hours 48
#   .\scripts\sync-meeting-notes.ps1 --dry-run

param(
    [int]$hours = 24,
    [switch]$dryRun
)

$root = Split-Path -Parent $PSScriptRoot
$script = Join-Path $root "scripts\google-calendar\sync-meeting-notes.js"
$logFile = Join-Path $root "automations\meeting-notes\sync.log"

# Ensure log directory exists
$logDir = Split-Path -Parent $logFile
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$args = @("--hours", $hours)
if ($dryRun) { $args += "--dry-run" }

# Log start
Add-Content -Path $logFile -Value "[$timestamp] Starting sync (lookback: ${hours}h)$(if ($dryRun) { ' [DRY RUN]' })"

# Run
try {
    $output = node $script @args 2>&1
    $output | ForEach-Object { Add-Content -Path $logFile -Value "[$timestamp] $_" }
    Write-Host $output
} catch {
    $errMsg = "ERROR: $_"
    Add-Content -Path $logFile -Value "[$timestamp] $errMsg"
    Write-Error $errMsg
    exit 1
}

Add-Content -Path $logFile -Value "[$timestamp] Sync complete"
