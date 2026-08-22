"use client";

import { useEffect } from "react";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app: send this to your error-tracking service.
    console.error("Chat route error:", error);
  }, [error]);

  return (
    <main className="route-error">
      <h1>This page hit a snag</h1>
      <p>
        Something failed while loading the chat. This is a route-level error boundary,
        not the chat&apos;s own retry — it catches failures the page itself
        couldn&apos;t recover from.
      </p>
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}
