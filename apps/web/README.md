# My Platform

Full-stack practice project built with **Next.js (App Router)** and **NestJS**,  
focusing on clean architecture, type safety, and frontend–backend integration.

## Tech Stack
- Frontend: Next.js 16 (App Router)
- Backend: NestJS
- Database: PostgreSQL (Prisma ORM)
- Validation: Zodproj1

- Language: TypeScript

## Project Structure
apps/
  web/        # Next.js frontend
  api/        # NestJS backend

## Features (Current)
- Posts CRUD API (NestJS)
- Cursor-based pagination
- Frontend ↔ Backend integration
- Type-safe API layer with Zod
- Load-more pagination UI
- Prisma CI configuration fixed

## Running Locally

### Backend
cd apps/api
npm install
npm run start:dev

Runs on http://localhost:4000

### Frontend
cd apps/web
npm install
npm run dev

Runs on http://localhost:3000 or 3001

## Environment Variables

Frontend (apps/web/.env.local)
NEXT_PUBLIC_API_BASE=http://localhost:4000/api

Backend (apps/api/.env)
DATABASE_URL=your_database_url

## Next Steps
- Create / Update / Delete posts UI
- Loading & error UI
- Infinite scroll

WIP
