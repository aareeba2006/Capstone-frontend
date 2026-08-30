import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/lib/rate-limit";

// Keep the streaming connection open long enough for a full response,
// but capped so a stuck request can't run (and bill) forever.
export const maxDuration = 30; // seconds

const MAX_MESSAGE_LENGTH = 4000; // characters, per user message
const MAX_HISTORY_MESSAGES = 20; // cap conversation size sent per request
const MAX_OUTPUT_TOKENS = 1024;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function getClientKey(req: Request): string {
  // Vercel/most proxies set x-forwarded-for; fall back to a constant
  // (meaning: everyone shares one bucket) if it's ever missing, so the
  // route still degrades safely instead of throwing.
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  const clientKey = getClientKey(req);
  const { ok, remaining, resetAt } = checkRateLimit(clientKey);
  if (!ok) {
    const retryAfterSec = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    return Response.json(
      { error: "Rate limit exceeded. Please slow down." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      }
    );
  }

  let body: { messages?: { role: "user" | "assistant"; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = body.messages ?? [];

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  if (messages.length > MAX_HISTORY_MESSAGES) {
    return Response.json(
      { error: `Conversation too long (max ${MAX_HISTORY_MESSAGES} messages).` },
      { status: 400 }
    );
  }

  for (const m of messages) {
    if (typeof m.content !== "string" || m.content.length === 0) {
      return Response.json({ error: "Empty message content." }, { status: 400 });
    }
    if (m.content.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters).` },
        { status: 400 }
      );
    }
  }

  try {
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: MAX_OUTPUT_TOKENS,
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          controller.error(err);
          return;
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return Response.json(
      { error: "Something went wrong talking to the model." },
      { status: 502 }
    );
  }
}
