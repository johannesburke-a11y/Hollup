# Context

> **Recurring context files — tools, infrastructure, working style.**

## Purpose

Context files provide background that the agent needs to use tools and systems correctly. Unlike the wiki (knowledge), context files describe **what is** and **how to use it** — not what was learned.

## Typical context files

| File | Purpose |
|---|---|
| `context/infrastructure/<tool>.md` | How to use a specific tool (API, auth, usage patterns) |
| `context/working-style.md` | How you work, preferences, recurring patterns |

## Structure

```
context/
├── _index.md
└── infrastructure/
    └── <tool>.md    ← one file per integrated tool/system
```

## Rules

- Context files are **living documents** — update them when setup changes.
- Sensitive data (tokens, passwords) → **never** in the wiki. Use `.env` or a secrets manager.
- Reference context files from skills that use those tools.

## Starter infrastructure folder

`context/infrastructure/` exists as an empty placeholder. Add one file per tool you connect, following `skills/add-infrastructure.md`.

## Current contents

- `infrastructure/google-calendar.md` — Google Calendar / Drive / Docs integration (IONOS Workspace)
- `strategy.md` — quarterly goals and personal development focus
