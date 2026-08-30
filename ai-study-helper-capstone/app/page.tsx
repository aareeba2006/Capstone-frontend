"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askAI(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAnswer("");

    if (!question.trim()) {
      setError("Please enter a question before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to get a response.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="card">
        <h1>AI Study Helper</h1>
        <p className="intro">Ask a study question and get a clear, beginner-friendly explanation.</p>

        <form onSubmit={askAI}>
          <label htmlFor="question">Your question</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Explain binary search in simple words."
            rows={5}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </form>

        {error && <p className="error" role="alert">{error}</p>}

        {answer && (
          <section className="answer" aria-live="polite">
            <h2>Answer</h2>
            <p>{answer}</p>
          </section>
        )}
      </section>
    </main>
  );
}
