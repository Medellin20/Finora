import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteDemande, updateDemande } from "@/lib/store";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import type { DemandeStatut } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUTS_VALIDES: DemandeStatut[] = [
  "nouvelle",
  "en_cours",
  "acceptee",
  "refusee",
  "archivee",
];

async function estAdmin() {
  return verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await estAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const patch: { statut?: DemandeStatut; note?: string } = {};

  if (body.statut) {
    if (!STATUTS_VALIDES.includes(body.statut)) {
      return NextResponse.json({ error: "Statut inconnu." }, { status: 400 });
    }
    patch.statut = body.statut;
  }
  if (typeof body.note === "string") {
    patch.note = body.note.slice(0, 2000);
  }

  const demande = await updateDemande(params.id, patch);
  if (!demande) {
    return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
  }
  return NextResponse.json({ demande });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await estAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const ok = await deleteDemande(params.id);
  if (!ok) {
    return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
