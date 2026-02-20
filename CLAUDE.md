# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **pnpm monorepo** with two apps for the Requete project (a data pipeline orchestration framework):
- `apps/web` — Next.js marketing/product site (static export)
- `apps/docs` — Docusaurus documentation site

## Common Commands

```bash
# Install dependencies
pnpm install

# Development servers
pnpm --filter requete-web dev      # http://localhost:8080
pnpm --filter requete-docs dev     # http://localhost:8081

# Build
pnpm --filter requete-web build
pnpm --filter requete-docs build

# Lint (Biome)
pnpm --filter requete-web lint
pnpm --filter requete-docs lint

# Type check
pnpm --filter requete-web typecheck
pnpm --filter requete-docs typecheck

# Format (Biome)
pnpm --filter requete-web format
pnpm --filter requete-docs format
```

There are no tests in this repository.

## Architecture

### `apps/web` (Next.js marketing site)

- **Static export** — no server runtime; outputs static files at build
- Entry point: `src/app/page.tsx` assembles homepage sections from `src/components/home/`
- Path alias: `@/*` maps to `src/*`
- Styling: Tailwind CSS v4
- Code highlighting: Shiki (configured in `src/lib/highlight.ts`)
- Global constants (URLs, copy) live in `src/lib/constants.ts`
- UI primitives (Button, CodeBlock, Container, ScrollReveal) in `src/components/ui/`
- Layout (Header, Footer) in `src/components/layout/`

### `apps/docs` (Docusaurus docs site)

- Documentation covers: getting-started, pipelines, environments, testing, IDE, lsp-rules, reference
- Navigation structure defined in `sidebars.ts`
- Supports Mermaid diagrams and MDX

## Code Quality

- **Biome** handles both linting and formatting (replaces ESLint + Prettier)
- Semicolons required, 2-space indentation, LF line endings, 120 char line length
- TypeScript strict mode enabled in both apps
- CI runs lint + typecheck + build for whichever app has changed (detected via `dorny/paths-filter`)

After every code change, verify the affected app passes all checks:
```bash
pnpm --filter <app> lint
pnpm --filter <app> typecheck
pnpm --filter <app> format
pnpm --filter <app> build
```
