import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { validateBody, validateParams, validateQuery } from "../middlewares/validator";
import { authenticate } from "../middlewares/auth";
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdSchema,
  reviewQuerySchema,
} from "../validators/review.validator";

const router = Router();

/**
 * Review routes
 */

// Get all reviews (public)
router.get("/", reviewController.getAllReviews);

// Get reviews by hotel ID with pagination (public)
router.get("/", validateQuery(reviewQuerySchema), reviewController.getReviewsByHotel);

// Create review (private)
router.post("/", authenticate, validateBody(createReviewSchema), reviewController.createReview);

// Delete review (private)
router.delete("/:id", authenticate, validateParams(reviewIdSchema), reviewController.deleteReview);

// Update review (private - only rating and comment)
router.put(
  "/:id",
  authenticate,
  validateParams(reviewIdSchema),
  validateBody(updateReviewSchema),
  reviewController.updateReview
);

export default router;
