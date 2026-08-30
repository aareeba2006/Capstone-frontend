export interface ToolResultCardProps {
  toolName: string;
  status: "success" | "error";
  output: string;
}

export function ToolResultCard({ toolName, status, output }: ToolResultCardProps) {
  return (
    <section aria-label={`${toolName} result`}>
      <h3>{toolName}</h3>
      {status === "success" ? (
        <p role="status">Completed</p>
      ) : (
        <p role="alert">Failed</p>
      )}
      <pre>{output}</pre>
    </section>
  );
}
