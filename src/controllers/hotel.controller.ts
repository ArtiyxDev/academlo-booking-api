import type { Request, Response } from "express";
import prisma from "../config/database";
import { createHotelSchema, updateHotelSchema, hotelIdSchema } from "../validators/hotel.validator";

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotelsData = await prisma.hotel.findMany({
      include: {
        images: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });
    const formatedHotels = hotelsData.map((hotel) => {
      const totalRatings = hotel.reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = hotel.reviews.length ? totalRatings / hotel.reviews.length : 0;
      return {
        ...hotel,
        rating: avgRating, // Required for frontend display
        average: avgRating,
      };
    });
    res.status(200).json(formatedHotels);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getHotelById = async (req: Request, res: Response) => {
  const { id } = hotelIdSchema.parse(req.params);
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: Number(id) },
      include: {
        images: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    const totalRatings = hotel.reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = hotel.reviews.length ? totalRatings / hotel.reviews.length : 0;
    const formatedHotel = {
      ...hotel,
      rating: avgRating,
    };
    res.status(200).json(formatedHotel);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createHotel = async (req: Request, res: Response) => {
  try {
    const hotelData = createHotelSchema.parse(req.body);
    const newHotel = await prisma.hotel.create({
      data: hotelData,
    });
    res.status(201).json({
      message: "Hotel created successfully",
      hotel: newHotel,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteHotel = async (req: Request, res: Response) => {
  const { id } = hotelIdSchema.parse(req.params);
  try {
    await prisma.hotel.delete({ where: { id: Number(id) } });
    res.status(200).json({
      message: "Hotel deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateHotel = async (req: Request, res: Response) => {
  const { id } = hotelIdSchema.parse(req.params);
  const hotelData = updateHotelSchema.parse(req.body);
  try {
    const updatedHotel = await prisma.hotel.update({
      where: { id: Number(id) },
      data: hotelData,
    });
    res.status(200).json({
      message: "Hotel updated successfully",
      hotel: updatedHotel,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
