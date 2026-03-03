# Dashboard Frontend Agent Guide

## Scope

- Applies to `apps/dashboard-frontend/*`.
- This app is a Bun-served React frontend for the OpenRouter dashboard.

## Stack And Structure

- Runtime/dev server: Bun (`src/index.ts` serves `src/index.html`).
- UI: React 19 + React Router (`src/App.tsx`, `src/pages/*`).
- Data/state: TanStack Query.
- API client: Eden treaty client in `src/client.ts` using `primary-backend` types.
- Shared code: UI, theme and components from `@repo/ui`, contracts from `@repo/contracts`.

## Working Rules

- Use Bun commands only (`bun install`, `bun run dev`, `bun run build`).
- Keep route-level UI in `src/pages/*`; avoid putting page logic in `App.tsx`.
- Reuse components from `@repo/ui` before adding local duplicates.
- Keep theme, styling and typography consistent and use frontend design skill to guide the design.
- Prefer typed API usage through `src/client.ts`; avoid ad-hoc untyped fetches.
- Keep edits small and consistent with existing patterns.

## Common Commands

- Start frontend dev server: `bun run dev`
- Build frontend: `bun run build`
- Run from workspace root (all apps/packages): `bun run dev`, `bun run build`, `bun run lint`

## Change Checklist

- Confirm changed route renders through `src/App.tsx`.
- Confirm API calls use shared types/contracts where possible.
