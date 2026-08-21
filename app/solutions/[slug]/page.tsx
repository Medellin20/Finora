import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { SOLUTIONS, ETAPES } from "@/lib/content";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const solution = SOLUTIONS.find((s) => s.slug === params.slug);
  if (!solution) return { title: "Financement introuvable" };
  return { title: solution.titre, description: solution.resume };
}

export default async function SolutionPage({
  params,
}: {
  params: { slug: string };
}) {
  const solution = SOLUTIONS.find((s) => s.slug === params.slug);
  if (!solution) notFound();

  const settings = await getSettings();
  const autres = SOLUTIONS.filter((s) => s.slug !== solution.slug);

  return (
    <>
      <Header settings={settings} />
      <main className="relative">
        <div className="grid-paper pointer-events-none absolute inset-x-0 top-0 h-[380px] [mask-image:linear-gradient(black,transparent)]" />

        <section className="container-page relative grid gap-12 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
          <Reveal>
            <p className="eyebrow">Financement</p>
            <h1 className="mt-3 text-[38px] font-bold leading-[1.06] sm:text-[50px]">
              {solution.titre}
            </h1>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-ink/70">
              {solution.resume}
            </p>

            <ul className="mt-9 space-y-3.5">
              {solution.points.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] text-ink/75">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-forest">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <Link href="/demande" className="btn-primary mt-10">
              Déposer un dossier
              <ArrowRight size={17} />
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="card sticky top-24 p-7">
              <p className="eyebrow">Conditions indicatives</p>
              <dl className="mt-5 divide-y divide-line">
                {[
                  ["Montant", solution.montant],
                  ["Durée", solution.duree],
                  ["Taux annuel", `à partir de ${settings.tauxAnnuel}%`],
                  ["Réponse de principe", "le jour même"],
                  ["Frais avant déblocage", "aucun"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-3.5">
                    <dt className="text-[14px] text-ink/55">{k}</dt>
                    <dd className="text-right font-mono text-[13.5px] font-medium">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[12px] leading-relaxed text-ink/45">
                Conditions données à titre indicatif. L&apos;offre définitive
                dépend de l&apos;étude de votre dossier.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="border-y border-line bg-white py-16">
          <div className="container-page">
            <Reveal>
              <h2 className="text-[28px] font-bold sm:text-[34px]">
                Comment se déroule la démarche
              </h2>
            </Reveal>
            <ol className="mt-10 grid gap-5 md:grid-cols-4">
              {ETAPES.map((e, i) => (
                <Reveal key={e.titre} delay={i * 0.08}>
                  <li className="h-full rounded-card border border-line bg-paper p-6">
                    <span className="font-mono text-[13px] font-semibold text-amber">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-[16.5px] font-bold">{e.titre}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink/60">
                      {e.texte}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="container-page py-16">
          <Reveal>
            <h2 className="text-[24px] font-bold">Autres financements</h2>
          </Reveal>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {autres.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.08}>
                <Link
                  href={`/solutions/${s.slug}`}
                  className="group flex items-center justify-between gap-6 rounded-card border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/30 hover:shadow-lift"
                >
                  <div>
                    <h3 className="text-[18px] font-bold">{s.titre}</h3>
                    <p className="mt-1.5 max-w-[42ch] text-[14px] text-ink/60">
                      {s.resume}
                    </p>
                  </div>
                  <ArrowRight
                    size={20}
                    className="shrink-0 text-ink/30 transition-all group-hover:translate-x-1 group-hover:text-forest"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
