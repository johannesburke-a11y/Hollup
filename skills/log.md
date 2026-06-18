---
type: skill
status: active
tags: [area/wiki, topic/logging]
---

# Skill: log

> **Create a session or daily log entry — the standard write-back at session end.**

## Purpose

Ensure that at the end of every content-relevant session, an entry lands in the daily log that summarizes what happened and what was written back into the wiki. Makes the system **connectable** for the next session.

## Trigger

- At the end of every content-relevant session.
- Before switching to another topic.
- On explicit request: "Run log" / "Log the session."

## Prerequisites

- Mandatory reads done (INDEX, USER, SOUL, RULES).
- Current session context in mind (what was done, what was decided, what's open).
- Today's daily file exists (otherwise create it).

## Procedure

1. **Check / create daily file**
   - File: `daily/<YYYY-MM-DD>.md`
   - If it doesn't exist → create it from the template in `resources/templates/daily.md`.

2. **Write session entry**
   - New section in the daily file (append).
   - Content:
     - **Session title** (topic in 3–8 words)
     - **Time window** (HH:MM–HH:MM)
     - **What happened** (3–7 bullets, concise)
     - **Write-back done** (what was written where, with file paths)
     - **Left open** (what remains for the next session)

3. **Write-back validation**
   - Check: are there tasks from the session missing in `ops/todo.md`?
   - Check: are there decisions that belong in `ops/decisions.md`?
   - Check: are there new people/organisations missing in `people/` / `organisations/`?
   - If yes → **now** write back (with a short note in the daily file).

## Write-back

- Daily file in `daily/<YYYY-MM-DD>.md` (append)
- Optional: `ops/todo.md`, `ops/decisions.md` (see step 3)
- Never overwrite existing daily content — only append.

## Examples

**Example 1 — setup session:**

```markdown
## Session 1 (20:00–20:30) — HOLLOP initial setup

### What was done
- Copied skeleton, filled in USER.md
- Opened vault in Obsidian

### Write-back done
- Personalized USER.md
- Created inbox/first-thoughts.md

### Open / next session
- Connect agent (pi / Cursor / etc.)
- First real agent session
```

**Example 2 — project session:**

```markdown
## Session 2 (21:00–22:15) — Project X: bugfix for feature Y

### What was done
- Reproduced the bug in feature-y
- Located the cause in core/parser.ts:42
- Implemented fix + tests green
- Created PR #123

### Write-back done
- New insight to projects/x/notes.md (caching behavior)
- ops/todo.md: PR review entered as P2

### Open / next session
- Await PR review (→ ops/waiting-on.md)
- Performance measurement
```

## Notes / History

_(append-only)_
