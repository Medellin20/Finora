import { promises as fs } from "fs";
import path from "path";
import { getStore } from "@netlify/blobs";
import type { Demande, Settings } from "./types";

/**
 * Stockage fichier (JSON) volontairement isolé dans ce module.
 * Pour passer en production sur un hébergement sans disque persistant
 * (Vercel, Netlify...), il suffit de réécrire les 6 fonctions exportées
 * ci-dessous avec Prisma / Supabase / MongoDB — le reste du code ne bouge pas.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DEMANDES_FILE = path.join(DATA_DIR, "demandes.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const NETLIFY_STORE = "finora-data";

function useNetlifyBlobs() {
  // `NETLIFY` est surtout garanti pendant le build et peut être absent dans
  // la fonction Next.js à l'exécution. Netlify injecte en revanche ce contexte
  // dans ses fonctions pour permettre à @netlify/blobs de s'authentifier.
  const globalContext = (
    globalThis as typeof globalThis & { netlifyBlobsContext?: unknown }
  ).netlifyBlobsContext;
  return Boolean(process.env.NETLIFY_BLOBS_CONTEXT || globalContext);
}

function blobStore() {
  return getStore({ name: NETLIFY_STORE, consistency: "strong" });
}

export const DEFAULT_SETTINGS: Settings = {
  societe: "Finora",
  baseline: "Courtier en crédit en ligne",
  email: "contact@finora.mn",
  telephone: "+976 7000 0000",
  whatsapp: "+976 7000 0000",
  adresse: "District de Sükhbaatar, Oulan-Bator, Mongolie",
  horaires: "Lundi au vendredi, 8h – 18h",
  facebook: "https://facebook.com/",
  linkedin: "https://linkedin.com/",
  youtube: "",
  tauxAnnuel: 7.9,
  montantMin: 500000,
  montantMax: 150000000,
  dureeMin: 12,
  dureeMax: 120,
  devise: "MNT",
  updatedAt: new Date().toISOString(),
};

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

/* ---------- Demandes ---------- */

export async function listDemandes(): Promise<Demande[]> {
  if (useNetlifyBlobs()) {
    const store = blobStore();
    const { blobs } = await store.list({ prefix: "demandes/", paginate: false });
    const items = await Promise.all(
      blobs.map((blob) =>
        store.get(blob.key, { type: "json", consistency: "strong" })
      )
    );
    return (items.filter(Boolean) as Demande[]).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }
  const items = await readJson<Demande[]>(DEMANDES_FILE, []);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createDemande(
  data: Omit<Demande, "id" | "createdAt" | "statut" | "note">
): Promise<Demande> {
  const demande: Demande = {
    ...data,
    id: `DEM-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    statut: "nouvelle",
    note: "",
  };
  if (useNetlifyBlobs()) {
    await blobStore().setJSON(`demandes/${demande.id}`, demande, {
      onlyIfNew: true,
    });
    return demande;
  }
  const items = await readJson<Demande[]>(DEMANDES_FILE, []);
  items.push(demande);
  await writeJson(DEMANDES_FILE, items);
  return demande;
}

export async function updateDemande(
  id: string,
  patch: Partial<Pick<Demande, "statut" | "note">>
): Promise<Demande | null> {
  if (useNetlifyBlobs()) {
    const store = blobStore();
    const key = `demandes/${id}`;
    const current = (await store.get(key, {
      type: "json",
      consistency: "strong",
    })) as Demande | null;
    if (!current) return null;
    const next = { ...current, ...patch };
    await store.setJSON(key, next);
    return next;
  }
  const items = await readJson<Demande[]>(DEMANDES_FILE, []);
  const index = items.findIndex((d) => d.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...patch };
  await writeJson(DEMANDES_FILE, items);
  return items[index];
}

export async function deleteDemande(id: string): Promise<boolean> {
  if (useNetlifyBlobs()) {
    const store = blobStore();
    const key = `demandes/${id}`;
    const current = await store.getMetadata(key, { consistency: "strong" });
    if (!current) return false;
    await store.delete(key);
    return true;
  }
  const items = await readJson<Demande[]>(DEMANDES_FILE, []);
  const next = items.filter((d) => d.id !== id);
  if (next.length === items.length) return false;
  await writeJson(DEMANDES_FILE, next);
  return true;
}

/* ---------- Paramètres ---------- */

export async function getSettings(): Promise<Settings> {
  if (useNetlifyBlobs()) {
    const stored = (await blobStore().get("settings", {
      type: "json",
      consistency: "strong",
    })) as Partial<Settings> | null;
    return { ...DEFAULT_SETTINGS, ...(stored ?? {}) };
  }
  const stored = await readJson<Partial<Settings>>(SETTINGS_FILE, {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  if (useNetlifyBlobs()) {
    await blobStore().setJSON("settings", next);
    return next;
  }
  await writeJson(SETTINGS_FILE, next);
  return next;
}
