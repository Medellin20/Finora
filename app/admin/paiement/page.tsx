import FormulairePaiement from "@/components/FormulairePaiement";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPaiementPage() {
  const settings = await getSettings();
  return <>
    <div className="mb-8">
      <p className="eyebrow">Configuration</p>
      <h1 className="mt-2 text-[30px] font-bold">Paiement</h1>
      <p className="mt-2 max-w-[56ch] text-[15px] text-ink/60">Modifiez ici le RIB/IBAN ou le lien de paiement affiché dans le formulaire de demande.</p>
    </div>
    <FormulairePaiement initiales={settings} />
  </>;
}
