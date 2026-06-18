# Extensions Catalog

> **All possible HOLLOP extensions — skills, integrations, hooks, automations.**
> Used by the `onboarding` skill to ask targeted setup questions.
> Also useful for self-guided expansion after the initial setup.

---

## How to read this catalog

Each entry has:
- **What it does** — one paragraph
- **When it makes sense** — who should add this
- **Dependencies** — what's required before setting it up
- **Setup effort** — `minimal` (< 30 min) / `medium` (30–90 min) / `involved` (> 90 min)

Extensions are organized by category. Start with **Core Skills**, then add **Tool Integrations** for your stack, then consider **Agent Hooks** if you use pi.

---

## Category 1 — Core Skills

These skills extend the base system with workflow patterns. Recommended for everyone.

---

### commit

**What it does:** A structured Git commit workflow. Before every commit, the agent checks what's staged, scans for accidentally included secrets, formulates a Conventional Commits-formatted message, and proposes it for approval before executing.

**When it makes sense:** You use Git for your projects and want clean, traceable commit history.

**Dependencies:** Git installed. Conventional Commits format agreed in USER.md.

**Setup effort:** `minimal` — create `skills/commit.md` following the schema in `skills/write.md`.

**Key behaviors:**
- Secret scan on every staged diff (mandatory)
- Always proposes the message before committing
- Never pushes automatically — only when explicitly asked
- Hard rule: no `git push --force` on main without confirmation

---

### inbox-review

**What it does:** A guided inbox processing session. The agent lists all files in `inbox/`, classifies each one by content type, routes it to the correct destination (people/, knowledge/, ops/todo.md, etc.), and writes a log entry.

**When it makes sense:** You use the inbox actively and want a reliable weekly processing routine.

**Dependencies:** None beyond the base system.

**Setup effort:** `minimal` — create `skills/inbox-review.md`.

**Recommended trigger:** Weekly (e.g. Friday morning or Monday start).

---

### add-infrastructure

**What it does:** A standardized checklist for connecting a new tool or system. Covers: credentials in `.env`, context file in `context/infrastructure/`, a script in `scripts/`, a skill in `skills/`, and references in USER.md and index files. Ensures every tool is findable and consistently structured.

**When it makes sense:** You connect multiple external tools (ticket systems, APIs, databases) and want to avoid ad-hoc setups that only you understand.

**Dependencies:** At least one external tool to connect.

**Setup effort:** `minimal` to create the skill; `medium` to `involved` per tool integration (see Category 3).

---

### weekly-review

**What it does:** A comprehensive guided weekly review covering all HOLLOP areas: todos, waiting-on, decisions, interactions, daily logs, inbox, people, projects, and strategy. One structured session (~30–45 min) that clears open threads and sets priorities for the coming week.

**When it makes sense:** You want a reliable weekly rhythm and don't want things to fall through the cracks. Especially valuable once the system has been running for 2+ weeks.

**Dependencies:** Base system with at least ops/, inbox/, people/, projects/ in use.

**Setup effort:** `minimal` — create `skills/weekly-review.md`. Optional: wire to a `/weekly` command if using pi.

---

## Category 2 — Tool Integrations

Each tool integration follows the same pattern: `.env` credentials → `context/infrastructure/<tool>.md` → `scripts/<tool>.sh` → `skills/<tool>.md`. See `skills/add-infrastructure.md` for the full checklist.

---

### Jira / Linear / GitHub Issues (ticket system)

**What it does:** Read and write tickets from the terminal. Typical commands: list my open issues, view a ticket, create a ticket, add a comment, transition status. The agent can reference ticket keys in context and auto-link them to project notes.

**When it makes sense:** You manage work through a ticket system and want the agent to pull context from it without manual copy-paste.

**Dependencies:** API access (PAT or token). VPN if self-hosted.

**Setup effort:** `medium` — script + skill + context file. Reference: `skills/add-infrastructure.md`.

---

### Confluence / Notion / Outline (wiki/docs)

