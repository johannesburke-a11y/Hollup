# Projects

> **Active projects with a wiki context layer.**

## Purpose

One folder per project with:
- `_index.md` as the main file (current truth, context, status)
- Sub-files for details, notes, decisions

## Important basic rule

**The wiki is the context layer, not the code store.**

- Code, builds, tests, configuration live in the physical project folder.
- The wiki only contains **knowledge about** the project: purpose, tech stack, decisions, open TODOs, timeline.
- The physical path is documented in `_index.md` under `Current Truth → Path`.

See `RULES.md §13 + §14` and `resources/system/rules/project-workflow.md` for the detailed workflow.

## Folder schema

```
projects/
├── _index.md
└── <project-slug>/
    ├── _index.md       ← main file (current truth + context + timeline)
    ├── notes.md        ← free notes
    └── ...
```

> Slug: lowercase, hyphens, short and unique (`website-relaunch`, `homelab-setup`).

## When to create a new project?

- When an undertaking spans **multiple sessions**.
- When there are **external parties** involved.
- When the result is **documentable**.

## Current contents

_(empty)_
