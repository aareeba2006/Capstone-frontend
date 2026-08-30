# Simple AI Chat

A minimal, production-ready streaming chat app powered by the Claude API.
Type a message, get a streamed response, done. No accounts, no database —
just a clean example of a hardened LLM-backed API route on Next.js.

**Live demo:** _[add your production URL here after deploying]_

## What it does

- Single-page chat UI (`app/page.tsx`) that sends your message history to a
  server route and streams the assistant's reply back token-by-token.
- The server route (`app/api/chat/route.ts`) calls the Claude API
  (`claude-sonnet-4-6`) and pipes the streamed text straight to the browser.
- Basic production hygiene baked in (see below) so a public URL doesn't
  become a way for strangers to drain your API credits.

## Screenshots

_(Add 1–2 screenshots here after your first deploy — an empty chat state and
one mid-conversation. Drag-and-drop images into this file on GitHub, or
reference `/public/screenshot.png` if you commit one.)_

## Run it locally

```bash
git clone <your-repo-url>
cd simple-ai-chat
npm install
cp .env.example .env.local   # then fill in your key
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable            | Required | Description                                                                 |
| ------------------- | -------- | ---------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`  | Yes      | Your Claude API key from the [Anthropic Console](https://console.anthropic.com/). Never commit this — `.env*` is gitignored. |

When deploying (e.g. on Vercel), set `ANTHROPIC_API_KEY` in the project's
Environment Variables settings rather than committing a `.env` file.

## Architecture

```
app/
  page.tsx          - Chat UI (client component): input box, message list,
                       reads the streamed fetch response chunk by chunk.
  api/chat/route.ts - Server route: validates input, applies rate limiting,
                       calls Anthropic's streaming Messages API, and pipes
                       the text deltas back to the client as a raw stream.
lib/
  rate-limit.ts     - Tiny in-memory fixed-window rate limiter keyed by
                       client IP.
```

Request flow: browser → `POST /api/chat` → rate limit + validation check →
Anthropic streaming API → text chunks streamed back → UI appends them live.

## Production hygiene

Strangers finding a public URL and hammering it is the main real-world risk
for a demo like this, since every request costs API credits. This project
handles that with:

- **Rate limiting** — 10 requests per minute per IP (`lib/rate-limit.ts`).
  It's in-memory, so it resets on cold start and doesn't share state across
  multiple server instances. That's an intentional simplification for a
  small/demo deployment; for real multi-instance production traffic, swap
  it for a shared store like Upstash Redis (`@upstash/ratelimit`) behind the
  same `checkRateLimit()` interface.
- **Input caps** — messages are capped at 4,000 characters and conversations
  at 20 messages, enforced both in the UI (can't type past the limit) and
  again on the server (never trust the client).
- **Output cap** — `max_tokens` is capped per response so a single request
  can't balloon in cost.
- **`maxDuration`** — the streaming route has `export const maxDuration = 30`
  (seconds), so a hung request can't run indefinitely on serverless
  platforms that bill for execution time.
- **Server-side key** — the API key lives only in the server route; it's
  never sent to or readable by the browser.

None of this is bulletproof (IP-based limits can be worked around with
rotating IPs, for instance), but it's a reasonable floor for a small public
demo and cheap to reason about.

## Decisions and trade-offs

- **Next.js App Router**, because the streaming API route pattern
  (`ReadableStream` + `Response`) is a natural fit and it deploys to Vercel
  with zero config.
- **Plain `fetch` + `ReadableStream`** on the client instead of a chat SDK,
  to keep the example legible — you can see exactly how streaming works
  without a library in between.
- **In-memory rate limiting** instead of a database or Redis, to keep this
  a zero-infrastructure, single-file deploy. Documented above as the first
  thing to swap out if this needs to handle real traffic.
- **No persistence** — conversations live only in browser state and are
  lost on refresh. Adding a database is the natural next step if you want
  history.

## How AI tools built this

This project was built with Claude (Anthropic) doing the actual coding —
scaffolding the Next.js app, writing the streaming API route, the rate
limiter, the chat UI, and this README — based on a short list of
requirements (deploy, add production hygiene, document it, clean git
history). Nothing here was hand-written first and then "cleaned up" by AI;
the AI wrote it directly and a human reviewed and ran it.

What that means practically:

- The code has been build-tested (`npm run build`) but has **not** been
  load-tested or security-audited beyond the basic hygiene steps listed
  above. Treat the rate limiter and input caps as a reasonable starting
  point, not a guarantee.
- Model/version strings, dependency versions, and API usage patterns were
  written against what was current when this was built. If Anthropic's API
  changes, this may need updates — check
  [docs.claude.com](https://docs.claude.com) if something breaks.
- A human is responsible for the deployed instance, the API key attached to
  it, and any costs incurred. AI wrote the code; a person owns the
  consequences of running it.

## Deploying

The fastest path is Vercel (zero-config for Next.js):

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the `ANTHROPIC_API_KEY` environment variable in the project settings.
4. Deploy. Optionally attach a custom domain under Project → Settings →
   Domains.
5. Do a quick manual pass in Chrome, Firefox, Safari, and mobile Safari
   before calling it done — this app has no native dependencies, so it
   should behave identically across all four, but streaming fetch behavior
   is worth eyeballing once per browser.
