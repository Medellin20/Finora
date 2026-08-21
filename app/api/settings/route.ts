import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSettings, saveSettings } from "@/lib/store";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import type { Settings } from "@/lib/types";

export const dynamic = "force-dynamic";

const CHAMPS_TEXTE: (keyof Settings)[] = [
  "societe",
  "baseline",
  "email",
  "telephone",
  "whatsapp",
  "adresse",
  "horaires",
  "facebook",
  "linkedin",
  "youtube",
];

const CHAMPS_NOMBRE: (keyof Settings)[] = [
  "tauxAnnuel",
  "montantMin",
  "montantMax",
  "dureeMin",
  "dureeMax",
];

export async function GET() {
  return NextResponse.json({ settings: await getSettings() });
}

export async function PUT(request: NextRequest) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};

  for (const champ of CHAMPS_TEXTE) {
    if (typeof body[champ] === "string") {
      patch[champ] = body[champ].trim().slice(0, 300);
    }
  }
  for (const champ of CHAMPS_NOMBRE) {
    const n = Number(body[champ]);
    if (Number.isFinite(n) && n >= 0) patch[champ] = n;
  }

  if (!patch.societe && typeof body.societe === "string") {
    return NextResponse.json(
      { error: "Le nom de la société ne peut pas être vide." },
      { status: 400 }
    );
  }

  const settings = await saveSettings(patch);
  return NextResponse.json({ settings });
}
