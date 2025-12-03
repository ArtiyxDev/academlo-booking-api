import request from "supertest";
import createApp from "../../src/app";
import { getAdminUser } from "../helper/auth.helper";

describe("Users Routes", () => {
  const app = createApp();

  let testUserId: number;
  let authToken: string;

  let adminContext: { userId: number; token: string; email: string };

  beforeAll(async () => {
    // Get admin context
    adminContext = await getAdminUser(app);
  });

  describe("🌐 Public routes", () => {
    describe("👤 Auth flow", () => {
      it("[POST /api/users] - should register a new user", async () => {
        const data = {
          firstName: "Test",
          lastName: "User",
          email: "testuser@example.com",
          password: "securepassword",
          gender: "other",
        };
        const res = await request(app).post("/api/users").send(data);
        testUserId = res.body.user.id;
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("id");
        expect(res.body.user.email).toBe(data.email);
      });

      it("[POST /api/users/login] - should log in the user", async () => {
        const res = await request(app).post("/api/users/login").send({
          email: "testuser@example.com",
          password: "securepassword",
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("user");
        expect(res.body).toHaveProperty("token");
        authToken = res.body.token;
      });
    });

    it("[GET /api/users] - should get all users", async () => {
      const res = await request(app).get("/api/users").set("Authorization", `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("🔒 Protected routes", () => {
    it("[PUT /api/users/:id] - should update user", async () => {
      const res = await request(app)
        .put(`/api/users/${testUserId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ firstName: "UpdatedName" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "User updated successfully");
      expect(res.body.user).toHaveProperty("firstName", "UpdatedName");
    });

    it("[DELETE /api/users/:id] - should delete user", async () => {
      const res = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminContext.token}`);

      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "User deleted successfully");
    });
  });
});
