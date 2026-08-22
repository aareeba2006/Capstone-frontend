// Mock CRM store. Swap this for a real CRM API call (HubSpot, Salesforce, etc.)
// The point is: this function only ever runs after a human has clicked "Approve".

type CrmRecord = {
  id: string;
  companyName: string;
  tier: "A" | "B" | "C" | "D";
  score: number;
  addedAt: string;
};

const pipeline: CrmRecord[] = [];

export async function addToPipeline(input: {
  companyName: string;
  tier: "A" | "B" | "C" | "D";
  score: number;
}): Promise<CrmRecord> {
  // simulate network latency of a real CRM write
  await new Promise((r) => setTimeout(r, 600));

  const record: CrmRecord = {
    id: `lead_${Math.random().toString(36).slice(2, 9)}`,
    ...input,
    addedAt: new Date().toISOString(),
  };
  pipeline.push(record);
  return record;
}
