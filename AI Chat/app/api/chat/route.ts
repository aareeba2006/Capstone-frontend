import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { aiModel, AI_SYSTEM_PROMPT } from "@/lib/ai-config";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = (await req.json()) as { messages: UIMessage[] };

  if (!Array.isArray(body.messages)) {
    return Response.json({ error: "Invalid messages payload." }, { status: 400 });
  }

  const result = streamText({
    model: aiModel,
    system: AI_SYSTEM_PROMPT,
    messages: await convertToModelMessages(body.messages),
  });

  return result.toUIMessageStreamResponse();
}
