const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType } = require('docx');

function h1(t){ return new Paragraph({ heading: HeadingLevel.HEADING_1, text: t }); }
function h2(t){ return new Paragraph({ heading: HeadingLevel.HEADING_2, text: t }); }
function p(t){ return new Paragraph({ text: t }); }
function pb(label, text){ return new Paragraph({ children: [new TextRun({text: label+": ", bold:true}), new TextRun(text)] }); }
function bullet(t){ return new Paragraph({ text: t, bullet: { level: 0 } }); }
function code(t){ return new Paragraph({ children: [new TextRun({text: t, font: "Consolas", size: 19})] }); }

function cell(text, opts={}) {
  return new TableCell({
    width: { size: opts.width || 2500, type: WidthType.DXA },
    shading: opts.header ? { type: ShadingType.CLEAR, fill: "D9E2F3" } : undefined,
    children: [new Paragraph({ children: [new TextRun({ text, bold: !!opts.header })] })],
  });
}

const headers = ["Case", "How it's triggered", "Handled by", "Verified"];
const rows = [
  ["Network failure / dead connection", "?fail=timeout (25s hang) or kill dev server mid-request", "useChat's error state + Retry button", "Yes, via curl to the route directly"],
  ["API error mid-stream", "?fail=mid_stream — throws after 4 tokens stream", "createUIMessageStream onError -> stream error part -> useChat error", "Yes, curl shows partial tokens then a clean error event, not a raw crash"],
  ["Rate limit", "?fail=rate_limit -> 429 response", "useChat error object + Retry", "Yes, curl confirms HTTP 429 + JSON error body"],
  ["Empty input", "Submitting a blank message", "Route returns 400 before doing any work", "Yes, curl confirms HTTP 400"],
  ["No results", "?fail=empty -> stream completes with 0 tokens", "Dedicated \u201cno response came back\u201d empty state with a retry action, distinct from an error", "Yes, curl shows a clean empty stream (start/end, no error)"],
  ["First-run empty state", "Fresh page load, no messages yet", "EmptyState component with a clear next action (ask a question)", "Yes, visible in the static HTML on first load"],
  ["Slow response", "?fail=timeout, or throttle network in devtools", "Skeleton component shown while status is submitted/streaming", "Partially - server-side hang confirmed via curl; the skeleton's visual appearance needs a real browser to see"],
  ["Route-level render failure", "/chat?routeError=1 -> throws during render", "app/chat/error.tsx boundary, with reset()", "Code correct per Next.js convention, but only observable in a real browser after hydration - see limitation note below"],
];

const table = new Table({
  width: { size: 10000, type: WidthType.DXA },
  rows: [
    new TableRow({ children: headers.map((hh,i) => cell(hh, {header:true, width: i===0?2200:i===1?2700:i===2?2900:2200})) }),
    ...rows.map(r => new TableRow({ children: r.map((v,i) => cell(v, {width: i===0?2200:i===1?2700:i===2?2900:2200})) }))
  ]
});

const children = [];
children.push(new Paragraph({ text: "Checkpoint 1 — Build Log", heading: HeadingLevel.TITLE }));
children.push(new Paragraph({text:""}));

children.push(h1("What this is"));
children.push(p("A reference Next.js chat app (App Router, useChat from @ai-sdk/react, a custom API route) built to demonstrate every failure/edge case in the assignment, since no existing project was shared to build directly on top of. The patterns here (error.tsx boundary, useChat's error + retry, skeleton for pending state, designed empty states) port directly onto a real app."));

children.push(h1("Primary flow"));
children.push(p("User types a message -> submits -> request streams to /api/chat -> tokens stream back and render live -> conversation continues. Every deliberate failure mode below hooks into this same flow via a ?fail= query param on the API route, so each case can be triggered on demand rather than waiting for a real outage."));

children.push(h1("Failure / edge case inventory and how each is handled"));
children.push(table);

children.push(h1("Sabotage testing performed (this session)"));
[
  "Ran a real production build (npm run build) - compiled and type-checked clean.",
  "Started the production server and hit the API route directly with curl for: happy path, empty input (400), rate limit (429), server error (500), mid-stream failure (partial tokens then a stream error event), and empty result (clean 0-token stream) - all six matched expected behavior exactly.",
  "Confirmed the server process stayed alive and kept serving requests after each simulated failure, including the mid-stream throw - nothing crashed the process.",
  "Attempted to verify the error.tsx route boundary via curl against /chat?routeError=1.",
].forEach(t=>children.push(bullet(t)));

children.push(h1("What broke / limitation found"));
children.push(p("The /chat route is statically prerendered (confirmed in the build output: \u25cb /chat). That means curl receives identical HTML whether or not routeError=1 is present, because the thrown error only happens client-side, after hydration, when useSearchParams reads the query string in the browser. This is not a bug in the error boundary - it's a real limit of testing a client-side render failure with a command-line HTTP request instead of an actual browser. The code path (error.tsx, the throw, the reset() call) is written correctly per Next.js's documented pattern, but this specific case still needs a real browser check before Checkpoint 1 is fully confirmed."));
children.push(p("Also found and fixed during this session: the original attempt to trigger the route error read searchParams as a prop, which does not work for a client (\"use client\") page component in this Next.js version - it required switching to the useSearchParams() hook, which in turn required wrapping the page in a Suspense boundary to satisfy static prerendering. Both were caught by the build failing loudly rather than failing silently."));

children.push(h1("Mobile Safari fixes applied"));
[
  "100vh swapped for 100dvh on the page container - 100vh includes the collapsed address bar height on iOS Safari and causes layout jump/overflow; dvh reflects the actual visible viewport.",
  "Input font-size set to 16px minimum - anything smaller causes iOS Safari to auto-zoom the page on focus, which is a common mobile-only bug.",
  "env(safe-area-inset-bottom) padding on the input row - keeps the send button clear of the home-indicator area on notched iPhones.",
  "-webkit-overflow-scrolling: touch on the scrollable message area for proper momentum scrolling on iOS.",
  "Layout verified down to a 480px breakpoint (message bubbles widen, header stacks) - this was checked in code/CSS, not yet on a physical device or simulator.",
].forEach(t=>children.push(bullet(t)));

children.push(h1("What's still needed before this is fully submittable"));
[
  "A real browser pass (or Playwright/Chrome DevTools) to visually confirm: the skeleton during streaming, the error.tsx boundary rendering after the routeError throw, and actual mobile Safari behavior on a device or simulator - all of these are client-side/visual and can't be fully confirmed by curl alone.",
  "Deploying this to get a real preview URL - this build was verified locally in this environment; getting it onto Vercel/Netlify for the Portal submission is a step that needs a live hosting account.",
  "The screen recording itself - showing the happy path plus at least two handled failure states live. This has to be captured on a real device, ideally exercising the sabotage dropdown in the UI (rate limit and mid-stream are the clearest to show on camera).",
].forEach(t=>children.push(bullet(t)));

const doc = new Document({
  sections: [{ properties: { page: { size: { width: 12240, height: 15840 } } }, children }]
});
Packer.toBuffer(doc).then(buf => require('fs').writeFileSync('/home/claude/checkpoint1_build_log.docx', buf));
