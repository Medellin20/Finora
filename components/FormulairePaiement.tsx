"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleAlert, Save } from "lucide-react";
import type { Settings } from "@/lib/types";
import { enregistrerParametres } from "@/lib/settings-client";

export default function FormulairePaiement({ initiales }: { initiales: Settings }) {
  const router = useRouter();
  const [titulaire, setTitulaire] = useState(initiales.titulaireRib);
  const [rib, setRib] = useState(initiales.rib);
  const [iban, setIban] = useState(initiales.iban);
  const [bic, setBic] = useState(initiales.bic);
  const [lien, setLien] = useState(initiales.paymentLink);
  const [affichage, setAffichage] = useState<Settings["paymentDisplay"]>(initiales.paymentDisplay);
  const [frais, setFrais] = useState(String(initiales.fraisDossier));
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function enregistrer() {
    setBusy(true);
    setResult(null);
    try {
      await enregistrerParametres({ titulaireRib: titulaire, rib, iban, bic, paymentLink: lien, paymentDisplay: affichage, fraisDossier: frais });
      setResult({ ok: true, text: "Coordonnées de paiement enregistrées." });
      router.refresh();
    } catch (error) {
      setResult({ ok: false, text: error instanceof Error ? error.message : "Enregistrement impossible." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card max-w-2xl p-6 sm:p-8">
      <h2 className="text-[19px] font-bold">Coordonnées à afficher aux demandeurs</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">Choisissez ce qui sera affiché à la dernière étape du formulaire : les coordonnées bancaires ou le lien de paiement.</p>
      <div className="mt-6 grid gap-5">
        <fieldset className="rounded-xl border border-line p-4">
          <legend className="px-1 text-[13px] font-semibold text-ink/70">Mode d’affichage public</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-paper px-3 py-3 text-sm">
              <input type="radio" name="payment-display" checked={affichage === "bank"} onChange={() => setAffichage("bank")} />
              Afficher IBAN / BIC
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-paper px-3 py-3 text-sm">
              <input type="radio" name="payment-display" checked={affichage === "link"} onChange={() => setAffichage("link")} />
              Afficher le lien de paiement
            </label>
          </div>
        </fieldset>
        <Field label="Montant des frais (EUR)" type="number" min="0" step="0.01" value={frais} onChange={setFrais} />
        <Field label="Titulaire du compte" value={titulaire} onChange={setTitulaire} />
        <Field label="IBAN" value={iban} onChange={setIban} placeholder="Ex. FR76…" autoComplete="off" />
        <Field label="BIC / SWIFT" value={bic} onChange={setBic} placeholder="Ex. ABCDFRPP" autoComplete="off" />
        <div>
          <label className="field-label" htmlFor="rib-admin">Autres coordonnées bancaires (facultatif)</label>
          <textarea id="rib-admin" rows={3} value={rib} onChange={(e) => setRib(e.target.value)} className="field resize-y" placeholder="IBAN et informations bancaires" />
        </div>
        <Field label="Lien de paiement (facultatif)" type="url" value={lien} onChange={setLien} placeholder="https://…" />
      </div>
      <button type="button" onClick={enregistrer} disabled={busy} className="btn-primary mt-6">
        <Save size={16} />{busy ? "Enregistrement…" : "Enregistrer les coordonnées"}
      </button>
      {result && <p role="status" className={`mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${result.ok ? "bg-mint text-forest-deep" : "bg-red-50 text-red-800"}`}>
        {result.ok ? <Check size={16} /> : <CircleAlert size={16} />}{result.text}
      </p>}
    </section>
  );
}

function Field({ label, onChange, ...props }: { label: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return <div><label className="field-label" htmlFor={id}>{label}</label><input id={id} className="field" onChange={(event) => onChange(event.target.value)} {...props} /></div>;
}
