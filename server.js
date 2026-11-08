import { connectDatabase, disconnectDatabase } from "./server/config/database.js";
import { environment } from "./server/config/environment.js";
import { createApp } from "./server/app.js";

async function startServer() {
  await connectDatabase();
  const app = createApp();
  const server = app.listen(environment.port, () => {
    console.info(`Portfolio API running at http://localhost:${environment.port}`);
  });

  async function shutDown(signal) {
    console.info(`${signal} received. Closing the Portfolio API.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutDown("SIGINT"));
  process.on("SIGTERM", () => shutDown("SIGTERM"));
}

startServer().catch((error) => {
  console.error("Unable to start the Portfolio API:", error.message);
  process.exit(1);
});
