"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  Inbox,
  Mail,
  Phone,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  STATUTS,
  formatDate,
  formatMontant,
  mensualite,
} from "@/lib/content";
import type { Demande, DemandeStatut, Settings } from "@/lib/types";

const FILTRES: Array<{ value: DemandeStatut | "toutes"; label: string }> = [
  { value: "toutes", label: "Tous" },
  { value: "nouvelle", label: "Nouvelles" },
  { value: "en_cours", label: "En cours" },
  { value: "acceptee", label: "Acceptées" },
  { value: "refusee", label: "Refusées" },
  { value: "archivee", label: "Archivées" },
];

export default function TableauDemandes({
  initiales,
  settings,
}: {
  initiales: Demande[];
  settings: Settings;
}) {
  const [demandes, setDemandes] = useState(initiales);
  const [filtre, setFiltre] = useState<DemandeStatut | "toutes">("toutes");
  const [recherche, setRecherche] = useState("");
  const [ouvert, setOuvert] = useState<Demande | null>(null);
  const [note, setNote] = useState("");

  const visibles = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return demandes.filter((d) => {
      if (filtre !== "toutes" && d.statut !== filtre) return false;
      if (!q) return true;
      return [d.nom, d.prenom, d.email, d.telephone, d.id, d.ville]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [demandes, filtre, recherche]);

  const compteurs = useMemo(
    () => ({
      total: demandes.length,
      nouvelles: demandes.filter((d) => d.statut === "nouvelle").length,
      volume: demandes
        .filter((d) => d.statut === "acceptee")
        .reduce((s, d) => s + d.montant, 0),
    }),
    [demandes]
  );

  async function changerStatut(id: string, statut: DemandeStatut) {
    setDemandes((list) =>
      list.map((d) => (d.id === id ? { ...d, statut } : d))
    );
    setOuvert((o) => (o && o.id === id ? { ...o, statut } : o));
    await fetch(`/api/demandes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
  }

  async function enregistrerNote(id: string) {
    setDemandes((list) => list.map((d) => (d.id === id ? { ...d, note } : d)));
    await fetch(`/api/demandes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
  }

  async function supprimer(id: string) {
    if (!confirm("Supprimer définitivement ce dossier ?")) return;
    setDemandes((list) => list.filter((d) => d.id !== id));
    setOuvert(null);
    await fetch(`/api/demandes/${id}`, { method: "DELETE" });
  }

  function exporterCsv() {
    const entetes = [
      "Référence",
      "Reçu le",
      "Statut",
      "Type",
      "Montant",
      "Durée",
      "Nom",
      "Prénom",
      "Téléphone",
      "E-mail",
      "Ville",
      "Revenu mensuel",
    ];
    const lignes = visibles.map((d) =>
      [
        d.id,
        d.createdAt,
        STATUTS[d.statut].label,
        d.typePret,
        d.montant,
        d.duree,
        d.nom,
        d.prenom,
        d.telephone,
        d.email,
        d.ville,
        d.revenuMensuel,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(";")
    );
    const csv = "\uFEFF" + [entetes.join(";"), ...lignes].join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `dossiers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Indicateurs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Dossiers reçus", valeur: String(compteurs.total) },
          { label: "En attente de traitement", valeur: String(compteurs.nouvelles) },
          {
            label: "Montant accepté",
            valeur: formatMontant(compteurs.volume, settings.devise),
          },
        ].map((s) => (
          <div key={s.label} className="card p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
              {s.label}
            </p>
            <p className="mt-2 font-display text-[28px] font-bold tabular-nums">
              {s.valeur}
            </p>
          </div>
        ))}
      </div>

      {/* Barre d'outils */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35"
          />
          <input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un nom, un e-mail, une référence…"
            className="field pl-11"
            aria-label="Rechercher un dossier"
          />
        </div>
        <button type="button" onClick={exporterCsv} className="btn-ghost">
          <Download size={15} />
          Exporter en CSV
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTRES.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFiltre(f.value)}
            className={`rounded-pill px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              filtre === f.value
                ? "bg-forest text-mint"
                : "border border-line bg-white text-ink/60 hover:border-forest/40 hover:text-forest"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {visibles.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center px-6 py-20 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mint text-forest">
            <Inbox size={22} />
          </span>
          <h2 className="mt-5 text-[19px] font-bold">Aucun dossier ici</h2>
          <p className="mt-2 max-w-[40ch] text-[14.5px] text-ink/55">
            {demandes.length === 0
              ? "Les demandes déposées depuis le site apparaîtront dans cette liste."
              : "Aucun dossier ne correspond à ce filtre. Élargissez la recherche."}
          </p>
        </div>
      ) : (
        <div className="card mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-paper/60">
                  {["Référence", "Demandeur", "Projet", "Montant", "Reçu le", "Statut"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/45"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visibles.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => {
                      setOuvert(d);
                      setNote(d.note);
                    }}
                    className="cursor-pointer transition-colors hover:bg-mint/40"
                  >
                    <td className="px-5 py-4 font-mono text-[12.5px] text-ink/60">
                      {d.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[14.5px] font-semibold">
                        {d.prenom} {d.nom}
                      </p>
                      <p className="text-[12.5px] text-ink/50">{d.ville}</p>
                    </td>
                    <td className="px-5 py-4 text-[14px] text-ink/70">
                      {d.typePret}
                      <span className="block font-mono text-[12px] text-ink/45">
                        {d.duree} mois
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[13.5px] font-medium tabular-nums">
                      {formatMontant(d.montant, settings.devise)}
                    </td>
                    <td className="px-5 py-4 text-[13px] text-ink/55">
                      {formatDate(d.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-pill px-2.5 py-1 text-[12px] font-semibold ${
                          STATUTS[d.statut].className
                        }`}
                      >
                        {STATUTS[d.statut].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Panneau de détail */}
      <AnimatePresence>
        {ouvert && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOuvert(null)}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-[520px] overflow-y-auto bg-white shadow-lift"
              aria-label="Détail du dossier"
            >
              <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-white px-7 py-5">
                <div>
                  <p className="font-mono text-[12px] text-ink/45">{ouvert.id}</p>
                  <h2 className="mt-1 text-[21px] font-bold">
                    {ouvert.civilite} {ouvert.prenom} {ouvert.nom}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOuvert(null)}
                  aria-label="Fermer le détail"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line transition-colors hover:border-forest hover:text-forest"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-8 px-7 py-7">
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${ouvert.telephone}`} className="btn-primary">
                    <Phone size={15} />
                    Appeler
                  </a>
                  <a href={`mailto:${ouvert.email}`} className="btn-ghost">
                    <Mail size={15} />
                    Écrire
                  </a>
                </div>

                <section>
                  <h3 className="eyebrow">Statut du dossier</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(Object.keys(STATUTS) as DemandeStatut[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => changerStatut(ouvert.id, s)}
                        className={`rounded-pill px-3 py-1.5 text-[12.5px] font-semibold transition-all ${
                          ouvert.statut === s
                            ? STATUTS[s].className
                            : "border border-line text-ink/50 hover:border-forest/40 hover:text-forest"
                        }`}
                      >
                        {STATUTS[s].label}
                      </button>
                    ))}
                  </div>
                </section>

                <Bloc titre="Projet">
                  <Ligne k="Type de prêt" v={ouvert.typePret} />
                  <Ligne
                    k="Montant"
                    v={formatMontant(ouvert.montant, settings.devise)}
                  />
                  <Ligne k="Durée" v={`${ouvert.duree} mois`} />
                  <Ligne
                    k="Mensualité estimée"
                    v={formatMontant(
                      mensualite(ouvert.montant, settings.tauxAnnuel, ouvert.duree),
                      settings.devise
                    )}
                  />
                </Bloc>

                <Bloc titre="Situation">
                  <Ligne k="Pays" v={ouvert.pays} />
                  <Ligne k="Ville" v={ouvert.ville} />
                  {ouvert.adresse && <Ligne k="Adresse" v={ouvert.adresse} />}
                  <Ligne k="Logement" v={ouvert.logement} />
                  <Ligne k="Situation pro." v={ouvert.situationPro} />
                  <Ligne
                    k="Revenu mensuel"
                    v={formatMontant(ouvert.revenuMensuel, settings.devise)}
                  />
                  <Ligne k="Situation familiale" v={ouvert.situationFamiliale} />
                </Bloc>

                <Bloc titre="Coordonnées">
                  <Ligne k="Téléphone" v={ouvert.telephone} />
                  <Ligne k="E-mail" v={ouvert.email} />
                  {ouvert.dateNaissance && (
                    <Ligne k="Naissance" v={ouvert.dateNaissance} />
                  )}
                  {ouvert.nationalite && (
                    <Ligne k="Nationalité" v={ouvert.nationalite} />
                  )}
                  <Ligne k="Reçu le" v={formatDate(ouvert.createdAt)} />
                </Bloc>

                {ouvert.message && (
                  <section>
                    <h3 className="eyebrow">Message du demandeur</h3>
                    <p className="mt-3 whitespace-pre-line rounded-xl bg-paper p-4 text-[14px] leading-relaxed text-ink/75">
                      {ouvert.message}
                    </p>
                  </section>
                )}

                <section>
                  <h3 className="eyebrow">Note interne</h3>
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onBlur={() => enregistrerNote(ouvert.id)}
                    className="field mt-3 resize-none"
                    placeholder="Compte rendu d'appel, pièces manquantes, relance à prévoir…"
                  />
                  <p className="mt-2 text-[12px] text-ink/45">
                    Enregistrée automatiquement dès que vous quittez le champ.
                  </p>
                </section>

                <button
                  type="button"
                  onClick={() => supprimer(ouvert.id)}
                  className="flex items-center gap-2 text-[13.5px] font-medium text-red-700 transition-opacity hover:opacity-70"
                >
                  <Trash2 size={15} />
                  Supprimer ce dossier
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Bloc({
  titre,
  children,
}: {
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="eyebrow">{titre}</h3>
      <dl className="mt-3 divide-y divide-line border-y border-line">
        {children}
      </dl>
    </section>
  );
}

function Ligne({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6 py-2.5">
      <dt className="text-[13.5px] text-ink/50">{k}</dt>
      <dd className="text-right text-[13.5px] font-medium">{v}</dd>
    </div>
  );
}
