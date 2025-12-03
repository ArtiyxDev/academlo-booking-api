import type { Request, Response } from "express";
import prisma from "../config/database";
import { updateUserSchema } from "../validators/auth.validator";
import { UnauthorizedError } from "../middlewares/errorHandler";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const data = await prisma.user.findMany();
    const users = data.map(({ password, ...user }) => user);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const userData = updateUserSchema.parse(req.body);
  try {
    const updatedData = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
    const { password, ...user } = updatedData;
    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
