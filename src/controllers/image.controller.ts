import type { Request, Response } from "express";
import prisma from "../config/database";
import { createImageSchema, imageIdSchema } from "../validators/image.validator";

export const getAllImages = async (req: Request, res: Response) => {
  try {
    const imagesData = await prisma.image.findMany();
    res.status(200).json(imagesData);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createImage = async (req: Request, res: Response) => {
  try {
    const bodyData = createImageSchema.parse(req.body);
    const newImage = await prisma.image.create({
      data: bodyData,
    });
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  const { id } = imageIdSchema.parse(req.params);
  try {
    await prisma.image.delete({
      where: { id: Number(id) },
    });
    res.status(204).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
