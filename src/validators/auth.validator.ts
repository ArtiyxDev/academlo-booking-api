import { z } from "zod";

/**
 * User registration schema
 */
export const registerSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["male", "female", "other"]),
});

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * Update user schema
 */
export const updateUserSchema = z.object({
  firstName: z.string().min(3).optional(),
  lastName: z.string().min(3).optional(),
  email: z.email().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

/**
 * User ID param schema
 */
export const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid user ID"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
