// @ts-nocheck
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import rateLimit from "express-rate-limit";
import { pool } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";

const app = express();

app.set("trust proxy", 1);

const PgSession = connectPgSimple(session);

const pinoMiddleware = (typeof pinoHttp === "function" ? pinoHttp : (pinoHttp as any).default) as typeof pinoHttp;

app.use(
  pinoMiddleware({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const databaseUrl = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;
let sessionStore: any;
if (databaseUrl) {
  try {
    sessionStore = new PgSession({
      pool,
      createTableIfMissing: true,
      disableTouch: true,
    });
  } catch {
    sessionStore = new session.MemoryStore();
  }
} else {
  sessionStore = new session.MemoryStore();
}

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET ?? "steamshare-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  }),
);

// Rate limiting — prevent brute-force and race-condition abuse on sensitive endpoints
const redeemLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute window
  max: 5,                     // max 5 redemption attempts per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use("/api/ad-links", redeemLimiter);
app.use("/api/premium/redeem", redeemLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minute window
  max: 20,                    // max 20 login/register attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

// Limit account uploads: max 10 new listings per IP per hour
// Only applies to POST /api/accounts (exact) — not likes, comments, replies, etc.
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  skip: (req) => req.method !== "POST" || req.path !== "/",
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many uploads. Please wait before listing more accounts." },
});
app.use("/api/accounts", uploadLimiter);

app.use("/api", router);

const steamshareRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../steamshare",
);
const steamshareDist = path.resolve(steamshareRoot, "dist/public");

if (process.env.NODE_ENV !== "production") {
  try {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: steamshareRoot,
      configFile: path.resolve(steamshareRoot, "vite.config.ts"),
    });
    app.use(vite.middlewares);
  } catch (err) {
    logger.warn({ err }, "Vite dev server failed to start, falling back to static files");
    app.use(express.static(steamshareDist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(steamshareDist, "index.html"));
    });
  }
} else {
  app.use(express.static(steamshareDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(steamshareDist, "index.html"));
  });
}

// Keep API failures JSON so the web client can finish its query state and
// display a useful retry action instead of waiting through a browser HTML error.
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  logger.error(
    { err, method: req.method, url: req.originalUrl?.split("?")[0] },
    "Unhandled API error",
  );
  res.status(500).json({ error: "Internal server error" });
});

export default app;
