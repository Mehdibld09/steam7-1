---
name: Supabase and Vercel database connectivity
description: Hosted Supabase Postgres URLs can time out from Vercel even when the same schema works locally.
---

Use Supabase's connection pooler URL for Vercel serverless functions instead of an IPv6-only direct database host. Keep the database URL and schema separate from the frontend; the API reaches Postgres server-side.

**Why:** The deployed health endpoint can succeed while every database-backed route waits for the Postgres connection timeout and returns 500. An empty but reachable database returns a normal empty JSON result, so this symptom indicates connectivity rather than missing rows.

**How to apply:** In Vercel, set `DATABASE_URL` to the Supabase session or transaction pooler connection string, keep `SESSION_SECRET` configured, redeploy, then verify `/api/healthz` and `/api/accounts?sort=recent&limit=12`.