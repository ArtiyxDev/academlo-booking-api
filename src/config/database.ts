import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma-client/client";
import pkg from "pg";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

const { Pool } = pkg;

// Verify DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Parse DATABASE_URL properly
const databaseUrl = new URL(process.env.DATABASE_URL);

const pool = new Pool({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port),
  user: databaseUrl.username,
  password: databaseUrl.password,
  database: databaseUrl.pathname.slice(1), // Remove leading slash
  // Only use SSL in production
  ...(process.env.NODE_ENV === "production" && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

const adapter = new PrismaPg(pool);

/**
 * Prisma Client instance
 * This is a singleton instance to ensure only one connection to the database
 */
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

/**
 * Connect to the database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

/**
 * Disconnect from the database
 */
export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
  await pool.end();
  console.log("Database disconnected");
};

export default prisma;
