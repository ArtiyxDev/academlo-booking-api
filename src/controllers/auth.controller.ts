import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import prisma from "../config/database";
import { generateToken } from "../utils/jwt";
import { hashPassword, verifyPassword } from "../utils/password";

export const register = async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);
    body.password = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: body,
    });
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);
    const userData = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (!userData) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const isPasswordValid = await verifyPassword(body.password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const jwt = generateToken({
      userId: userData.id,
      email: userData.email,
      role: userData.role,
    });
    const user = {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      gender: userData.gender,
    };
    res.status(200).json({ user, token: jwt });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
