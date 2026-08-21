import FormulaireParametres from "@/components/FormulaireParametres";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const settings = await getSettings();

  return (
    <>
      <div className="mb-8">
        <p className="eyebrow">Configuration</p>
        <h1 className="mt-2 text-[30px] font-bold">Coordonnées du site</h1>
        <p className="mt-2 max-w-[56ch] text-[15px] text-ink/60">
          Modifiez le téléphone, l&apos;e-mail, l&apos;adresse et les paramètres
          du simulateur sans toucher au code.
        </p>
      </div>
      <FormulaireParametres initiales={settings} />
    </>
  );
}
