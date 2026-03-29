# HomeNest Portal

The application provides a small buyer portal for a real-estate broker with:
- user registration and login
- JWT-based authentication
- a buyer dashboard
- a shared property catalogue
- user-specific favourites

## Project Overview

This project focuses on a buyer portal where a user can:
- register and log in with email and password
- authenticate with a secure token-based flow
- view a dashboard with their name and role
- browse properties
- add and remove favourites
- see only their own favourites

The application also includes:
- basic frontend screens
- server-side validation and error handling
- a small database-backed data layer
- a README with setup and example usage

## Aims And Objectives

### Aim

To build a clean, working full-stack buyer portal that demonstrates core authentication, protected data access, and user-specific favourite management.

### Objectives

- Implement secure user registration and login.
- Store passwords securely using hashing instead of raw text.
- Protect API routes using JWT authentication.
- Build a buyer dashboard that shows authenticated user information.
- Allow users to add and remove favourite properties.
- Ensure favourite data is scoped to the logged-in user only.
- Maintain a clear separation between frontend and backend.
- Provide basic but clear UX feedback with validation and toast messages.
- Keep the setup simple enough to run locally with a PostgreSQL-compatible database.

## What Has Been Implemented

### 1. Authentication

- User registration with `name`, `email`, and `password`
- User login with `email` and `password`
- JWT-based authentication
- Protected `me` endpoint for resolving the current user
- Password hashing using `argon2`
- Forgot password and reset password flow
- Change password flow from the account page

### 2. Buyer Dashboard And Favourites

- Dashboard shows the logged-in user's name and role
- Property catalogue is visible to all authenticated users
- Favourite properties are user-specific
- Users can add a property to favourites
- Users can remove a property from favourites
- Backend enforces that users can only access and modify their own favourites

### 3. Frontend

- Login and registration screen
- Dashboard screen
- Property listing screen
- Saved homes screen
- Account screen
- Clear save/remove favourite flow from the UI
- Toast-based success and error messages

### 4. Backend Validation And DB Layer

- Request validation with `zod`
- Centralized error handling
- Prisma ORM with PostgreSQL
- Database tables for:
  - users
  - properties
  - favourites

### 5. Additional Enhancements

The current implementation also includes:

- property create, detail, edit, and list modules
- image upload with `multer`
- backend pagination for properties
- breadcrumbs across main modules
- dark mode toggle
- dashboard analytics using ApexCharts
- tracking property creator and creation timestamp

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Material UI
- React Hook Form
- Zustand
- TanStack Query
- ApexCharts

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL / Neon
- Argon2
- JWT
- Zod
- Multer

## Project Structure

- [frontend](/C:/Users/NCC-User/Desktop/HomeNest-Portal/frontend)
- [backend](/C:/Users/NCC-User/Desktop/HomeNest-Portal/backend)
- [backend/prisma/schema.prisma](/C:/Users/NCC-User/Desktop/HomeNest-Portal/backend/prisma/schema.prisma)
- [backend/src/db/properties.ts](/C:/Users/NCC-User/Desktop/HomeNest-Portal/backend/src/db/properties.ts)

## How To Run The App

This project is currently configured to use **Neon PostgreSQL** through the backend `.env`.

### 1. Configure Environment Variables

Create or update [backend/.env](/C:/Users/NCC-User/Desktop/HomeNest-Portal/backend/.env):

```env
PORT=8000
CLIENT_ORIGIN=http://localhost:3000
DATABASE_URL=your_neon_connection_string
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=1d
```

Create or update `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

### 2. Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Generate Prisma Client

From [backend](/C:/Users/NCC-User/Desktop/HomeNest-Portal/backend):

```bash
npm run prisma:generate
```

### 4. Push Prisma Schema To The Database

```bash
npm run prisma:push
```

### 5. Start The Backend

```bash
cd backend
npm run dev
```

The backend runs on:

`http://localhost:8000`

### 6. Start The Frontend

```bash
cd frontend
npm run dev
```

The frontend runs on:

`http://localhost:3000`

## Example User Flow

### Flow 1: Sign Up To Favourite A Property

1. Open `http://localhost:3000`
2. Create a new account
3. After registration, you are redirected into the buyer portal
4. Open the properties page
5. Click `Save property`
6. Open the saved homes page
7. Confirm the property appears in your favourites

