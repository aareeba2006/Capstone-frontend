# Day 1 — Project Scaffolding & Deployment

A deployment-ready Next.js project created for the Day 1 assignment.

## Included

- Next.js App Router
- Server Components by default
- Responsive navigation
- Routed placeholder screens
- Tailwind CSS v4
- Base design tokens
- `/health` page with live API data
- `/api/health` application health endpoint
- Environment variable structure
- Vercel-ready configuration
- Mobile layout tested by design for 375px and desktop at 1280px

## Routes

- `/`
- `/dashboard`
- `/profile`
- `/settings`
- `/health`
- `/api/health`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` when needed.

Never commit `.env.local` or real secrets.

## Deployment

Push this repository to GitHub and import the repository into Vercel. Vercel will automatically create deployments when changes are pushed.
