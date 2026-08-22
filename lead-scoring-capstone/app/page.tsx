"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { ToolPartView } from "@/components/ToolPart";

const EXAMPLE =
  "Score this lead: Acme Robotics, mid-market industrial automation company, " +
  "51-200 employees, contact is their VP of Operations, budget around $40k, " +
  "and they've been warm — replied to our last two emails.";

export default function Chat() {
  const { messages, sendMessage, addToolResult, status } = useChat();
  const [input, setInput] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <main className="mx-auto flex h-dvh max-w-2xl flex-col bg-paper">
      <header className="border-b border-line px-4 py-3">
        <h1 className="font-display text-sm font-semibold text-ink">Lead Scoring Assistant</h1>
        <p className="text-xs text-ink/50">Describe a lead — the assistant scores it and can add it to the CRM.</p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <button
            onClick={() => sendMessage({ text: EXAMPLE })}
            className="rounded-lg border border-dashed border-line px-3 py-2 text-left text-xs text-ink/50 hover:border-ink/30 hover:text-ink/70"
          >
            Try an example: “{EXAMPLE}”
          </button>
        )}

        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-ink/30">
              {message.role}
            </p>
            {message.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <p key={i} className="whitespace-pre-wrap text-sm text-ink">
                    {part.text}
                  </p>
                );
              }
              if (part.type.startsWith("tool-")) {
                return (
                  <ToolPartView
                    key={i}
                    part={part as any}
                    onCrmResult={(toolCallId, result) =>
                      addToolResult({ tool: "addLeadToCrm", toolCallId, output: result })
                    }
                  />
                );
              }
              return null;
            })}
          </div>
        ))}

        {status === "submitted" && (
          <p className="font-mono text-xs text-ink/40">Thinking…</p>
        )}
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-line p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe a lead…"
          className="flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink/40"
        />
        <button
          type="submit"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          disabled={status !== "ready"}
        >
          Send
        </button>
      </form>
    </main>
  );
}
