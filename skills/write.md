---
type: skill
status: active
tags: [area/wiki, topic/skills]
---

# Skill: write

> **META skill: how a skill is written.**
> Read this skill before creating a new skill.

## Purpose

Ensure consistency: every skill follows the same schema so the agent can reliably read and execute it.

## When to use?

- When a new skill is created.
- When an existing skill is revised.

## Schema for a skill file

Every skill file in `skills/` follows this structure:

```markdown
# Skill: <name>

> **One-line short description.**

## Purpose
What this skill does and which problem it solves (2–4 sentences).

## Trigger
When is this skill triggered? ("When I want X, then …")

## Prerequisites
- Which root files must have been read?
- Which context files are relevant?
- Which rules apply?

## Procedure
1. Step 1
2. Step 2
3. Step 3
…

## Write-back
What must flow back into the wiki at the end of this skill?
- Example: "Write entry in `daily/<date>.md`"
- Example: "Create new task in `ops/todo.md`"

## Examples
- Concrete example 1 (input → expected output)
- Concrete example 2

## Notes / History
_(append-only — what changed on this skill?)_
```

## Checklist before creating

- [ ] Name is action-verb-based and short (`ingest`, `prep`, `review`, …)
- [ ] Trigger clearly formulated
- [ ] Prerequisites complete
- [ ] Procedure in 3–10 steps
- [ ] Write-back block defined
- [ ] At least 1 concrete example

## Maintenance

- Review the skill after the first 2–3 applications — does it still fit?
- If the skill grows: split steps into sub-skills.
- Don't delete outdated skills → first into `trash/`, then remove permanently after 30+ days.

## Notes / History

_(append-only)_
