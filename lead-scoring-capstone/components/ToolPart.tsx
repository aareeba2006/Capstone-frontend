import { LeadScoreCard } from "./LeadScoreCard";
import { ConfirmAddToCrm } from "./ConfirmAddToCrm";

/**
 * A UIMessage tool part looks like:
 *   { type: 'tool-scoreLead', toolCallId, state, input?, output?, errorText? }
 *
 * `state` walks through, in order:
 *   'input-streaming'  -> the model is still generating arguments
 *   'input-available'  -> arguments are complete; execute() is running
 *                         (or, for tools with no execute, we're waiting on the human)
 *   'output-available' -> execute() returned a result
 *   'output-error'     -> execute() threw, or the human declined
 */
type ToolPart = {
  type: string; // e.g. "tool-scoreLead" | "tool-addLeadToCrm"
  toolCallId: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  input?: any;
  output?: any;
  errorText?: string;
};

export function ToolPartView({
  part,
  onCrmResult,
}: {
  part: ToolPart;
  onCrmResult: (toolCallId: string, result: any) => void;
}) {
  const toolName = part.type.replace(/^tool-/, "");

  // --- input-streaming: arguments are still being generated -----------------
  if (part.state === "input-streaming") {
    return (
      <div className="my-2 flex max-w-md animate-pulse items-center gap-2 rounded-lg border border-line bg-white p-3">
        <span className="h-2 w-2 rounded-full bg-ink/30" />
        <span className="font-mono text-xs text-ink/50">
          Preparing {toolName}{part.input ? `: ${Object.keys(part.input).length} field(s) so far` : "…"}
        </span>
      </div>
    );
  }

  // --- input-available: args are ready, execute() is running / awaiting human
  if (part.state === "input-available") {
    if (toolName === "addLeadToCrm") {
      return (
        <ConfirmAddToCrm
          input={part.input}
          onSubmit={(result) => onCrmResult(part.toolCallId, result)}
        />
      );
    }
    return (
      <div className="my-2 flex max-w-md items-center gap-2 rounded-lg border border-line bg-white p-3">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-ink/20 border-t-ink/60" />
        <span className="font-mono text-xs text-ink/60">Running {toolName}…</span>
      </div>
    );
  }

  // --- output-available: execute() (or the human) returned a result ---------
  if (part.state === "output-available") {
    if (toolName === "scoreLead") {
      return <LeadScoreCard output={part.output} />;
    }
    if (toolName === "addLeadToCrm") {
      return part.output?.status === "added" ? (
        <div className="my-2 max-w-md rounded-lg border border-tierA/30 bg-tierA/5 p-3 font-mono text-xs text-tierA">
          Added to pipeline — record {part.output.id}
        </div>
      ) : (
        <div className="my-2 max-w-md rounded-lg border border-line bg-white p-3 font-mono text-xs text-ink/50">
          Declined — no record created
        </div>
      );
    }
    return (
      <pre className="my-2 max-w-md overflow-x-auto rounded-lg border border-line bg-white p-3 text-xs">
        {JSON.stringify(part.output, null, 2)}
      </pre>
    );
  }

  // --- output-error: execute() threw ----------------------------------------
  if (part.state === "output-error") {
    return (
      <div className="my-2 max-w-md rounded-lg border border-signal/40 bg-signal/5 p-3">
        <p className="font-mono text-xs font-medium text-signal">{toolName} failed</p>
        <p className="mt-1 text-xs text-signal/80">{part.errorText ?? "Unknown error"}</p>
      </div>
    );
  }

  return null;
}