**What it does:** Search and read internal documentation. Optionally: create and update pages. Useful when the agent needs to reference internal runbooks, architecture docs, or team wikis during a session.

**When it makes sense:** Your team maintains a shared wiki and the agent frequently needs to cross-reference it.

**Dependencies:** API access.

**Setup effort:** `medium`.

---

### GitHub / GitLab (code host)

**What it does:** List open PRs, view PR status, check CI results, create issues. Complements the `commit` skill by giving the agent visibility into the full PR lifecycle.

**When it makes sense:** You work on projects with pull request workflows.

**Dependencies:** GitHub/GitLab token. `gh` CLI or REST API.

**Setup effort:** `minimal` to `medium` depending on scope.

---

### Slack / Teams (messaging)

**What it does:** Search message history, draft messages for approval, optionally send (always with confirmation). Useful for the agent to pull context from recent conversations without switching windows.

**When it makes sense:** Decisions and context are often buried in Slack/Teams threads.

**Dependencies:** Bot token or user token with search scope. Sending always requires explicit confirmation (hard rule).

**Setup effort:** `medium`.

---

### Google Calendar / Outlook (calendar)

**What it does:** Read upcoming events, extract meeting participants, suggest interaction files for upcoming meetings, detect scheduling conflicts.

**When it makes sense:** You want the agent to prep for upcoming meetings and suggest interaction files automatically.

**Dependencies:** Calendar API token or `.ics` feed.

**Setup effort:** `medium` to `involved`.

---

### Custom database / internal API

**What it does:** Read-only queries against an internal database or API (employee directory, org chart, product data, analytics). Useful when the agent needs to look up structured data that isn't in the wiki.

**When it makes sense:** You have access to internal data sources that the agent should be able to query.

**Dependencies:** DB credentials or API token. Read-only access strongly recommended.

**Setup effort:** `involved`.

---

## Category 3 — Agent Hooks (pi-specific)

