import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
  "rib",
  "iban",
  "bic",
  "paymentLink",
  "titulaireRib",
];

const CHAMPS_NOMBRE: (keyof Settings)[] = [
  "tauxAnnuel",
  "montantMin",
  "montantMax",
  "dureeMin",
  "dureeMax",
  "fraisDossier",
];

export async function GET() {
  try {
    return NextResponse.json({ settings: await getSettings() });
  } catch {
    return NextResponse.json(
      { error: "Les paramètres sont temporairement indisponibles. Vérifiez la connexion au stockage." },
      { status: 503 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Les données envoyées sont invalides." }, { status: 400 });
  }
  const patch: Record<string, unknown> = {};

  for (const champ of CHAMPS_TEXTE) {
    if (typeof body[champ] === "string") {
      patch[champ] = body[champ].trim().slice(0, 300);
    }
  }
  if (typeof patch.paymentLink === "string" && patch.paymentLink) {
    try {
      if (new URL(patch.paymentLink).protocol !== "https:") throw new Error();
    } catch {
      return NextResponse.json(
        { error: "Le lien de paiement doit être une adresse HTTPS valide." },
        { status: 400 }
      );
    }
  }
  for (const champ of CHAMPS_NOMBRE) {
    const n = Number(body[champ]);
    if (Number.isFinite(n) && n >= 0) patch[champ] = n;
  }
  if (body.paymentDisplay === "bank" || body.paymentDisplay === "link") {
    patch.paymentDisplay = body.paymentDisplay;
  }

  if (!patch.societe && typeof body.societe === "string") {
    return NextResponse.json(
      { error: "Le nom de la société ne peut pas être vide." },
      { status: 400 }
    );
  }

  try {
    const settings = await saveSettings(patch);
    revalidatePath("/", "layout");
    return NextResponse.json({ settings });
  } catch {
    console.error("Échec de l’enregistrement des paramètres dans le stockage.");
    return NextResponse.json(
      { error: "Les modifications n’ont pas pu être enregistrées. Vérifiez la configuration du stockage sur l’hébergement, puis réessayez." },
      { status: 500 }
    );
  }
}
