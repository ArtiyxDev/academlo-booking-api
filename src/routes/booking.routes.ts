import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { validateBody, validateParams } from "../middlewares/validator";
import { authenticate } from "../middlewares/auth";
import {
  createBookingSchema,
  updateBookingSchema,
  bookingIdSchema,
} from "../validators/booking.validator";

const router = Router();

/**
 * Booking routes
 */

// Get user's bookings (private)
router.get("/", authenticate, bookingController.getUserBookings);

// Create booking (private)
router.post("/", authenticate, validateBody(createBookingSchema), bookingController.createBooking);

// Delete booking (private)
router.delete(
  "/:id",
  authenticate,
  validateParams(bookingIdSchema),
  bookingController.deleteBooking
);

// Update booking (private - only checkIn and checkOut)
router.put(
  "/:id",
  authenticate,
  validateParams(bookingIdSchema),
  validateBody(updateBookingSchema),
  bookingController.updateBooking
);

export default router;
