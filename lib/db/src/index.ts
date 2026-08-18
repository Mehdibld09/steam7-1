import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const databaseUrl = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;

let pool: any;
let db: any;

if (databaseUrl) {
  try {
    const isSupabaseDatabase = (() => {
      try {
        const hostname = new URL(databaseUrl).hostname;
        return hostname.endsWith(".supabase.co") || hostname.endsWith(".pooler.supabase.com");
      } catch {
        return false;
      }
    })();

    pool = new Pool({
      connectionString: databaseUrl,
      max: process.env.VERCEL ? 1 : 2,
      idleTimeoutMillis: process.env.VERCEL ? 5_000 : 10_000,
      connectionTimeoutMillis: 8_000,
      keepAlive: true,
      ...(isSupabaseDatabase ? { ssl: { rejectUnauthorized: false } } : {}),
    });

    pool.on("error", (err: any) => {
      console.warn("[DB] Pool background error:", err?.message || err);
    });

    db = drizzle(pool, { schema });
  } catch (err) {
    console.warn("[DB] Failed to initialize Postgres pool:", err);
  }
}

if (!pool) {
  console.warn("[DB] SUPABASE_DATABASE_URL or DATABASE_URL not set — using mock pool");
  pool = {
    query: async () => ({ rows: [], rowCount: 0 }),
    connect: async () => ({
      query: async () => ({ rows: [], rowCount: 0 }),
      release: () => {},
    }),
    on: () => {},
  };
}

if (!db) {
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  };
  db = new Proxy(
    {},
    {
      get: (_, prop) =>
        prop === "query"
          ? new Proxy({}, { get: () => noOp })
          : () => ({
              values: () => ({ returning: () => Promise.resolve([]) }),
              set: () => ({ where: () => Promise.resolve([]) }),
              where: () => Promise.resolve([]),
              from: () => ({ where: () => Promise.resolve([]) }),
            }),
    },
  );
}

export { pool, db };
export * from "./schema";

