import { z } from "zod";

/**
 * Create booking schema
 */
export const createBookingSchema = z.object({
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid check-in date"),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid check-out date"),
  hotelId: z.number().int().positive("Invalid hotel ID"),
});

/**
 * Update booking schema (only checkIn and checkOut can be updated)
 */
export const updateBookingSchema = z.object({
  checkIn: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid check-in date")
    .optional(),
  checkOut: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid check-out date")
    .optional(),
});

/**
 * Booking ID param schema
 */
export const bookingIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid booking ID"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
