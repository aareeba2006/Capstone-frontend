"use client";

import { useEffect, useRef, useState } from "react";
import { DefaultChatTransport, useChat } from "ai/react";

export default function ChatClient() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  const { messages, sendMessage, stop, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isStreaming = status === "streaming";
  const isWaiting = status === "submitted";

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || userScrolledUp.current) return;

    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  function handleScroll() {
    const element = scrollRef.current;
    if (!element) return;

    const distanceFromBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;

    userScrolledUp.current = distanceFromBottom > 80;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();

    if (!text || isStreaming || isWaiting) return;

    sendMessage({ text });
    setInput("");
    userScrolledUp.current = false;
  }

  return (
    <main className="flex min-h-[calc(100vh-128px)] flex-col bg-slate-50">
      <div className="container-page flex w-full flex-1 flex-col py-6 sm:py-10">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            AI Qualification Chat
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Tell us about your project
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Your conversation is streamed live from Claude. Ask questions,
            answer the assistant, and continue across multiple turns.
          </p>
        </header>

        <section
          ref={scrollRef}
          onScroll={handleScroll}
          aria-label="Conversation"
          className="card min-h-[420px] flex-1 overflow-y-auto p-4 sm:p-6"
        >
          {messages.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  ✦
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  Start the conversation
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Try: “I need a website for my small business.”
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message) => {
                const text = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("");

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                        message.role === "user"
                          ? "rounded-br-md bg-blue-600 text-white"
                          : "rounded-bl-md bg-slate-100 text-slate-800"
                      }`}
                    >
                      <p className="mb-1 text-xs font-semibold opacity-60">
                        {message.role === "user" ? "You" : "Claude"}
                      </p>
                      <p className="whitespace-pre-wrap">
                        {text || (message.role === "assistant" ? " " : "")}
                      </p>
                    </div>
                  </div>
                );
              })}

              {isWaiting && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-500">
                    <span className="inline-flex gap-1" aria-label="Claude is thinking">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce [animation-delay:120ms]">●</span>
                      <span className="animate-bounce [animation-delay:240ms]">●</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            Something went wrong. Check your server-side API key and try again.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="card mt-4 flex items-end gap-2 p-2 sm:p-3"
        >
          <label htmlFor="chat-input" className="sr-only">
            Message
          </label>
          <textarea
            id="chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Type your message..."
            rows={2}
            disabled={isStreaming || isWaiting}
            className="min-h-12 flex-1 resize-none rounded-xl border-0 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />

          {isStreaming || isWaiting ? (
            <button
              type="button"
              onClick={() => stop()}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          )}
        </form>

        <p className="mt-2 text-center text-xs text-slate-400">
          Enter to send · Shift+Enter for a new line
        </p>
      </div>
    </main>
  );
}
