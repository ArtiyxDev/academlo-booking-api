import request from "supertest";
import createApp from "../../src/app";
import { getAdminUser, getAuthenticatedUser } from "../helper/auth.helper";
import { getTestCity } from "../helper/city.helper";
import { getTestHotel } from "../helper/hotel.helper";

describe("Review routes", () => {
  const app = createApp();
  let reviewId: number;

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

  describe("🌐 Public routes", () => {
    it("[GET /api/reviews] - should get all reviews, filter by hotelId, and paginate", async () => {
      // Get all reviews
      const resAll = await request(app).get("/api/reviews");
      expect(resAll.status).toBe(200);
      expect(Array.isArray(resAll.body.results)).toBe(true);

      // Filter reviews by hotelId
      const resFiltered = await request(app).get(`/api/reviews?hotelId=${hotelContext.hotelId}`);
      expect(resFiltered.status).toBe(200);
      expect(Array.isArray(resAll.body.results)).toBe(true);

      // Paginate reviews
      const resPaginated = await request(app).get("/api/reviews?offset=0&perPage=10");
      expect(resPaginated.status).toBe(200);
      expect(Array.isArray(resAll.body.results)).toBe(true);
    });
  });

  describe("🔒 Protected routes", () => {
    it("[POST /api/reviews] - should create a new review as authenticated user", async () => {
      const reviewData = {
        rating: 5,
        comment: "Excellent hotel! Highly recommended.",
        hotelId: hotelContext.hotelId,
      };
      const res = await request(app)
        .post("/api/reviews")
        .set("Authorization", `Bearer ${userContext.token}`)
        .send(reviewData);
      expect(res.status).toBe(201);
      expect(res.body.review).toHaveProperty("rating", reviewData.rating);
      expect(res.body.review).toHaveProperty("comment", reviewData.comment);
      expect(res.body.review).toHaveProperty("hotelId", hotelContext.hotelId);
      expect(res.body.review).toHaveProperty("userId", userContext.userId);
      reviewId = res.body.review.id;
    });

    it("[PUT /api/reviews/:id] - should update review rating and comment only", async () => {
      const updatedData = {
        rating: 4,
        comment: "Good hotel, but could be better.",
      };
      const res = await request(app)
        .put(`/api/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${userContext.token}`)
        .send(updatedData);
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body.review).toHaveProperty("rating", updatedData.rating);
      expect(res.body.review).toHaveProperty("comment", updatedData.comment);
      // Verify userId and hotelId remain unchanged
      expect(res.body.review).toHaveProperty("userId", userContext.userId);
      expect(res.body.review).toHaveProperty("hotelId", hotelContext.hotelId);
    });

    it("[DELETE /api/reviews/:id] - should delete a review", async () => {
      const res = await request(app)
        .delete(`/api/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${userContext.token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Review deleted successfully");
    });
  });
});
