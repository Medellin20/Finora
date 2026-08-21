import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const connecte = await verifySessionToken(token);

  // Déjà connecté : la page de connexion redirige vers le tableau de bord
  if (pathname === "/admin/login") {
    if (connecte) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!connecte) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("suite", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
