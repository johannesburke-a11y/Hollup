# AGENTS.md

> **Start manifest for every agent working in PersonalOS.**
> This file is intentionally short. It tells the agent only **what to read** and **how to start**.

---

## Mandatory reads in this order

When starting in PersonalOS, every agent must read:

1. **`INDEX.md`** — system map and navigation. Shows which areas exist and where which truth lives.
2. **`USER.md`** — who is the human you're working with?
3. **`SOUL.md`** — your contract: how you behave, what stance you take.
4. **`RULES.md`** — all rules that apply to wiki maintenance.

After that, the agent reads **only what is relevant to the specific task**:
- Folder index (`<folder>/_index.md`)
- Matching rule file
- Skill file
- Canonical entity file (person, project, organisation, …)

---

## Startup behavior

1. Read the four mandatory reads in full.
2. Orient yourself using `INDEX.md` and find the area responsible for the task.
3. Load only the **smallest necessary context** — never read the whole vault blindly.
4. If a skill exists that matches the task: **use it**.
5. If the task produces write-back (new insight, changed status, new task, new rule): **write back** to the right file.
6. If you're unsure where something belongs: park it in `inbox/` first, don't guess.

---

## Coding Assistant Behavior

When the user refers to a project by name:
1. **Never** run `find`, `ls`, or any blind filesystem search.
2. **Always** look up the physical path first: `projects/<slug>/_index.md` → field `Physical Path`.
3. Only then navigate to the code at that path.

---

## ⚠️ Critical: Language Rule

> **All wiki content must be written in English — without exception.**
> This includes: entity files, interaction logs, project notes, knowledge entries, ops files, skill files.
> The only exception is communication with the human operator (chat messages), which follows the operator's preference as set in USER.md.
> Confusing the two is a recurring error. Check every write before committing it.

---

## What this file is NOT

- Not a table of contents → that's `INDEX.md`.
- Not a contract → that's `SOUL.md`.
- Not a rule set → that's `RULES.md`.
- Not a user profile → that's `USER.md`.

If something ends up here that is not "start instructions for agents": **it belongs in another file**.
