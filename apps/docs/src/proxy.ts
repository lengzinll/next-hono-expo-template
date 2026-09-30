import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const backendUrl = process.env.API_URL || "http://localhost:8000";

  const destination = new URL(`${pathname}${search}`, backendUrl);

  return NextResponse.rewrite(destination);
}

export const config = {
  matcher: "/api/:path*",
};
