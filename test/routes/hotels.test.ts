import request from "supertest";
import createApp from "../../src/app";
import { getAdminUser, getAuthenticatedUser } from "../helper/auth.helper";
import { getTestCity } from "../helper/city.helper";

describe("Hotel routes", () => {
  const app = createApp();
  let hotelId: number;

  let adminContext: { userId: number; token: string; email: string };
  let userContext: { userId: number; token: string; email: string };

  let cityContext: { cityId: number; name: string; state: string };

  beforeAll(async () => {
    // Get admin and regular user contexts
    adminContext = await getAdminUser(app);
    userContext = await getAuthenticatedUser(app);
    cityContext = await getTestCity(app, adminContext.token);
  });

  describe("🌐 Public routes", () => {
    it("[GET /api/hotels] - should get all hotels and filter by name", async () => {
      // Test getting all hotels
      const res = await request(app).get("/api/hotels");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      // Test filtering hotels by name
      const filteredRes = await request(app).get("/api/hotels?name=Test");
      expect(filteredRes.status).toBe(200);
      expect(Array.isArray(filteredRes.body)).toBe(true);
    });

    it("[GET /api/hotels/:id] - should get a specific hotel", async () => {
      // First create a hotel to get
      const hotelData = {
        name: "Hotel to Get",
        description: "A wonderful place to stay for testing purposes.",
        price: 150,
        address: "123 Test St",
        lat: 40.7128,
        lon: -74.006,
        cityId: cityContext.cityId,
      };
      const createRes = await request(app)
        .post("/api/hotels")
        .set("Authorization", `Bearer ${adminContext.token}`)
        .send(hotelData);

      const testHotelId = createRes.body.hotel.id;

      const res = await request(app).get(`/api/hotels/${testHotelId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id", testHotelId);
      expect(res.body).toHaveProperty("name", hotelData.name);
      expect(res.body).toHaveProperty("rating");
    });
  });

  describe("🔒 Protected routes", () => {
    it("[POST /api/hotels] - should create a new hotel as admin", async () => {
      const hotelData = {
        name: "Test Hotel",
        description: "A wonderful place to stay for testing purposes.",
        price: 150,
        address: "123 Test St",
        lat: 40.7128,
        lon: -74.006,
        cityId: cityContext.cityId,
      };
      const res = await request(app)
        .post("/api/hotels")
        .set("Authorization", `Bearer ${adminContext.token}`)
        .send(hotelData);
      expect(res.status).toBe(201);
      expect(res.body.hotel.name).toBe(hotelData.name);
      hotelId = res.body.hotel.id;
    });

    it("[PUT /api/hotels/:id] - should update a hotel as admin", async () => {
      const updatedData = {
        name: "Updated Test Hotel",
        description: "An updated description.",
        price: 200,
        address: "456 Updated St",
        lat: 40.7128,
        lon: -74.006,
        cityId: cityContext.cityId,
      };
      const res = await request(app)
        .put(`/api/hotels/${hotelId}`)
        .set("Authorization", `Bearer ${adminContext.token}`)
        .send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body.hotel.name).toBe(updatedData.name);
      expect(res.body.hotel.price).toBe(updatedData.price);
    });

    it("[DELETE /api/hotels/:id] - should delete a hotel as admin", async () => {
      const res = await request(app)
        .delete(`/api/hotels/${hotelId}`)
        .set("Authorization", `Bearer ${adminContext.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Hotel deleted successfully");
    });
  });
});
