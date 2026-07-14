# WORKFLOW.md — Vague vs. Precise Prompting: Settings Form

## The two prompts

**Round 1 (vague):** `"make me a settings form"` — one sentence, no file
references, no constraints, no examples, no verification step. Output
accepted as-is.

**Round 2 (precise):** a multi-part prompt specifying the exact fields,
required validation library (react-hook-form + zod, per project convention),
"controlled inputs only," accessibility requirements (labeled inputs,
`aria-live` error regions), five explicit edge cases to handle, and a
verification step ("write it, then write tests and run them").

## Correctness

Round 1's validation is a single `if (name == "" || email == "")` check.
It does not catch:
- Whitespace-only input (`"   "` passes the empty-string check)
- Malformed email addresses (`"areeba"` or `"areeba@"` are accepted as valid)

Round 2 uses a zod schema (`z.string().trim().min(1)` for name,
`z.string().email()` for email) that rejects all of the above. I confirmed
this isn't just a claim: I temporarily removed `.trim()` from the round-2
schema to see what would happen, reran the test suite, and one test failed
immediately — `"rejects a whitespace-only name"` — because without `.trim()`,
`"   "` has length 3 and passes `.min(1)`. Restoring `.trim()` turned the
suite green again (6/6 passing). **That's the AI mistake I caught**: my own
first-draft schema silently allowed whitespace-only names, and the test
written *before* accepting the code is what surfaced it — not a manual read
of the code.

Round 1 has zero tests, so an equivalent bug would have shipped silently.

## Accessibility

Round 1: no `<label>` elements — inputs only have `placeholder` text, which
disappears on focus and isn't reliably read by screen readers as a field
name. Errors and success are communicated via `alert()`, which is jarring,
blocks the main thread, and isn't tied to the field it concerns.

Round 2: every input has a `<label htmlFor>` pair, and errors render inside
`aria-live="polite"` regions next to their field, so assistive tech
announces them without a jarring interrupt. Success state renders in the UI
rather than a blocking dialog.

## Edge cases

Round 1 handles exactly one case: "is either field an empty string." Round 2
explicitly handles: empty name, whitespace-only name, missing `@`, missing
domain, and a sensible default (`notifications: true`) rather than an
unset/undefined checkbox state. All five are covered by named test cases,
not just eyeballed.

## Review effort

Round 1 took under a minute to generate and looked "done" at a glance — the
form renders, submits, and shows *something*. But every gap above would
surface later, either in a code review or in production, at a much higher
cost to find and fix than catching it now.

Round 2 took longer to prompt and to review the full diff. But total time —
prompting + reviewing + fixing — was lower than it would've taken to
retrofit round 1 with tests, labels, and proper validation after the fact.
The verification step (write tests, run them, fix failures) meant issues
surfaced during generation, not during review.
