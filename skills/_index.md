# Skills

> **Repeatable workflows — the power feature of PersonalOS.**

## Purpose

A skill is a **documented procedure** that gets executed regularly. Skills are what make the wiki **increasingly valuable** over time: every recognized repeatable process becomes a skill, every skill saves time the next time.

## What is a skill?

- Concrete trigger ("When I want X, then …")
- Concrete actions (what's to be done, in which order)
- Reference to relevant context files / rules
- Template for write-back

## File schema

```
skills/
├── _index.md
├── write.md           ← META: how a skill is written
├── log.md             ← create session / daily log entry
└── <skill-slug>.md
```

> Slug: lowercase, hyphens, action name (`knowledge-ingest`, `meeting-prep`).

## When to create a skill?

- When a process appears **for the second or third time**.
- When the process is **clear enough** to document.
- When the process would work in **multiple contexts**.

## When NOT a skill?

- One-off tasks.
- Processes that are still changing a lot.
- Things that belong better in a sub-rule.

## Rules

- Every skill follows the schema in `write.md`.
- Skill files are **append-friendly**: current version on top, change history at the bottom.
- Skills may reference other skills.

## Current contents

- `write.md` — META skill (schema for skill creation)
- `log.md` — operational standard skill (session / daily log)
- `onboarding.md` — **one-time setup skill** (status: archived — completed 2026-06-18)
- `add-infrastructure.md` — checklist for connecting a new tool or system (7-step pattern)
