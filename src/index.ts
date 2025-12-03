import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/database";
import createApp from "./app";

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start server
    const PORT = parseInt(env.PORT);
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 API available at: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\n⚠️  Shutting down gracefully...");
      await disconnectDatabase();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\n⚠️  Shutting down gracefully...");
      await disconnectDatabase();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
