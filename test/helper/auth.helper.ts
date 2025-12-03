import request from "supertest";
import { type Application } from "express";

interface AuthContext {
  userId: number;
  token: string;
  email: string;
}

let cachedAuthContext: AuthContext | null = null;
let cachedAdminContext: AuthContext | null = null;

/**
 * Gets admin user credentials (the one created in testSetup)
 */
export async function getAdminUser(app: Application): Promise<AuthContext> {
  if (cachedAdminContext) {
    return cachedAdminContext;
  }

  // Login with admin credentials from testSetup
  const loginRes = await request(app).post("/api/users/login").send({
    email: "admin@example.com",
    password: "securepassword",
  });

  cachedAdminContext = {
    userId: loginRes.body.user.id,
    token: loginRes.body.token,
    email: "admin@example.com",
  };

  return cachedAdminContext;
}

/**
 * Creates or retrieves a cached authenticated regular user for testing
 */
export async function getAuthenticatedUser(app: Application): Promise<AuthContext> {
  if (cachedAuthContext) {
    return cachedAuthContext;
  }

  // Register a test user
  const userData = {
    firstName: "Test",
    lastName: "User",
    email: `test-${Date.now()}@example.com`,
    password: "securepassword",
    gender: "other",
  };

  const registerRes = await request(app).post("/api/users").send(userData);

  const userId = registerRes.body.user.id;

  // Login to get token
  const loginRes = await request(app).post("/api/users/login").send({
    email: userData.email,
    password: userData.password,
  });

  cachedAuthContext = {
    userId,
    token: loginRes.body.token,
    email: userData.email,
  };

  return cachedAuthContext;
}

/**
 * Creates a fresh authenticated user (not cached)
 */
export async function createAuthenticatedUser(
  app: Application,
  userData?: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: string;
  }>
): Promise<AuthContext> {
  const defaultData = {
    firstName: "Test",
    lastName: "User",
    email: `test-${Date.now()}@example.com`,
    password: "securepassword",
    gender: "other",
  };

  const data = { ...defaultData, ...userData };

  const registerRes = await request(app).post("/api/users").send(data);
  const userId = registerRes.body.user.id;

  const loginRes = await request(app).post("/api/users/login").send({
    email: data.email,
    password: data.password,
  });

  return {
    userId,
    token: loginRes.body.token,
    email: data.email,
  };
}

/**
 * Clears the cached auth context (useful for cleanup)
 */
export function clearAuthCache(): void {
  cachedAuthContext = null;
  cachedAdminContext = null;
}
