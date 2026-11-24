import {
  buildCategoryChannel,
  feedErrorResponse,
  isCategory,
  rssResponse,
} from "@/lib/feeds";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!isCategory(slug)) {
    return new Response("Categoria não encontrada", { status: 404 });
  }
  const topic =
    new URL(request.url).searchParams.get("topic") === "one-piece"
      ? "one-piece" as const
      : undefined;
  try {
    return rssResponse(await buildCategoryChannel(slug, { topic }));
  } catch {
    return feedErrorResponse();
  }
}
