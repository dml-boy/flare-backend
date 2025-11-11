# Flare Backend (NestJS + Prisma + Postgres)

Quick scaffold that serves dynamic content for the Flare HTML site:
- About (`/about`)
- Services (`/services`)
- Testimonials (`/testimonials`)

## Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install deps:

```bash
npm install
```

3. Generate Prisma client & run migration:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

4. Start dev server:

```bash
npm run start:dev
```

Static frontend: place your `index.html`, images and assets into `public/` at project root and they will be served by Nest.

