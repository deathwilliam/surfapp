# Copilot / AI Agent Instructions — surf-app-sv

This project is a Next.js (App router) TypeScript application with Prisma (Postgres) and NextAuth. The goal of these notes is to help an AI coding agent be productive quickly and follow repository conventions.

- **Big picture**: frontend and backend are colocated in `src/app` using the Next App Router. UI components live in `src/components`. Server logic and API routes live under `src/app/api/*/route.ts` (server route handlers). Prisma models (Postgres) drive the data layer (`prisma/schema.prisma`).

- **Key stacks / versions**: Next 16 (App Router), React 19, TypeScript, Prisma 6, NextAuth v5 (prisma adapter), Tailwind v4. Use the code in `package.json` scripts for exact commands.

- **Important files to reference**:
  - `package.json` — scripts and dependencies
  - `prisma/schema.prisma` — canonical data model and enums (UserType, BookingStatus, PaymentStatus, etc.)
  - `src/lib/prisma.ts` — Prisma client singleton pattern (avoid multiple clients in dev)
  - `src/lib/auth.ts` — NextAuth configuration (Credentials provider + Prisma adapter)
  - `src/app/api/**/route.ts` — API handlers (NextRequest/NextResponse)
  - `src/lib/validations` — Zod schemas used across routes (follow these patterns)
  - `src/lib/password.ts` — bcrypt hashing/verification (SALT_ROUNDS = 12)
  - `src/app/layout.tsx` + `src/components/providers/SessionProvider.tsx` — global layout and session wrapper

- **Project conventions / patterns** (do not change lightly):
  - Use the `@/*` path alias (maps to `./src/*`) for imports.
  - API routes are server-first. Use `NextRequest`, `NextResponse` and return JSON via `NextResponse.json(...)` with proper status codes.
  - Validate request bodies with Zod found in `src/lib/validations/*` and return structured errors when ZodError occurs (see `src/app/api/auth/register/route.ts`).
  - Prisma usage: prefer `select` or `include` to control returned fields. Handle Prisma unique constraint errors (`P2002`) where appropriate.
  - For long-lived server objects (Prisma client) reuse the singleton in `src/lib/prisma.ts` to avoid connection explosion in dev.
  - Components default to server components; add `'use client'` at top of client components (see `src/components/providers/SessionProvider.tsx`).

- **How to run & DB workflows** (PowerShell examples):
  - Start dev server: `npm run dev`
  - Build: `npm run build`
  - Generate Prisma client: `npm run db:generate`
  - Apply schema to DB (push or migrate): `npm run db:push` or `npm run db:migrate`
  - Seed DB: `npm run db:seed` (uses `tsx prisma/seed.ts`)
  - Open Prisma Studio: `npm run db:studio`

  Example (PowerShell):
  ```powershell
  $env:DATABASE_URL = "postgresql://..."
  npm run db:generate; npm run db:migrate; npm run db:seed; npm run dev
  ```

- **Common API route pattern (follow these examples)**:
  - Import prisma and zod schema, parse body, try/catch errors.
  - Map ZodError and Prisma errors to proper HTTP codes and messages.
  - Keep responses minimal and typed (use `select` when creating users).

  Reference: `src/app/api/auth/register/route.ts` — good example of input validation, bcrypt hashing (`src/lib/password.ts`) and `prisma.user.create` with conditional `instructorProfile` creation.

- **Auth & sessions**:
  - NextAuth is configured in `src/lib/auth.ts` and exposed via the `[...nextauth]/route.ts` route handler.
  - Sessions are provided to the UI by `src/components/providers/SessionProvider.tsx` (wraps app in `src/app/layout.tsx`).

- **External integrations & expectations**:
  - Schema includes `stripe_payment_intent_id` and similar fields — Stripe is expected by schema but not necessarily wired in code. Search for `stripe` before adding Stripe code.
  - Email/phone verification flows are referenced by fields (e.g., `emailVerified`, `phoneVerified`) — look for related routes before implementing.

- **When editing code**:
  - Preserve `paths` alias imports. Keep TypeScript strictness. Run `npm run lint` and rely on Prettier + Prettier plugin for Tailwind.
  - When adding Prisma fields, add migration using `npm run db:migrate` and update seeds if required.

If anything in this file is unclear or you'd like more examples for a specific area (API routes, Prisma migrations, auth flows), tell me which part and I'll expand or add code snippets.
