export type MessagePart =
  | { type: "text"; text: string }
  | { type: "tool-call"; toolName: string; input: Record<string, unknown> }
  | { type: "tool-result"; toolName: string; output: string }
  | { type: "error"; message: string };

export interface ChatMessageProps {
  role: "user" | "assistant";
  parts: MessagePart[];
}

export function ChatMessage({ role, parts }: ChatMessageProps) {
  return (
    <article aria-label={`${role} message`} role="group">
      {parts.map((part, i) => {
        switch (part.type) {
          case "text":
            return <p key={i}>{part.text}</p>;
          case "tool-call":
            return (
              <p key={i} role="status">
                Calling tool: {part.toolName}
              </p>
            );
          case "tool-result":
            return (
              <pre key={i} aria-label={`${part.toolName} result`}>
                {part.output}
              </pre>
            );
          case "error":
            return (
              <p key={i} role="alert">
                {part.message}
              </p>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
