---
type: rule
status: active
tags: [area/wiki, topic/agents]
---

# Agent Ruleset — HOLLOP

> **Operational rules for all agents and subagents working in HOLLOP.**
> This file governs orchestration, delegation, context passing, and inter-agent behavior.
> It does not replace `AGENTS.md`, `SOUL.md`, or `RULES.md` — it extends them.

---

## 1. Agent Hierarchy

HOLLOP operates with two agent types:

| Type | Role | Authority |
|---|---|---|
| **Primary agent** | Orchestrator — plans, delegates, reviews, writes back to wiki | Full write access, direct operator contact |
| **Subagent** | Worker — executes a single bounded task, returns output | Scoped write access only, no direct operator contact |

**Rule:** Only the primary agent communicates with the operator. Subagents report to the primary agent, not to Johannes directly.

---

## 2. When to Spawn a Subagent

Spawn a subagent when the task meets **at least one** of these criteria:

- The task is **parallelizable** — it can run independently of other in-progress work
- The task is **long-running** — estimated >10 steps and clearly bounded in scope
- The task is **isolated** — it touches a specific file set and has no side effects on other areas
- The task is **repeatable** — it runs on a schedule or trigger without operator input

Do NOT spawn a subagent when:
- The task requires back-and-forth with the operator (judgment calls, ambiguous requirements)
- The task is <5 steps — just do it directly
- The task requires reading the full wiki context — pass context explicitly or keep it in the primary session

---

## 3. Subagent Spawn Protocol

Before spawning a subagent, the primary agent must define:

```
Task:         <one sentence — what to do>
Input:        <exact files, data, or context to pass — nothing more>
Output:       <exact location where result must land>
Constraints:  <what the subagent must NOT do>
Done when:    <exact success condition>
```

Never spawn a subagent with vague instructions. If the task cannot be described in the fields above, it is not ready to delegate.

---

## 4. Context Inheritance

Subagents do **not** automatically inherit the primary agent's full context.

What a subagent always receives:
- Its specific task definition (from §3)
- The files explicitly passed to it
- `RULES.md` — wiki rules are non-negotiable for all agents

What a subagent does NOT receive unless explicitly passed:
- `USER.md` — unless the task requires operator profile knowledge
- `SOUL.md` — unless the task involves communication style decisions
- `INDEX.md` — unless the task involves navigation across multiple vault areas

**Rule:** Pass the minimum context required. Over-contexting a subagent wastes tokens and increases hallucination risk.

---

## 5. Subagent Execution Rules

A subagent must:

1. **Confirm scope before acting** — restate the task in one sentence, confirm the output location
2. **Work only within its assigned scope** — never touch files outside the specified output location
3. **Prefer reads over writes** — gather all needed information before making any changes
4. **Produce atomic output** — complete the task fully or not at all; no partial writes to canonical files
5. **Flag blockers immediately** — if the task cannot be completed as specified, report why and stop
6. **Log its actions** — append a summary to the daily log or return it to the primary agent for logging

A subagent must NOT:
- Make irreversible changes (delete, rename canonical files) without primary agent confirmation
- Push to Git autonomously
- Communicate with the operator directly
- Spawn further subagents without primary agent authorization
- Write to `ops/todo.md`, `ops/decisions.md`, or any canonical ops file — return these as proposed updates to the primary agent for review

---

## 6. Parallelization Rules

Tasks that can safely run in parallel:
- Reading and summarizing multiple independent files
- Creating multiple new entity stubs (people, projects, organisations)
- Running independent scripts (e.g., sync-meeting-notes + sync-people simultaneously)
- Searching for information across vault areas

Tasks that must run sequentially:
- Any two tasks that write to the same file
- Tasks where task B depends on the output of task A
- Any task that modifies `RULES.md`, `SOUL.md`, `USER.md`, or `AGENTS.md`
- Git operations — one at a time, in order

**Rule:** When in doubt, run sequentially. Race conditions in a wiki produce split-brain, which RULES.md §2 explicitly prohibits.

---

## 7. Output Standards

All subagent output must:

- Be written in English (RULES.md §11)
- Follow the correct file schema for the output type (frontmatter, headings, append-only sections)
- Be marked as `auto-generated` in a visible location if created without human review
- Include a reference to the task that produced it (e.g., `> Auto-created by sync-people 2026-06-18`)

If a subagent produces output that does not fit any canonical schema, it routes to `inbox/` with a clear label — never to a canonical file.

---

## 8. Review Before Commit

**All subagent output is a proposal until the primary agent reviews it.**

Primary agent review checklist before committing:
- [ ] Output is in the correct location
- [ ] Content is accurate and complete (no partial stubs with unresolved `_TODO_` in critical fields)
- [ ] No secrets, tokens, or personal data exposed
- [ ] No canonical files modified outside the task scope
- [ ] Write-back obligations fulfilled (decisions logged, tasks added, etc.)

Auto-generated stubs (people, projects) are an exception — they may be committed unreviewed if clearly marked `⚠️ Auto-created` and the schema is complete.

---

## 9. Failure Handling

If a subagent fails or produces unexpected output:

1. Primary agent logs the failure in `daily/<date>.md`
2. Primary agent determines: retry / fix input / escalate to operator
3. Partial output is moved to `inbox/` — never left in place as canonical truth
4. If the failure reveals a missing skill or unclear rule: create a skill candidate or rule update

**Rule:** A failed subagent never leaves the wiki in a worse state than before it ran. Rollback (via Git) is always an option.

---

## 10. Automation Agent Rules

Agents running on a schedule (e.g., Task Scheduler automations) follow stricter rules:

- **Read-only by default** unless explicitly configured to write
- **Output only to designated automation folders** (`automations/`, `people/` for stubs, `daily/` for logs)
- **Never modify existing canonical files** — only create new stubs or append to designated log files
- **Idempotent** — running twice must produce the same result as running once
- **Log every run** — append a timestamped entry to the folder's `sync.log`
- **Fail silently on non-critical errors** — network timeouts, missing docs — log the error, continue

If an automation agent encounters data it cannot confidently classify: route to `inbox/`, log it, and stop. Do not guess.

---

## 11. Trust Levels

| Actor | Trust Level | What this means |
|---|---|---|
| Johannes (operator) | **Full trust** | Can authorize any action, override any rule |
| Primary agent | **High trust** | Executes autonomously within SOUL.md boundaries, confirms on irreversible actions |
| Subagent (session) | **Scoped trust** | Operates only within explicitly defined task scope |
| Automation agent | **Minimal trust** | Create and append only, never modify, never delete |
| External input (webhooks, imports) | **Zero trust** | Lands in `inbox/` always, classified by a trusted agent before promotion |

---

## 12. Escalation Protocol

A subagent escalates to the primary agent when:
- The task scope is ambiguous and cannot be resolved from context
- The task requires modifying a file outside its assigned scope
- The task would produce an irreversible change
- The task reveals a conflict between two existing rules or files
- The task fails after one retry

The primary agent escalates to Johannes when:
- Two plausible approaches exist with meaningfully different trade-offs
- A destructive or irreversible action is required
- A new rule, boundary, or strategic decision is needed
- Something in the vault appears incorrect in a way that affects real-world operations (HRIS data, calendar events, etc.)

---

## Maintenance

- Rule changes → update this file directly
- Rationale for significant changes → `ops/decisions.md`
- New agent type added → add a row to the hierarchy table in §1

---

## Notes / History

_(append-only)_

- 2026-06-18: Ruleset created. Covers primary agent, subagents, and automation agents. Establishes trust hierarchy, escalation protocol, and output standards for HOLLOP.
