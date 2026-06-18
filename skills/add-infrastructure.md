---
type: skill
status: draft
tags: [area/wiki, topic/infrastructure]
---

# Skill: add-infrastructure

> **Checklist for adding a new tool or system to PersonalOS.**
> Follow this skill every time a new tool (API, ticket system, database, etc.) is connected.
> Ensures every tool is consistently structured and reliably findable.

## Purpose

When a new external tool is connected, many things need to be set up in parallel: credentials, a context file, a script, a skill, and references in the index files. This skill ensures nothing is missed and every tool follows the same pattern — so any future agent can find and use it reliably.

## Trigger

- "Connect X", "Add Y", "I have access to Z"
- A new tool is being integrated for the first time
- An existing tool integration is being formalized

## Prerequisites

- `RULES.md` read (especially §2, §8, §11)
- `.env` file exists at vault root (gitignored)
- `context/infrastructure/` folder exists

## The Mandatory Pattern (all 7 steps)

### 1. Credentials → `.env`

Add credentials to `.env` at vault root (gitignored):
```
# <Tool Name>
<TOOL>_BASE_URL="https://..."
<TOOL>_TOKEN="..."
```

Variable prefix = tool name in CAPS (e.g. `JIRA_`, `GITHUB_`, `NOTION_`).
Never commit `.env`. Verify it's in `.gitignore` first.

---

### 2. Context file → `context/infrastructure/<tool>.md`

Create a context file documenting:
- Instance overview (URL, edition, auth method)
- Your role / access level
- Key endpoints, spaces, or projects you use
- API reference (base URL, auth header format)
- Reference to the script and skill

Template: `resources/templates/infrastructure.md` _(create if it doesn't exist yet)_

---

### 3. Script → `scripts/<tool>.sh`

Create a script with the core commands for this tool type:

| Tool type | Minimum commands |
|---|---|
| Ticket system | `my-issues`, `issue <key>`, `search`, `create`, `comment`, `transition` |
| Wiki / docs | `my-pages`, `page <id>`, `search`, `create`, `update` |
| Database | `search`, relevant domain queries |
| API / service | `status`, `search`, relevant domain commands |

Required in every script:
- Load credentials from `.env`
- Timeout / connection error handling
- Write commands require a confirm prompt

Make executable: `chmod +x scripts/<tool>.sh`

---

### 4. Skill → `skills/<tool>.md`

Create a skill file (follow `skills/write.md` schema) with:
- Trigger section: when is this skill activated?
- All script commands documented with examples
- Write rules (what needs confirmation, what runs silently)
- Reference to `context/infrastructure/<tool>.md`

---

### 5. `USER.md` → add to "System Roles & Access"

```markdown
- **<Tool> <Role>** — <short description>
  - Details: `context/infrastructure/<tool>.md` | Script: `scripts/<tool>.sh` | Skill: `skills/<tool>.md`
```

---

### 6. `context/_index.md` → add a row to the infrastructure table

---

### 7. `skills/_index.md` → add entry

---

## Quality Check

Before committing, verify:

- [ ] `.env` has credentials with correct prefix
- [ ] `context/infrastructure/<tool>.md` exists and is complete
- [ ] `scripts/<tool>.sh` is executable and tested
- [ ] `skills/<tool>.md` has a trigger section and at least one example
- [ ] `USER.md` → System Roles & Access updated
- [ ] `context/_index.md` updated
- [ ] `skills/_index.md` updated
- [ ] All script commands tested manually at least once

## Write-back

- All 7 locations above updated
- Session log entry in `daily/<YYYY-MM-DD>.md`

## Notes / History

_(append-only — fill in after first use)_
