import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const databaseUrl = process.env.DATABASE_URL;
const isSupabaseDatabase = (() => {
  try {
    const hostname = new URL(databaseUrl).hostname;
    return hostname.endsWith(".supabase.co") || hostname.endsWith(".pooler.supabase.com");
  } catch {
    return false;
  }
})();

export const pool = new Pool({
  connectionString: databaseUrl,
  // Tuned for serverless (Vercel): keep a small pool so each function instance
  // doesn't open many idle connections — Postgres has a hard connection cap.
  max: process.env.VERCEL ? 1 : 2,
  idleTimeoutMillis: process.env.VERCEL ? 5_000 : 10_000,
  connectionTimeoutMillis: 8_000,
  keepAlive: true,
  // Supabase requires TLS for hosted Postgres connections. The hosted
  // certificate chain is managed by Supabase, not by this serverless bundle.
  ...(isSupabaseDatabase
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
});
export const db = drizzle(pool, { schema });

export * from "./schema";
