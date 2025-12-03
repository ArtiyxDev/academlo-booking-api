import type { Request, Response } from "express";
import prisma from "../config/database";
import { createBookingSchema } from "../validators/booking.validator";

export const getUserBookings = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  try {
    const bookingsData = await prisma.booking.findMany({
      where: { userId: Number(userId) },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            address: true,
            price: true,
          },
        },
      },
    });
    const formattedBookings = bookingsData.map((booking) => ({
      ...booking,
      checkIn: booking.checkIn.toISOString().split("T")[0],
      checkOut: booking.checkOut.toISOString().split("T")[0],
    }));
    res.status(200).json(formattedBookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { hotelId, checkIn, checkOut } = createBookingSchema.parse(req.body);
  try {
    console.log(userId);
    const newBooking = await prisma.booking.create({
      data: {
        userId: Number(userId),
        hotelId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
      },
    });
    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const bookingId = Number(req.params.id);
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking || booking.userId !== Number(userId)) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await prisma.booking.delete({
      where: { id: bookingId },
    });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const bookingId = Number(req.params.id);
  const { checkIn, checkOut } = req.body;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking || booking.userId !== Number(userId)) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { checkIn: new Date(checkIn), checkOut: new Date(checkOut) },
    });
    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
