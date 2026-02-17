# Requete Web

Monorepo for [requete.dev](https://requete.dev) and [docs.requete.dev](https://docs.requete.dev).

Requete is a data pipeline orchestration framework. Build, test, and deploy data pipelines using Python decorators instead of YAML.

## Structure

- `apps/web` — Marketing site (Next.js)
- `apps/docs` — Documentation (Docusaurus)

## Setup

```sh
pnpm install
```

## Development

```sh
# Web (http://localhost:8080)
pnpm --filter requete-web dev

# Docs (http://localhost:8081)
pnpm --filter requete-docs dev
```

## Build

```sh
pnpm -r build
```

## Lint & Typecheck

```sh
pnpm -r lint
pnpm -r typecheck
```
