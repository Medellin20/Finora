import { Suspense } from "react";
import type { Metadata } from "next";
import { ShieldCheck, Clock, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormulaireDemande from "@/components/FormulaireDemande";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Déposer un dossier",
  description:
    "Complétez votre demande de financement en ligne en trois étapes et recevez une réponse de principe sous 24 heures ouvrées.",
};

const REPERES = [
  { Icon: Clock, texte: "Environ 5 minutes" },
  { Icon: FileText, texte: "3 pièces justificatives" },
  { Icon: ShieldCheck, texte: "Données chiffrées" },
];

export default async function DemandePage() {
  const settings = await getSettings();

  return (
    <>
      <Header settings={settings} />
      <main className="relative">
        <div className="grid-paper pointer-events-none absolute inset-x-0 top-0 h-[340px] [mask-image:linear-gradient(black,transparent)]" />
        <div className="container-page relative py-12 lg:py-16">
          <div className="max-w-[52ch]">
            <p className="eyebrow">Votre demande</p>
            <h1 className="mt-3 text-[36px] font-bold leading-[1.08] sm:text-[46px]">
              Déposez votre dossier en ligne.
            </h1>
            <p className="mt-5 text-[16px] leading-relaxed text-ink/65">
              Trois étapes, aucun engagement. Vous recevez une référence de
              suivi dès l&apos;envoi, puis l&apos;appel d&apos;un conseiller.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {REPERES.map(({ Icon, texte }) => (
              <li
                key={texte}
                className="flex items-center gap-2 rounded-pill border border-line bg-white px-3.5 py-2 text-[13px] font-medium text-ink/70"
              >
                <Icon size={14} className="text-forest" />
                {texte}
              </li>
            ))}
          </ul>

          <div className="mt-10 max-w-[820px]">
            <Suspense
              fallback={
                <div className="card h-[560px] animate-pulse bg-white/60" />
              }
            >
              <FormulaireDemande settings={settings} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
