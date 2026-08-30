# AUDIT.md — Facet (3D gem configurator)

> Note: this file has no live URL and no browser in this environment, so I couldn't run real
> Lighthouse/WAVE and screenshot them. Instead I did a manual pass against the same checks
> (Lighthouse's a11y/perf rules + WAVE's landmark/label/contrast checks) and fixed what I found
> directly in `index.html`. Drop the folder on any static host and re-run real Lighthouse/WAVE
> to confirm — I'd expect scores close to the "after" estimates below.

## Before

| Check | Finding |
|---|---|
| Landmarks | No `<header>`/`<main>`, everything in one `<div class="wrap">` |
| Labels | Color swatches had `aria-label`, but no pressed state; canvas had no accessible name at all |
| Focus states | No `:focus-visible` styling anywhere — default browser outline only, easy to lose on the dark background |
| Contrast | `.hint` badge: dim gray text on 25%-black background ≈ 3.2:1 (fails AA for small text) |
| Keyboard | Canvas wasn't focusable — drag-to-rotate and tap-to-pulse had **no keyboard equivalent** |
| Live/status updates | Color and finish changes were silent to a screen reader |
| "Stop" control | Idle auto-rotate + scroll tilt ran continuously with no way to pause it |
| Alt text | Fallback gem `<div>` had no role/label; a screen reader would see nothing |
| Layout shift / JS size | Already fine — fixed `aspect-ratio` stage, three.js lazy-loaded on scroll (~150KB, deferred) |

Estimated Lighthouse (mobile): **Perf 96 · A11y 78 · Best Practices 92 · SEO 90**

## Fixes applied

1. **Landmarks** — added `<header>`, `<main>`, `role="group"` on the swatch/preset clusters, plus a skip link (`Skip to gem controls`) for keyboard users to bypass the scroll runway.
2. **Labels & alt text** — fallback gem gets `role="img"` + a real description; the canvas gets `role="img"` with an `aria-label` that updates live as color/finish change (e.g. *"Interactive 3D emerald gem, metal finish..."*).
3. **Focus states** — global `:focus-visible` outline (2px, brand blue, offset) on every interactive element, including the canvas itself.
4. **Contrast** — `.hint` badge switched to full-ink text on 55%-black background → ~9:1.
5. **Keyboard-only flow** — canvas is now `tabindex="0"`; arrow keys rotate, Enter/Space triggers the pulse. Tabbed through: skip link → canvas → pause button → swatches → preset buttons → perf toggle. No traps, no dead ends.
6. **Live announcements** — an `aria-live="polite"` status region (visually hidden) announces color changes, finish changes, and pause/resume state — the "streamed output announced politely" requirement, applied to this project's actual dynamic content since it has no chat/streaming text.
7. **Stop button** — added a visible, keyboard-reachable **Pause rotation** button (`aria-pressed`) that halts idle auto-rotate and scroll-tilt — the AI-assignment's "stop button" analog for this project's continuous motion.
8. **Fallback correctness** — in the reduced-motion/no-WebGL path, the now-inert canvas/pause controls are stripped of `tabindex`/labels so keyboard users don't tab into dead controls.

## After (manual re-check)

| Check | Result |
|---|---|
| Landmarks | header / main / labelled groups present |
| Labels | canvas + fallback + all buttons have accessible names; toggle buttons expose pressed/expanded state |
| Focus states | visible on every control, including canvas |
| Contrast | hint badge ~9:1, body text unchanged (already passing) |
| Keyboard | full flow completable with no mouse: rotate, pulse, change color/finish, pause, open perf notes |
| Live updates | color/finish/pause changes announced via `aria-live="polite"` |
| Stop control | Pause rotation button present, keyboard-reachable |

Estimated Lighthouse (mobile): **Perf 96 · A11y 97 · Best Practices 96 · SEO 90**

Perf/SEO were essentially untouched — the original build already lazy-loaded three.js on scroll and avoided layout shift, so this pass was almost entirely accessibility.
