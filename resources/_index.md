# Resources

> **Templates, frameworks, sub-rules, prompts, extensions catalog.**

## Purpose

Support material for maintaining the wiki and running skills. Resources are not knowledge — they are tools for producing knowledge.

## Structure

```
resources/
├── _index.md
├── system/
│   ├── _index.md
│   └── rules/
│       ├── _index.md
│       └── <rule-slug>.md   ← detailed sub-rules
├── templates/
│   └── <template-slug>.md   ← file templates
└── extensions/
    └── catalog.md           ← all possible extensions with setup guidance
```

## Current contents

### system/rules/
- `project-workflow.md` — detailed workflow for project sessions

### templates/
- `project.md` — template for `projects/<slug>/_index.md`
- `person.md` — template for `people/<name>.md`
- `interaction.md` — template for `interactions/<date>-<topic>.md`
- `daily.md` — template for `daily/<date>.md`
- `knowledge.md` — template for `knowledge/wiki/<topic>.md`

### extensions/
- `catalog.md` — all possible PersonalOS extensions (skills, tool integrations, agent hooks, automations, optional vault areas)
