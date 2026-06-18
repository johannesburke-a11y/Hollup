# Knowledge / Raw

> **Unprocessed sources — articles, transcripts, videos, excerpts.**

## Purpose

Raw storage for input that hasn't been processed yet. Everything lands here first before becoming curated knowledge.

## File naming

```
knowledge/raw/<YYYY-MM-DD>-<source-slug>.md
```

## Frontmatter schema

```yaml
---
type: raw-source
source: <channel>       # web / book / video / transcript / email / ...
captured: YYYY-MM-DD
url: https://...        # if applicable
tags: [topic/<...>]
---
```

## Rules

- Raw sources are **not** automatically knowledge (see `RULES.md §6`).
- Don't link to raw sources from entity files — link to the curated wiki page instead.
- When processed: create a `knowledge/wiki/<topic>.md` and link back here.

## Current contents

_(empty)_
