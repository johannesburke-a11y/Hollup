# RULES.md

> **Wiki rules — read by the agent before every session.**
> These rules are binding. They prevent drift and split-brain.
> On rule violations: stop first, then ask, then correct.

---

## 1. There is one canonical entry point

- Every agent starts with the four mandatory reads: `INDEX.md`, `USER.md`, `SOUL.md`, `RULES.md`.
- After that: only load the folder index, the matching rule, skill, or entity file relevant to the task.
- Never read the whole vault blindly — that produces hallucinations and drift.

## 2. One entity = one main truth

- One person, one project, one organisation, one skill, one rule has **exactly one main file** each.
- Split-brain ban: the same information must not exist in equal form in multiple places.
- Sources, drafts, attachments are explicitly marked as such (`Source`, `Draft`, `Attachment`).

## 3. Current truth ≠ timeline

- **Current truth** = what currently applies. May change.
- **Timeline** = how we got here. Append-only. Never rewrite.
- Every entity file with history has both sections.

## 4. New information has a default path

- Raw sources, loose thoughts, imports, DMs, unclear inputs: first **`inbox/`**.
- From there, decide: current truth, timeline, knowledge, task, rule, skill, or trash.
- **"Archive"** means setting `status: archived` in the file's frontmatter — it is not a folder destination. Archived files stay in their original location; they are just marked inactive.
- Never write into a canonical file without clarification first.

## 5. Tasks live centrally

- All operational tasks belong in **`ops/todo.md`** (with priority 1/2/3).
- Project files may describe open points, but **the tasks themselves live centrally**.
- Waiting / blocked: in **`ops/waiting-on.md`**.

## 6. Raw sources are not automatically knowledge

- `knowledge/raw/` = input, source, unevaluated.
- `knowledge/wiki/` = curated, classified, linked.
- A source only becomes knowledge through classification + linking.

## 7. Skills are repeatable workflows

- Every skill lives in `skills/` as its own `.md` file.
- A skill is only created when a process is **truly repeated**.
- Skill creation follows the `write` skill (see `skills/write.md`).
- Every skill references the rules and context files it needs.

## 8. Write-back is mandatory

- Every session creates value → that value must flow back.
- What flows where:
  - **Decision** → entity timeline
  - **Status update** → entity current truth
  - **New task** → `ops/todo.md`
  - **New knowledge** → `knowledge/wiki/` (raw material first in `knowledge/raw/`)
  - **New rule** → `RULES.md` or matching sub-rule
  - **Repeatable process** → skill candidate in `skills/`
  - **Unclear input** → `inbox/`
- The `log` skill is the standard tool for write-back at session end.

## 9. Deleting needs a reviewable path

- Unsure if something should stay? First into **`trash/`**.
- Final deletion only after review.
- `trash/` is part of versioning (or can optionally be excluded).

## 10. Agent outputs are proposals, not truth

- Every agent output is reviewed by the human before it lands in the wiki.
- Drift happens when agent outputs are checked in unexamined.
- Human = orchestrator. Agent = assistant.

## 11. Language

- **All wiki contents in English.**
- File, folder, and skill names: English (tool-agnostic).
- YAML keys / status values: English.
- Code, commit messages, configuration comments: English.

> This is the single source of truth for the language rule. `AGENTS.md` and `SOUL.md` reference this rule — if they diverge, §11 takes precedence.

## 12. Version hygiene

- The wiki is Git-versioned.
- Private/sensitive areas are in `.gitignore` (see there).
- For larger changes: short entry in `ops/changelog.md` (optional).

## 13. Project workflow (wiki is the entry point, not the code store)

**Basic rule:** The wiki is the **context layer**, not the code store. Projects continue to live in their physical folders. The wiki only contains **knowledge about** the project.

**When project X is to be worked on:**

1. **Wiki first** — read `projects/<slug>/_index.md` (current truth, ADRs, open TODOs, latest decisions).
2. **Switch physically** — go to the path documented in `_index.md`. Code edits, builds, tests happen there.
3. **Write-back at the end** — see § 14.

**When no project is named:**

- General questions → wiki stays the source, no project context needed.
- Ambiguous → briefly ask which project is meant.

**When "open project X" or "start with X" is said:**

- Wiki mandatory read (path 1) is mandatory — never skip.
- If `projects/<slug>/_index.md` is missing or outdated: **get the wiki in shape first**, then start.

## 14. Write-back for project sessions

What happens after a session in which a project was worked on?

