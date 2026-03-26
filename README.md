# HomeNest Portal Take-Home

Buyer portal assessment with a TypeScript backend and a React + Vite frontend.

## Stack

- Frontend: React, Vite, TypeScript, Zustand, TanStack Query, Material UI
- Backend: Node.js, Express, TypeScript, PostgreSQL, Prisma, JWT auth, Argon2 password hashing
- Database: PostgreSQL via Docker Compose

## Features

- User registration and login with email/password
- Argon2 password hashing
- JWT-protected routes
- Buyer dashboard showing the logged-in user's name and role
- Property catalogue with add/remove favourite actions
- User-scoped favourites only
- Basic validation and API error handling
- Theme config with light/dark mode toggle

## Project Structure

- [frontend](/Users/mebidhanshrestha/Desktop/HomeNest%20Portal/frontend)
- [backend](/Users/mebidhanshrestha/Desktop/HomeNest%20Portal/backend)
- [docker-compose.yml](/Users/mebidhanshrestha/Desktop/HomeNest%20Portal/docker-compose.yml)

## How To Run

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

This starts PostgreSQL on `localhost:5433` with:

- database: `homenest_portal`
- user: `postgres`
- password: `postgres`

### 2. Configure environment files

Create `backend/.env` from [backend/.env.example](/Users/mebidhanshrestha/Desktop/HomeNest%20Portal/backend/.env.example).

```env
PORT=8000
CLIENT_ORIGIN=http://localhost:3000
DATABASE_URL=postgres://postgres:postgres@localhost:5433/homenest_portal
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=1d
```

Create `frontend/.env` from [frontend/.env.example](/Users/mebidhanshrestha/Desktop/HomeNest%20Portal/frontend/.env.example).

```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Start the backend

```bash
cd backend
npm run dev
```

The backend auto-creates tables and seeds a few sample properties on startup.
It runs on `http://localhost:8000`.

Because the backend dev script runs `prisma generate` and `prisma db push` first, the
Prisma client and database schema stay in sync during local development.

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Open `http://127.0.0.1:3000`.

## Prisma Workflow

Run these from [backend](/Users/mebidhanshrestha/Desktop/HomeNest%20Portal/backend):

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:studio
```

- `prisma:generate` regenerates the Prisma client.
- `prisma:push` syncs `prisma/schema.prisma` to PostgreSQL.
- `prisma:studio` opens Prisma Studio for browsing users, properties, and favourites.

The Prisma schema lives at [backend/prisma/schema.prisma](/Users/mebidhanshrestha/Desktop/HomeNest%20Portal/backend/prisma/schema.prisma).

## Example User Flow

1. Open the frontend and go to the auth screen.
2. Register with name, email, and password.
3. After registration, you are redirected into the dashboard.
4. Browse available properties and click `Add favourite`.
5. Confirm the property appears in `My favourites`.
6. Click `Remove favourite` to remove it again.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Properties

- `GET /api/properties`

### Favourites

- `GET /api/favourites`
- `POST /api/favourites`
- `DELETE /api/favourites/:propertyId`

All routes except register/login require `Authorization: Bearer <token>`.

## Notes

- Passwords are never stored in raw form.
- Favourites are always filtered by the authenticated user ID on the server.
- The light/dark mode toggle is stored locally via Zustand persistence.
- The backend uses Prisma Client for database access.
- The frontend build currently emits a Vite chunk-size warning because Material UI is bundled into a single main chunk; functionality is unaffected.
