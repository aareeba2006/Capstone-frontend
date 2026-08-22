import { useState } from "react";

type Input = { companyName: string; tier: "A" | "B" | "C" | "D"; score: number };

export function ConfirmAddToCrm({
  input,
  onSubmit,
}: {
  input: Input;
  onSubmit: (result: { status: "added"; id: string } | { status: "declined" }) => void;
}) {
  const [pending, setPending] = useState<"approve" | "decline" | null>(null);

  async function approve() {
    setPending("approve");
    const res = await fetch("/api/crm/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const record = await res.json();
    onSubmit({ status: "added", id: record.id });
  }

  function decline() {
    setPending("decline");
    onSubmit({ status: "declined" });
  }

  return (
    <div className="my-2 max-w-md rounded-lg border border-signal/30 bg-signal/5 p-4">
      <p className="text-sm font-medium text-ink">
        Add <span className="font-semibold">{input.companyName}</span> (Tier {input.tier}, score{" "}
        {input.score}) to the CRM pipeline?
      </p>
      <p className="mt-1 text-xs text-ink/50">This writes a real record. Confirm before it runs.</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={approve}
          disabled={pending !== null}
          className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {pending === "approve" ? "Adding…" : "Approve"}
        </button>
        <button
          onClick={decline}
          disabled={pending !== null}
          className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-ink disabled:opacity-50"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
