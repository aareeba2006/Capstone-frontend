# CLAUDE.md

Guidance for Claude Code (or any AI assistant) working in this repository.

## Project Overview

Frontend capstone web application built with Next.js and React. This repo is
part of an AI-assisted development learning track.

## Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: TODO (Tailwind CSS / CSS Modules)
- Package manager: npm

## Conventions

### Commits
This repo uses Conventional Commits:
feat: add user login form
fix(nav): correct broken mobile menu link
docs: update README setup instructions
chore: configure eslint rules

### Code style
- Functional components only, no class components.
- Prefer named exports over default exports for components.
- Keep components small and single-purpose.

### File structure
/app          - Next.js routes/pages
/components   - shared React components
/lib          - utilities, helpers, API clients
/styles       - global styles/theme

### Working with AI assistance
- Explain reasoning for non-trivial changes, not just the diff.
- Flag assumptions made about missing context.
- Don't make architecture decisions without flagging them first.
