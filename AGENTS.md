# AGENTS Guide

## Project Snapshot

- Monorepo managed with Turborepo and Bun.
- Workspaces live under `apps/*` and `packages/*`.
- Main app areas:
  - `apps/dashboard-frontend`: React frontend (Bun dev server).
  - `apps/primary-backend`: Elysia/Bun backend.
  - `apps/api-backend`: backend app scaffold.
  - `packages/contracts`: shared Zod schemas and contract types.
  - `packages/ui`: shared UI components.
  - `packages/db`: Prisma + Neon database package.

## Working Rules

- Default to Bun tooling (`bun install`, `bun run <script>`, `bun test`).
- Prefer minimal, focused changes over broad refactors.
- Keep API/type contracts in `packages/contracts` and reuse them across apps.
- Avoid hardcoding env values; rely on environment variables.
- Update docs when behavior or commands change.
- Always use kebab-case for file names and directories.

## Common Commands

- Install deps: `bun install`
- Run all dev tasks: `bun run dev`
- Build all packages/apps: `bun run build`
- Lint all packages/apps: `bun run lint`
- Type-check all packages/apps: `bun run check-types`

## Change Checklist

- Scope change to the relevant app/package first.
- Reuse shared packages before adding duplicate logic.
- Run lint/type-check for affected workspace (or full monorepo when needed).
- Keep naming and file placement consistent with nearby code.
