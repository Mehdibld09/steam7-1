// @ts-nocheck
import app from "./app";
import { logger } from "./lib/logger";
import { startHealthCheckScheduler } from "./lib/accountHealthChecker";
import { startGiveawayScheduler } from "./lib/giveawayScheduler";
import { getOrCreateAdminBot } from "./lib/adminBot";

const port = 3000;

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening on 0.0.0.0:" + port);
  if (!process.env["VERCEL"]) {
    try { startHealthCheckScheduler(); } catch (e) { logger.warn({ err: e }, "Failed to start health check scheduler"); }
    try { startGiveawayScheduler(); } catch (e) { logger.warn({ err: e }, "Failed to start giveaway scheduler"); }
  }
  getOrCreateAdminBot().catch((e) => logger.error({ err: e }, "Failed to init Admin Bot"));
});
