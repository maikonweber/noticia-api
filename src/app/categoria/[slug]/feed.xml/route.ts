import {
  buildCategoryChannel,
  feedErrorResponse,
  isCategory,
  rssResponse,
} from "@/lib/feeds";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!isCategory(slug)) {
    return new Response("Categoria não encontrada", { status: 404 });
  }
  try {
    return rssResponse(await buildCategoryChannel(slug));
  } catch {
    return feedErrorResponse();
  }
}
