# Academlo Booking API

[English Version](README.md)

Una API RESTful moderna para la gestión de reservas de hoteles construida con Node.js, Express, TypeScript, Prisma y PostgreSQL.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Configuración de Base de Datos](#-configuración-de-base-de-datos)
- [Ejecutar la Aplicación](#️-ejecutar-la-aplicación)
- [Documentación de la API](#-documentación-de-la-api)
- [Pruebas](#-pruebas)
- [Soporte Docker](#-soporte-docker)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

- **Autenticación de Usuarios**: Autenticación basada en JWT con control de acceso basado en roles (USER/ADMIN)
- **Gestión de Usuarios**: Operaciones CRUD completas para perfiles de usuario
- **Gestión de Ciudades**: Administrar ciudades con información de país
- **Gestión de Hoteles**: CRUD completo de hoteles con coordenadas de ubicación, precios y descripciones
- **Gestión de Imágenes**: Manejo de múltiples imágenes por hotel
- **Sistema de Reservas**: Crear y gestionar reservas de hoteles con fechas de entrada/salida
- **Sistema de Reseñas**: Los usuarios pueden calificar y reseñar hoteles (1-5 estrellas)
- **Validación de Datos**: Validación de solicitudes usando esquemas Zod
- **Manejo de Errores**: Manejo centralizado de errores con clases de error personalizadas
- **Migraciones de Base de Datos**: Esquema de base de datos versionado con Prisma
- **Pruebas**: Suite de pruebas exhaustiva con Jest y Supertest
- **Soporte CORS**: Intercambio de recursos de origen cruzado configurable
- **Health Checks**: Endpoint de monitoreo de salud de la API
- **Listo para Docker**: Configuración de Docker lista para producción

## 🛠 Stack Tecnológico

- **Runtime**: Node.js 22+
- **Lenguaje**: TypeScript 5.7
- **Framework**: Express 5.1
- **Base de Datos**: PostgreSQL 18
- **ORM**: Prisma 7.0
- **Autenticación**: JWT (jsonwebtoken)
- **Hashing de Contraseñas**: bcrypt
- **Validación**: Zod 4.1
- **Pruebas**: Jest 30.2 + Supertest
- **Desarrollo**: tsx (ejecutor de TypeScript)
- **Gestor de Paquetes**: pnpm
- **Contenedorización**: Docker & Docker Compose

## 🏗 Arquitectura

La API sigue un patrón de arquitectura en capas:

```
├── Controllers    → Manejan solicitudes/respuestas HTTP
├── Routes         → Definen endpoints de la API
├── Middlewares    → Autenticación, validación, manejo de errores
├── Validators     → Esquemas Zod para validación de solicitudes
├── Utils          → Utilidades de JWT y contraseñas
├── Config         → Configuración de base de datos y entorno
└── Prisma         → Esquema de base de datos y migraciones
```

## 📦 Requisitos Previos

- Node.js >= 22.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 13 (o usar Docker)
- Docker & Docker Compose (opcional)

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 22.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose (recomendado)

### Instalación y Configuración

1. **Clonar e instalar**

```bash
git clone <repository-url>
cd academlo-booking-api
pnpm install
```

2. **Configurar variables de entorno**

Crear un archivo `.env` en el directorio raíz:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/academlo_booking
JWT_SECRET=tu-clave-secreta-jwt-super-segura-min-10-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

Crear un archivo `.env.test` para pruebas:

```env
PORT=3001
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/academlo_booking_test
JWT_SECRET=clave-jwt-secreta-para-pruebas
JWT_EXPIRES_IN=1d
CORS_ORIGIN=*
```

### 🐳 Despliegue con Docker (Recomendado)

#### Entorno de Desarrollo

```bash
# Iniciar contenedores de PostgreSQL (bases de datos dev + test)
pnpm docker:up

# Generar Prisma Client
pnpm db:generate

# Aplicar migraciones de base de datos
pnpm db:migrate

# (Opcional) Poblar base de datos con datos iniciales
pnpm db:seed

# Iniciar servidor de desarrollo
pnpm dev
```

La API estará disponible en `http://localhost:3000`

#### Entorno de Producción

```bash
# Construir e iniciar todos los servicios (API + PostgreSQL)
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f api

# Detener servicios
docker-compose -f docker-compose.prod.yml down
```

La API de producción estará disponible en `http://localhost:3000`

### 💻 Despliegue Manual (Sin Docker)

1. **Instalar e iniciar PostgreSQL**

```bash
# Instalar PostgreSQL 13 o superior
# Crear bases de datos
psql -U postgres
CREATE DATABASE academlo_booking;
CREATE DATABASE academlo_booking_test;
\q
```

2. **Configurar y ejecutar la aplicación**

```bash
# Generar Prisma Client
pnpm db:generate

# Aplicar migraciones
pnpm db:migrate

# Poblar base de datos (opcional)
pnpm db:seed

# Construir para producción
pnpm build

# Iniciar servidor de producción
pnpm start

# O iniciar servidor de desarrollo
pnpm dev
```

## 📚 Documentación de la API

### URL Base

```
http://localhost:3000/api
```

### Autenticación

La mayoría de los endpoints requieren autenticación JWT. Incluye el token en el header de Authorization:

```
Authorization: Bearer <tu-token-jwt>
```

### Endpoints

#### **Usuarios / Autenticación**

| Método | Endpoint           | Auth | Descripción                |
| ------ | ------------------ | ---- | -------------------------- |
| POST   | `/api/users`       | No   | Registrar nuevo usuario    |
| POST   | `/api/users/login` | No   | Iniciar sesión             |
| GET    | `/api/users`       | Sí   | Obtener todos los usuarios |
| PUT    | `/api/users/:id`   | Sí   | Actualizar usuario         |
| DELETE | `/api/users/:id`   | Sí   | Eliminar usuario           |

#### **Ciudades**

| Método | Endpoint          | Auth | Descripción                |
| ------ | ----------------- | ---- | -------------------------- |
| GET    | `/api/cities`     | No   | Obtener todas las ciudades |
| POST   | `/api/cities`     | Sí   | Crear ciudad               |
| DELETE | `/api/cities/:id` | Sí   | Eliminar ciudad            |

#### **Hoteles**

| Método | Endpoint          | Auth | Descripción                             |
| ------ | ----------------- | ---- | --------------------------------------- |
| GET    | `/api/hotels`     | No   | Obtener todos los hoteles (con filtros) |
| GET    | `/api/hotels/:id` | No   | Obtener hotel por ID                    |
| POST   | `/api/hotels`     | Sí   | Crear hotel                             |
| PUT    | `/api/hotels/:id` | Sí   | Actualizar hotel                        |
| DELETE | `/api/hotels/:id` | Sí   | Eliminar hotel                          |

#### **Imágenes**

| Método | Endpoint          | Auth | Descripción                |
| ------ | ----------------- | ---- | -------------------------- |
| GET    | `/api/images`     | Sí   | Obtener todas las imágenes |
| POST   | `/api/images`     | Sí   | Subir imagen               |
| DELETE | `/api/images/:id` | Sí   | Eliminar imagen            |

#### **Reservas**

| Método | Endpoint            | Auth | Descripción                  |
| ------ | ------------------- | ---- | ---------------------------- |
| GET    | `/api/bookings`     | Sí   | Obtener reservas del usuario |
| POST   | `/api/bookings`     | Sí   | Crear reserva                |
| DELETE | `/api/bookings/:id` | Sí   | Eliminar reserva             |

#### **Reseñas**

| Método | Endpoint           | Auth | Descripción                           |
| ------ | ------------------ | ---- | ------------------------------------- |
| GET    | `/api/reviews`     | No   | Obtener todas las reseñas (por hotel) |
| POST   | `/api/reviews`     | Sí   | Crear reseña                          |
| PUT    | `/api/reviews/:id` | Sí   | Actualizar reseña                     |
| DELETE | `/api/reviews/:id` | Sí   | Eliminar reseña                       |

### Ejemplos de Solicitudes

#### Registrar Usuario

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "contraseñaSegura123",
    "gender": "male"
  }'
```

#### Iniciar Sesión

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "contraseñaSegura123"
  }'
```

#### Crear Hotel (Autenticado)

```bash
curl -X POST http://localhost:3000/api/hotels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token-jwt>" \
  -d '{
    "name": "Gran Hotel",
    "description": "Hotel de lujo en el centro de la ciudad",
    "price": 150.00,
    "address": "Calle Principal 123",
    "lat": 40.7128,
    "lon": -74.0060,
    "cityId": 1
  }'
```

## 🧪 Ejecutar Pruebas

### Requisitos Previos para Pruebas

Asegurarse de que la base de datos de prueba esté ejecutándose y configurada:

```bash
# Iniciar base de datos de prueba (usa el puerto 5433)
pnpm docker:up

# Configurar esquema de la base de datos de prueba
pnpm test:db:push
```

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
pnpm test

# Ejecutar pruebas en modo watch (para desarrollo)
pnpm test:watch
```

### Cobertura de Pruebas

El proyecto incluye pruebas exhaustivas para todos los endpoints de la API:

- **Usuarios y Autenticación**: Registro, inicio de sesión, gestión de usuarios
- **Ciudades**: Operaciones CRUD para ciudades
- **Hoteles**: Gestión de hoteles con filtros
- **Reservas**: Creación y gestión de reservas
- **Reseñas**: Reseñas y calificaciones de hoteles

Ubicación de archivos de prueba: `test/routes/*.test.ts`

## 🐳 Soporte Docker

### Construir y Ejecutar con Docker Compose

```bash
# Construir e iniciar todos los servicios
pnpm docker:build
pnpm docker:up

# Detener todos los servicios
pnpm docker:down

# Ver logs
pnpm docker:logs
```

La configuración de Docker incluye:

- Contenedor PostgreSQL 18
- Contenedor de API con construcción multi-etapa
- Persistencia de volumen para la base de datos
- Health checks
- Migraciones automáticas de Prisma

### Comandos Docker Manuales

```bash
# Construir imagen
docker build -t academlo-booking-api .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="tu-secreto" \
  academlo-booking-api
```

## 📁 Estructura del Proyecto

```
academlo-booking-api/
├── src/
│   ├── app.ts                 # Configuración de Express
│   ├── index.ts               # Punto de entrada de la aplicación
│   ├── config/
│   │   ├── database.ts        # Configuración de Prisma
│   │   └── env.ts             # Validación de entorno
│   ├── controllers/           # Manejadores de solicitudes
│   │   ├── auth.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── city.controller.ts
│   │   ├── hotel.controller.ts
│   │   ├── image.controller.ts
│   │   ├── review.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/           # Middlewares de Express
│   │   ├── auth.ts            # Autenticación JWT
│   │   ├── errorHandler.ts   # Manejo global de errores
│   │   └── validator.ts       # Validación de solicitudes
│   ├── routes/                # Definiciones de rutas de la API
│   │   ├── index.ts
│   │   ├── user.routes.ts
│   │   ├── city.routes.ts
│   │   ├── hotel.routes.ts
│   │   ├── image.routes.ts
│   │   ├── booking.routes.ts
│   │   └── review.routes.ts
│   ├── utils/                 # Funciones utilitarias
│   │   ├── jwt.ts
│   │   └── password.ts
│   └── validators/            # Esquemas Zod
│       ├── auth.validator.ts
│       ├── booking.validator.ts
│       ├── city.validator.ts
│       ├── hotel.validator.ts
│       ├── image.validator.ts
│       ├── review.validator.ts
│       └── users.validator.ts
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts                # Población de base de datos
│   └── migrations/            # Archivos de migración
├── test/
│   ├── testSetup.ts           # Configuración de pruebas
│   ├── helper/                # Ayudantes de prueba
│   └── routes/                # Pruebas de rutas
├── generated/
│   └── prisma-client/         # Cliente Prisma generado
├── docker-compose.yml         # Configuración Docker Compose
├── Dockerfile                 # Imagen Docker de producción
├── tsconfig.json              # Configuración TypeScript
├── jest.config.ts             # Configuración Jest
├── package.json               # Dependencias y scripts
└── README.md                  # Este archivo
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev                 # Iniciar servidor dev con recarga automática
pnpm build               # Construir para producción
pnpm start               # Iniciar servidor de producción

# Base de Datos
pnpm db:generate         # Generar Prisma Client
pnpm db:push             # Hacer push de cambios del esquema (dev)
pnpm db:migrate          # Ejecutar migraciones (dev)
pnpm db:migrate:deploy   # Desplegar migraciones (prod)
pnpm db:seed             # Poblar base de datos
pnpm db:studio           # Abrir Prisma Studio

# Pruebas
pnpm test                # Ejecutar pruebas
pnpm test:watch          # Ejecutar pruebas en modo watch
pnpm test:db:push        # Configurar base de datos de pruebas

# Calidad de Código
pnpm lint                # Lintear código
pnpm lint:fix            # Corregir errores de linting
pnpm format              # Formatear código
pnpm format:check        # Verificar formato

# Docker
pnpm docker:up           # Iniciar contenedores
pnpm docker:down         # Detener contenedores
pnpm docker:logs         # Ver logs
pnpm docker:build        # Construir imágenes
```

## 🤝 Contribuir

1. Hacer fork del repositorio
2. Crear tu rama de características (`git checkout -b feature/caracteristica-increible`)
3. Hacer commit de tus cambios (`git commit -m 'Agregar alguna característica increíble'`)
4. Hacer push a la rama (`git push origin feature/caracteristica-increible`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT.

## 👥 Autores

Desarrollado por estudiantes de Academlo como parte del bootcamp de desarrollo backend.

## 🙏 Agradecimientos

- Equipo de Express.js por el excelente framework web
- Equipo de Prisma por el increíble ORM
- Todos los contribuidores y estudiantes que ayudaron a construir este proyecto

---

**¡Feliz Codificación! 🚀**
