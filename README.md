# Academlo Booking API

[Versión en Español](README.es.md)

A modern RESTful API for hotel booking management built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Docker Support](#-docker-support)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **User Authentication**: JWT-based authentication with role-based access control (USER/ADMIN)
- **User Management**: Complete CRUD operations for user profiles
- **City Management**: Manage cities with country information
- **Hotel Management**: Full hotel CRUD with location coordinates, pricing, and descriptions
- **Image Management**: Handle multiple images per hotel
- **Booking System**: Create and manage hotel reservations with check-in/check-out dates
- **Review System**: Users can rate and review hotels (1-5 stars)
- **Data Validation**: Request validation using Zod schemas
- **Error Handling**: Centralized error handling with custom error classes
- **Database Migrations**: Version-controlled database schema with Prisma
- **Testing**: Comprehensive test suite with Jest and Supertest
- **CORS Support**: Configurable cross-origin resource sharing
- **Health Checks**: API health monitoring endpoint
- **Docker Ready**: Production-ready Docker configuration

## 🛠 Tech Stack

- **Runtime**: Node.js 22+
- **Language**: TypeScript 5.7
- **Framework**: Express 5.1
- **Database**: PostgreSQL 18
- **ORM**: Prisma 7.0
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod 4.1
- **Testing**: Jest 30.2 + Supertest
- **Development**: tsx (TypeScript runner)
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose

## 🏗 Architecture

The API follows a layered architecture pattern:

```
├── Controllers    → Handle HTTP requests/responses
├── Routes         → Define API endpoints
├── Middlewares    → Authentication, validation, error handling
├── Validators     → Zod schemas for request validation
├── Utils          → JWT and password utilities
├── Config         → Database and environment configuration
└── Prisma         → Database schema and migrations
```

## 📦 Prerequisites

- Node.js >= 22.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 13 (or use Docker)
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose (recommended)

### Installation & Setup

1. **Clone and install**

```bash
git clone <repository-url>
cd academlo-booking-api
pnpm install
```

2. **Set up environment variables**

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/academlo_booking
JWT_SECRET=your-super-secret-jwt-key-min-10-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

Create a `.env.test` file for testing:

```env
PORT=3001
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/academlo_booking_test
JWT_SECRET=test-jwt-secret-key-for-testing
JWT_EXPIRES_IN=1d
CORS_ORIGIN=*
```

### 🐳 Deployment with Docker (Recommended)

#### Development Environment

```bash
# Start PostgreSQL containers (dev + test databases)
pnpm docker:up

# Generate Prisma Client
pnpm db:generate

# Apply database migrations
pnpm db:migrate

# (Optional) Seed database with initial data
pnpm db:seed

# Start development server
pnpm dev
```

The API will be available at `http://localhost:3000`

#### Production Environment

```bash
# Build and start all services (API + PostgreSQL)
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f api

# Stop services
docker-compose -f docker-compose.prod.yml down
```

The production API will be available at `http://localhost:3000`

### 💻 Manual Deployment (Without Docker)

1. **Install and start PostgreSQL**

```bash
# Install PostgreSQL 13 or higher
# Create databases
psql -U postgres
CREATE DATABASE academlo_booking;
CREATE DATABASE academlo_booking_test;
\q
```

2. **Setup and run the application**

```bash
# Generate Prisma Client
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Seed database (optional)
pnpm db:seed

# Build for production
pnpm build

# Start production server
pnpm start

# OR start development server
pnpm dev
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### **Users / Authentication**

| Method | Endpoint           | Auth | Description       |
| ------ | ------------------ | ---- | ----------------- |
| POST   | `/api/users`       | No   | Register new user |
| POST   | `/api/users/login` | No   | User login        |
| GET    | `/api/users`       | Yes  | Get all users     |
| PUT    | `/api/users/:id`   | Yes  | Update user       |
| DELETE | `/api/users/:id`   | Yes  | Delete user       |

#### **Cities**

| Method | Endpoint          | Auth | Description    |
| ------ | ----------------- | ---- | -------------- |
| GET    | `/api/cities`     | No   | Get all cities |
| POST   | `/api/cities`     | Yes  | Create city    |
| DELETE | `/api/cities/:id` | Yes  | Delete city    |

#### **Hotels**

| Method | Endpoint          | Auth | Description                   |
| ------ | ----------------- | ---- | ----------------------------- |
| GET    | `/api/hotels`     | No   | Get all hotels (with filters) |
| GET    | `/api/hotels/:id` | No   | Get hotel by ID               |
| POST   | `/api/hotels`     | Yes  | Create hotel                  |
| PUT    | `/api/hotels/:id` | Yes  | Update hotel                  |
| DELETE | `/api/hotels/:id` | Yes  | Delete hotel                  |

#### **Images**

| Method | Endpoint          | Auth | Description    |
| ------ | ----------------- | ---- | -------------- |
| GET    | `/api/images`     | Yes  | Get all images |
| POST   | `/api/images`     | Yes  | Upload image   |
| DELETE | `/api/images/:id` | Yes  | Delete image   |

#### **Bookings**

| Method | Endpoint            | Auth | Description       |
| ------ | ------------------- | ---- | ----------------- |
| GET    | `/api/bookings`     | Yes  | Get user bookings |
| POST   | `/api/bookings`     | Yes  | Create booking    |
| DELETE | `/api/bookings/:id` | Yes  | Delete booking    |

#### **Reviews**

| Method | Endpoint           | Auth | Description                |
| ------ | ------------------ | ---- | -------------------------- |
| GET    | `/api/reviews`     | No   | Get all reviews (by hotel) |
| POST   | `/api/reviews`     | Yes  | Create review              |
| PUT    | `/api/reviews/:id` | Yes  | Update review              |
| DELETE | `/api/reviews/:id` | Yes  | Delete review              |

### Example Requests

#### Register User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "gender": "male"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

#### Create Hotel (Authenticated)

```bash
curl -X POST http://localhost:3000/api/hotels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "name": "Grand Hotel",
    "description": "Luxury hotel in the city center",
    "price": 150.00,
    "address": "123 Main St",
    "lat": 40.7128,
    "lon": -74.0060,
    "cityId": 1
  }'
