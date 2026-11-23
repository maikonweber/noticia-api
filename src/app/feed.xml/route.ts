import { buildAllNewsChannel, feedErrorResponse, rssResponse } from "@/lib/feeds";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return rssResponse(await buildAllNewsChannel());
  } catch {
    return feedErrorResponse();
  }
}
