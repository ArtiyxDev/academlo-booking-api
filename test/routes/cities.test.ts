import request from "supertest";
import createApp from "../../src/app";
import { getAdminUser } from "../helper/auth.helper";

describe("City routes", () => {
  const app = createApp();
  let cityId: number;

  let adminContext: { userId: number; token: string; email: string };

  beforeAll(async () => {
    // Get admin and regular user contexts
    adminContext = await getAdminUser(app);
  });

  describe("🌐 Public routes", () => {
    it("[GET /api/cities] - should get all cities", async () => {
      const res = await request(app).get("/api/cities");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("🔒 Protected routes", () => {
    it("[POST /api/cities] - should create a new city as admin", async () => {
      const cityData = {
        name: "Test City",
        country: "Test Country",
        countryId: "TC",
      };
      const res = await request(app)
        .post("/api/cities")
        .set("Authorization", `Bearer ${adminContext.token}`)
        .send(cityData);
      expect(res.status).toBe(201);
      expect(res.body.city.name).toBe(cityData.name);
      cityId = res.body.city.id;
    });
    it("[PUT /api/cities/:id] - should update a city as admin", async () => {
      const updatedData = {
        name: "Test City",
        country: "Updated Test Country",
        countryId: "TC",
      };
      const res = await request(app)
        .put(`/api/cities/${cityId}`)
        .set("Authorization", `Bearer ${adminContext.token}`)
        .send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body.city.name).toBe(updatedData.name);
    });
    it("[DELETE /api/cities/:id] - should delete a city as admin", async () => {
      const res = await request(app)
        .delete(`/api/cities/${cityId}`)
        .set("Authorization", `Bearer ${adminContext.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "City deleted successfully");
    });
  });
});
