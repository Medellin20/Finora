"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleAlert } from "lucide-react";
import {
  CIVILITES,
  DUREES,
  LOGEMENTS,
  SITUATIONS_FAMILIALES,
  SITUATIONS_PRO,
  TYPES_PRET,
  formatMontant,
  mensualite,
} from "@/lib/content";
import type { Settings } from "@/lib/types";

const ETAPES = ["Votre projet", "Votre situation", "Vos coordonnées"];

const CHAMPS_REQUIS: Record<number, string[]> = {
  0: ["typePret", "montant", "duree"],
  1: ["pays", "ville", "logement", "situationPro", "revenuMensuel"],
  2: ["civilite", "nom", "prenom", "telephone", "email"],
};

type FormState = Record<string, string>;

export default function FormulaireDemande({
  settings,
}: {
  settings: Settings;
}) {
  const params = useSearchParams();
  const reduce = useReducedMotion();

  const [etape, setEtape] = useState(0);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    typePret: TYPES_PRET[0],
    montant: params.get("montant") ?? "5000000",
    duree: params.get("duree") ?? "48",
    pays: "Grèce",
    ville: "",
    adresse: "",
    logement: LOGEMENTS[0],
    situationPro: SITUATIONS_PRO[0],
    revenuMensuel: "",
    situationFamiliale: SITUATIONS_FAMILIALES[0],
    civilite: CIVILITES[0],
    nom: "",
    prenom: "",
    dateNaissance: "",
    nationalite: "",
    telephone: "",
    email: "",
    message: "",
  });

  const set = (name: string) => (value: string) =>
    setForm((f) => ({ ...f, [name]: value }));

  const estimation = mensualite(
    Number(form.montant) || 0,
    settings.tauxAnnuel,
    Number(form.duree) || 1
  );

  function valider(index: number) {
    const manquants = CHAMPS_REQUIS[index].filter((c) => !form[c]?.trim());
    if (manquants.length) {
      setErreur("Complétez les champs marqués d'un astérisque pour continuer.");
      return false;
    }
    if (index === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErreur("L'adresse e-mail saisie n'est pas valide.");
      return false;
    }
    if (index === 2 && !/^\d{10}$/.test(form.telephone)) {
      setErreur("Le numéro grec doit contenir exactement 10 chiffres, sans l'indicatif +30.");
      return false;
    }
    setErreur(null);
    return true;
  }

  function suivant() {
    if (valider(etape)) setEtape((e) => Math.min(e + 1, 2));
  }

  async function envoyer() {
    if (!valider(2)) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const responseText = await res.text();
      let data: { id?: string; error?: string } = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText) as { id?: string; error?: string };
        } catch {
          // Netlify peut renvoyer une page ou un corps non JSON si la fonction échoue.
        }
      }

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Le serveur n'a pas pu enregistrer votre dossier. Réessayez dans un instant."
        );
      }
      if (!data.id) {
        throw new Error("Le serveur a renvoyé une réponse incomplète. Réessayez.");
      }
      setReference(data.id);
    } catch (e) {
      setErreur(
        e instanceof Error
          ? e.message
          : "L'envoi a échoué. Réessayez dans un instant."
      );
    } finally {
      setEnvoi(false);
    }
  }

  if (reference) {
    return (
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-10 text-center"
      >
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-forest">
          <Check size={30} />
        </span>
        <h2 className="mt-6 text-[26px] font-bold">Dossier bien reçu</h2>
        <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed text-ink/65">
          Un conseiller examine votre demande et vous rappelle sous 24 heures
          ouvrées au +30 {form.telephone}. Conservez votre référence de suivi.
        </p>
        <p className="mt-7 inline-block rounded-xl bg-paper px-5 py-3 font-mono text-[15px] font-semibold">
          {reference}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Progression */}
      <div className="border-b border-line px-6 py-5 sm:px-8">
        <ol className="flex items-center gap-3">
          {ETAPES.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[12px] font-semibold transition-colors ${
                    i < etape
                      ? "bg-forest text-mint"
                      : i === etape
                        ? "bg-amber text-ink"
                        : "bg-paper text-ink/40"
                  }`}
                >
                  {i < etape ? <Check size={13} /> : i + 1}
                </span>
                <span
                  className={`hidden truncate text-[13.5px] font-medium sm:block ${
                    i === etape ? "text-ink" : "text-ink/45"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < ETAPES.length - 1 && (
                <span className="h-px flex-1 bg-line" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="px-6 py-8 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={etape}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {etape === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  label="Type de prêt *"
                  value={form.typePret}
                  onChange={set("typePret")}
                  options={TYPES_PRET}
                  className="sm:col-span-2"
                />
                <Input
                  label={`Montant souhaité (${settings.devise}) *`}
                  type="number"
                  value={form.montant}
                  onChange={set("montant")}
                  min={settings.montantMin}
                  max={settings.montantMax}
                  step={500000}
                />
                <Select
                  label="Durée de remboursement *"
                  value={form.duree}
                  onChange={set("duree")}
                  options={DUREES.map(String)}
                  format={(v) => `${v} mois`}
                />
                <div className="rounded-2xl bg-mint px-5 py-4 sm:col-span-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-forest">
                    Mensualité estimée
                  </p>
                  <p className="mt-1 font-display text-[26px] font-bold tabular-nums text-forest-deep">
                    {formatMontant(estimation, settings.devise)}
                  </p>
                </div>
              </div>
            )}

            {etape === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Pays de résidence *" value={form.pays} onChange={set("pays")} />
                <Input label="Ville *" value={form.ville} onChange={set("ville")} />
                <Input
                  label="Adresse"
                  value={form.adresse}
                  onChange={set("adresse")}
                  className="sm:col-span-2"
                />
                <Select
                  label="Situation de logement *"
                  value={form.logement}
                  onChange={set("logement")}
                  options={LOGEMENTS}
                />
                <Select
                  label="Situation professionnelle *"
                  value={form.situationPro}
                  onChange={set("situationPro")}
                  options={SITUATIONS_PRO}
                />
                <Input
                  label={`Revenu mensuel net (${settings.devise}) *`}
                  type="number"
                  value={form.revenuMensuel}
                  onChange={set("revenuMensuel")}
                  min={0}
                  step={100000}
                />
                <Select
                  label="Situation familiale"
                  value={form.situationFamiliale}
                  onChange={set("situationFamiliale")}
                  options={SITUATIONS_FAMILIALES}
                />
              </div>
            )}

            {etape === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  label="Civilité *"
                  value={form.civilite}
                  onChange={set("civilite")}
                  options={CIVILITES}
                />
                <Input label="Nom *" value={form.nom} onChange={set("nom")} />
                <Input label="Prénom *" value={form.prenom} onChange={set("prenom")} />
                <Input
                  label="Date de naissance"
                  type="date"
                  value={form.dateNaissance}
                  onChange={set("dateNaissance")}
                />
                <Input
                  label="Nationalité"
                  value={form.nationalite}
                  onChange={set("nationalite")}
                />
                <div>
                  <label className="field-label" htmlFor="telephone">
                    Téléphone *
                  </label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-xl border border-r-0 border-line bg-paper px-4 font-mono text-sm text-ink/65">
                      +30
                    </span>
                    <input
                      id="telephone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={form.telephone}
                      onChange={(e) =>
                        set("telephone")(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="6912345678"
                      className="field rounded-l-none"
                      aria-describedby="telephone-aide"
                    />
                  </div>
                  <p id="telephone-aide" className="mt-1.5 text-xs text-ink/55">
                    10 chiffres exactement, sans l'indicatif +30.
                  </p>
                </div>
                <Input
                  label="E-mail *"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  className="sm:col-span-2"
                />
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="message">
                    Précisions sur votre projet
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => set("message")(e.target.value)}
                    className="field resize-none"
                    placeholder="Décrivez brièvement l'usage prévu des fonds."
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {erreur && (
          <p
            role="alert"
            className="mt-6 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] text-red-800"
          >
            <CircleAlert size={16} className="mt-0.5 shrink-0" />
            {erreur}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
          <button
            type="button"
            onClick={() => setEtape((e) => Math.max(e - 1, 0))}
            disabled={etape === 0}
            className="btn-ghost disabled:invisible"
          >
            <ArrowLeft size={16} />
            Retour
          </button>

          {etape < 2 ? (
            <button type="button" onClick={suivant} className="btn-primary">
              Étape suivante
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={envoyer}
              disabled={envoi}
              className="btn-accent"
            >
              {envoi ? "Envoi en cours…" : "Envoyer mon dossier"}
              {!envoi && <ArrowRight size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Sous-champs */

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

function Input({ label, value, onChange, className = "", ...rest }: InputProps) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className={className}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field"
        {...rest}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  format,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  format?: (v: string) => string;
  className?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className={className}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230A1F1B%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-11"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {format ? format(o) : o}
          </option>
        ))}
      </select>
    </div>
  );
}
