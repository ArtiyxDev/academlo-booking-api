import request from "supertest";
import { type Application } from "express";

interface CityContext {
  cityId: number;
  name: string;
  state: string;
}

let cachedCityContext: CityContext | null = null;

/**
 * Gets or creates a cached city for testing
 */
export async function getTestCity(app: Application, token: string): Promise<CityContext> {
  if (cachedCityContext) {
    return cachedCityContext;
  }

  // Create a test city
  const cityData = {
    name: "Test City",
    country: "Test Country",
    countryId: "TC",
  };

  const createRes = await request(app)
    .post("/api/cities")
    .set("Authorization", `Bearer ${token}`)
    .send(cityData);

  cachedCityContext = {
    cityId: createRes.body.city.id,
    name: createRes.body.city.name,
    state: createRes.body.city.state,
  };

  return cachedCityContext;
}

/**
 * Creates a fresh city (not cached)
 */
export async function createTestCity(
  app: Application,
  token: string,
  cityData?: Partial<{
    name: string;
    state: string;
  }>
): Promise<CityContext> {
  const defaultData = {
    name: `Test City ${Date.now()}`,
    state: "Test State",
  };

  const data = { ...defaultData, ...cityData };

  const createRes = await request(app)
    .post("/api/cities")
    .set("Authorization", `Bearer ${token}`)
    .send(data);

  return {
    cityId: createRes.body.id,
    name: createRes.body.name,
    state: createRes.body.state,
  };
}

/**
 * Clears the cached city context (useful for cleanup)
 */
export function clearCityCache(): void {
  cachedCityContext = null;
}
