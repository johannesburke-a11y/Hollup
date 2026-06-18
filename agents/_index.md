# Agents

> **Agent governance for HOLLOP — rules, protocols, and configurations for all agents and subagents.**

## Purpose

This folder defines how AI agents operate within HOLLOP — individually and in orchestration.
It is the single source of truth for agent behavior that goes beyond the primary session contract.

## Files

| File | Purpose |
|---|---|
| `ruleset.md` | General rules for all agents and subagents |

## Relationship to other files

| File | Scope |
|---|---|
| `AGENTS.md` | Startup manifest — what a primary agent reads and how it starts |
| `SOUL.md` | Behavioral contract — stance, tone, communication style |
| `RULES.md` | Wiki rules — how content is created, maintained, and structured |
| `agents/ruleset.md` | **This folder** — orchestration, subagents, parallelization, delegation |

These files do not overlap. An agent reads all four.
