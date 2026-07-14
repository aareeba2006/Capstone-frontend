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

- ## Rules learned from FE-05 (vague vs. precise prompting drill)

- **Forms use react-hook-form + zod, never uncontrolled inputs.** Round 1's
  useRef/DOM-query approach is not acceptable — it bypasses React's
  render cycle and can't be validated declaratively. A form PR using
  getElementById or bare useRef for form state should fail review.

- **String validation schemas must call .trim() before .min(1, ...).**
  Confirmed by test: z.string().min(1) alone accepts whitespace-only
  input. Any "required" text field must chain .trim() first, or the
  field silently accepts blank-looking input.

- **No alert() or blocking dialogs for form feedback.** Validation errors
  and success messages must render inline in the UI inside an
  aria-live="polite" region tied to the relevant field. A PR using
  alert() for error/success feedback should fail review — it blocks the
  main thread and isn't accessible.
