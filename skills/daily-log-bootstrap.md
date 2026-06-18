---
type: skill
status: active
tags: [area/wiki, topic/logging]
---

# Skill: daily-log-bootstrap

> **Creates today's daily log file from the template if it doesn't exist yet.**
> Run at the start of every session. Idempotent — safe to run multiple times.

## Purpose

Ensure that `daily/<today>.md` always exists before the first log entry of the day.
Eliminates the friction of manually creating the file each morning.

## Trigger

- Start of any working session
- Before running the `log` skill
- Automatically via pi `session_start` hook (once that extension is set up)

## Prerequisites

- `resources/templates/daily.md` exists (it does — part of the base system)
- PowerShell available (Windows)

## Procedure

Run from the HOLLOP root:

```powershell
.\scripts\daily-log-bootstrap.ps1
```

**What it does:**
1. Checks if `daily/<YYYY-MM-DD>.md` already exists
2. If yes → does nothing, exits cleanly
3. If no → copies `resources/templates/daily.md`, replaces `YYYY-MM-DD` with today's date, writes the file

## Integration: pi session_start hook

Once `.pi/extensions/personalos.ts` is set up, this script can be wired to run automatically on every pi session start. Until then, run it manually at the start of each day.

See: `inbox/onboarding-extensions.md` → session_start hook

## Write-back

- Creates `daily/<YYYY-MM-DD>.md` (if not yet present)
- No other write-back required

## Notes / History

_(append-only)_

- 2026-06-18: Skill created during onboarding extension setup.
