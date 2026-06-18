# Google Calendar Integration

> Context file for the HOLLOP Google Calendar / Drive / Docs integration.
> Read by the agent before executing any calendar operations.

---

## Overview

| Field | Value |
|---|---|
| Account | johannes.burke@ionos.com |
| Calendar | Primary (IONOS Google Workspace) |
| Auth method | OAuth 2.0 (Desktop app) |
| APIs enabled | Google Calendar API v3, Google Drive API v3, Google Docs API v1 |
| Cloud project | personal-proj-its-22482 |

---

## File Locations

| File | Purpose |
|---|---|
| `scripts/google-calendar/calendar.js` | Main CLI script — all calendar operations |
| `scripts/google-calendar/auth.js` | OAuth flow — run once to authenticate |
| `scripts/google-calendar/credentials.json` | OAuth client credentials (**gitignored**) |
| `scripts/google-calendar/token.json` | OAuth token (**gitignored**) |
| `skills/google-calendar.md` | Skill — when and how to use the integration |

---

## API Reference

**Base:** Google Calendar API v3 — `https://www.googleapis.com/calendar/v3`

**Auth:** OAuth 2.0 Bearer token (managed automatically via `token.json`)

**Scopes granted:**
- `https://www.googleapis.com/auth/calendar` — read + write calendar events
- `https://www.googleapis.com/auth/drive.readonly` — read Meet notes from Drive
- `https://www.googleapis.com/auth/documents.readonly` — read Google Docs content

**Token refresh:** Automatic (googleapis library handles it via refresh_token)

---

## Available Commands

Run all commands from the HOLLOP root:

```powershell
node scripts/google-calendar/calendar.js <command>
```

| Command | What it does |
|---|---|
| `today` | List all events today with attendees + Meet links |
| `week` | List all events this week |
| `next [n]` | List next N upcoming events (default: 10) |
| `briefing` | Full daily briefing — structured overview of today's meetings |
| `meet-notes <eventId>` | Pull Google Meet notes for a specific event |
| `create` | Create a new event (interactive, supports Google Meet link) |
| `find-slot [min]` | Find free time slots today + tomorrow (default: 60 min) |

**Event IDs** are shown in `[]` brackets in `today` / `week` / `next` output.

---

## Re-authentication

If the token expires or access is revoked:

```powershell
Remove-Item scripts/google-calendar/token.json
node scripts/google-calendar/auth.js
```

Then follow the OAuth flow again.

---

## Maintenance Notes

- Token auto-refreshes — no manual action needed in normal use
- If IONOS IT revokes app access: re-run auth flow
- To add new API scopes: delete `token.json`, add scopes to `auth.js`, re-authenticate
