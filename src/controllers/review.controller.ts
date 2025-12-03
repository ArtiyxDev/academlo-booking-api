import type { Request, Response } from "express";
import {
  reviewIdSchema,
  reviewQuerySchema,
  updateReviewSchema,
} from "../validators/review.validator";
import prisma from "../config/database";

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviewsData = await prisma.review.findMany({
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });
    res.status(200).json({
      results: reviewsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getReviewsByHotel = async (req: Request, res: Response) => {
  const { hotelId } = reviewQuerySchema.parse(req.query);
  try {
    const reviewsData = await prisma.review.findMany({
      where: { hotelId: Number(hotelId) },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });
    res.status(200).json(reviewsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  const { hotelId, rating, comment } = req.body;
  const userId = req.user!.userId;
  try {
    const newReview = await prisma.review.create({
      data: {
        userId,
        hotelId,
        rating,
        comment,
      },
    });
    res.status(201).json({
      message: "Review created successfully",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  const { id } = reviewIdSchema.parse(req.params);
  const { rating, comment } = updateReviewSchema.parse(req.body);
  const userId = req.user!.userId;
  try {
    const existingReview = await prisma.review.findUnique({
      where: { id: Number(id) },
    });
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: You can only update your own reviews" });
    }
    await prisma.review.update({
      where: { id: Number(id) },
      data: { rating, comment },
    });
    res.status(200).json({
      message: "Review updated successfully",
      review: { ...existingReview, rating, comment },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const { id } = reviewIdSchema.parse(req.params);
  const userId = req.user!.userId;
  try {
    const existingReview = await prisma.review.findUnique({
      where: { id: Number(id) },
    });
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: You can only delete your own reviews" });
    }
    await prisma.review.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
