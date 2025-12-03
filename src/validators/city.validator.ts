import { z } from "zod";

/**
 * Create city schema
 */
export const createCitySchema = z.object({
  name: z.string().min(2, "City name must be at least 2 characters"),
  country: z.string().min(2, "Country name must be at least 2 characters"),
  countryId: z.string().length(2, "Country ID must be 2 characters (e.g., MX, US)"),
});

/**
 * Update city schema
 */
export const updateCitySchema = z.object({
  name: z.string().min(2).optional(),
  country: z.string().min(2).optional(),
  countryId: z.string().length(2).optional(),
});

/**
 * City ID param schema
 */
export const cityIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid city ID"),
});

export type CreateCityInput = z.infer<typeof createCitySchema>;
export type UpdateCityInput = z.infer<typeof updateCitySchema>;
