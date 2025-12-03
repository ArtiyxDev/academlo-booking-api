import request from "supertest";
import { type Application } from "express";

interface HotelContext {
  hotelId: number;
  name: string;
  cityId: number;
}

let cachedHotelContext: HotelContext | null = null;

/**
 * Gets or creates a cached hotel for testing
 */
export async function getTestHotel(
  app: Application,
  token: string,
  cityId: number
): Promise<HotelContext> {
  if (cachedHotelContext) {
    return cachedHotelContext;
  }

  // Create a test hotel
  const hotelData = {
    name: "Test Hotel",
    description: "A wonderful place to stay for testing purposes.",
    price: 150,
    address: "123 Test St",
    lat: 40.7128,
    lon: -74.006,
    cityId,
  };

  const createRes = await request(app)
    .post("/api/hotels")
    .set("Authorization", `Bearer ${token}`)
    .send(hotelData);

  cachedHotelContext = {
    hotelId: createRes.body.hotel.id,
    name: createRes.body.hotel.name,
    cityId: createRes.body.hotel.cityId,
  };

  return cachedHotelContext;
}

/**
 * Creates a fresh hotel (not cached)
 */
export async function createTestHotel(
  app: Application,
  token: string,
  cityId: number,
  hotelData?: Partial<{
    name: string;
    description: string;
    price: number;
    address: string;
    lat: number;
    lon: number;
  }>
): Promise<HotelContext> {
  const defaultData = {
    name: `Test Hotel ${Date.now()}`,
    description: "A wonderful place to stay for testing purposes.",
    price: 150,
    address: "123 Test St",
    lat: 40.7128,
    lon: -74.006,
  };

  const data = { ...defaultData, ...hotelData, cityId };

  const createRes = await request(app)
    .post("/api/hotels")
    .set("Authorization", `Bearer ${token}`)
    .send(data);

  return {
    hotelId: createRes.body.hotel.id,
    name: createRes.body.hotel.name,
    cityId: createRes.body.hotel.cityId,
  };
}

/**
 * Clears the cached hotel context (useful for cleanup)
 */
export function clearHotelCache(): void {
  cachedHotelContext = null;
}
