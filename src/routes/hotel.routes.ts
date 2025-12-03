import { Router } from "express";
import * as hotelController from "../controllers/hotel.controller";
import { validateBody, validateParams, validateQuery } from "../middlewares/validator";
import { authenticate } from "../middlewares/auth";
import {
  createHotelSchema,
  updateHotelSchema,
  hotelIdSchema,
  hotelQuerySchema,
} from "../validators/hotel.validator";

const router = Router();

/**
 * Hotel routes
 */

// Get all hotels with filters (public)
router.get("/", validateQuery(hotelQuerySchema), hotelController.getAllHotels);

// Get hotel by ID (public)
router.get("/:id", validateParams(hotelIdSchema), hotelController.getHotelById);

// Create hotel (private - admin only)
router.post("/", authenticate, validateBody(createHotelSchema), hotelController.createHotel);

// Delete hotel (private - admin only)
router.delete("/:id", authenticate, validateParams(hotelIdSchema), hotelController.deleteHotel);

// Update hotel (private - admin only)
router.put(
  "/:id",
  authenticate,
  validateParams(hotelIdSchema),
  validateBody(updateHotelSchema),
  hotelController.updateHotel
);

export default router;
