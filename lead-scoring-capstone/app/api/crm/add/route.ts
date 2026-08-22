import { addToPipeline } from "@/lib/crm";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  companyName: z.string(),
  tier: z.enum(["A", "B", "C", "D"]),
  score: z.number().min(0).max(100),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const record = await addToPipeline(parsed.data);
  return NextResponse.json(record);
}
