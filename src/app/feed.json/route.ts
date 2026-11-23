import { buildAllNewsChannel, feedErrorResponse, jsonFeedResponse } from "@/lib/feeds";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return jsonFeedResponse(await buildAllNewsChannel());
  } catch {
    return feedErrorResponse();
  }
}
