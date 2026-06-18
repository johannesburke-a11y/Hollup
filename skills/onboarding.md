---
type: skill
status: active
tags: [area/wiki, topic/setup]
---

# Skill: onboarding

> **First-run walkthrough — sets up PersonalOS for a new user.**
> Run this skill when USER.md still contains `_TODO_` placeholders.
> The agent guides through every core file interactively, one step at a time.

## Purpose

Ensure that a new PersonalOS installation is fully personalized before the first real use.
A generic setup is useless — the system only becomes powerful when it reflects the actual user.
This skill transforms the starter kit into a real personal operating system.

## Trigger

- USER.md still contains `_TODO_` fields (agent detects on session start)
- User says: "Set up PersonalOS", "Run onboarding", "First-time setup"
- AGENTS.md startup check fires (see AGENTS.md — First Run section)

## Prerequisites

- All four mandatory reads done: INDEX.md, USER.md, SOUL.md, RULES.md
- The agent has read the current (still generic) USER.md and SOUL.md

## Behavior Rules

- **One step at a time.** Never jump ahead.
- **Wait for the user's answer before proceeding.**
- For each file: explain WHY it matters before asking questions.
- If the user says "skip" or "keep default" for something — respect it and move on.
- At the end: summarize what was set up and what remains optional.

---

## Procedure

### Step 1 — Welcome & orientation

Greet the user. Explain in 3–4 sentences what PersonalOS is and what this onboarding does.
Then ask: "What language should I use to communicate with you?" — set this as the communication language for the rest of the session.

---

### Step 2 — Fill in USER.md

Open `USER.md`. Go through each `_TODO_` field and ask for the value.

**Section: Master Data**
- Full name + preferred call name
- Location
- Primary languages (native / fluent)
- Preferred chat language with the agent

**Section: Professional / Main Activities**
- Current role(s) / title(s)
- Employer or main context (company, freelance, personal)
- Focus areas (e.g. Backend, DevOps, Management, Design)

**Section: Working Style**
Ask the 4 working style questions:
1. "How should I communicate with you? (direct + short / collaborative / detailed)"
2. "Is it okay if I push back on your ideas or point out flaws in your thinking?"
3. "What agent behavior do you value most?"
4. "What agent behavior do you want to avoid?"

**Section: Tech Stack**
- OS (macOS / Linux / Windows)
- Primary editor / IDE
- Main languages and technologies
- Agent tool being used (pi / Cursor / Claude / other)

**Section: Git Conventions**
- Ask: "Do you want to use Conventional Commits format for commit messages? (Recommended: yes)"
- If yes: keep the default. If no: ask what format they prefer and update accordingly.

After all fields: write the completed USER.md back to disk.

---

### Step 3 — Review SOUL.md

Explain: "SOUL.md defines how I behave — my role, communication style, and trust boundaries."

Read through each section of SOUL.md with the user:

1. **Role** — "I act as a right hand and sparring partner. Does that feel right, or do you want a more passive assistant?"
2. **Decision Making** — "For non-trivial changes I present a plan first. For small things I just do it. Does that match your preference?"
3. **Error Handling** — "I fix errors autonomously and verify the fix myself. Agree?"
4. **Trust Boundaries** — "I never make irreversible changes without confirmation. Any additional limits you want to set?"

Update SOUL.md if the user wants adjustments.

---

### Step 4 — Walk through RULES.md

Explain: "RULES.md is the constitution of your wiki. These rules prevent drift and split-brain. Let me walk you through each one."

Go through each rule (§1–§16). For each rule:
- State the rule in one sentence
- Explain WHY it exists (1–2 sentences)
- Ask: "Does this make sense for you? Any adjustments?"

Rules that commonly need adaptation:
- **§11 Language** — Confirm the wiki language (default: English). If user works primarily in another language, discuss trade-offs.
- **§12 Git** — Ask: "Do you plan to version your wiki with Git? (Recommended)"
- **§16 Deploy approval** — Ask: "Are there production systems I might touch? If so, should I always ask before deploying?"

Update RULES.md for any agreed adjustments. Document changes in `ops/decisions.md`.

---

### Step 5 — Walk through AGENTS.md

Explain: "AGENTS.md is my startup manifest — what I read first and how I orient myself."

Cover:
1. **Mandatory reads** — explain why the order matters (INDEX → USER → SOUL → RULES)
2. **Startup behavior** — explain the inbox-first principle
3. **Language rule** — confirm English for wiki content

Ask: "Is there anything you'd want me to always do at the start of a session that isn't covered here?" — if yes, add it to AGENTS.md.

