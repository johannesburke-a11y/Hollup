---
type: skill
status: active
tags: [area/work, topic/calendar, topic/google]
---

# Skill: google-calendar

> **Read and write your IONOS Google Calendar, pull Meet notes, create briefings, schedule meetings.**

## Purpose

Connects PersonalOS to Google Calendar so the agent can:
- Show what's on today / this week without leaving the terminal
- Generate structured daily briefings before the workday starts
- Pull Google Meet notes and turn them into interaction files
- Create events and find free time slots
- Auto-create interaction files for upcoming meetings

## Trigger

- "What's on my calendar today?"
- "Show me this week's meetings"
- "Pull the notes from my meeting with X"
- "Schedule a meeting with Y on [date]"
- "Find a free slot this afternoon"
- "Create a briefing for today"
- "Create an interaction file for [meeting]"

## Prerequisites

- `context/infrastructure/google-calendar.md` read
- `scripts/google-calendar/token.json` exists (run `node scripts/google-calendar/auth.js` if missing)
- Node.js available in terminal

## Procedure

All commands run from the PersonalOS root:

```powershell
node scripts/google-calendar/calendar.js <command>
```

---

### Checking the calendar

```powershell
# Today's events
node scripts/google-calendar/calendar.js today

# This week
node scripts/google-calendar/calendar.js week

# Next 15 events
node scripts/google-calendar/calendar.js next 15
```

---

### Daily briefing

Generates a structured Markdown briefing of today's meetings:

```powershell
node scripts/google-calendar/calendar.js briefing
```

**After running:** copy the output into `daily/<today>.md` under a `## Morning Briefing` section, or pipe it directly:

```powershell
node scripts/google-calendar/calendar.js briefing >> daily/2026-06-18.md
```

---

### Pulling Google Meet notes

1. Get the event ID from `today` or `week` output (shown in `[brackets]`)
2. Run:
   ```powershell
   node scripts/google-calendar/calendar.js meet-notes <eventId>
   ```
3. The script searches your Drive for a Google Doc matching the meeting title
4. Select the correct document if multiple matches appear
5. Notes are printed to terminal — copy into an interaction file

---

### Creating an interaction file from a meeting

After pulling notes, create `interactions/<YYYY-MM-DD>-<topic>.md`:
- Use `resources/templates/interaction.md` as the base
- Fill in: participants (from the event attendees), topic, date, key points from Meet notes
- Add any follow-up actions to `ops/todo.md`

---

### Creating a new event

```powershell
node scripts/google-calendar/calendar.js create
```

Interactive prompts for: title, date, start/end time, attendees (emails), description, Google Meet link.

**Write rule:** creating an event sends calendar invitations to attendees. Always confirm before running.

---

### Finding free time slots

```powershell
# Find slots of at least 60 minutes (default)
node scripts/google-calendar/calendar.js find-slot

# Find slots of at least 30 minutes
node scripts/google-calendar/calendar.js find-slot 30
```

Works against today and tomorrow, within working hours (08:00–18:00 Europe/Berlin).

---

## Write-back

| What | Where |
|---|---|
| Daily briefing | `daily/<YYYY-MM-DD>.md` — append under `## Morning Briefing` |
| Meet notes from a significant meeting | `interactions/<YYYY-MM-DD>-<topic>.md` |
| Follow-up actions from meeting notes | `ops/todo.md` |
| New people encountered | `people/<name>.md` (create if recurring contact) |

## Examples

**Example 1 — morning startup:**
```powershell
node scripts/google-calendar/calendar.js briefing
# → review today's meetings, create interaction files for important ones
```

**Example 2 — after a meeting:**
```powershell
node scripts/google-calendar/calendar.js meet-notes ujq91ovj
# → pull notes from N8N Exchange → create interactions/2026-06-18-n8n-exchange.md
```

**Example 3 — scheduling:**
```powershell
node scripts/google-calendar/calendar.js find-slot 60
# → find free hour → create event
node scripts/google-calendar/calendar.js create
```

## Notes / History

_(append-only)_

- 2026-06-18: Skill created. OAuth authenticated with johannes.burke@ionos.com. All 3 APIs live (Calendar, Drive, Docs).
