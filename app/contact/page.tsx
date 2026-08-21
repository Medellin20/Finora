import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Joignez un conseiller par téléphone, e-mail ou WhatsApp. Réponse sous 24 heures ouvrées.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  const canaux = [
    {
      Icon: Phone,
      label: "Téléphone",
      valeur: settings.telephone,
      href: `tel:${settings.telephone.replace(/\s/g, "")}`,
    },
    {
      Icon: MessageCircle,
      label: "WhatsApp",
      valeur: settings.whatsapp,
      href: `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`,
    },
    {
      Icon: Mail,
      label: "E-mail",
      valeur: settings.email,
      href: `mailto:${settings.email}`,
    },
  ].filter((c) => c.valeur);

  return (
    <>
      <Header settings={settings} />
      <main className="relative">
        <div className="grid-paper pointer-events-none absolute inset-x-0 top-0 h-[320px] [mask-image:linear-gradient(black,transparent)]" />
        <section className="container-page relative py-12 lg:py-16">
          <Reveal>
            <p className="eyebrow">Nous joindre</p>
            <h1 className="mt-3 max-w-[20ch] text-[38px] font-bold leading-[1.06] sm:text-[48px]">
              Un conseiller, pas un standard.
            </h1>
            <p className="mt-6 max-w-[52ch] text-[16.5px] leading-relaxed text-ink/70">
              Posez votre question avant de déposer un dossier. Nous répondons
              sous 24 heures ouvrées, et l&apos;échange n&apos;engage à rien.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {canaux.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08}>
                <a
                  href={c.href}
                  target={c.label === "WhatsApp" ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className="group flex h-full flex-col rounded-card border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-lift"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest transition-colors group-hover:bg-forest group-hover:text-mint">
                    <c.Icon size={20} />
                  </span>
                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
                    {c.label}
                  </p>
                  <p className="mt-2 text-[16px] font-semibold">{c.valeur}</p>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="rounded-card border border-line bg-white p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest">
                  <MapPin size={20} />
                </span>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
                  Adresse
                </p>
                <p className="mt-2 text-[16px] font-semibold">
                  {settings.adresse}
                </p>
              </div>
              <div className="rounded-card border border-line bg-white p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest">
                  <Clock size={20} />
                </span>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">
                  Horaires
                </p>
                <p className="mt-2 text-[16px] font-semibold">
                  {settings.horaires}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-5 flex flex-col items-start justify-between gap-6 rounded-card bg-forest px-8 py-9 text-mint sm:flex-row sm:items-center">
              <div>
                <h2 className="text-[22px] font-bold">
                  Vous préférez aller droit au but ?
                </h2>
                <p className="mt-2 max-w-[48ch] text-[14.5px] text-mint/70">
                  Déposez votre dossier : un conseiller vous rappelle avec une
                  proposition chiffrée.
                </p>
              </div>
              <Link href="/demande" className="btn-accent shrink-0">
                Déposer un dossier
                <ArrowRight size={17} />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
