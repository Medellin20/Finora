"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert, Save } from "lucide-react";
import type { Settings } from "@/lib/types";

export default function FormulaireParametres({
  initiales,
}: {
  initiales: Settings;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Settings>(initiales);
  const [envoi, setEnvoi] = useState(false);
  const [etat, setEtat] = useState<"idle" | "ok" | "erreur">("idle");
  const [message, setMessage] = useState("");

  const set =
    (name: keyof Settings) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEtat("idle");
      setForm((f) => ({ ...f, [name]: e.target.value }));
    };

  async function enregistrer() {
    setEnvoi(true);
    setEtat("idle");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enregistrement impossible.");
      setForm(data.settings);
      setEtat("ok");
      setMessage("Coordonnées mises à jour sur tout le site.");
      router.refresh();
    } catch (e) {
      setEtat("erreur");
      setMessage(
        e instanceof Error ? e.message : "Enregistrement impossible."
      );
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
      <div className="space-y-5">
        <Section
          titre="Identité"
          description="Affichée dans l'en-tête, le pied de page et les titres de pages."
        >
          <Champ label="Nom de la société" value={form.societe} onChange={set("societe")} />
          <Champ label="Signature / baseline" value={form.baseline} onChange={set("baseline")} />
        </Section>

        <Section
          titre="Coordonnées"
          description="Reprises automatiquement dans le pied de page, l'en-tête et la page Contact."
        >
          <Champ label="Téléphone" value={form.telephone} onChange={set("telephone")} />
          <Champ label="WhatsApp" value={form.whatsapp} onChange={set("whatsapp")} />
          <Champ label="E-mail" type="email" value={form.email} onChange={set("email")} />
          <Champ label="Horaires" value={form.horaires} onChange={set("horaires")} />
          <Champ
            label="Adresse"
            value={form.adresse}
            onChange={set("adresse")}
            large
          />
        </Section>

        <Section
          titre="Réseaux sociaux"
          description="Laissez un champ vide pour masquer l'icône correspondante."
        >
          <Champ label="Facebook" value={form.facebook} onChange={set("facebook")} placeholder="https://…" />
          <Champ label="LinkedIn" value={form.linkedin} onChange={set("linkedin")} placeholder="https://…" />
          <Champ label="YouTube" value={form.youtube} onChange={set("youtube")} placeholder="https://…" />
        </Section>

        <Section
          titre="Paramètres du simulateur"
          description="Bornes des curseurs et taux utilisé pour estimer les mensualités."
        >
          <Champ
            label="Taux annuel (%)"
            type="number"
            step="0.1"
            value={String(form.tauxAnnuel)}
            onChange={set("tauxAnnuel")}
          />
          <Champ
            label="Montant minimum"
            type="number"
            value={String(form.montantMin)}
            onChange={set("montantMin")}
          />
          <Champ
            label="Montant maximum"
            type="number"
            value={String(form.montantMax)}
            onChange={set("montantMax")}
          />
          <Champ
            label="Durée minimum (mois)"
            type="number"
            value={String(form.dureeMin)}
            onChange={set("dureeMin")}
          />
          <Champ
            label="Durée maximum (mois)"
            type="number"
            value={String(form.dureeMax)}
            onChange={set("dureeMax")}
          />
        </Section>
      </div>

      <div className="card sticky top-24 p-6">
        <h2 className="text-[16px] font-bold">Publier les changements</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink/60">
          Les modifications s&apos;appliquent immédiatement à toutes les pages
          publiques du site.
        </p>

        <button
          type="button"
          onClick={enregistrer}
          disabled={envoi}
          className="btn-primary mt-5 w-full"
        >
          <Save size={16} />
          {envoi ? "Enregistrement…" : "Enregistrer"}
        </button>

        <AnimatePresence>
          {etat !== "idle" && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className={`mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px] ${
                etat === "ok"
                  ? "bg-mint text-forest-deep"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {etat === "ok" ? (
                <Check size={15} className="mt-0.5 shrink-0" />
              ) : (
                <CircleAlert size={15} className="mt-0.5 shrink-0" />
              )}
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-5 border-t border-line pt-4 font-mono text-[11.5px] text-ink/40">
          Dernière modification
          <br />
          {new Date(form.updatedAt).toLocaleString("fr-FR")}
        </p>
      </div>
    </div>
  );
}

function Section({
  titre,
  description,
  children,
}: {
  titre: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-7">
      <h2 className="text-[17px] font-bold">{titre}</h2>
      <p className="mt-1.5 text-[13.5px] text-ink/55">{description}</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Champ({
  label,
  large = false,
  ...rest
}: {
  label: string;
  large?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className={large ? "sm:col-span-2" : ""}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="field" {...rest} />
    </div>
  );
}
