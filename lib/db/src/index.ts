import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const databaseUrl = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
const hasDatabaseConfig = Boolean(databaseUrl);

const unavailableError = () => new Error(
  "Database is not configured. Set SUPABASE_DATABASE_URL or DATABASE_URL to enable DB-backed routes.",
);

const isSupabaseDatabase = (() => {
  try {
    const hostname = new URL(databaseUrl ?? "postgres://localhost:5432/postgres").hostname;
    return hostname.endsWith(".supabase.co") || hostname.endsWith(".pooler.supabase.com");
  } catch {
    return false;
  }
})();

const createUnavailablePool = () => ({
  query: async () => {
    throw unavailableError();
  },
  connect: async () => {
    throw unavailableError();
  },
  on: () => {},
  end: async () => {},
});

const createUnavailableQueryBuilder = () => {
  const builder = {
    from: () => createUnavailableQueryBuilder(),
    where: () => createUnavailableQueryBuilder(),
    leftJoin: () => createUnavailableQueryBuilder(),
    innerJoin: () => createUnavailableQueryBuilder(),
    orderBy: () => createUnavailableQueryBuilder(),
    limit: () => createUnavailableQueryBuilder(),
    offset: () => createUnavailableQueryBuilder(),
    groupBy: () => createUnavailableQueryBuilder(),
    having: () => createUnavailableQueryBuilder(),
    then: (resolve: any, reject: any) =>
      Promise.reject(unavailableError()).then(resolve, reject),
  };

  return builder;
};

const createUnavailableDb = () =>
  new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") {
          return undefined;
        }

        if (prop === "select") {
          return () => createUnavailableQueryBuilder();
        }

        if (prop === "insert") {
          return () => ({
            into: () => ({ values: () => Promise.reject(unavailableError()) }),
          });
        }

        if (prop === "update") {
          return () => ({
            set: () => ({ where: () => Promise.reject(unavailableError()) }),
          });
        }

        if (prop === "delete") {
          return () => ({ where: () => Promise.reject(unavailableError()) });
        }

        if (prop === "transaction") {
          return async () => {
            throw unavailableError();
          };
        }

        return () => Promise.reject(unavailableError());
      },
    },
  );

const configuredPool: pg.Pool = hasDatabaseConfig
  ? new Pool({
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
    })
  : (createUnavailablePool() as unknown as pg.Pool);

export const pool = configuredPool;
export const db: any = hasDatabaseConfig ? drizzle(pool, { schema }) : createUnavailableDb();
export const isDatabaseConfigured = hasDatabaseConfig;

export * from "./schema";
