# Steam Family

A Steam account sharing platform — users share unused Steam libraries, claim games, earn XP/points, and compete on the leaderboard. Includes premium and Pro subscription tiers with profile customization.

## Run & Operate

- `pnpm --filter @workspace/steamshare run dev` — frontend dev server (port 5000)
- `pnpm --filter @workspace/api-server run dev` — API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes to Postgres (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (add via Replit Secrets)

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4 + shadcn/ui
- API: Express 5 + express-session
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec in `lib/api-spec`)

## Where things live

- `artifacts/steamshare/` — React frontend
- `artifacts/api-server/` — Express API server
- `lib/db/src/schema/` — Drizzle schema (source of truth for DB shape)
- `lib/api-spec/` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/` — generated React Query hooks (run codegen to regenerate)
- `lib/api-zod/` — generated Zod schemas

## Architecture decisions

- Premium tiers: `premium` (basic customization) and `pro` (full customization incl. animated colors, pro badges, custom icon badge).
- Custom icon badges (`badgeIconUrl` + `badgeIconLink`) are Pro-only — stored in the `users` table, shown on profile pages next to the user's name.
- Session auth via express-session + connect-pg-simple. Sessions stored in Postgres.
- Cron jobs run in-process in dev; on Vercel they're triggered via `/api/cron/tick` from an external cron.

## Gotchas

- After any change to `lib/db/src/schema/`, run `pnpm --filter @workspace/db run push` to apply migrations to the DB.
- The two new columns added — `badge_icon_url` and `badge_icon_link` — need to be pushed to your DB before the custom badge feature works end-to-end.
- API server requires `DATABASE_URL` secret to start fully. Without it the server starts but all DB calls fail with 500.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
