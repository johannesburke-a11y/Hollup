# Knowledge

> **Sources + curated knowledge — kept apart.**

## Purpose

Two-stage model:
- **`raw/`** = unprocessed sources (articles, transcripts, PDFs, videos, book excerpts)
- **`wiki/`** = curated, classified, linked knowledge

Knowledge only emerges **through classification**, not through storage.

## Structure

```
knowledge/
├── _index.md
├── raw/
│   ├── _index.md
│   └── <source-slug>.md
└── wiki/
    ├── _index.md
    └── <topic-slug>.md
```

## Workflow

1. Drop the source in `raw/` (with link, short note, why relevant).
2. When processing: create a curated page in `wiki/`.
3. The wiki page links back to raw sources + other wiki pages.

## Rules

- **Raw sources are not truth** (see `RULES.md §6`).
- Wiki pages have their own slugs and link to each other.
- Knowledge drift: when a wiki page is outdated, mark and update it — don't maintain in parallel.

## Current contents

- `raw/`: _(empty)_
- `wiki/`: _(empty)_
