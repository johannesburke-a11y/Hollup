---
type: skill
status: active
tags: [area/wiki, topic/review]
---

# Skill: weekly-review

> **Guided weekly review — clears open threads and sets priorities for the coming week.**

## Purpose

A structured ~30–45 min session that sweeps all HOLLOP areas once per week.
Prevents things from falling through the cracks. Gives the coming week a clear starting point.
The system only stays reliable if it is reviewed regularly — this skill is the mechanism.

## Trigger

- Once per week — recommended: Friday end-of-day or Monday start-of-day
- On demand: "Run weekly review" / "Let's do the weekly"
- Overdue notice in pi session_start widget (once that hook is set up)

## Prerequisites

- Mandatory reads done: `INDEX.md`, `USER.md`, `SOUL.md`, `RULES.md`
- Today's daily log exists (run `daily-log-bootstrap` first if needed)
- Access to: `ops/`, `inbox/`, `people/`, `projects/`, `interactions/`, `daily/`

## Procedure

Work through each area in order. For each: read the current state, act on what needs acting, write back.

---

### 1. Todos (`ops/todo.md`)

- Read all open tasks
- For each P1: is it still P1? Is it blocked? Should it be done today?
- For each P2: is it still relevant? Promote to P1 or keep?
- For each P3: purge if stale (> 3 weeks old and no progress)
- Add any missing tasks that surfaced during the week

---

### 2. Waiting-On (`ops/waiting-on.md`)

- Read all waiting-on entries
- For each: still waiting? If resolved → close it, update relevant entity file
- If waiting too long (> 1 week) → consider a follow-up action in `ops/todo.md`

---

### 3. Decisions (`ops/decisions.md`)

- Scan recent entries (last 2 weeks)
- Any decisions that need a follow-up action? → add to `ops/todo.md`
- Any decisions that change a project or person file? → update it now

---

### 4. Inbox (`inbox/`)

- List all files in `inbox/`
- For each file: classify and route (person, project, knowledge, task, rule, trash)
- Target: inbox empty (or only files < 3 days old)
- If something can't be classified now: note it in `ops/todo.md` as a P3

---

### 5. Interactions (`interactions/`)

- Scan interaction files from the past week
- Any open actions that haven't made it to `ops/todo.md` yet? → add them
- Any relationship updates for `people/` files? → update now

---

### 6. People (`people/`)

- Scan people files for anyone with overdue actions or stale "next step"
- Any relationship that needs a touch this week? → add to `ops/todo.md`

---

### 7. Projects (`projects/`)

- For each active project: read `_index.md`
- Status still correct? (active / paused / completed)
- Any open points that are missing from `ops/todo.md`?
- Any architecture decisions from last week not yet in the timeline?

---

### 8. Daily logs (`daily/`)

- Scan logs from the past week
- Anything noted as "open / next session" that hasn't been actioned? → add to `ops/todo.md`
- Any recurring theme that should become a skill or a rule? → note in `inbox/`

---

### 9. Strategy check (`context/strategy.md`) *(once set up)*

- Read current strategic focus
- Did the week align with the stated priorities?
- Any adjustment needed for next week? → note it

---

### 10. Close

- Write a review summary entry in today's daily log (use the `log` skill)
- Mark review as done — append to `ops/decisions.md`:
  ```
  - YYYY-MM-DD: Weekly review completed (CW XX)
  ```

## Write-back

| What | Where |
|---|---|
| Updated / purged tasks | `ops/todo.md` |
| Closed waiting-on entries | `ops/waiting-on.md` |
| Follow-up actions from decisions | `ops/todo.md` |
| Routed inbox files | Their canonical destinations |
| People / project updates | `people/<name>.md` / `projects/<slug>/_index.md` |
| Review completion note | `ops/decisions.md` |
| Session summary | `daily/<YYYY-MM-DD>.md` |

## Examples

**Typical output after a weekly review:**
- 3 tasks purged from `ops/todo.md` (stale P3s)
- 2 waiting-on entries closed (resolved last week)
- 1 interaction follow-up added to `ops/todo.md`
- Inbox cleared (4 files routed)
- 1 project status updated from `active` to `paused`
- Review note appended to `ops/decisions.md`

## Notes / History

_(append-only)_

- 2026-06-18: Skill created during onboarding extension setup.
