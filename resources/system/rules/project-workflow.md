---
type: rule
status: active
tags: [area/wiki, topic/projects]
---

# Project Workflow

> **Detailed workflow for project sessions — with concrete examples.**
> Abstract rules: `RULES.md §13` (project workflow) + `§14` (write-back for project sessions).

---

## 1. Start the session — wiki first

Before touching any code:

```
1. Open projects/<slug>/_index.md
2. Read: Current Truth (status, stack, path), latest timeline entries, open TODOs
3. Check ops/todo.md: are there prioritized tasks for this project?
```

**Why?** The agent needs context before making decisions. Without reading the wiki, it cannot correctly interpret architecture decisions.

**What if `_index.md` is missing or outdated?**
→ Get the wiki file in order first. Then start the actual work.

---

## 2. Switch physically

The physical path is in `_index.md` → `Current Truth → Path`.

```bash
cd <path-from-wiki>
```

Code, builds, tests, and configuration happen in the physical project folder. **Never** copy code files into the vault.

---

## 3. Session end: What goes where in the wiki?

| What happened? | Where in the wiki? |
|---|---|
| Feature / fix / refactor implemented | **Nothing** — code stays in the project |
| Architecture decision made | `projects/<slug>/_index.md` → timeline (+ ADR in `knowledge/wiki/` if reusable) |
| Project status changed | `projects/<slug>/_index.md` → current truth (status field) |
| New open point surfaced | `ops/todo.md` (central!) |
| New insight about the project | `projects/<slug>/notes.md` |
| New reusable pattern recognized | Skill candidate in `skills/` |
| Knowledge that is not project-specific | `knowledge/wiki/` |

---

## 4. Concrete Examples

### Example A — Feature built, no special decision

> Work session on project X: implemented feature Y.

**Wiki write-back:**
- `ops/todo.md`: enter PR review as P2
- `ops/waiting-on.md`: `[YYYY-MM-DD] PR review — @colleague — by EOW`
- `daily/YYYY-MM-DD.md`: session log via `log` skill

**No write-back** for the implementation itself (code stays in the project).

---

### Example B — Architecture decision made

> During work on project X, you decided to switch from REST to GraphQL.

**Wiki write-back:**
- `projects/x/_index.md` → timeline: `YYYY-MM-DD — Switched API layer from REST to GraphQL. Reason: ...`
- `projects/x/_index.md` → current truth: update stack entry
- If reusable insight: `knowledge/wiki/graphql-migration-patterns.md`

---

### Example C — Project paused

> Project X is paused until further notice.

**Wiki write-back:**
- `projects/x/_index.md` → current truth: `status: paused`
- `projects/x/_index.md` → timeline: `YYYY-MM-DD — Paused. Reason: ...`
- `ops/todo.md`: remove active tasks or mark as P3

---

## 5. Anti-patterns

| Anti-pattern | Correct behavior |
|---|---|
| Pasting code snippets into wiki | Code stays in the project. Document the **decision**, not the code. |
| TODO list in `_index.md` | Tasks in `ops/todo.md`. Only reference them in `_index.md`. |
| Skipping mandatory wiki read | Always read `_index.md` before touching code. |
| Not documenting architecture changes | Architecture decisions always go in the timeline. |
