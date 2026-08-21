"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  FileCheck2,
  Gauge,
  ShieldCheck,
  Star,
} from "lucide-react";
import Reveal from "./Reveal";
import Simulateur from "./Simulateur";
import { ETAPES, FAQ, SOLUTIONS, TEMOIGNAGES } from "@/lib/content";
import type { Settings } from "@/lib/types";

/* ------------------------------------------------------------------ Hero */

export function Hero({ settings }: { settings: Settings }) {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09 } },
  };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="grid-paper pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="container-page relative grid gap-14 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-16">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-pill border border-line bg-white px-3.5 py-1.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-forest"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber" />
            </span>
            Réponse de principe le jour même
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-[40px] font-bold leading-[1.03] sm:text-[54px] lg:text-[62px]"
          >
            Obtenez votre prêt sans complication.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-[46ch] text-[17px] leading-relaxed text-ink/70"
          >
            {settings.societe} compare les offres de ses partenaires financiers
            et vous présente la mensualité, le coût total et la durée avant même
            que vous ne déposiez un dossier.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <Link href="/demande" className="btn-primary">
              Déposer un dossier
              <ArrowRight size={17} />
            </Link>
            <Link href="#solutions" className="btn-ghost">
              Voir les financements
            </Link>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-7"
          >
            {[
              { k: "72 h", v: "pour recevoir les fonds" },
              { k: "3 pièces", v: "justificatives suffisent" },
              { k: "0 frais", v: "avant déblocage" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="font-display text-[24px] font-bold text-forest">
                  {s.k}
                </dt>
                <dd className="mt-1 text-[13px] leading-snug text-ink/55">
                  {s.v}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Simulateur settings={settings} />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Atouts */

const ATOUTS = [
  {
    Icon: Gauge,
    titre: "Une réponse rapide",
    texte:
      "Votre dossier est étudié dans la journée. Vous savez immédiatement où vous en êtes, sans relance.",
  },
  {
    Icon: ShieldCheck,
    titre: "Des conditions négociées",
    texte:
      "Nous mettons nos partenaires en concurrence pour obtenir le meilleur taux compatible avec votre profil.",
  },
  {
    Icon: FileCheck2,
    titre: "Un coût lisible",
    texte:
      "Taux fixe, mensualité fixe, coût total affiché. Aucune ligne de frais ne s'ajoute après signature.",
  },
];

export function Atouts() {
  return (
    <section className="container-page py-20 lg:py-24">
      <Reveal>
        <p className="eyebrow">Ce qui change chez nous</p>
        <h2 className="mt-3 max-w-[18ch] text-[32px] font-bold leading-[1.1] sm:text-[40px]">
          Un courtier qui affiche ses chiffres.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {ATOUTS.map((a, i) => (
          <Reveal key={a.titre} delay={i * 0.09}>
            <div className="group h-full rounded-card border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-lift">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest transition-colors duration-300 group-hover:bg-forest group-hover:text-mint">
                <a.Icon size={21} />
              </span>
              <h3 className="mt-6 text-[19px] font-bold">{a.titre}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink/65">
                {a.texte}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Étapes */

export function Etapes() {
  return (
    <section className="border-y border-line bg-white py-20 lg:py-24">
      <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">Le parcours</p>
          <h2 className="mt-3 text-[32px] font-bold leading-[1.1] sm:text-[40px]">
            Quatre étapes, dans cet ordre.
          </h2>
          <p className="mt-5 max-w-[40ch] text-[15.5px] leading-relaxed text-ink/65">
            Chaque étape est datée dans votre espace de suivi. Vous êtes prévenu
            par e-mail à chaque changement.
          </p>
          <Link href="/demande" className="btn-primary mt-8">
            Commencer maintenant
            <ArrowRight size={17} />
          </Link>
        </Reveal>

        <ol className="relative">
          <span
            aria-hidden
            className="absolute left-[27px] top-2 h-[calc(100%-2rem)] w-px bg-line"
          />
          {ETAPES.map((e, i) => (
            <Reveal key={e.titre} delay={i * 0.08}>
              <li className="relative flex gap-6 pb-9 last:pb-0">
                <span className="z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-paper font-mono text-[15px] font-semibold text-forest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-2">
                  <h3 className="text-[18px] font-bold">{e.titre}</h3>
                  <p className="mt-2 max-w-[52ch] text-[14.5px] leading-relaxed text-ink/65">
                    {e.texte}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Solutions */

export function Solutions() {
  return (
    <section id="solutions" className="container-page py-20 lg:py-24">
      <Reveal>
        <p className="eyebrow">Nos financements</p>
        <h2 className="mt-3 max-w-[22ch] text-[32px] font-bold leading-[1.1] sm:text-[40px]">
          Trois familles de prêts, un seul interlocuteur.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {SOLUTIONS.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.09}>
            <Link
              href={`/solutions/${s.slug}`}
              className="group flex h-full flex-col rounded-card border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[21px] font-bold">{s.titre}</h3>
                <ArrowUpRight
                  size={20}
                  className="mt-1 shrink-0 text-ink/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forest"
                />
              </div>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink/65">
                {s.resume}
              </p>
              <dl className="mt-6 space-y-2 border-t border-line pt-5 font-mono text-[12.5px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/45">Montant</dt>
                  <dd className="text-right font-medium">{s.montant}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/45">Durée</dt>
                  <dd className="text-right font-medium">{s.duree}</dd>
                </div>
              </dl>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Témoignages */

export function Temoignages() {
  const liste = [...TEMOIGNAGES, ...TEMOIGNAGES];

  return (
    <section className="overflow-hidden border-y border-line bg-white py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">Ils ont déposé un dossier</p>
          <h2 className="mt-3 text-[32px] font-bold leading-[1.1] sm:text-[40px]">
            Ce qu&apos;en disent nos clients.
          </h2>
        </Reveal>
      </div>

      <div
        className="group relative mt-12 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        aria-label="Témoignages clients"
      >
        <div className="flex shrink-0 animate-marquee gap-5 pr-5 group-hover:[animation-play-state:paused]">
          {liste.map((t, i) => (
            <figure
              key={`${t.nom}-${i}`}
              className="flex w-[330px] shrink-0 flex-col rounded-card border border-line bg-paper p-6"
            >
              <div className="flex gap-0.5 text-amber" aria-label="5 sur 5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink/75">
                {t.texte}
              </blockquote>
              <figcaption className="mt-5 border-t border-line pt-4">
                <p className="text-[14px] font-semibold">{t.nom}</p>
                <p className="font-mono text-[12px] text-ink/45">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- FAQ */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="container-page py-20 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <Reveal>
          <p className="eyebrow">Questions fréquentes</p>
          <h2 className="mt-3 text-[32px] font-bold leading-[1.1] sm:text-[40px]">
            Les réponses avant les questions.
          </h2>
          <p className="mt-5 max-w-[36ch] text-[15.5px] leading-relaxed text-ink/65">
            Une question qui ne figure pas ici ? Écrivez-nous, un conseiller
            répond sous 24 heures ouvrées.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.question}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={`text-[16.5px] font-semibold transition-colors ${
                          isOpen ? "text-forest" : "text-ink"
                        }`}
                      >
                        {f.question}
                      </span>
                      <ChevronDown
                        size={19}
                        className={`shrink-0 text-ink/40 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-forest" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[62ch] pb-6 pr-8 text-[14.5px] leading-relaxed text-ink/65">
                          {f.reponse}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Bandeau CTA */

export function BandeauCta({ settings }: { settings: Settings }) {
  return (
    <section className="container-page pb-4">
      <Reveal>
        <div className="relative overflow-hidden rounded-card bg-forest px-8 py-14 text-mint sm:px-14">
          <div className="grid-paper pointer-events-none absolute inset-0 opacity-[0.35]" />
          <div className="relative max-w-[54ch]">
            <h2 className="text-[30px] font-bold leading-[1.12] sm:text-[38px]">
              Votre dossier prend cinq minutes. Notre réponse arrive le jour
              même.
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-mint/75">
              Aucun frais n&apos;est prélevé tant que le financement n&apos;est
              pas débloqué. Vous pouvez interrompre la démarche à tout moment.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/demande" className="btn-accent">
                Déposer un dossier
                <ArrowRight size={17} />
              </Link>
              <a
                href={`tel:${settings.telephone.replace(/\s/g, "")}`}
                className="btn border border-mint/25 text-mint transition-colors hover:border-mint hover:bg-mint/10"
              >
                Parler à un conseiller
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
