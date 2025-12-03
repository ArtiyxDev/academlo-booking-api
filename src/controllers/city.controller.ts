import type { Request, Response } from "express";
import prisma from "../config/database";
import { createCitySchema, updateCitySchema } from "../validators/city.validator";

export const getAllCities = async (req: Request, res: Response) => {
  try {
    const citiesData = await prisma.city.findMany({
      include: {
        hotels: true,
      },
    });
    res.status(200).json(citiesData);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createCity = async (req: Request, res: Response) => {
  try {
    const bodyData = createCitySchema.parse(req.body);
    const newCity = await prisma.city.create({
      data: bodyData,
      include: {
        hotels: true,
      },
    });
    res.status(201).json({
      message: "City created successfully",
      city: newCity,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCity = async (req: Request, res: Response) => {
  try {
    const cityId = Number(req.params.id);
    const bodyData = updateCitySchema.parse(req.body);
    const updatedCity = await prisma.city.update({
      where: { id: cityId },
      data: bodyData,
    });
    res.status(200).json({
      message: "City updated successfully",
      city: updatedCity,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const cityId = Number(req.params.id);
    await prisma.city.delete({ where: { id: cityId } });
    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
