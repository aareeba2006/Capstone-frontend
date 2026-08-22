# Lead Scoring Assistant — Capstone (FE1)

A Next.js + Vercel AI SDK v5 chat app where the model scores a sales lead
using a server-side tool, and can optionally add a well-scoring lead to a
CRM through a human-confirmed action.

## Run it

```bash
npm install
cp .env.local.example .env.local   # add your OPENAI_API_KEY
npm run dev
```

Open http://localhost:3000. Click the example prompt or describe a lead
in your own words.

## Architecture

```
app/api/chat/route.ts      → streamText() with the two tools below
lib/tools/lead-tools.ts    → tool definitions (Zod schema + execute)
lib/crm.ts                 → mock CRM "database"
app/api/crm/add/route.ts   → write endpoint, only called after user approval
components/ToolPart.tsx    → renders each tool-call lifecycle state
components/LeadScoreCard.tsx     → renders scoreLead's output
components/ConfirmAddToCrm.tsx   → confirmation UI for addLeadToCrm
app/page.tsx                → chat UI (useChat)
```

## Tool contract

### `scoreLead`

Fully server-executed — the model calls it, `execute()` runs immediately
server-side, and the result streams back. No human step involved.

**Input schema**

| field         | type                                   | notes                              |
|---------------|-----------------------------------------|-------------------------------------|
| `companyName` | `string`                                | required                            |
| `industry`    | `string`                                | free text, e.g. `"fintech"`         |
| `companySize` | `"1-10" \| "11-50" \| "51-200" \| "201-1000" \| "1000+"` | headcount bracket |
| `role`        | `string`                                | contact's job title                 |
| `budget`      | `number`                                | USD, ≥ 0                            |
| `engagement`  | `"cold" \| "warm" \| "hot"`             | current engagement level            |

**Return shape**

```ts
{
  companyName: string;
  industry: string;
  score: number;        // 0-100
  tier: "A" | "B" | "C" | "D";
  reasons: string[];    // point breakdown, one line per factor
  recommendation: string;
}
```

Scoring is deterministic (size + seniority + budget + engagement points,
capped at 100) so results are stable and auditable — the model never does
the arithmetic itself, it only calls the tool.

### `addLeadToCrm`

Human-in-the-loop tool. It has **no `execute` function**, so the AI SDK
pauses the call in the `input-available` state instead of running it
automatically. The client renders a confirm/decline card
(`ConfirmAddToCrm.tsx`); only an explicit "Approve" click hits
`POST /api/crm/add`, and the result is fed back to the conversation via
`addToolResult`.

**Input schema**

| field         | type                       | notes                    |
|---------------|-----------------------------|---------------------------|
| `companyName` | `string`                    |                            |
| `tier`        | `"A" \| "B" \| "C" \| "D"`  | from a prior `scoreLead` call |
| `score`       | `number` (0–100)            | from a prior `scoreLead` call |

**Return shape** (submitted client-side after user action)

```ts
{ status: "added"; id: string } | { status: "declined" }
```

## Tool-call lifecycle → UI mapping

Each tool part on a message carries a `state`. `ToolPart.tsx` gives each
one a distinct treatment instead of dumping JSON:

| state              | meaning                                   | UI treatment                                  |
|--------------------|---------------------------------------------|------------------------------------------------|
| `input-streaming`  | model is still generating arguments         | pulsing skeleton row, field count so far        |
| `input-available`  | args complete; executing (or awaiting human)| spinner row — or the confirm card for `addLeadToCrm` |
| `output-available` | tool returned a result                      | `LeadScoreCard`, or a CRM confirmation banner    |
| `output-error`     | `execute()` threw                           | red error banner with the error text             |

## Notes

- Swap `lib/crm.ts` for a real CRM API call — the write is already isolated
  behind one function and one route, so nothing else needs to change.
- `scoreLead`'s scoring weights live at the top of `lib/tools/lead-tools.ts`
  and are easy to tune independently of the tool's schema.
