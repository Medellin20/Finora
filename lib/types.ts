export type DemandeStatut =
  | "nouvelle"
  | "en_cours"
  | "acceptee"
  | "refusee"
  | "archivee";

export interface Demande {
  id: string;
  createdAt: string;
  statut: DemandeStatut;
  note: string;

  // Projet
  typePret: string;
  montant: number;
  duree: number;

  // Situation
  pays: string;
  ville: string;
  adresse: string;
  logement: string;
  situationPro: string;
  revenuMensuel: number;
  situationFamiliale: string;

  // Identité
  civilite: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  nationalite: string;
  telephone: string;
  email: string;
  message: string;
}

export interface Settings {
  societe: string;
  baseline: string;
  email: string;
  telephone: string;
  whatsapp: string;
  adresse: string;
  horaires: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  tauxAnnuel: number;
  montantMin: number;
  montantMax: number;
  dureeMin: number;
  dureeMax: number;
  devise: string;
  updatedAt: string;
}
