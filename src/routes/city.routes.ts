import { Router } from "express";
import * as cityController from "../controllers/city.controller";
import { validateBody, validateParams } from "../middlewares/validator";
import { authenticate, authorizeAdmin } from "../middlewares/auth";
import { createCitySchema, updateCitySchema, cityIdSchema } from "../validators/city.validator";

const router = Router();

/**
 * City routes
 */

// Get all cities (public)
router.get("/", cityController.getAllCities);

// Create city (private - admin only)
router.post("/", authenticate, validateBody(createCitySchema), cityController.createCity);

// Delete city (private - admin only)
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  validateParams(cityIdSchema),
  cityController.deleteCity
);

// Update city (private - admin only)
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  validateParams(cityIdSchema),
  validateBody(updateCitySchema),
  cityController.updateCity
);

export default router;
