import { Router } from "express";
import * as imageController from "../controllers/image.controller";
import { validateBody, validateParams } from "../middlewares/validator";
import { authenticate } from "../middlewares/auth";
import { createImageSchema, imageIdSchema } from "../validators/image.validator";

const router = Router();

/**
 * Image routes (optional)
 */

// Get all images (private)
router.get("/", authenticate, imageController.getAllImages);

// Create image (private)
router.post("/", authenticate, validateBody(createImageSchema), imageController.createImage);

// Delete image (private)
router.delete("/:id", authenticate, validateParams(imageIdSchema), imageController.deleteImage);

export default router;
