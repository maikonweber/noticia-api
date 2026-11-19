import { NextResponse, type NextRequest } from "next/server";

/**
 * O site não usa Server Actions nem rotas POST. Scanners automáticos (ex.: sondas
 * "React2Shell") mandam POST com header Next-Action e enchiam o log de erros
 * ("Failed to find Server Action", "Expected RSC response"). Rejeita cedo.
 */
export function proxy(request: NextRequest) {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    return new NextResponse(null, { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  if (request.headers.has("next-action")) {
    return new NextResponse(null, { status: 400 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|icon|apple-touch-icon|logo|sw.js|manifest.webmanifest).*)"],
};
