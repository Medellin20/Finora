"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <section role="alert" className="card max-w-2xl p-6 sm:p-8">
      <h1 className="text-xl font-bold">Chargement temporairement impossible</h1>
      <p className="mt-3 text-ink/70">
        Les données de l’administration ne sont pas accessibles. Vérifiez la connexion
        au stockage et sa configuration dans l’hébergement, puis réessayez.
      </p>
      <p className="mt-3 text-sm text-ink/70">Aucune modification n’a été enregistrée.</p>
      <button type="button" onClick={reset} className="btn-primary mt-5">Réessayer</button>
    </section>
  );
}