```

## 🧪 Running Tests

### Prerequisites for Testing

Ensure the test database is running and configured:

```bash
# Start test database (uses port 5433)
pnpm docker:up

# Setup test database schema
pnpm test:db:push
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch
```

### Test Coverage

The project includes comprehensive tests for all API endpoints:

- **Users & Authentication**: Registration, login, user management
- **Cities**: CRUD operations for cities
- **Hotels**: Hotel management with filters
- **Bookings**: Reservation creation and management
- **Reviews**: Hotel reviews and ratings

Test files location: `test/routes/*.test.ts`

## 🐳 Docker Support

### Build and Run with Docker Compose

```bash
# Build and start all services
pnpm docker:build
pnpm docker:up

# Stop all services
pnpm docker:down

# View logs
pnpm docker:logs
```

The Docker setup includes:

- PostgreSQL 18 container
- API container with multi-stage build
- Volume persistence for database
- Health checks
- Automatic Prisma migrations

### Manual Docker Commands

```bash
# Build image
docker build -t academlo-booking-api .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  academlo-booking-api
```

## 📁 Project Structure

```
academlo-booking-api/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── index.ts               # Application entry point
│   ├── config/
│   │   ├── database.ts        # Prisma client setup
│   │   └── env.ts             # Environment validation
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── city.controller.ts
│   │   ├── hotel.controller.ts
│   │   ├── image.controller.ts
│   │   ├── review.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.ts            # JWT authentication
│   │   ├── errorHandler.ts   # Global error handling
│   │   └── validator.ts       # Request validation
│   ├── routes/                # API route definitions
│   │   ├── index.ts
│   │   ├── user.routes.ts
│   │   ├── city.routes.ts
│   │   ├── hotel.routes.ts
│   │   ├── image.routes.ts
│   │   ├── booking.routes.ts
│   │   └── review.routes.ts
│   ├── utils/                 # Utility functions
│   │   ├── jwt.ts
│   │   └── password.ts
│   └── validators/            # Zod schemas
│       ├── auth.validator.ts
│       ├── booking.validator.ts
│       ├── city.validator.ts
│       ├── hotel.validator.ts
│       ├── image.validator.ts
│       ├── review.validator.ts
│       └── users.validator.ts
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding
│   └── migrations/            # Migration files
├── test/
│   ├── testSetup.ts           # Test configuration
│   ├── helper/                # Test helpers
│   └── routes/                # Route tests
├── generated/
│   └── prisma-client/         # Generated Prisma client
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Production Docker image
├── tsconfig.json              # TypeScript configuration
├── jest.config.ts             # Jest configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev                 # Start dev server with hot-reload
pnpm build               # Build for production
pnpm start               # Start production server

# Database
pnpm db:generate         # Generate Prisma Client
pnpm db:push             # Push schema changes (dev)
pnpm db:migrate          # Run migrations (dev)
pnpm db:migrate:deploy   # Deploy migrations (prod)
pnpm db:seed             # Seed database
pnpm db:studio           # Open Prisma Studio

# Testing
pnpm test                # Run tests
pnpm test:watch          # Run tests in watch mode
pnpm test:db:push        # Setup test database

# Code Quality
pnpm lint                # Lint code
pnpm lint:fix            # Fix linting errors
pnpm format              # Format code
pnpm format:check        # Check formatting

# Docker
pnpm docker:up           # Start containers
pnpm docker:down         # Stop containers
pnpm docker:logs         # View logs
pnpm docker:build        # Build images
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Developed by Academlo students as part of the backend development bootcamp.

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- Prisma team for the amazing ORM
- All contributors and students who helped build this project

---

**Happy Coding! 🚀**
