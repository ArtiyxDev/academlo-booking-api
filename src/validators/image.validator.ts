import { z } from "zod";

/**
 * Create image schema
 */
export const createImageSchema = z.object({
  url: z.string().url("Invalid URL format"),
  hotelId: z.number().int().positive("Invalid hotel ID"),
});

/**
 * Image ID param schema
 */
export const imageIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid image ID"),
});

export type CreateImageInput = z.infer<typeof createImageSchema>;