---

### Step 6 — Extensions (see `resources/extensions/catalog.md`)

Load `resources/extensions/catalog.md`.

Explain: "PersonalOS can be extended with additional skills, integrations, and automations. Let me ask about a few areas — you can always add these later."

Work through the catalog **category by category**. For each category, ask ONE targeted question based on the user's profile (from USER.md). Don't list all options — make a recommendation.

Example questions:
- "You mentioned using Git — should I set up the `commit` skill with Conventional Commits format? It adds a review step before every commit."
- "Do you use a ticket system like Jira, Linear, or GitHub Issues? I can build a script + skill integration for it."
- "Are you using pi as your agent? If so, I can set up session hooks: a daily briefing widget on startup and automatic write-back when you close the session."
- "Do you have recurring operational reviews (weekly review, sync)? I can set up a guided weekly review command."
- "Do you work with external collaborators regularly? The `add-infrastructure` skill helps standardize how new tools get connected."

For each "yes" → note it in `inbox/onboarding-extensions.md` as a TODO. Don't set them up now — that's a separate session per extension.

---

### Step 7 — Initialize Git (optional)

Ask: "Should I initialize a Git repository for your PersonalOS vault now?"

If yes:
1. First, review `.gitignore` together:
   - Confirm `daily/` is correctly gitignored (personal logs, not for sharing — change if you want to version them)
   - Confirm no secrets are in the vault yet (`.env` should not exist yet or should be empty)
   - Ask: "Do you want to add anything else to .gitignore before the first commit?"
2. Then:
```bash
git init
git add .
git status   # review staged files together before committing
git commit -m "chore: initial PersonalOS setup"
```

Also ask: "Do you have a remote repository (GitHub, GitLab, Gitea)? If yes, share the URL and I'll add the remote."

If they add a remote:
```bash
git remote add origin <url>
git push -u origin main
```

---

### Step 8 — First log entry

Run the `log` skill (`skills/log.md`) to write the first session entry:
- Create `daily/<today>.md`
- Log entry: "PersonalOS onboarding — initial setup"
- Write-back done: USER.md, SOUL.md, RULES.md personalized; extensions noted in inbox/

---

### Step 9 — Post-setup cleanup

The starter kit contains scaffolding that is no longer needed once onboarding is complete. Clean it up now so the vault doesn't carry dead weight.

**AGENTS.md — remove the First Run block**
Delete the entire `⚡ First Run Check` section (the `grep` check + instruction to run onboarding).
It was only relevant before personalization. Leaving it in causes the agent to check on every session start unnecessarily.
Also update the Startup behavior list: remove step 1 ("First Run Check").

**skills/onboarding.md — archive this skill**
Change the frontmatter:
```yaml
status: archived
```
Add a note at the bottom under `## Notes / History`:
```
- YYYY-MM-DD: Onboarding completed. Skill archived — one-time use only.
```

**skills/_index.md — update the contents list**
Remove or mark the `onboarding.md` entry as archived. It should not appear as an active skill.

**Verify: no `_TODO_` remaining**
Run a final check:
```bash
grep -r "_TODO_" --include="*.md" . | grep -v "trash/"
```
If any `_TODO_` entries remain: either fill them in now or note them in `inbox/` for later.

---

### Step 10 — Wrap-up

Summarize what was set up:
- USER.md → filled in ✅
- SOUL.md → reviewed + adjusted ✅
- RULES.md → reviewed + adjusted ✅
- AGENTS.md → reviewed + First Run block removed ✅
- Starter kit scaffolding cleaned up ✅
- Extensions noted → `inbox/onboarding-extensions.md`
- Git initialized (if applicable) ✅

Tell the user:
> "Your PersonalOS is now personalized and ready. The starter kit scaffolding has been cleaned up. The next step is to work through the extensions you noted — start with the ones that match your daily tools."

---

## Write-back

| What | Where |
|---|---|
| Completed operator profile | `USER.md` (overwrite) |
| Adjusted behavior contract | `SOUL.md` (overwrite) |
| Adjusted rules | `RULES.md` (overwrite where changed) |
| Rule change rationale | `ops/decisions.md` (append) |
| Extensions to set up | `inbox/onboarding-extensions.md` (create) |
| First Run block removed | `AGENTS.md` (edit) |
| Skill archived | `skills/onboarding.md` frontmatter (edit) |
| Skills index updated | `skills/_index.md` (edit) |
| Session log | `daily/<YYYY-MM-DD>.md` (create + write) |

## Notes / History

_(append-only)_
