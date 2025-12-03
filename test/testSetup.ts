import "dotenv/config";
import prisma, { connectDatabase, disconnectDatabase } from "../src/config/database";
import { hashPassword } from "../src/utils/password";

beforeAll(async () => {
  await connectDatabase();

  // Clean up database before running tests
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.image.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user for authentication if needed
  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: await hashPassword("securepassword"),
      gender: "other",
      role: "ADMIN",
    },
  });
});

afterAll(async () => {
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.image.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();
  // Close database connection if needed
  await disconnectDatabase();
});
