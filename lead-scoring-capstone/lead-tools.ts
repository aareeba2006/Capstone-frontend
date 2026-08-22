import { tool } from "ai";
import { z } from "zod";

/**
 * scoreLead
 * ---------
 * Fully server-executed tool. The model gathers the lead's details from the
 * conversation, calls this tool, and we run deterministic scoring logic
 * (no model involved in the math itself) so results are stable and auditable.
 */
export const scoreLead = tool({
  description:
    "Score a sales lead from 0-100 using firmographic and behavioral signals. " +
    "Returns a numeric score, a letter tier (A-D), the point breakdown, and a next-step recommendation. " +
    "Call this whenever the user describes a lead they want evaluated.",
  inputSchema: z.object({
    companyName: z.string().min(1).describe("Name of the lead's company"),
    industry: z.string().min(1).describe("Industry vertical, e.g. 'fintech', 'healthcare'"),
    companySize: z
      .enum(["1-10", "11-50", "51-200", "201-1000", "1000+"])
      .describe("Employee headcount bracket"),
    role: z.string().min(1).describe("Job title of the contact, e.g. 'VP of Sales'"),
    budget: z.number().min(0).describe("Stated or estimated budget in USD"),
    engagement: z
      .enum(["cold", "warm", "hot"])
      .describe("Current engagement level: cold (no response yet), warm (replied/attended a call), hot (actively requesting next steps)"),
  }),
  execute: async ({ companyName, industry, companySize, role, budget, engagement }) => {
    const reasons: string[] = [];
    let score = 0;

    const sizePoints: Record<typeof companySize, number> = {
      "1-10": 5,
      "11-50": 12,
      "51-200": 20,
      "201-1000": 28,
      "1000+": 22,
    };
    score += sizePoints[companySize];
    reasons.push(`Company size ${companySize} → ${sizePoints[companySize]} pts`);

    const seniorTitle = /(chief|vp|vice president|head|director|founder|ceo|cto|coo|cmo)/i;
    const rolePoints = seniorTitle.test(role) ? 25 : 10;
    score += rolePoints;
    reasons.push(`Role "${role}" → ${rolePoints} pts`);

    const budgetPoints = Math.min(25, Math.round(budget / 2000));
    score += budgetPoints;
    reasons.push(`Budget $${budget.toLocaleString()} → ${budgetPoints} pts`);

    const engagementPoints = { cold: 5, warm: 15, hot: 25 } as const;
    score += engagementPoints[engagement];
    reasons.push(`Engagement "${engagement}" → ${engagementPoints[engagement]} pts`);

    score = Math.max(0, Math.min(100, score));
    const tier = score >= 75 ? "A" : score >= 50 ? "B" : score >= 25 ? "C" : "D";

    const recommendation =
      tier === "A"
        ? "Fast-track to an AE and schedule a demo within 48 hours."
        : tier === "B"
        ? "Nurture with relevant case studies, follow up within a week."
        : tier === "C"
        ? "Add to the drip campaign, revisit in a month."
        : "Low priority — monitor for future signals, no active outreach.";

    return {
      companyName,
      industry,
      score,
      tier,
      reasons,
      recommendation,
    };
  },
});

/**
 * addLeadToCrm
 * ------------
 * Human-in-the-loop tool: deliberately has NO `execute` function.
 * The model can still call it (it appears in `tools`), but because there's
 * no execute, the AI SDK pauses the tool call in the `input-available`
 * state and waits for the client to submit a result via `addToolResult`.
 * The UI renders a confirmation card; only a user click actually runs
 * the "write" (here, a mock CRM insert).
 */
export const addLeadToCrm = tool({
  description:
    "Add a scored lead to the CRM pipeline. This performs a real write action, " +
    "so it must never run without explicit user confirmation. Only call this " +
    "after scoreLead has returned a tier of A or B.",
  inputSchema: z.object({
    companyName: z.string(),
    tier: z.enum(["A", "B", "C", "D"]),
    score: z.number().min(0).max(100),
  }),
});

export const leadTools = {
  scoreLead,
  addLeadToCrm,
};
