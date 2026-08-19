/**
 * Central AI configuration.
 *
 * Keep the model and system prompt here so the API route stays small and
 * changes to the assistant's behavior have one obvious place to live.
 *
 * ANTHROPIC_API_KEY is intentionally read only on the server.
 */
import { anthropic } from "@ai-sdk/anthropic";

export const AI_MODEL = "claude-sonnet-4-5";

export const AI_SYSTEM_PROMPT = `
You are a friendly qualification assistant for a web-development project.
Ask concise, useful questions to understand a user's project needs.
When enough information is available, summarize their goals and recommend
clear next steps. Do not claim to have completed actions you cannot actually do.
`;

export const aiModel = anthropic(AI_MODEL);
