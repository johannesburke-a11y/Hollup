# Ops

> **Operational layer — tasks, decisions, waiting-on, changelog.**

## Purpose

All **operational** things that need to be kept in view. One central place so nothing exists twice.

## Structure

```
ops/
├── _index.md
├── todo.md             ← current tasks (priority 1/2/3)
├── waiting-on.md       ← what are we waiting on?
├── decisions.md        ← important decisions with reasoning + date
└── changelog.md        ← changes to the wiki itself (optional)
```

## Rules

- **Tasks live centrally** in `todo.md` (see `RULES.md §5`).
- Project files may mention open points, but tasks are linked to `todo.md`.
- `waiting-on.md` for everything where you're blocked waiting for an external answer.
- `decisions.md` is append-only — who decided what, when, and why.
- `changelog.md` is optional and only for structural changes to the wiki.

## Priorities in `todo.md`

- **P1** — today / asap
- **P2** — this week
- **P3** — sometime / nice-to-have
