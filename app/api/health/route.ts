import { NextResponse } from "next/server";

export const dynamic = "force-static";

/** Liveness endpoint for Cloud Run startup and health probes. */
export function GET() {
  return NextResponse.json({ ok: true });
}
