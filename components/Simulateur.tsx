"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { coutTotal, formatMontant, mensualite } from "@/lib/content";
import type { Settings } from "@/lib/types";

function arrondi(value: number, pas: number) {
  return Math.round(value / pas) * pas;
}

export default function Simulateur({ settings }: { settings: Settings }) {
  const router = useRouter();
  const reduce = useReducedMotion();

  const [montant, setMontant] = useState(
    Math.min(20000, settings.montantMax)
  );
  const [duree, setDuree] = useState(48);

  const { paiement, cout, total } = useMemo(() => {
    const paiement = mensualite(montant, settings.tauxAnnuel, duree);
    const cout = coutTotal(montant, settings.tauxAnnuel, duree);
    return { paiement, cout, total: montant + cout };
  }, [montant, duree, settings.tauxAnnuel]);

  // Part du capital dans le coût total — alimente la barre de répartition
  const partCapital = Math.round((montant / total) * 100);

  function continuer() {
    const params = new URLSearchParams({
      montant: String(montant),
      duree: String(duree),
    });
    router.push(`/demande?${params.toString()}`);
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 sm:px-7">
        <div>
          <p className="eyebrow">Simulation</p>
          <p className="mt-1 text-[15px] font-semibold">Estimez votre mensualité</p>
        </div>
        <span className="rounded-pill bg-mint px-3 py-1.5 font-mono text-[12px] font-semibold text-forest-deep">
          {settings.tauxAnnuel}% / an
        </span>
      </div>

      <div className="space-y-7 px-6 py-7 sm:px-7">
        <div>
          <div className="mb-3 flex items-end justify-between gap-4">
            <label htmlFor="sim-montant" className="text-[13px] font-semibold text-ink/70">
              Montant emprunté
            </label>
            <output
              htmlFor="sim-montant"
              className="font-mono text-[17px] font-semibold tabular-nums"
            >
              {formatMontant(montant, settings.devise)}
            </output>
          </div>
          <input
            id="sim-montant"
            type="range"
            min={settings.montantMin}
            max={settings.montantMax}
            step={1000}
            value={montant}
            onChange={(e) => setMontant(arrondi(Number(e.target.value), 1000))}
          />
          <div className="mt-2 flex justify-between font-mono text-[11px] text-ink/40">
            <span>{formatMontant(settings.montantMin, settings.devise)}</span>
            <span>{formatMontant(settings.montantMax, settings.devise)}</span>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-end justify-between gap-4">
            <label htmlFor="sim-duree" className="text-[13px] font-semibold text-ink/70">
              Durée de remboursement
            </label>
            <output
              htmlFor="sim-duree"
              className="font-mono text-[17px] font-semibold tabular-nums"
            >
              {duree} mois
            </output>
          </div>
          <input
            id="sim-duree"
            type="range"
            min={settings.dureeMin}
            max={settings.dureeMax}
            step={6}
            value={duree}
            onChange={(e) => setDuree(Number(e.target.value))}
          />
          <div className="mt-2 flex justify-between font-mono text-[11px] text-ink/40">
            <span>{settings.dureeMin} mois</span>
            <span>{settings.dureeMax} mois</span>
          </div>
        </div>

        <div className="rounded-2xl bg-forest-deep px-6 py-6 text-mint">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber">
            Mensualité estimée
          </p>
          <motion.p
            key={Math.round(paiement)}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2 font-display text-[38px] font-bold leading-none tabular-nums sm:text-[46px]"
          >
            {formatMontant(paiement, settings.devise)}
          </motion.p>

          <div className="mt-6">
            <div
              className="flex h-2 overflow-hidden rounded-full bg-mint/15"
              role="img"
              aria-label={`Répartition : ${partCapital}% de capital, ${
                100 - partCapital
              }% d'intérêts`}
            >
              <motion.span
                className="bg-mint"
                animate={{ width: `${partCapital}%` }}
                transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
              />
              <span className="flex-1 bg-amber" />
            </div>
            <div className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-2 font-mono text-[12px]">
              <span className="text-mint/70">
                Capital&nbsp;· {formatMontant(montant, settings.devise)}
              </span>
              <span className="text-amber">
                Intérêts&nbsp;· {formatMontant(cout, settings.devise)}
              </span>
            </div>
          </div>
        </div>

        <button type="button" onClick={continuer} className="btn-accent w-full">
          Continuer avec ce montant
          <ArrowRight size={17} />
        </button>

        <p className="text-center text-[12px] leading-relaxed text-ink/45">
          Estimation indicative hors assurance et frais de dossier. Les
          conditions définitives figurent dans l&apos;offre de prêt.
        </p>
      </div>
    </div>
  );
}
