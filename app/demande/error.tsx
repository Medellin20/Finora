"use client";

export default function DemandeError({ reset }: { reset: () => void }) {
  return (
    <main className="container-page py-16">
      <section role="alert" className="card max-w-2xl p-8">
        <h1 className="text-xl font-bold">Le formulaire est temporairement indisponible</h1>
        <p className="mt-3 text-ink/70">Nous ne pouvons pas charger les informations nécessaires à votre demande. Veuillez réessayer dans quelques instants.</p>
        <button type="button" onClick={reset} className="btn-primary mt-5">Réessayer</button>
        <a href="/" className="ml-5 underline">Retour à l’accueil</a>
      </section>
    </main>
  );
}
