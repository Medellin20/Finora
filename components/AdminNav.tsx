"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, Inbox, LogOut, Settings2 } from "lucide-react";

const LIENS = [
  { href: "/admin", label: "Dossiers", Icon: Inbox },
  { href: "/admin/contact", label: "Coordonnées", Icon: Settings2 },
];

export default function AdminNav({ societe }: { societe: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // La page de connexion partage ce layout mais n'affiche pas la navigation
  if (pathname === "/admin/login") return null;

  async function deconnexion() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-[9px] bg-forest font-display text-[15px] font-bold text-mint"
            >
              F
            </span>
            <span className="font-display text-[16px] font-bold">
              {societe}
              <span className="ml-2 rounded-pill bg-amber-soft px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink/70">
                Admin
              </span>
            </span>
          </span>

          <nav className="flex items-center gap-1">
            {LIENS.map(({ href, label, Icon }) => {
              const actif = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-pill px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                    actif
                      ? "bg-forest text-mint"
                      : "text-ink/60 hover:bg-mint hover:text-forest"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-pill px-3.5 py-2 text-[13.5px] font-medium text-ink/60 transition-colors hover:text-forest"
          >
            Voir le site
            <ExternalLink size={14} />
          </Link>
          <button
            type="button"
            onClick={deconnexion}
            className="flex items-center gap-2 rounded-pill border border-line px-3.5 py-2 text-[13.5px] font-medium text-ink/70 transition-colors hover:border-red-300 hover:text-red-700"
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
