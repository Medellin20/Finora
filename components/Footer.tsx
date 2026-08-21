import Link from "next/link";
import { Mail, MapPin, Phone, Clock, Facebook, Linkedin, Youtube } from "lucide-react";
import type { Settings } from "@/lib/types";
import { SOLUTIONS } from "@/lib/content";

export default function Footer({ settings }: { settings: Settings }) {
  const reseaux = [
    { href: settings.facebook, label: "Facebook", Icon: Facebook },
    { href: settings.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: settings.youtube, label: "YouTube", Icon: Youtube },
  ].filter((r) => r.href);

  return (
    <footer className="mt-24 bg-forest-deep text-mint">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-[10px] bg-mint font-display text-[17px] font-bold text-forest-deep"
            >
              F
            </span>
            <span className="font-display text-[19px] font-bold">
              {settings.societe}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-mint/70">
            {settings.baseline}. Nous montons votre dossier, négocions auprès de
            nos partenaires financiers et vous accompagnons jusqu&apos;au
            déblocage des fonds.
          </p>
          {reseaux.length > 0 && (
            <div className="mt-6 flex gap-2.5">
              {reseaux.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-mint/20 transition-colors hover:border-amber hover:text-amber"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber">
            Financements
          </h3>
          <ul className="mt-5 space-y-3 text-[14.5px] text-mint/75">
            {SOLUTIONS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/solutions/${s.slug}`}
                  className="transition-colors hover:text-amber"
                >
                  {s.titre}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/demande" className="transition-colors hover:text-amber">
                Déposer un dossier
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber">
            Nous joindre
          </h3>
          <ul className="mt-5 space-y-4 text-[14.5px] text-mint/75">
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-mint/50" />
              <a
                href={`tel:${settings.telephone.replace(/\s/g, "")}`}
                className="font-mono transition-colors hover:text-amber"
              >
                {settings.telephone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-mint/50" />
              <a
                href={`mailto:${settings.email}`}
                className="transition-colors hover:text-amber"
              >
                {settings.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-mint/50" />
              <span>{settings.adresse}</span>
            </li>
            <li className="flex gap-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-mint/50" />
              <span>{settings.horaires}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-mint/12">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-6 text-[13px] text-mint/50 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {settings.societe}. Tous droits
            réservés.
          </p>
          <p className="font-mono text-[12px]">
            Taux indicatif {settings.tauxAnnuel}% · Un crédit vous engage et doit
            être remboursé.
          </p>
        </div>
      </div>
    </footer>
  );
}
