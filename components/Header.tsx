"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import type { Settings } from "@/lib/types";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV = [
  { href: "/solutions/pret-personnel", label: "Prêt personnel" },
  { href: "/solutions/pret-professionnel", label: "Prêt professionnel" },
  { href: "/solutions/pret-immobilier", label: "Prêt immobilier" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ settings }: { settings: Settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-[10px] bg-forest font-display text-[17px] font-bold text-mint"
          >
            F
          </span>
          <span className="font-display text-[19px] font-bold tracking-tight">
            {settings.societe}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-[14.5px] font-medium text-ink/75 transition-colors hover:text-forest"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-amber transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <a
            href={`tel:${settings.telephone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 font-mono text-[13px] text-ink/70 transition-colors hover:text-forest"
          >
            <Phone size={14} />
            {settings.telephone}
          </a>
          <Link href="/demande" className="btn-primary">
            Déposer un dossier
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-[15px] font-medium text-ink/80 transition-colors hover:bg-mint hover:text-forest"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-line pt-3">
                <LanguageSwitcher mobile />
              </div>
              <Link
                href="/demande"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 w-full"
              >
                Déposer un dossier
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
