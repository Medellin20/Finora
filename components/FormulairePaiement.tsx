"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleAlert, Save } from "lucide-react";
import type { Settings } from "@/lib/types";

export default function FormulairePaiement({ initiales }: { initiales: Settings }) {
  const router = useRouter();
  const [titulaire, setTitulaire] = useState(initiales.titulaireRib);
  const [rib, setRib] = useState(initiales.rib);
  const [iban, setIban] = useState(initiales.iban);
  const [bic, setBic] = useState(initiales.bic);
  const [lien, setLien] = useState(initiales.paymentLink);
  const [frais, setFrais] = useState(String(initiales.fraisDossier));
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function enregistrer() {
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulaireRib: titulaire, rib, iban, bic, paymentLink: lien, fraisDossier: frais }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Enregistrement impossible.");
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
      <p className="mt-2 text-sm leading-relaxed text-ink/60">Renseignez un RIB/IBAN ou un lien de paiement. Ces informations seront affichées à la dernière étape du formulaire.</p>
      <div className="mt-6 grid gap-5">
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
