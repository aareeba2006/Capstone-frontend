"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSkeleton } from "@/components/MessageSkeleton";
import { EmptyState } from "@/components/EmptyState";

// Sabotage modes let you deliberately trigger every failure case in the
// assignment without needing a real flaky API. Selecting one appends
// ?fail=<mode> to the chat API request. "none" is the happy path.
const SABOTAGE_MODES = [
  { value: "none", label: "Happy path" },
  { value: "rate_limit", label: "Rate limit (429)" },
  { value: "server_error", label: "Server error (500)" },
  { value: "mid_stream", label: "Mid-stream failure" },
  { value: "timeout", label: "Slow / hung response" },
  { value: "empty", label: "Empty result" },
] as const;

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageInner />
    </Suspense>
  );
}

function ChatPageInner() {
  // Deliberate trigger for testing the app/chat/error.tsx boundary itself:
  // visiting /chat?routeError=1 throws during render, on purpose.
  // Client components read the URL via useSearchParams, not a searchParams prop.
  const params = useSearchParams();
  if (params.get("routeError") === "1") {
    throw new Error("Simulated route-level render failure (test of error.tsx).");
  }

  const [sabotage, setSabotage] = useState<string>("none");
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: sabotage === "none" ? "/api/chat" : `/api/chat?fail=${sabotage}`,
      }),
    [sabotage]
  );

  const { messages, sendMessage, status, error, clearError, regenerate } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  function handleRetry() {
    clearError();
    regenerate();
  }

  return (
    <main className="chat-page">
      <header className="chat-header">
        <h1>Support chat</h1>
        <label className="sabotage-select">
          Test mode:
          <select value={sabotage} onChange={(e) => setSabotage(e.target.value)}>
            {SABOTAGE_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="chat-body">
        {!hasMessages && !isLoading && !error && (
          <EmptyState
            title="Nothing here yet"
            description="Ask a question below to get started - this is a first-run empty state, not a broken page."
          />
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.role}`}>
            <div className="message-role">{message.role === "user" ? "You" : "Assistant"}</div>
            <div className="message-content">
              {message.parts.map((part, i) =>
                part.type === "text" ? <span key={i}>{part.text}</span> : null
              )}
            </div>
          </div>
        ))}

        {isLoading && <MessageSkeleton />}

        {!isLoading && hasMessages && !error && messages[messages.length - 1]?.role === "assistant" &&
          messages[messages.length - 1]?.parts.every((p) => p.type === "text" && p.text.trim() === "") && (
            <EmptyState
              title="No response came back"
              description="The request completed but returned no content. Try rephrasing your question."
              actionLabel="Try again"
              onAction={handleRetry}
            />
        )}

        {error && (
          <div className="error-banner" role="alert">
            <p className="error-title">Something went wrong</p>
            <p className="error-message">{error.message}</p>
            <button className="retry-button" onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          aria-label="Message"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}
