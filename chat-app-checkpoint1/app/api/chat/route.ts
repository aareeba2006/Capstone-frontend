import { NextRequest } from "next/server";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";

export const maxDuration = 30;

/**
 * Sabotage modes, triggered by a `?fail=` query param on the request.
 * This is how every failure case in the assignment gets tested deliberately,
 * without needing to actually break a real upstream API:
 *
 *   ?fail=rate_limit   -> immediate 429
 *   ?fail=mid_stream   -> starts streaming, then throws partway through
 *   ?fail=server_error -> immediate 500
 *   ?fail=timeout      -> hangs long enough to simulate a dead connection
 *   ?fail=empty        -> returns a stream with zero tokens
 *   (no param)         -> normal happy-path response
 */
export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const url = new URL(req.url);
  const fail = url.searchParams.get("fail");

  const lastUserMessage = messages?.[messages.length - 1]?.content ?? "";

  if (!lastUserMessage || lastUserMessage.trim() === "") {
    return new Response(
      JSON.stringify({ error: "Empty input is not allowed." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (fail === "rate_limit") {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  if (fail === "server_error") {
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (fail === "timeout") {
    await new Promise((resolve) => setTimeout(resolve, 25000));
    return new Response(
      JSON.stringify({ error: "Request timed out." }),
      { status: 504, headers: { "Content-Type": "application/json" } }
    );
  }

  const fullReply =
    fail === "empty"
      ? ""
      : `You said: "${lastUserMessage}". This is a simulated streamed reply, arriving token by token so the pending/skeleton state has something real to show.`;

  const tokens = fullReply.length ? fullReply.split(" ") : [];

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({ type: "start" });
      writer.write({ type: "text-start", id: "0" });

      for (let i = 0; i < tokens.length; i++) {
        // Simulate a connection that dies partway through streaming.
        if (fail === "mid_stream" && i === 4) {
          throw new Error(
            "Simulated mid-stream failure: connection dropped after partial output."
          );
        }
        const chunk = i === 0 ? tokens[i] : " " + tokens[i];
        writer.write({ type: "text-delta", id: "0", delta: chunk });
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      writer.write({ type: "text-end", id: "0" });
    },
    onError: (error) => {
      // Never leak raw error internals to the client - return a stable message.
      return error instanceof Error
        ? error.message
        : "An unexpected error occurred while streaming the response.";
    },
  });

  return createUIMessageStreamResponse({ stream });
}
