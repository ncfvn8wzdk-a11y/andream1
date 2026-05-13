# Andream — Timezone-Aware Project Management

A project management platform designed for distributed teams across timezones (Italy + USA). Features real-time project tracking, file uploads, time logging, and intelligent overlap window visualization.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local and add your DATABASE_URL and NEXTAUTH_SECRET

# 3. Initialize database
npm run db:push

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` to access the app.

## Development

```bash
# Run all tests
npm test

# Run with test UI
npm run test:ui

# Lint and format code
npm run lint:fix
npm run format

# Type check
npm run type-check

# Build for production
npm run build
npm start
```

## Features

- **User Authentication** — Email/password with NextAuth.js
- **Project Management** — Create, manage, and track projects
- **File Uploads** — Store invoices, drawings, PDFs, and photos
- **Time Tracking** — Log hours worked with descriptions
- **Timezone Support** — Automatic conversion between timezones (IT/US)
- **Overlap Window** — Visual indicator for team overlap hours

## Architecture

See [CLAUDE.md](./CLAUDE.md) for detailed development guide, database schema, and conventions.

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Session encryption key
- `NEXTAUTH_URL` — Application URL (localhost:3000 for dev)

Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

## License

MIT
