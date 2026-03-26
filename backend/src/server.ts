import { app } from "./app.js";
import { env } from "./config.js";
import { closePrisma } from "./db/prisma.js";
import { initializeDatabase } from "./db/schema.js";

const startServer = async () => {
  await initializeDatabase();

  const server = app.listen(env.port, () => {
    console.log(`Backend listening on http://localhost:${env.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await closePrisma();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
