import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from "./middlewares/errorHandler";

/**
 * Create and configure Express application
 */
function createApp() {
  const app: Application = express();

  // Middleware
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  // Health check
  app.get("/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      message: "Welcome to Academlo Booking API",
      timestamp: new Date().toISOString(),
    });
  });

  // Root endpoint
  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "Welcome to Academlo Booking API",
      version: "1.0.0",
      documentation: "/api",
    });
  });

  // API routes
  app.use("/api", routes);

  // 404 handler
  app.use((req, res, next) => {
    next(new NotFoundError("Route not found"));
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

export default createApp;
