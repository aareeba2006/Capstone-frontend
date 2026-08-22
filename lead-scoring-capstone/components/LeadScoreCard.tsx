type ScoreOutput = {
  companyName: string;
  industry: string;
  score: number;
  tier: "A" | "B" | "C" | "D";
  reasons: string[];
  recommendation: string;
};

const tierStyles: Record<ScoreOutput["tier"], { ring: string; text: string; bg: string; label: string }> = {
  A: { ring: "ring-tierA", text: "text-tierA", bg: "bg-tierA/10", label: "Tier A — Hot" },
  B: { ring: "ring-tierB", text: "text-tierB", bg: "bg-tierB/10", label: "Tier B — Warm" },
  C: { ring: "ring-tierC", text: "text-tierC", bg: "bg-tierC/10", label: "Tier C — Cool" },
  D: { ring: "ring-tierD", text: "text-tierD", bg: "bg-tierD/10", label: "Tier D — Low priority" },
};

export function LeadScoreCard({ output }: { output: ScoreOutput }) {
  const style = tierStyles[output.tier];

  return (
    <div className="my-2 max-w-md rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-ink">{output.companyName}</p>
          <p className="text-xs text-ink/50">{output.industry}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${style.bg} ${style.text}`}
        >
          {style.label}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ring-2 ${style.ring}`}>
          <span className={`font-mono text-lg font-bold ${style.text}`}>{output.score}</span>
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
          <div
            className={`h-full rounded-full ${style.text.replace("text-", "bg-")}`}
            style={{ width: `${output.score}%` }}
          />
        </div>
      </div>

      <ul className="mt-4 space-y-1 border-t border-line pt-3">
        {output.reasons.map((reason, i) => (
          <li key={i} className="font-mono text-xs text-ink/60">
            {reason}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-sm text-ink">{output.recommendation}</p>
    </div>
  );
}
