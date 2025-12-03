import { z } from "zod";

/**
 * Create hotel schema
 */
export const createHotelSchema = z.object({
  name: z.string().min(3, "Hotel name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  lat: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  lon: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  cityId: z.number().int().positive("Invalid city ID"),
});

/**
 * Update hotel schema
 */
export const updateHotelSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  address: z.string().min(5).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  cityId: z.number().int().positive().optional(),
});

/**
 * Hotel ID param schema
 */
export const hotelIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid hotel ID"),
});

/**
 * Hotel query filters schema
 */
export const hotelQuerySchema = z.object({
  name: z.string().optional(),
  cityId: z.string().regex(/^\d+$/).optional(),
});

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
export type HotelQueryInput = z.infer<typeof hotelQuerySchema>;
