# AdonisJS v7 agent skill

Install this **folder** into your agent's supported skill directory, commonly `.agents/skills/adonisjs-v7/`. The folder name must match the `name` field in `SKILL.md`.

## What is included
- `SKILL.md`: short trigger + operating procedure and on-demand reference routing.
- `references/`: 15 concise Markdown topic guides grounded in official v7 documentation, a source index, and 4 implementation checklists.
- `scripts/inspect-project.mjs`: read-only Node.js audit, run with `node .agents/skills/adonisjs-v7/scripts/inspect-project.mjs .` from the project root.
- `scripts/sync-official-docs.mjs`: optional downloader for official `.md` source pages using `scripts/official-docs-manifest.json` (not executed during installation).
- `evals/cases.json`: positive/negative activation cases and behavior assertions for skills-aware agent evaluation.

## Install

```sh
mkdir -p .agents/skills
cp -R /path/to/adonisjs-v7 .agents/skills/adonisjs-v7
```

Use the equivalent skill path for your specific coding-agent client. Restart/reload skills if the client needs it. Do not copy this folder into `app/` or install it as an npm package.

## Validate

```sh
# If you have the official skills-ref CLI installed
skills-ref validate .agents/skills/adonisjs-v7

# Optional read-only project audit (Node 24+ expected for AdonisJS v7)
node .agents/skills/adonisjs-v7/scripts/inspect-project.mjs .
```

## Tailor it to your repository

Add a small project-specific reference documenting exact stack, preferred DB, auth guard, API response envelope, naming conventions, test commands, tenancy and data retention rules. Link it once from `SKILL.md` so the agent reads it only when relevant. Update evaluations using real mistakes found during implementation and review.

Primary sources: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx ; https://github.com/agentskills/agentskills/blob/main/docs/skill-creation/best-practices.mdx ; https://docs.adonisjs.com/ ; https://docs.adonisjs.com/v6-to-v7

## Documentation references

Read [`references/README.md`](references/README.md) for the topic map. Each reference file links to the matching original v7 Markdown page (`https://docs.adonisjs.com/... .md`). The bundled notes are purpose-written condensed summaries, **not full reproductions of upstream pages**.

To fetch official raw Markdown into `references/official/` from the official site yourself:

```sh
node scripts/sync-official-docs.mjs --list
node scripts/sync-official-docs.mjs --only routing,validation,lucid,transformers
node scripts/sync-official-docs.mjs --all
```

Run these commands from the skill folder; Node.js with built-in `fetch` is needed, and internet access is required. Check official documentation licensing/terms before redistributing downloaded content.
