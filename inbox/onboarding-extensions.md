# Onboarding Extensions — Setup Queue

> Created during initial onboarding. Each item below is a confirmed extension to set up in a dedicated session.
> Work through these one at a time — don't rush them all at once.

---

## Category 1 — Core Skills

- [ ] **weekly-review** (`skills/weekly-review.md`)
  - Guided weekly review covering todos, waiting-on, decisions, interactions, inbox, people, projects
  - Trigger: Friday morning or Monday start
  - Ref: `resources/extensions/catalog.md` → Category 1

---

## Category 2 — Tool Integrations

- [ ] **Google Calendar integration**
  - Read upcoming events, extract participants, suggest interaction files, detect conflicts
  - Requires: Google Calendar API token
  - Ref: `resources/extensions/catalog.md` → Category 2

---

## Category 3 — Agent Hooks (pi)

- [ ] **session_start — Daily Briefing Widget**
  - Shows open P1/P2 todos, stale inbox files, date/CW on every pi startup
  - File: `.pi/extensions/personalos.ts`
  - Ref: `resources/extensions/catalog.md` → Category 3

- [ ] **session_shutdown — Automatic Write-Back**
  - Auto-writes session summary if daily log wasn't written manually
  - File: `.pi/extensions/personalos.ts`
  - Ref: `resources/extensions/catalog.md` → Category 3

---

## Category 4 — Automation Scripts

- [ ] **daily-log-bootstrap**
  - Creates today's daily log from template on pi session start
  - File: `scripts/daily-log-bootstrap.sh`
  - Requires: `resources/templates/daily.md`
  - Ref: `resources/extensions/catalog.md` → Category 4

---

## Category 5 — Optional Vault Areas

- [ ] **context/strategy/** — Strategic Focus Layer
  - Document quarterly goals, personal development direction, career priorities
  - File: `context/strategy.md`
  - Ref: `resources/extensions/catalog.md` → Category 5

---

## Notes

- All items confirmed during onboarding session: 2026-06-18
- Set up one extension per session — don't batch them
- Start with `daily-log-bootstrap` (minimal effort, immediate value), then `weekly-review`, then pi hooks, then Google Calendar
