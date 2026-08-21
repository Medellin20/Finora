import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createDemande, listDemandes } from "@/lib/store";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

function texte(value: unknown, max = 400) {
  return String(value ?? "").trim().slice(0, max);
}

function nombre(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Dépôt d'un dossier — public. */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Requête illisible." },
      { status: 400 }
    );
  }

  const email = texte(body.email, 160);
  const nom = texte(body.nom, 80);
  const telephone = texte(body.telephone, 40);
  const montant = nombre(body.montant);

  if (!nom || !telephone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Nom, téléphone et e-mail valide sont requis." },
      { status: 400 }
    );
  }
  if (!montant) {
    return NextResponse.json(
      { error: "Indiquez un montant supérieur à zéro." },
      { status: 400 }
    );
  }

  const demande = await createDemande({
    typePret: texte(body.typePret, 60),
    montant,
    duree: nombre(body.duree) || 12,
    pays: texte(body.pays, 80),
    ville: texte(body.ville, 80),
    adresse: texte(body.adresse, 200),
    logement: texte(body.logement, 40),
    situationPro: texte(body.situationPro, 60),
    revenuMensuel: nombre(body.revenuMensuel),
    situationFamiliale: texte(body.situationFamiliale, 40),
    civilite: texte(body.civilite, 20),
    nom,
    prenom: texte(body.prenom, 80),
    dateNaissance: texte(body.dateNaissance, 20),
    nationalite: texte(body.nationalite, 60),
    telephone,
    email,
    message: texte(body.message, 2000),
  });

  return NextResponse.json({ id: demande.id }, { status: 201 });
}

/** Liste des dossiers — réservé à l'admin. */
export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  return NextResponse.json({ demandes: await listDemandes() });
}
