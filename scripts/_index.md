# Scripts

> **Executable scripts — automation, tooling, helpers.**

## Purpose

Scripts that automate recurring tasks. Each script should have a corresponding skill in `skills/` documenting when and how to use it.

## Structure

```
scripts/
├── _index.md
└── <script-name>.sh    # or .py, .ts, etc.
```

## Rules

- Scripts never contain secrets/tokens — use `.env` (gitignored).
- Every script with non-obvious behavior gets a comment header.
- Corresponding skill: `skills/<matching-skill>.md`.

## Current contents

_(empty)_
