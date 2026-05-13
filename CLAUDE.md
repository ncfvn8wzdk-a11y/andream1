# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Intent

Timezone-aware project management platform for distributed teams (Italy + USA). Core features:
- **User authentication** with NextAuth.js
- **Project management** with file uploads (invoices, drawings, PDFs, photos)
- **Time tracking** — project leads log hours worked with descriptions
- **Timezone-aware rendering** — all timestamps stored in UTC, displayed in viewer's local timezone
- **Overlap window** (typically 15:00–18:00 IT / 09:00–12:00 EST) as a first-class UI concept

## Tech Stack

- **Frontend + Backend:** Next.js 14 (TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Testing:** Vitest + React Testing Library
- **Code Quality:** ESLint + Prettier with Husky pre-commit hooks

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Database
npm run db:generate      # Generate Prisma client after schema changes
npm run db:push          # Push schema changes to dev database
npm run db:migrate       # Create migration files

# Code quality
npm run lint             # Check for issues
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting without changing
npm run type-check       # TypeScript type checking

# Testing
npm test                 # Run all tests
npm run test:ui          # Open Vitest UI

# Build and deploy
npm run build            # Build for production
npm start                # Run production server
```

## Database Schema

Key models in `prisma/schema.prisma`:
- **User** — email, password, timezone preference
- **Project** — name, description, owner (User), status
- **ProjectMember** — joins User + Project with role (owner/lead/member)
- **ProjectFile** — uploaded files (invoices, drawings, PDFs) with metadata
- **TimeLog** — hours logged by team members per project per date

## Project Structure

```
src/
├── app/               # Next.js App Router
│   ├── api/          # API routes (auth, projects, files, time-logs)
│   ├── auth/         # Auth pages (login, register)
│   └── dashboard/    # Protected pages (projects, time tracking)
├── components/        # React components
├── lib/              # Utilities (db client, auth helpers, timezone conversion)
├── types/            # TypeScript types
└── test/             # Test setup and utilities
```

## Key Conventions

- **Timestamps:** Always store in UTC (PostgreSQL timezone-aware columns). Convert to user's timezone only in UI.
- **File uploads:** Store in `public/uploads/` during dev; configure S3 in production via `.env`
- **Protected routes:** Use NextAuth.js middleware; check session in API routes
- **API responses:** Return consistent JSON shape: `{ data?, error?, message? }`
- **Timezone field:** Each User has a `timezone` string (e.g., "America/New_York"); use during display

## Setup

1. Copy `.env.example` to `.env.local` and configure:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=openssl rand -base64 32  # Generate once, keep same
   ```
2. `npm install`
3. `npm run db:push` to initialize database
4. `npm run dev` to start

## Pre-commit Hooks

Husky + lint-staged automatically:
- Run ESLint on `.ts` and `.tsx` files
- Format code with Prettier
- Prevent commits with linting errors

To bypass (not recommended): `git commit --no-verify`
