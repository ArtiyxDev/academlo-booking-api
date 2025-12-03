# Academlo Booking API

API de reservas construida con Bun, Express, TypeScript, Prisma y PostgreSQL.

## 🚀 Tecnologías

- **Runtime:** Bun
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **ORM:** Prisma
- **Base de datos:** PostgreSQL 18
- **Linting:** ESLint
- **Formateo:** Prettier
- **Contenedores:** Docker & Docker Compose

## 📋 Prerrequisitos

- [Bun](https://bun.sh) (v1.0+)
- [Docker](https://www.docker.com/) y Docker Compose
- [Git](https://git-scm.com/)

## 🛠️ Instalación

1. **Clonar el repositorio:**
```bash
git clone <tu-repositorio>
cd academlo-booking-api
```

2. **Instalar dependencias:**
```bash
bun install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones.

4. **Levantar PostgreSQL con Docker:**
```bash
bun run docker:up
```

5. **Generar Prisma Client:**
```bash
bun run db:generate
```

6. **Ejecutar migraciones:**
```bash
bun run db:migrate
```

7. **Poblar base de datos (opcional):**
```bash
bun run db:seed
```

## 🎯 Scripts Disponibles

### Desarrollo
```bash
bun run dev              # Inicia servidor en modo desarrollo con hot reload
bun start                # Inicia servidor en modo producción
```

### Base de datos
```bash
bun run docker:up        # Levanta PostgreSQL en Docker
bun run docker:down      # Detiene PostgreSQL
bun run docker:logs      # Ver logs de PostgreSQL

bun run db:generate      # Genera Prisma Client
bun run db:push          # Push cambios del schema sin migraciones
bun run db:migrate       # Crea y aplica migraciones
bun run db:migrate:deploy # Aplica migraciones en producción
bun run db:seed          # Ejecuta seeds
bun run db:studio        # Abre Prisma Studio
```

### Código
```bash
bun run lint             # Ejecuta ESLint
bun run lint:fix         # Corrige errores de ESLint
bun run format           # Formatea código con Prettier
bun run format:check     # Verifica formato sin modificar
```

### Build
```bash
bun run build            # Construye para producción
```

## 🐳 Docker

### Desarrollo Local
```bash
# Levantar solo la base de datos
bun run docker:up

# La aplicación corre en tu máquina
bun run dev
```

### Producción (Dokploy/VPS)
```bash
# Construir imagen
docker build -t academlo-booking-api .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e DATABASE_URL="tu-database-url" \
  -e PORT=3000 \
  academlo-booking-api
```

### Con Docker Compose (Producción)
Crea un `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/academlo_booking
      NODE_ENV: production
      PORT: 3000
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:18-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: academlo_booking
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

Luego:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Estructura del Proyecto

```
academlo-booking-api/
├── prisma/
│   ├── schema.prisma      # Schema de Prisma
│   └── seed.ts           # Seeds de base de datos
├── src/
│   ├── app.ts            # Configuración de Express
│   └── index.ts          # Punto de entrada
├── .env                  # Variables de entorno (no commitear)
├── .env.example          # Ejemplo de variables
├── .eslintrc.json        # Configuración ESLint
├── .prettierrc           # Configuración Prettier
├── docker-compose.yml    # PostgreSQL para desarrollo
├── Dockerfile            # Imagen de producción
├── package.json          # Dependencias y scripts
└── tsconfig.json         # Configuración TypeScript
```

## 🗃️ Modelos de Base de Datos

### User
- `id`: UUID
- `email`: String (único)
- `name`: String
- `password`: String (hash)
- `role`: Role (USER, ADMIN)
- `bookings`: Relación con Booking[]

### Booking
- `id`: UUID
- `userId`: String (FK a User)
- `title`: String
- `description`: String (opcional)
- `startDate`: DateTime
- `endDate`: DateTime
- `status`: BookingStatus (PENDING, CONFIRMED, CANCELLED, COMPLETED)

## 🌐 Endpoints

### Health Check
```
GET /health
```

### Root
```
GET /
```

## 🚀 Despliegue en Dokploy

1. **Conecta tu repositorio Git** en Dokploy
2. **Configura variables de entorno:**
   - `DATABASE_URL`
   - `PORT=3000`
   - `NODE_ENV=production`
   - `JWT_SECRET`

3. **Dokploy detectará automáticamente** el `Dockerfile` y construirá la imagen

4. **Ejecuta migraciones** después del primer despliegue:
```bash
docker exec -it <container-id> bunx prisma migrate deploy
```

## 📝 Notas

- El puerto por defecto es `3000`
- PostgreSQL corre en el puerto `5432`
- Credenciales por defecto: `postgres:postgres`
- **Cambia las credenciales en producción**

## 🔒 Seguridad

- [ ] Cambiar credenciales de PostgreSQL en producción
- [ ] Generar `JWT_SECRET` seguro
- [ ] Configurar CORS apropiadamente
- [ ] Usar HTTPS en producción
- [ ] Implementar rate limiting

## 📚 Recursos

- [Bun Documentation](https://bun.sh/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express Documentation](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Dokploy Documentation](https://docs.dokploy.com/)

## 📄 Licencia

Este proyecto es privado y pertenece a Academlo.