### Flow 2: Login And Remove A Favourite

1. Open the auth page
2. Sign in with an existing account
3. Open the saved homes page
4. Remove a saved property
5. Confirm it disappears from your own favourites list

### Flow 3: Multi-User Favourite Isolation

1. Sign in as User A
2. Save one or more properties
3. Sign out
4. Sign in as User B
5. Verify the same properties are still visible in the catalogue
6. Verify User B does not automatically inherit User A’s favourites

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/change-password`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Properties

- `GET /api/properties`
- `GET /api/properties/cities`
- `GET /api/properties/:id`
- `POST /api/properties`
- `PUT /api/properties/:id`
- `DELETE /api/properties/:id`

### Favourites

- `GET /api/favourites`
- `POST /api/favourites`
- `DELETE /api/favourites/:propertyId`

All protected routes require:

`Authorization: Bearer <token>`

## Database Design

The core database structure is intentionally small:

### User

- id
- name
- email
- password hash
- role
- created at

### Property

- id
- title
- city
- price
- image URL
- created at
- created by

### Favourite

- user id
- property id
- created at

This structure supports:
- authentication
- shared property listings
- user-specific favourites

## Validation And Error Handling

The backend validates requests using `zod` and returns controlled error messages for cases like:

- invalid login credentials
- duplicate email registration
- unauthenticated access
- invalid property IDs
- invalid favourite operations
- invalid form input

The frontend surfaces these with:

- inline field validation
- page-level error states
- toast notifications

## Security Considerations

- Passwords are hashed with `argon2`
- Raw passwords are never stored in the database
- JWT protects authenticated routes
- Favourite access is always filtered by authenticated user ID
- User-specific cache handling was adjusted on the frontend to avoid leaking stale favourite state between sessions in the same browser

## Challenges Faced And How They Were Solved

### 1. CORS And Local Development Origins

**Challenge:** Frontend and backend local origins need to stay aligned during development to avoid browser-side request failures.

**Solution:** The local setup was standardized around `http://localhost:3000`, and backend CORS handling was made tolerant for loopback development.

### 2. Form State And Validation Consistency

**Challenge:** Manual form state management across multiple screens becomes repetitive and harder to maintain.

**Solution:** Forms were standardized with `react-hook-form`, improving validation, field control, and error display consistency.

### 3. User-Specific Favourite Isolation

**Challenge:** Even with correct backend filtering, frontend cache reuse can make saved state look shared when switching users in the same browser session.

**Solution:** User-scoped query keys were introduced so favourite and property save-state caches remain isolated per authenticated user.

### 4. Local Image Uploads

**Challenge:** Property creation originally relied on image URLs instead of a more realistic upload flow.

**Solution:** `multer` was integrated to upload files locally, and drag-and-drop support was added on the frontend.

### 5. Database Evolution During Development

**Challenge:** As the schema changed, keeping the database aligned with the running application became important.

**Solution:** Prisma `generate` and `db push` were used to keep the client and database schema synchronized during development.

### 6. Prisma Client Lock On Windows

**Challenge:** On Windows, Prisma client generation can fail if a running Node process locks the query engine DLL.

**Solution:** The backend process must be stopped before regeneration, then restarted after `prisma generate` completes.

## Project Highlights

### Authentication And Security

- JWT authentication is implemented
- password hashing is implemented with Argon2
- protected routes require a valid token

### Database And CRUD Design

- users, properties, and favourites are modeled in Prisma
- favourites can be created, listed, and removed
- properties can be created, viewed, updated, and deleted

### Frontend And Backend Separation

- frontend and backend live in separate folders
- backend exposes API routes
- frontend consumes the API through service modules

### Extensibility

- the project is structured so the auth, property, and favourites flows can be extended independently
- additional modules such as analytics, uploads, and account management were added without collapsing the frontend/backend separation

### UX Considerations

- validation messages are shown clearly
- toast feedback is used for actions
- auth and dashboard flows are straightforward
- saved/favourite actions are visible and simple

## Notes

- The application currently uses Neon as the database backend through `DATABASE_URL`.
- The frontend build may show a chunk size warning because Material UI and ApexCharts add bundle weight; functionality is unaffected.
- Uploaded property images are ignored in Git through `.gitignore`.
