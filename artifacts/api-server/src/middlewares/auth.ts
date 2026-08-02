// @ts-nocheck
import type { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  // Re-check ban status at most once every 2 minutes per session so that
  // banning a user takes effect within 2 minutes even if they are already
  // logged in.  Without this, banned users could keep using every
  // authenticated endpoint until their session cookie expires (30 days).
  const now = Date.now();
  if (!req.session._banCheckedAt || now - req.session._banCheckedAt > 120_000) {
    const [user] = await db
      .select({ isBanned: usersTable.isBanned, banExpiresAt: usersTable.banExpiresAt })
      .from(usersTable)
      .where(eq(usersTable.id, req.session.userId))
      .limit(1);

    if (!user) {
      // User no longer exists — destroy stale session
      req.session.destroy(() => {});
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const isActiveBan =
      user.isBanned &&
      (!user.banExpiresAt || new Date() < new Date(user.banExpiresAt));

    if (isActiveBan) {
      req.session.destroy(() => {});
      res.status(403).json({ error: "Your account is banned" });
      return;
    }

    req.session._banCheckedAt = now;
  }

  next();
}

// Admin/mod status is stored in the session at login time and kept in sync
// by the login/register handlers.  We trust the session value here — no DB
// round-trip needed on every admin route.  If admin status is revoked,
// the admin should log the user out or wait for the session to expire.
export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (!req.session.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

export async function requireModOrAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (!req.session.isAdmin && !req.session.isModerator) {
    res.status(403).json({ error: "Moderator or admin access required" });
    return;
  }
  next();
}
