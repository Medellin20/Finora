"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CircleAlert, Lock } from "lucide-react";

function FormulaireConnexion() {
  const router = useRouter();
  const params = useSearchParams();
  const suite = params.get("suite") || "/admin";

  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function connexion() {
    if (!password) {
      setErreur("Saisissez le mot de passe.");
      return;
    }
    setEnvoi(true);
    setErreur(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Connexion refusée.");
      router.push(suite);
      router.refresh();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Connexion refusée.");
      setEnvoi(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card w-full max-w-[420px] p-8"
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest">
        <Lock size={20} />
      </span>
      <h1 className="mt-6 text-[26px] font-bold">Espace administrateur</h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink/60">
        Accédez aux dossiers reçus et aux coordonnées affichées sur le site.
      </p>

      <div className="mt-7">
        <label className="field-label" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && connexion()}
          className="field"
          placeholder="••••••••"
        />
      </div>

      {erreur && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] text-red-800"
        >
          <CircleAlert size={16} className="mt-0.5 shrink-0" />
          {erreur}
        </p>
      )}

      <button
        type="button"
        onClick={connexion}
        disabled={envoi}
        className="btn-primary mt-6 w-full"
      >
        {envoi ? "Connexion…" : "Se connecter"}
        {!envoi && <ArrowRight size={16} />}
      </button>

      <Link
        href="/"
        className="mt-6 flex items-center justify-center gap-2 text-[13.5px] text-ink/50 transition-colors hover:text-forest"
      >
        <ArrowLeft size={14} />
        Retour au site
      </Link>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <main className="grid-paper flex min-h-screen items-center justify-center px-5 py-16">
      <Suspense fallback={<div className="card h-[420px] w-full max-w-[420px]" />}>
        <FormulaireConnexion />
      </Suspense>
    </main>
  );
}
