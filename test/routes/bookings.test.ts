import request from "supertest";
import createApp from "../../src/app";
import { getAdminUser, getAuthenticatedUser } from "../helper/auth.helper";
import { getTestCity } from "../helper/city.helper";
import { getTestHotel } from "../helper/hotel.helper";

describe("Booking routes", () => {
  const app = createApp();
  let bookingId: number;

  let adminContext: { userId: number; token: string; email: string };
  let userContext: { userId: number; token: string; email: string };

  let cityContext: { cityId: number; name: string; state: string };
  let hotelContext: { hotelId: number; name: string; cityId: number };

  beforeAll(async () => {
    // Get admin and regular user contexts
    adminContext = await getAdminUser(app);
    userContext = await getAuthenticatedUser(app);
    cityContext = await getTestCity(app, adminContext.token);
    hotelContext = await getTestHotel(app, adminContext.token, cityContext.cityId);
  });

  describe("🔒 Protected routes", () => {
    it("[GET /api/bookings] - should get bookings for authenticated user", async () => {
      const res = await request(app)
        .get("/api/bookings")
        .set("Authorization", `Bearer ${userContext.token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("[POST /api/bookings] - should create a new booking as authenticated user", async () => {
      const bookingData = {
        checkIn: "2025-12-10",
        checkOut: "2025-12-15",
        hotelId: hotelContext.hotelId,
      };
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userContext.token}`)
        .send(bookingData);
      expect(res.status).toBe(201);
      expect(res.body.booking).toHaveProperty("checkIn");
      expect(res.body.booking).toHaveProperty("checkOut");
      expect(res.body.booking).toHaveProperty("hotelId", hotelContext.hotelId);
      expect(res.body.booking).toHaveProperty("userId", userContext.userId);
      bookingId = res.body.booking.id;
    });

    it("[PUT /api/bookings/:id] - should update booking checkIn and checkOut", async () => {
      const updatedData = {
        checkIn: "2025-12-12",
        checkOut: "2025-12-18",
      };
      const res = await request(app)
        .put(`/api/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${userContext.token}`)
        .send(updatedData);
      expect(res.status).toBe(200);
      expect(res.body.booking).toHaveProperty("checkIn");
      expect(res.body.booking).toHaveProperty("checkOut");
      // Verify userId and hotelId remain unchanged
      expect(res.body.booking).toHaveProperty("userId", userContext.userId);
      expect(res.body.booking).toHaveProperty("hotelId", hotelContext.hotelId);
    });

    it("[DELETE /api/bookings/:id] - should delete a booking", async () => {
      const res = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${userContext.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Booking deleted successfully");
    });
  });
});
