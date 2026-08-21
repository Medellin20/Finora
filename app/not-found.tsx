import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid-paper flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-forest">
        Erreur 404
      </p>
      <h1 className="mt-4 max-w-[18ch] text-[36px] font-bold leading-[1.1] sm:text-[46px]">
        Cette page n&apos;existe pas.
      </h1>
      <p className="mt-5 max-w-[44ch] text-[15.5px] leading-relaxed text-ink/60">
        Le lien est peut-être obsolète. Reprenez depuis l&apos;accueil ou
        déposez directement votre dossier.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          <ArrowLeft size={16} />
          Retour à l&apos;accueil
        </Link>
        <Link href="/demande" className="btn-ghost">
          Déposer un dossier
        </Link>
      </div>
    </main>
  );
}
