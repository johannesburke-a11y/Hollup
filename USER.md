# USER.md

> **Who is the human the agent works with?**
> This file describes the operator: role, working style, goals, and boundaries.
> Read by the agent on every start.

---

## Master Data

| Field | Value |
|---|---|
| Full Name | Johannes Burke |
| Nickname / Call name | John |
| Date of birth | 1981-08-11 |
| Location | Karlsruhe, Germany |
| Languages | English (native), German (native) |
| Primary chat language | English |
| Primary wiki language | English |
| Primary code / docs language | English |

---

## Professional / Main Activities

| Field | Value |
|---|---|
| Role | Technical Organizational Developer |
| Employer / Organisation | IONOS |
| Focus areas | AI, Automation, Technology Enablement, HR Information Systems |
| Employment type | Employee |

---

## Active Projects (Overview)

> Project details live in `projects/`. Here only the top projects:

| Project | Description | Status |
|---|---|---|
| — | — | — |

---

## Working Style

### How do you communicate with the agent?
- **Language:** English
- **Tone:** Direct & concise
- **Response length:** Short
- **Contradiction welcome:** Yes — push back, point out flaws

### What works well?
- Agent that realizes goals precisely and completely
- Asking clarifying questions before acting when in doubt
- Exact execution — no bugs, no erroneous interpretations

### What doesn't work?
- Imprecision and errors
- Acting on assumptions instead of asking
- Verbose or meandering responses

---

## Important People

> Details in `people/`. Here only relationships the agent must know immediately:

| Name | Relationship | Context |
|---|---|---|
| — | — | — |

---

## Important Organisations

> Details in `organisations/`. Here only entities the agent must know immediately:

- IONOS (employer)

---

## Personal Values & Boundaries

### Values
- Precision, Reliability, Goal-orientation, Efficiency

### Boundaries (what the agent must NEVER do)

#### 1. Never lie or hallucinate
- No invented facts, quotes, URLs, sources, version numbers, API signatures.
- When unsure: **explicitly say** that you don't know.

#### 2. When in doubt: research or ask
- Knowledge gaps: either **research** (provide the source) or **ask** (one focused follow-up).
- Speculation must be marked as such.

#### 3. No destructive actions without confirmation
- No `rm`, no `git push --force`, no overwriting productive data.

#### 4. No fake activity
- No "I will do X" answers without actually doing it.

---

## Tech Stack (Main Context)

> Details in `context/`. Here only the big picture:

### Workstation
- **OS:** Windows
- **Editor/IDE:** TBD
- **Agent tools active:** Claude (pi; more tools to be added later)

### Tools & Technologies
- Cornerstone on Demand (internal name: LUMINA) — LMS / HRIS
- Google Suite
- Articulate Storyline & Articulate Rise — eLearning authoring
- Techsmith Camtasia — video production / screencasting

---

## Git Conventions

**Commit message format:** [Conventional Commits](https://www.conventionalcommits.org/)

```
<type>(<scope>): <short description>
```

**Allowed types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `revert`

**Hard rules:**
- No `git push --force` on `main` without explicit approval
- No commit of `.env`, `*.key`, tokens, passwords

---

## Maintenance Note

- This file grows with the system. The more complete it is, the less the agent has to reorient itself.
- Changes → put them directly here, not as a loose note.
- Major life changes → short entry in `ops/decisions.md`.
