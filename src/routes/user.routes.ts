import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as userController from "../controllers/user.controller";
import { validateBody, validateParams } from "../middlewares/validator";
import { authenticate, authorizeAdmin } from "../middlewares/auth";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  userIdSchema,
} from "../validators/auth.validator";

const router = Router();

/**
 * User routes
 */

// Get all users (private)
router.get("/", authenticate, userController.getAllUsers);

// Register a new user (public)
router.post("/", validateBody(registerSchema), authController.register);

// Login user (public)
router.post("/login", validateBody(loginSchema), authController.login);

// Delete user (private)
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  validateParams(userIdSchema),
  userController.deleteUser
);

// Update user (private)
router.put(
  "/:id",
  authenticate,
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  userController.updateUser
);

export default router;
