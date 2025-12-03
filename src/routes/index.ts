import { Router } from "express";
import userRoutes from "./user.routes";
import cityRoutes from "./city.routes";
import hotelRoutes from "./hotel.routes";
import imageRoutes from "./image.routes";
import bookingRoutes from "./booking.routes";
import reviewRoutes from "./review.routes";

const router = Router();

/**
 * API Routes
 */

// User routes
router.use("/users", userRoutes);

// City routes
router.use("/cities", cityRoutes);

// Hotel routes
router.use("/hotels", hotelRoutes);

// Image routes (optional)
router.use("/images", imageRoutes);

// Booking routes
router.use("/bookings", bookingRoutes);

// Review routes
router.use("/reviews", reviewRoutes);

export default router;
