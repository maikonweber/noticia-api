import type { NextRequest } from "next/server";
import { buildVulnChannel, feedErrorResponse, rssResponse } from "@/lib/feeds";

export const dynamic = "force-dynamic";

/** /vulnerabilidades/feed.xml?severity=CRITICAL,HIGH&kev=1 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const kev = ["1", "true", "sim"].includes((sp.get("kev") || "").toLowerCase());
  try {
    return rssResponse(await buildVulnChannel({ severity: sp.get("severity"), kev }));
  } catch {
    return feedErrorResponse();
  }
}
