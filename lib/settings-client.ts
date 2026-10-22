import type { Settings } from "./types";

export async function enregistrerParametres(patch: Partial<Settings> | Record<string, unknown>): Promise<Settings> {
  const response = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (response.status === 401) {
    throw new Error("Votre session a expiré. Reconnectez-vous à l’administration, puis réessayez.");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || "Enregistrement impossible. Le serveur est indisponible, veuillez réessayer.");
  }
  if (!data?.settings || typeof data.settings !== "object") {
    throw new Error("Le serveur n’a pas confirmé l’enregistrement. Rechargez la page pour vérifier les modifications.");
  }
  return data.settings;
}