These extensions require [pi](https://github.com/earendil-works/pi-coding-agent) as the agent runtime. They live in `.pi/extensions/personalos.ts` and use the pi Extension API.

---

### session_start — Daily Briefing Widget

**What it does:** On every session start, a briefing widget appears above the prompt showing: today's date + calendar week, open P1/P2 todos, stale inbox files (> 3 days), wiki health issue count, and weekly review status. The widget clears automatically on the first user message.

**When it makes sense:** You use pi daily and want an instant situational overview without having to ask for it.

**Dependencies:** pi coding agent. `scripts/daily-log-bootstrap.sh` (creates today's log on startup).

**Setup effort:** `medium` — create `.pi/extensions/personalos.ts` with the `session_start` hook.

---

### session_shutdown — Automatic Write-Back

**What it does:** When you close pi (`quit` / `new` / `resume`), a background sub-agent fires. It checks if the daily log was written during the session. If not, it writes a session summary automatically — capturing what was done, updating todos, and enforcing English in wiki content. You don't have to remember to run the `log` skill.

**When it makes sense:** You often forget write-back or want it to happen without friction.

**Dependencies:** pi coding agent. `session_start` hook recommended (for the daily log file).

**Setup effort:** `medium` — add `session_shutdown` handler to `.pi/extensions/personalos.ts`.

---

### /sync command

**What it does:** An on-demand operational scan. The agent reads all HOLLOP areas (inbox, interactions, notes, daily logs, todos, waiting-on, decisions, people, projects, knowledge), identifies only what needs attention, and works through it with you. Run it multiple times per day — it shows only the delta.

**When it makes sense:** You want a quick "what needs my attention right now" view without a full weekly review.

**Dependencies:** pi coding agent. Full base system in use.

**Setup effort:** `minimal` — register `/sync` command in the pi extension.

---

### /weekly command

**What it does:** Triggers the weekly review skill as an interactive guided session inside pi. The agent works through all review steps one by one, waits for your input at each step, and marks the review as done when complete. Startup widget shows overdue notice if the weekly review hasn't been run.

**When it makes sense:** You have the `weekly-review` skill set up and want it integrated as a pi command with state tracking.

**Dependencies:** pi coding agent. `skills/weekly-review.md` exists.

**Setup effort:** `minimal` — register `/weekly` command + `weekly_mark_done` tool in the pi extension.

---

### /incident command (on-call specific)

**What it does:** Documents an on-call incident deployment. Pre-fills from a ticket key if provided (pulls title, severity, affected system from the ticket system). Creates a structured incident file. Links to the duty period file.

**When it makes sense:** You have on-call duties and need to document incident deployments reliably.

**Dependencies:** pi coding agent. `oncall/` vault area set up. Optionally: ticket system integration.

**Setup effort:** `medium` — register `/incident` command + create `skills/oncall-incident.md` + set up `oncall/` folder structure.

---

## Category 4 — Automation Scripts

Scripts that run on a schedule or are triggered by system events. On macOS: launchd. On Linux: cron / systemd.

---

### daily-log-bootstrap

**What it does:** Creates today's daily log file from the template if it doesn't exist yet. Idempotent — safe to run multiple times.

**When it makes sense:** You want today's log to exist before you start working, without having to create it manually.

**Dependencies:** `resources/templates/daily.md` exists.

**Setup effort:** `minimal` — `scripts/daily-log-bootstrap.sh` + launchd plist or cron job. If using pi: integrate into `session_start` hook instead.

---

### wiki-health-check

**What it does:** Runs a daily health check on the vault. Checks: broken wikilinks, empty ops/ lists, stale waiting-on entries. Writes a report to `automations/health/<date>.md`. Sends a system notification if issues are found.

**When it makes sense:** Your vault has grown to 30+ files and you want automated quality control.

**Dependencies:** bash, standard Unix tools. macOS `osascript` for notifications.

**Setup effort:** `minimal` — `scripts/wiki-health-check.sh` + scheduler. If using pi: integrate async into `session_start` hook.

---

### inbox-staleness-check

**What it does:** Checks if any inbox files are older than a configurable threshold (default: 3 days) and sends a reminder notification.

**When it makes sense:** You tend to let the inbox grow without reviewing it.

**Dependencies:** bash + scheduler.

**Setup effort:** `minimal`.

---

## Category 5 — Optional Vault Areas

Structural additions to the vault for specific use cases.

---

### oncall/ — On-Call Duty Tracking

**What it does:** Adds a structured area for tracking on-call duty periods and incident deployments. Includes duty files (shift metadata), incident files (timeline, actions taken, resolution), and links to the external calendar as source of truth.

**When it makes sense:** You have a rotating on-call duty (24/7 support, incident response) and need to document deployments reliably.

**Setup effort:** `minimal` — create `oncall/` folder with `_index.md`, `duties/`, `incidents/` subdirs + `skills/oncall-incident.md`.

---

### context/strategy/ — Strategic Focus

**What it does:** A place to document your current strategic focus (quarterly goals, personal development direction, career priorities). The weekly review references it to check if the week was intentional.

**When it makes sense:** You want the system to help you stay aligned with longer-term goals, not just react to daily noise.

**Setup effort:** `minimal` — create `context/strategy.md` with your current focus areas.

---

### automations/ structured outputs

**What it does:** If you run external automations (Zapier, n8n, Make, GitHub Actions) that produce Markdown outputs, route them into `automations/<source>/`. The agent can scan these on demand or in the weekly review.

**When it makes sense:** You have existing automation workflows that produce logs or summaries you want to capture in the wiki.

**Setup effort:** `minimal` to `medium` depending on the automation source.

---

## Adding a new extension not in this catalog

1. Identify the pattern: skill / tool integration / hook / script / vault area
2. If it's a tool integration: follow `skills/add-infrastructure.md`
3. If it's a new skill: follow `skills/write.md` (META skill)
4. If it's a pi hook or command: edit `.pi/extensions/personalos.ts`, use `/reload` to hot-reload
5. Document it here in the catalog so future sessions (and future agents) can find it
