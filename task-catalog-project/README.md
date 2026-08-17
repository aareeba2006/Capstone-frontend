# Index — a card-catalog task manager

A React task manager styled as a library card catalog instead of a generic
to-do list. Tasks are index cards with a colored category tab, a priority
dot, a due date, and a rotated "FILED" ink stamp when marked complete.

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
├── index.html
├── package.json
├── vite.config.js
└── src
    ├── main.jsx           # React entry point
    └── TaskCatalog.jsx    # the app
```

## Deploying for a live link

The fastest option is Vercel:

1. Push this repo to GitHub (see steps below).
2. Go to vercel.com, sign in with GitHub, click "Add New Project," and
   import this repo.
3. Vercel auto-detects Vite — leave the defaults and click Deploy.
4. You'll get a live URL like `https://task-catalog-yourname.vercel.app`.

Netlify works the same way (drag-and-drop the `dist` folder after
`npm run build`, or connect the GitHub repo directly).

## Assignment documentation

See `DEVELOPMENT_LOG.md` for the prompts used during development, how AI
assisted at each stage, and specific manual corrections made after
reviewing the AI-generated code.
