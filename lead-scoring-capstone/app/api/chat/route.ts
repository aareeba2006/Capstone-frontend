import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { leadTools } from "@/lib/tools/lead-tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system:
      "You are a sales-ops assistant that scores inbound leads. " +
      "When the user describes a lead, ask for any missing fields " +
      "(company name, industry, company size, contact role, budget, engagement level), " +
      "then call scoreLead. If the resulting tier is A or B, propose adding the lead " +
      "to the CRM and call addLeadToCrm — that tool always requires the user's explicit " +
      "confirmation in the UI before anything is written.",
    messages: convertToModelMessages(messages),
    tools: leadTools,
  });

  return result.toUIMessageStreamResponse();
}
