# Steam Family

A Steam account-sharing / exchange platform ("Steam Family") — members share unused Steam libraries, claim games, and level up through community participation. Includes an admin panel with security/anti-abuse tooling (IP bans, VPN detection, ban system).

## Run & Operate

- Two workflows are configured and run automatically in this Repl: `API Server` (Express API, port 8080) and `Start application` (Vite frontend, port 5000).
- `pnpm --filter @workspace/api-server run dev` — run the API server directly
- `pnpm --filter @workspace/steamshare run dev` — run the frontend directly
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (Replit-managed Postgres is already provisioned and set)

### Vercel database setup

The frontend calls the API through same-origin `/api/*` routes. Vercel therefore needs `DATABASE_URL` and `SESSION_SECRET` in the Vercel project environment, and the database referenced by `DATABASE_URL` must have this project's schema. A reachable but empty database returns `accounts: []`; a database URL that cannot be reached causes the web page's data requests to return 500 errors.

For Supabase on Vercel, use Supabase's connection pooler URL (session or transaction pooler) rather than an IPv6-only direct database host. The API enables TLS automatically for Supabase hosts and uses one pooled connection per Vercel function.

Before the first Vercel deployment, apply the schema using the Vercel database connection in a secure shell or CI environment:

```sh
pnpm install --frozen-lockfile
pnpm --filter @workspace/db run push
```

Do not add `db:push` to the Vercel build or server startup command. Schema changes should be applied separately, then the Vercel deployment can be rebuilt. The Replit development database is separate from an external Vercel database.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/steamshare` — Vite/React web application
- `artifacts/api-server` — Express API and Vercel serverless app bundle
- `lib/db/src/schema` — Drizzle/PostgreSQL schema source of truth
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- Password reset uses a 6-digit emailed OTP (no link), handled entirely on `/forgot-password` in a 3-step flow (email → code + new password → success). The OTP is stored in `passwordResetTokensTable` like the old hex token; only the format changed.
- All admin/moderator notifications to users (report actions, listing approvals/rejections) are sent via the "Admin Bot" system user (`adminBot.ts`) so messages appear from the bot, not a real admin account.
- VIP-only accounts (`vipOnly: boolean` on `accountsTable`) are filtered out from non-VIP users at the API level (both listing and detail endpoints). They show a gold "VIP" badge instead of "Free" or "pts" on cards.
- Premium name color (`posterNameColor`) is shown when `premiumTier` is set AND either `premiumExpiresAt` is null (lifetime) or hasn't expired yet. The old code required a non-null `premiumExpiresAt`.

## Product

- Steam account sharing and exchange platform — users post Steam accounts, others claim them for free or for points.
- VIP (pro) subscribers get: colored usernames with animated effects, VIP badge, ability to bypass like/comment unlock gates, ability to see and claim VIP-only listings.
- Admin bot sends automated messages for report outcomes, listing approvals/rejections, and store purchases.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The `pnpm --filter @workspace/db run push` command requires an interactive TTY; run SQL migrations directly via `psql $DATABASE_URL` when in a non-interactive shell.
- The `.migration-backup/` artifact workflows fail (no node_modules) — these can be ignored; only the `artifacts/` workflows are active.
- The API server workflow named "API Server" (original) conflicts with the artifact-managed "artifacts/api-server: API Server" on port 8080. Only start one at a time.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
