import Link from "next/link";
import {
  Building2,
  Clock,
  Facebook,
  FileBadge,
  Landmark,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Youtube,
} from "lucide-react";
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

        <section className="border-t border-mint/15 pt-9 md:col-span-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mint/45">
                Transparence &amp; réglementation
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-mint">
                Informations légales
              </h3>
            </div>
            <p className="max-w-md text-[12px] leading-relaxed text-mint/50 sm:text-right">
              Informations d&apos;identification et cadre réglementaire de
              BOULANGER FINANCE INTER.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-mint/10 bg-white/[0.035] p-4">
              <Building2 size={18} className="text-amber" aria-hidden />
              <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-mint/45">
                Raison sociale
              </p>
              <p className="mt-1 text-[13px] font-semibold text-mint/85">
                BOULANGER FINANCE INTER
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-mint/55">
                Propriétaire du présent site, inscrite au RCS de LILLE
                METROPOLE.
              </p>
            </div>

            <div className="rounded-2xl border border-mint/10 bg-white/[0.035] p-4">
              <FileBadge size={18} className="text-amber" aria-hidden />
              <dl className="mt-3 space-y-3 text-[12px]">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-mint/45">
                    N° SIREN
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] text-mint/85">
                    325 307 146
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-mint/45">
                    N° TVA
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] text-mint/85">
                    FR 62325307106
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-mint/10 bg-white/[0.035] p-4">
              <MapPin size={18} className="text-amber" aria-hidden />
              <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-mint/45">
                Siège social
              </p>
              <address className="mt-1 text-[13px] not-italic leading-relaxed text-mint/85">
                RUE DE LA PAIX
                <br />
                75002 PARIS, FRANCE
              </address>
            </div>

            <div className="rounded-2xl border border-mint/10 bg-white/[0.035] p-4">
              <UserRound size={18} className="text-amber" aria-hidden />
              <dl className="mt-3 space-y-3 text-[12px]">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-mint/45">
                    Directeur de la publication
                  </dt>
                  <dd className="mt-1 text-[13px] font-semibold text-mint/85">
                    ELISABETH BOULANGER
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-mint/45">
                    Capital
                  </dt>
                  <dd className="mt-1 font-mono text-[13px] text-mint/85">
                    867 500 000 €
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-3 flex gap-3 rounded-2xl border border-amber/20 bg-amber/[0.06] p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-amber"
              aria-hidden
            />
            <div>
              <p className="flex items-center gap-2 text-[12px] font-semibold text-mint/85">
                <Landmark size={14} aria-hidden />
                Établissement réglementé
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-mint/60">
                Agréée en qualité d&apos;Établissement de Crédit Spécialisé
                et soumise au contrôle de l&apos;Autorité de Contrôle Prudentiel
                et de Résolution, 4 Place de Budapest, CS 92459, 75436 Paris
                Cedex 09.
              </p>
            </div>
          </div>
        </section>
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
