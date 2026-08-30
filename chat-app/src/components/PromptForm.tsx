import { useState, FormEvent } from "react";

export interface PromptFormProps {
  onSubmit: (prompt: string) => void;
}

export function PromptForm({ onSubmit }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (trimmed.length === 0) {
      setError("Message can't be empty.");
      return;
    }
    if (trimmed.length > 500) {
      setError("Message must be under 500 characters.");
      return;
    }
    setError(null);
    onSubmit(trimmed);
    setPrompt("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="prompt-input">Message</label>
      <textarea
        id="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "prompt-error" : undefined}
      />
      {error && (
        <p id="prompt-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit">Send</button>
    </form>
  );
}
