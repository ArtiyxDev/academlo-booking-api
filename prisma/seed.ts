import dotenv from "dotenv";
import prisma from "../src/config/database";
import bcrypt from "bcrypt";

dotenv.config();

/**
 * Seed data for the database
 */
async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@hotels.com" },
    update: {},
    create: {
      email: "admin@hotels.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      gender: "male",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@hotels.com" },
    update: {},
    create: {
      email: "user@hotels.com",
      password: userPassword,
      firstName: "John",
      lastName: "Doe",
      gender: "male",
      role: "USER",
    },
  });
  console.log("✅ Regular user created:", user.email);

  // Create cities
  const mexicoCity = await prisma.city.create({
    data: {
      name: "Mexico City",
      country: "Mexico",
      countryId: "MX",
    },
  });

  const cancun = await prisma.city.create({
    data: {
      name: "Cancun",
      country: "Mexico",
      countryId: "MX",
    },
  });

  const bogota = await prisma.city.create({
    data: {
      name: "Bogota",
      country: "Colombia",
      countryId: "CO",
    },
  });

  const newYork = await prisma.city.create({
    data: {
      name: "New York",
      country: "United States",
      countryId: "US",
    },
  });

  console.log("✅ Cities created");

  // Create hotels
  const hotel1 = await prisma.hotel.create({
    data: {
      name: "Grand Hotel Mexico",
      description: "Luxury hotel in the heart of Mexico City with stunning views",
      price: 150.0,
      address: "Av. Reforma 123, Centro",
      lat: 19.4326,
      lon: -99.1332,
      cityId: mexicoCity.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945" },
          { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" },
        ],
      },
    },
  });

  const hotel2 = await prisma.hotel.create({
    data: {
      name: "Beach Paradise Resort",
      description: "Beachfront resort in Cancun with all-inclusive packages",
      price: 250.0,
      address: "Blvd. Kukulcan Km 12.5",
      lat: 21.1619,
      lon: -86.8515,
      cityId: cancun.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4" },
          { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9" },
        ],
      },
    },
  });

  const hotel3 = await prisma.hotel.create({
    data: {
      name: "Bogota Inn",
      description: "Cozy hotel in Bogota with great breakfast",
      price: 80.0,
      address: "Calle 26 #13-19, Zona T",
      lat: 4.711,
      lon: -74.0721,
      cityId: bogota.id,
      images: {
        create: [{ url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791" }],
      },
    },
  });

  const hotel4 = await prisma.hotel.create({
    data: {
      name: "Manhattan Suites",
      description: "Modern hotel in Manhattan with city views",
      price: 300.0,
      address: "5th Avenue, Manhattan",
      lat: 40.7128,
      lon: -74.006,
      cityId: newYork.id,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa" },
          { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" },
        ],
      },
    },
  });

  console.log("✅ Hotels created");

  // Create bookings
  const booking1 = await prisma.booking.create({
    data: {
      userId: user.id,
      hotelId: hotel1.id,
      checkIn: new Date("2025-12-01"),
      checkOut: new Date("2025-12-05"),
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      userId: user.id,
      hotelId: hotel2.id,
      checkIn: new Date("2025-12-10"),
      checkOut: new Date("2025-12-15"),
    },
  });

  console.log("✅ Bookings created");

  // Create reviews
  await prisma.review.create({
    data: {
      userId: user.id,
      hotelId: hotel1.id,
      rating: 5,
      comment: "Excellent hotel! Great service and amazing location.",
    },
  });

  await prisma.review.create({
    data: {
      userId: user.id,
      hotelId: hotel2.id,
      rating: 4,
      comment: "Beautiful resort, loved the beach access!",
    },
  });

  await prisma.review.create({
    data: {
      userId: admin.id,
      hotelId: hotel3.id,
      rating: 4,
      comment: "Good value for money, friendly staff.",
    },
  });

  await prisma.review.create({
    data: {
      userId: admin.id,
      hotelId: hotel4.id,
      rating: 5,
      comment: "Perfect location in Manhattan, highly recommended!",
    },
  });

  console.log("✅ Reviews created");
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
