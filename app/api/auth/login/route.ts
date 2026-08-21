import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, checkPassword, createSessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const motDePasse = String(body.password ?? "");

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      {
        error:
          "Aucun mot de passe admin configuré. Renseignez ADMIN_PASSWORD dans .env.local.",
      },
      { status: 500 }
    );
  }

  if (!checkPassword(motDePasse)) {
    // Léger délai : limite les tentatives automatisées
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(
      { error: "Mot de passe incorrect." },
      { status: 401 }
    );
  }

  const { value, maxAge } = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return response;
}
