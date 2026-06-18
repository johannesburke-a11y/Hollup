# HOLLOP — Starter Kit

> A personal knowledge management system designed to work with AI coding agents.
> Built on plain Markdown, optionally extended with Obsidian.

---

## What is HOLLOP?

HOLLOP is a structured personal wiki that serves as the **long-term memory** for you and your AI agent. It is:

- A **context system** — everything the agent needs to know about you, your work, your projects
- A **knowledge base** — raw sources and curated insights kept cleanly separate
- An **operational layer** — tasks, decisions, waiting items in one central place
- A **skill library** — documented workflows that improve over time

The system is designed to be used with an AI coding agent (e.g. [pi](https://github.com/earendil-works/pi)) but works equally well as a standalone Obsidian vault.

---

## How to set up

### 1. Copy this folder
Place this folder somewhere on your machine. Recommended: `~/HOLLOP/`

### 2. Connect your agent
Point your AI coding agent to this folder. The agent reads `AGENTS.md` first.

### 3. Run the onboarding skill
The agent will detect that `USER.md` is still a template and automatically start the onboarding process. It will:
- Fill in your personal profile (USER.md)
- Walk through the behavior contract (SOUL.md) with you
- Explain every rule in RULES.md and check if it fits your workflow
- Ask about useful extensions for your specific setup

You can also trigger it manually: **"Run onboarding"** or **"Set up HOLLOP"**

### 4. Open in Obsidian (optional)
Open the folder as a vault in [Obsidian](https://obsidian.md). The system is fully compatible.

### 5. Initialize Git (optional, part of onboarding)
The onboarding skill will offer to initialize a Git repository. Recommended — gives you version history and a safe undo path.

---

## Core files

| File | Purpose |
|---|---|
| `AGENTS.md` | Start manifest — what the agent reads and how it starts |
| `INDEX.md` | System map and navigation |
| `RULES.md` | All rules governing the wiki |
| `SOUL.md` | Behavioral contract for the agent |
| `USER.md` | Who you are — the agent's most important context file |

---

## Folder overview

| Folder | Purpose |
|---|---|
| `inbox/` | Staging area — everything unclear lands here first |
| `context/` | Recurring context (tools, infrastructure, working style) |
| `people/` | Important people with active relationships |
| `organisations/` | Companies, clients, partners |
| `projects/` | Active projects with wiki context layer |
| `interactions/` | Meetings, calls, conversations |
| `knowledge/` | Raw sources (`raw/`) and curated wiki (`wiki/`) |
| `ops/` | Tasks, decisions, waiting items |
| `daily/` | Daily and session logs |
| `notes/` | Free thoughts without a fixed place |
| `resources/` | Templates, rules, prompts, extensions catalog |
| `scripts/` | Executable scripts |
| `skills/` | Documented repeatable workflows |
| `automations/` | Outputs from external automations |
| `trash/` | Reviewable recycle bin |

---

## Extending the system

After onboarding, the agent will suggest extensions from `resources/extensions/catalog.md`. You can also browse it yourself anytime.

Extensions are organized in five categories:
1. **Core Skills** — commit workflow, inbox review, weekly review, infrastructure setup
2. **Tool Integrations** — Jira, Linear, GitHub, Confluence, Notion, Slack, Calendar
3. **Agent Hooks** (pi) — session_start widget, auto write-back, /sync, /weekly commands
4. **Automation Scripts** — daily log bootstrap, wiki health check, inbox staleness check
5. **Optional Vault Areas** — on-call tracking, strategy layer, structured automations

Each extension in the catalog explains what it does, when it makes sense, and how much effort it takes to set up.

---

## Philosophy

1. **One truth, one place** — no split-brain, no duplicates
2. **Inbox-first** — unclear things stage in `inbox/`, not scattered across files
3. **Write-back is mandatory** — every session that produces value writes back to the wiki
4. **Raw ≠ knowledge** — sources need classification before they become knowledge
5. **Skills compound** — every documented repeatable process pays dividends over time