| What happened? | Where in the wiki? |
|---|---|
| Code changed (feature, bugfix, refactor) | **Nothing** — code stays in the project, wiki doesn't document code states |
| Architecture decision made | `projects/<slug>/_index.md` → timeline (+ ADR to `knowledge/wiki/` if reusable) |
| Project status changed (active ↔ paused ↔ completed) | `projects/<slug>/_index.md` → current truth (status field) |
| New open point surfaced | In `_index.md` open list **or** directly in `ops/todo.md` (central!) — **don't** duplicate |
| New insight about the project | `projects/<slug>/notes.md` (or matching sub-file) |
| New repeatable pattern | Skill candidate in `skills/` |
| Knowledge update that is not project-specific | `knowledge/wiki/` (raw material first in `knowledge/raw/` if applicable) |
| Substantive structural change to project setup | `projects/<slug>/_index.md` → current truth (tech stack, architecture) |

**Anti-patterns:**

- Pasting code snippets into the wiki → no. Wiki documents **knowledge**, not code.
- Maintaining TODO lists in project `_index.md` instead of `ops/todo.md` → no (see § 5).
- Not documenting architecture changes in the timeline → no.

> **Detailed elaboration with examples:** see `resources/system/rules/project-workflow.md`.
> That file is the authoritative reference. §14 is the summary — if they conflict, the sub-rule file takes precedence.

---

## 15. Linking & frontmatter (Obsidian / wikilinks)

The wiki uses **Obsidian-compatible wikilinks** as the primary linking format.

### 15.1 Wikilink format

| What | Format | Example |
|---|---|---|
| File link | `[[path/file]]` | `[[projects/my-project]]` |
| File with display text (alias) | `[[path/file\|display]]` | `[[projects/my-project\|My Project]]` |
| Section link | `[[path/file#anchor]]` | `[[RULES#8-write-back-is-mandatory]]` |

> **Internal link?** → `[[wikilink]]`. **External link?** → `[text](https://url)`. Never mix.

### 15.2 File naming = entity name

- **File name = canonical entity name** (e.g., `jane-doe.md`).
- Alternative spellings → as **`aliases:`** in the frontmatter.

### 15.3 Frontmatter schema (required fields for entity files)

Every file in `people/`, `organisations/`, `projects/`, `knowledge/wiki/`, `skills/`, `resources/system/rules/`, `resources/templates/` gets YAML frontmatter:

```yaml
---
type: <entity-type>           # person | organisation | project | knowledge | skill | rule | template
status: <state>               # active | paused | completed | archived | draft
tags: [<tag1>, <tag2>, ...]   # see tag dimensions below
aliases: [<alt-name-1>, ...]  # optional
---
```

**`type` values** (canonical):

| Value | Use |
|---|---|
| `person` | `people/<name>.md` |
| `organisation` | `organisations/<name>.md` |
| `project` | `projects/<slug>/_index.md` |
| `knowledge` | `knowledge/wiki/<topic>.md` |
| `skill` | `skills/<skill>.md` |
| `rule` | `resources/system/rules/<rule>.md` |
| `template` | `resources/templates/...` |

### 15.4 Tag dimensions (max. 3 dimensions)

| Dimension | Values | Answers |
|---|---|---|
| `area/<...>` | `area/work`, `area/personal`, `area/homelab`, `area/wiki`, `area/project` | In which life area? |
| `status/<...>` | `status/active`, `status/paused`, `status/completed`, `status/draft` | In which state? |
| `topic/<...>` | free topic tags, sparingly (e.g., `topic/auth`, `topic/git`) | What is it about? |

### 15.5 What does NOT get frontmatter

- **List files in `ops/`** — append-only.
- **Daily logs in `daily/`** — date-driven.
- **`_index.md` files** — folder indexes.
- **Raw sources in `knowledge/raw/`** — get `type: raw-source`, `source:`, `captured: YYYY-MM-DD`.

### 15.6 Anti-patterns (linking)

- ❌ Relative Markdown links for internal references — use wikilinks.
- ❌ Duplicate entity files for alternative spellings — use `aliases:`.
- ❌ Linking to non-existent files without creating a stub.

---

## 16. Never deploy without explicit approval

- **Deploying to any live system requires explicit approval from the operator first.**
- This includes: running deploy scripts, restarting services, pushing builds to servers, running database migrations in production.
- Code changes, commits, and pushes are fine autonomously.
- **"Fix it" or "resolve it" does NOT imply permission to deploy.**

---

## Maintaining Rules

- New rule? → integrate into `RULES.md`, **don't** park as a loose note.
- Revising a rule? → change `RULES.md` directly, rule timeline briefly recorded in `ops/decisions.md`.
