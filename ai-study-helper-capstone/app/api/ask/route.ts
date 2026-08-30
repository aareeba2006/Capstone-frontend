import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Please provide a valid question." }, { status: 400 });
    }

    if (question.length > 1000) {
      return NextResponse.json({ error: "Please keep your question under 1000 characters." }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured. Add the API key in the deployment settings." },
        { status: 503 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 500,
      system: "You are a helpful study assistant. Give accurate, clear, beginner-friendly answers. If you are unsure, say so instead of inventing information.",
      messages: [{ role: "user", content: question.trim() }]
    });

    const text = message.content.find((item) => item.type === "text");
    const answer = text && text.type === "text" ? text.text : "Sorry, I could not generate an answer.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "The AI service is temporarily unavailable. Please try again later." },
      { status: 500 }
    );
  }
}
