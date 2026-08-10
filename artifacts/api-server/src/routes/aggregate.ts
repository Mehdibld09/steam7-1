// @ts-nocheck
import express from "express";
import { db, notificationsTable, giveawaysTable, giveawayEntriesTable, announcementsTable, usersTable, messagesTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";

const router = express.Router();

// GET /api/aggregate — single endpoint returning several small pieces of data
router.get("/", async (req, res) => {
  const userId = req.session?.userId;

  // Announcements (public cached)
  const anns = await db
    .select({
      id: announcementsTable.id,
      title: announcementsTable.title,
      description: announcementsTable.description,
      pinned: announcementsTable.pinned,
      isPopup: announcementsTable.isPopup,
      popupButtons: announcementsTable.popupButtons,
      authorId: announcementsTable.authorId,
      createdAt: announcementsTable.createdAt,
      authorUsername: usersTable.username,
    })
    .from(announcementsTable)
    .leftJoin(usersTable, eq(announcementsTable.authorId, usersTable.id))
    .orderBy(desc(announcementsTable.pinned), desc(announcementsTable.createdAt));

  const announcements = anns.map((r) => ({
    ...r,
    popupButtons: (() => { try { return JSON.parse(r.popupButtons || "[]"); } catch { return []; } })(),
  }));

  // Giveaways (include whether current user has entered)
  const giveaways = await db.select().from(giveawaysTable).orderBy(desc(giveawaysTable.createdAt));
  let giveawaysWithEntered = giveaways;
  if (userId) {
    const entries = await db
      .select({ giveawayId: giveawayEntriesTable.giveawayId })
      .from(giveawayEntriesTable)
      .where(eq(giveawayEntriesTable.userId, userId));
    const entered = new Set(entries.map((e) => e.giveawayId));
    giveawaysWithEntered = giveaways.map((g) => ({ ...g, userHasEntered: entered.has(g.id) }));
  } else {
    giveawaysWithEntered = giveaways.map((g) => ({ ...g, userHasEntered: false }));
  }

  // Prepare response object
  const result: any = {
    announcements,
    giveaways: giveawaysWithEntered,
  };

  // If user is logged in, include notifications and unread counts
  if (userId) {
    const notes = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, userId))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(30);

    const [{ notif_count }] = await db.execute(sql`SELECT COUNT(*) AS notif_count FROM notifications WHERE user_id = ${userId} AND is_read = FALSE`);
    const [{ msg_count }] = await db.execute(sql`SELECT COUNT(*) AS msg_count FROM messages WHERE receiver_id = ${userId} AND is_read = FALSE`);

    result.appNotifications = notes;
    result.notifUnreadCount = Number(notif_count ?? 0);
    result.unreadMessagesCount = Number(msg_count ?? 0);
  }

  // Cache control: public for anonymous, private for authenticated (small max-age)
  if (userId) {
    res.set("Cache-Control", "private, max-age=30");
  } else {
    res.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  }

  res.json(result);
});

export default router;
