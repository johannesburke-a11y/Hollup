# INDEX.md

> **System map and navigation — the canonical entry point for humans and agents.**
> This file shows which areas exist, what they're for, and how they work together.
> It is **not** a content dump. Each section points to the responsible folder index.

---

## Mandatory Reads

Before anything else:

| File | Purpose |
|---|---|
| `AGENTS.md` | Start manifest: what does the agent read, how does it start? |
| `RULES.md` | Wiki rules — binding for every session |
| `USER.md` | Who is the human you're working with? |
| `SOUL.md` | Your contract: stance, tone, behavior |

---

## System Areas

| Area | Path | Purpose |
|---|---|---|
| Inbox | `inbox/` | Staging for unclear things, raw input, new material |
| Context | `context/` | Recurring context files (tools, infrastructure, working style) |
| People | `people/` | Important humans with active relationships |
| Organisations | `organisations/` | Companies, clients, suppliers, partners |
| Projects | `projects/` | Active projects with a wiki context layer |
| Interactions | `interactions/` | Meetings, calls, conversations with context |
| Knowledge | `knowledge/` | Raw sources (`raw/`) and curated wiki (`wiki/`) |
| Ops | `ops/` | Tasks, decisions, waiting-on, changelog |
| Daily | `daily/` | Daily and session logs |
| Notes | `notes/` | Free thoughts without a fixed place |
| Resources | `resources/` | Templates, frameworks, sub-rules, prompts |
| Scripts | `scripts/` | Executable scripts |
| Skills | `skills/` | Repeatable workflows |
| Automations | `automations/` | Outputs of external automations |
| Trash | `trash/` | Reviewable recycle bin |

> Each of these folders has its own `_index.md` with detailed information.

---

## Navigation — Typical Questions

| Question | Go to |
|---|---|
| Who are you / who is my operator? | `USER.md` |
| What are the rules? | `RULES.md` |
| How do you behave? | `SOUL.md` |
| Which tools & systems are in use? | `context/` |
| What skills / scripts exist? | `skills/_index.md` |
| What's pending with person X? | `people/<name>.md` |
| How is project Y going? | `projects/<project>/_index.md` |
| What was discussed in the call with Z? | `interactions/<date>-<topic>.md` |
| What do I have to do today? | `ops/todo.md` |
| What am I waiting on? | `ops/waiting-on.md` |
| What was that decision again? | `ops/decisions.md` |
| What happened last week? | `daily/` |
| How does skill X work? | `skills/<skill>.md` |
| Where is the source on topic T? | `knowledge/raw/` |
| What have I understood about topic T? | `knowledge/wiki/` |
| What have I noted but not filed anywhere? | `inbox/` |
| What can I delete? | `trash/` |

---

## Memory Layers (Mental Model)

The wiki is physically structured into folders. Logically, those are **seven memory layers**:

1. **Identity** → `USER.md` (Who am I / who is my operator?)
2. **Factual** → `projects/`, `people/`, `organisations/` (What is currently true?)
3. **Knowledge** → `knowledge/raw/`, `knowledge/wiki/` (What have I understood?)
4. **Interaction** → `interactions/` (What was discussed?)
5. **Action** → `ops/` (What is to do?)
6. **Learning** → Rules, skills, templates (What is the system learning?)
7. **Observability** → `daily/`, `automations/` (What has happened?)

When it's unclear where something belongs: classify by layer first, then pick the physical folder.

---

## How New Content Emerges

```
          ┌──────────┐
Input ──▶ │ inbox/   │  ← everything unclear goes here first
          └────┬─────┘
               │ classify
               ▼
   ┌──────────────────────────┐
   │ canonical main file      │
   │ (Current Truth +         │
   │  Timeline, if entity)    │
   └──────────────────────────┘
               │
               │ link / reference
               ▼
   ┌──────────────────────────┐
   │ knowledge/wiki/          │  ← curated knowledge
   │ skills/                  │  ← repeatable workflows
   │ ops/                     │  ← tasks, decisions
   └──────────────────────────┘
```

---

## Obsidian Notes

- This vault works without Obsidian (plain Markdown) too.
- Obsidian-specific features (tags `#area/project`, `[[Wikilinks]]`, YAML frontmatter) are allowed and encouraged.
- See `resources/templates/` for recommended frontmatter schemas.

---

## Version Status

- See `ops/changelog.md` for the history of structural changes to the wiki itself.
