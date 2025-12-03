import { z } from "zod";

/**
 * Create review schema
 */
export const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
  hotelId: z.number().int().positive("Invalid hotel ID"),
});

/**
 * Update review schema (only rating and comment can be updated)
 */
export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(5).optional(),
});

/**
 * Review ID param schema
 */
export const reviewIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid review ID"),
});

/**
 * Review query filters schema
 */
export const reviewQuerySchema = z.object({
  hotelId: z.string().regex(/^\d+$/, "Hotel ID is required"),
  offset: z.string().regex(/^\d+$/).optional().default("0"),
  perPage: z.string().regex(/^\d+$/).optional().default("10"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;
