# Streaming AI Chat Assignment

## Deliverable links

- Preview URL: add after Vercel deployment
- Chat component: `components/ChatClient.tsx`
- Route handler: `app/api/chat/route.ts`
- AI configuration: `lib/ai-config.ts`

## Implementation

The chat uses the AI SDK `streamText` server-side and `useChat` on the client. The server converts UI messages into model messages and returns a UI message stream. The client renders text parts as they arrive.

The API key is read by the Anthropic provider on the server. It is not prefixed with `NEXT_PUBLIC_` and is not stored in client code.

## Test checklist

- [ ] Send a message and visibly see the assistant response stream.
- [ ] Stop during generation and confirm the UI remains usable.
- [ ] Send a second message and confirm the conversation continues.
- [ ] Scroll upward during a long response and confirm auto-scroll does not force the view back down.
- [ ] Test at 375px.
- [ ] Confirm no API key appears in browser code or GitHub.
