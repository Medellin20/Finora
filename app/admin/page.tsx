import TableauDemandes from "@/components/TableauDemandes";
import { getSettings, listDemandes } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminDemandesPage() {
  const [demandes, settings] = await Promise.all([
    listDemandes(),
    getSettings(),
  ]);

  return (
    <>
      <div className="mb-8">
        <p className="eyebrow">Suivi</p>
        <h1 className="mt-2 text-[30px] font-bold">Dossiers reçus</h1>
        <p className="mt-2 max-w-[56ch] text-[15px] text-ink/60">
          Cliquez sur une ligne pour ouvrir le dossier, changer son statut et
          consigner vos échanges avec le demandeur.
        </p>
      </div>
      <TableauDemandes initiales={demandes} settings={settings} />
    </>
  );
}
