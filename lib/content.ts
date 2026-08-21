import type { DemandeStatut } from "./types";

/* ---------- Formatage & calculs financiers ---------- */

export function formatMontant(value: number, devise = "EUR") {
  if (devise === "MNT" || devise === "₮") {
    // Format volontairement déterministe entre Node et le navigateur : les
    // implémentations d'Intl n'affichent pas toutes MNT de la même manière.
    const montant = Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${montant} ₮`;
  }
  if (devise === "EUR" || devise === "€") {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Math.round(value));
  }
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(value))} ${devise}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Mensualité d'un prêt amortissable classique. */
export function mensualite(capital: number, tauxAnnuel: number, mois: number) {
  if (mois <= 0) return 0;
  const t = tauxAnnuel / 100 / 12;
  if (t === 0) return capital / mois;
  return (capital * t) / (1 - Math.pow(1 + t, -mois));
}

export function coutTotal(capital: number, tauxAnnuel: number, mois: number) {
  return mensualite(capital, tauxAnnuel, mois) * mois - capital;
}

/* ---------- Référentiels de formulaire ---------- */

export const TYPES_PRET = [
  "Prêt personnel",
  "Prêt professionnel",
  "Prêt immobilier",
  "Crédit auto",
  "Financement d'entreprise",
  "Rachat de crédits",
  "Trésorerie rapide",
];

export const DUREES = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];

export const LOGEMENTS = ["Locataire", "Propriétaire", "Hébergé"];

export const SITUATIONS_PRO = [
  "Salarié du privé",
  "Agent de la fonction publique",
  "Indépendant / profession libérale",
  "Chef d'entreprise",
  "Retraité",
];

export const SITUATIONS_FAMILIALES = [
  "Célibataire",
  "Marié(e)",
  "Divorcé(e)",
  "Séparé(e)",
  "Veuf / veuve",
];

export const CIVILITES = ["Madame", "Monsieur", "Autre"];

/* ---------- Statuts admin ---------- */

export const STATUTS: Record<
  DemandeStatut,
  { label: string; className: string }
> = {
  nouvelle: { label: "Nouvelle", className: "bg-amber-soft text-ink" },
  en_cours: { label: "En cours", className: "bg-mint text-forest-deep" },
  acceptee: { label: "Acceptée", className: "bg-forest text-mint" },
  refusee: { label: "Refusée", className: "bg-red-100 text-red-800" },
  archivee: { label: "Archivée", className: "bg-line/60 text-ink/60" },
};

/* ---------- Contenu éditorial ---------- */

export const SOLUTIONS = [
  {
    slug: "pret-personnel",
    titre: "Prêt personnel",
    resume:
      "Un budget libre pour vos projets du quotidien : véhicule, travaux, études, événement familial.",
    montant: "500 000 – 30 000 000 ₮",
    duree: "12 à 84 mois",
    points: [
      "Aucun justificatif d'utilisation à fournir",
      "Mensualité fixe connue avant signature",
      "Réponse de principe le jour même",
    ],
  },
  {
    slug: "pret-professionnel",
    titre: "Prêt professionnel",
    resume:
      "Financez votre stock, votre matériel ou votre besoin en fonds de roulement sans bloquer votre trésorerie.",
    montant: "1 000 000 – 80 000 000 ₮",
    duree: "12 à 96 mois",
    points: [
      "Étude basée sur votre chiffre d'affaires réel",
      "Différé de remboursement possible sur 3 mois",
      "Un interlocuteur unique jusqu'au déblocage",
    ],
  },
  {
    slug: "pret-immobilier",
    titre: "Prêt immobilier",
    resume:
      "Achat, construction ou rénovation : nous négocions les conditions auprès de nos banques partenaires.",
    montant: "5 000 000 – 150 000 000 ₮",
    duree: "60 à 120 mois",
    points: [
      "Comparaison de plusieurs offres bancaires",
      "Accompagnement jusqu'à la signature notariée",
      "Assurance emprunteur négociée séparément",
    ],
  },
];

export const ETAPES = [
  {
    titre: "Vous simulez",
    texte:
      "Ajustez le montant et la durée. La mensualité s'affiche immédiatement, sans engagement.",
  },
  {
    titre: "Vous déposez votre dossier",
    texte:
      "Un formulaire unique, en ligne, qui prend moins de cinq minutes à compléter.",
  },
  {
    titre: "Nous étudions",
    texte:
      "Un conseiller analyse votre profil et interroge nos partenaires financiers pour vous.",
  },
  {
    titre: "Vous recevez les fonds",
    texte:
      "Après signature électronique, le virement est déclenché sous 72 heures ouvrées.",
  },
];

export const TEMOIGNAGES = [
  {
    nom: "Bolormaa B.",
    role: "Commerçante, Oulan-Bator",
    texte:
      "J'ai monté mon dossier un mardi soir, j'avais une réponse le lendemain matin. Le conseiller m'a expliqué chaque ligne du contrat.",
  },
  {
    nom: "Temüülen G.",
    role: "Artisan menuisier, Erdenet",
    texte:
      "J'avais besoin d'une machine avant la haute saison. Le différé de trois mois m'a permis de produire avant de commencer à rembourser.",
  },
  {
    nom: "Sarangerel D.",
    role: "Infirmière libérale, Darkhan",
    texte:
      "Trois offres comparées côte à côte, avec le coût total affiché. J'ai choisi en connaissance de cause, sans pression.",
  },
  {
    nom: "Bat-Erdene N.",
    role: "Gérant de PME, Oulan-Bator",
    texte:
      "Le suivi est clair : à chaque étape je savais où en était mon dossier. Rien à voir avec mes démarches précédentes.",
  },
  {
    nom: "Enkhjin T.",
    role: "Enseignante, Kharkhorin",
    texte:
      "Un seul justificatif d'identité et mon relevé bancaire. La mensualité annoncée est exactement celle que je paie.",
  },
];

export const FAQ = [
  {
    question: "Qui est BOULANGER FINANCE INTER exactement ?",
    reponse:
      "BOULANGER FINANCE INTER est un cabinet de courtage en financement. Nous ne prêtons pas nos propres fonds : nous montons votre dossier, puis nous le présentons à nos établissements partenaires pour obtenir les meilleures conditions selon votre profil.",
  },
  {
    question: "Combien puis-je emprunter ?",
    reponse:
      "De 500 000 à 150 000 000 ₮ selon le type de projet et votre capacité de remboursement. Si le montant demandé ne passe pas, nous vous proposons une alternative chiffrée plutôt qu'un simple refus.",
  },
  {
    question: "Comment êtes-vous rémunérés ?",
    reponse:
      "Uniquement au succès, par des frais de dossier facturés lorsque le financement est effectivement débloqué. Aucun frais n'est prélevé pour une simulation ou une étude qui n'aboutit pas.",
  },
  {
    question: "Quelles sont les conditions pour déposer un dossier ?",
    reponse:
      "Être majeur, disposer de revenus réguliers démontrables, d'un compte bancaire ou mobile money à votre nom, ainsi que d'une adresse e-mail et d'un numéro de téléphone valides.",
  },
  {
    question: "Puis-je tout faire à distance ?",
    reponse:
      "Oui. Le dépôt du dossier, l'envoi des pièces justificatives et la signature du contrat se font en ligne. Un rendez-vous téléphonique est proposé avant toute signature.",
  },
  {
    question: "Quels documents dois-je fournir ?",
    reponse:
      "Une pièce d'identité en cours de validité, un justificatif de revenus des trois derniers mois et un relevé de compte. Des pièces complémentaires peuvent être demandées pour un dossier immobilier ou professionnel.",
  },
];
