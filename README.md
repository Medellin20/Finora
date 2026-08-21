# Finora — site de courtage en crédit

Site vitrine professionnel avec dépôt de dossier en ligne et espace
d'administration. Construit avec Next.js 14 (App Router), TypeScript,
Tailwind CSS et Framer Motion.

---

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis éditez les deux variables
npm run dev                  # http://localhost:3000
```

### Variables d'environnement

| Variable         | Rôle                                                        |
| ---------------- | ----------------------------------------------------------- |
| `ADMIN_PASSWORD` | Mot de passe d'accès à `/admin`                              |
| `AUTH_SECRET`    | Clé de signature du cookie de session (32+ caractères)       |

Générer une clé solide :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Mise en production

```bash
npm run build
npm start
```

### Déploiement sur Netlify

Le dépôt contient un `netlify.toml` prêt à l'emploi. Connectez le dépôt Git
dans Netlify : le framework, la commande `npm run build` et le dossier `.next`
sont ensuite détectés automatiquement.

Dans **Project configuration → Environment variables**, ajoutez ces secrets
pour le contexte Production (et Deploy Previews si nécessaire) :

| Variable | Valeur |
| --- | --- |
| `ADMIN_PASSWORD` | Un mot de passe admin fort et unique |
| `AUTH_SECRET` | Une chaîne aléatoire d'au moins 32 caractères |

Ne copiez jamais `.env.local` dans Git. Netlify fournit automatiquement la
variable `NETLIFY=true` : l'application utilise alors **Netlify Blobs** pour
conserver les dossiers et réglages entre les déploiements. En local, les
fichiers JSON du dossier `data/` restent utilisés.

---

## Ce que contient le site

### Pages publiques

| Route                  | Contenu                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `/`                    | Accueil : simulateur, atouts, parcours, financements, avis, FAQ  |
| `/solutions/[slug]`    | Fiche détaillée par type de prêt (personnel, pro, immobilier)    |
| `/demande`             | Formulaire de dépôt de dossier en 3 étapes                       |
| `/contact`             | Canaux de contact, adresse, horaires                             |

Le **simulateur** de la page d'accueil calcule la mensualité en direct
(formule d'amortissement classique) et transmet le montant et la durée
choisis au formulaire de demande via l'URL.

### Espace d'administration

| Route             | Contenu                                                            |
| ----------------- | ------------------------------------------------------------------ |
| `/admin/login`    | Connexion par mot de passe                                          |
| `/admin`          | Dossiers reçus : indicateurs, recherche, filtres, détail, export CSV |
| `/admin/contact`  | Coordonnées, réseaux sociaux et réglages du simulateur              |

Dans la liste des dossiers, un clic sur une ligne ouvre un panneau
latéral permettant d'appeler ou d'écrire au demandeur, de changer le
statut (nouvelle / en cours / acceptée / refusée / archivée), de
consigner une note interne et de supprimer le dossier.

Les valeurs modifiées dans `/admin/contact` sont reprises
**immédiatement** par l'en-tête, le pied de page, la page contact et le
simulateur — aucune intervention dans le code n'est nécessaire.

---

## Structure

```
app/
  layout.tsx              Polices, métadonnées globales
  page.tsx                Accueil
  demande/                Formulaire de dépôt
  solutions/[slug]/       Fiches de financement
  contact/                Page contact
  admin/                  Espace protégé (layout + 3 pages)
  api/
    demandes/             POST public · GET admin
    demandes/[id]/        PATCH statut & note · DELETE
    settings/             GET public · PUT admin
    auth/login|logout/    Session admin
components/               Header, Footer, Simulateur, formulaires, tableau
lib/
  store.ts                Accès aux données (à remplacer pour une vraie BDD)
  auth.ts                 Session signée HMAC
  content.ts              Textes, référentiels, calculs financiers
  types.ts                Types partagés
middleware.ts             Protection de /admin
data/                     Fichiers JSON générés à l'exécution
```

---

## Sécurité

- Session par cookie `httpOnly`, `sameSite=lax`, `secure` en production,
  signée en HMAC-SHA256 et valable 8 heures.
- Vérification de session dans le middleware **et** dans chaque route API
  sensible : une requête directe à l'API sans cookie valide reçoit un 401.
- Comparaisons de mots de passe et de signatures à temps constant.
- Toutes les entrées du formulaire sont nettoyées et tronquées côté serveur.
- L'espace admin est exclu de l'indexation (`robots: noindex`).

---

## Stockage des données

En développement local, les données sont stockées dans des fichiers JSON sous
`data/`. Sur Netlify, la couche de stockage bascule automatiquement vers
Netlify Blobs afin que les dossiers et paramètres restent persistants.

Tout l'accès aux données reste isolé dans `lib/store.ts`. Pour migrer plus tard
vers une base relationnelle, conservez les signatures suivantes :

```ts
listDemandes()          // Promise<Demande[]>
createDemande(data)     // Promise<Demande>
updateDemande(id, patch)// Promise<Demande | null>
deleteDemande(id)       // Promise<boolean>
getSettings()           // Promise<Settings>
saveSettings(patch)     // Promise<Settings>
```

Aucun composant ni aucune route API n'a besoin d'être modifié.

---

## Personnalisation

- **Marque et couleurs** : `tailwind.config.ts` (palette `forest`, `mint`,
  `amber`, `ink`) et `app/globals.css`.
- **Police** : `app/layout.tsx` (Open Sans).
- **Textes, types de prêts, étapes, avis, FAQ** : `lib/content.ts`.
- **Coordonnées, devise, taux, bornes du simulateur** : depuis `/admin/contact`,
  sans toucher au code. Les valeurs par défaut sont dans `lib/store.ts`.

---

## Suites possibles

- Notification e-mail à chaque nouveau dossier (Resend, Nodemailer).
- Téléversement des pièces justificatives.
- Espace de suivi pour le demandeur via sa référence.
- Comptes administrateurs multiples avec rôles.
- Mentions légales et politique de confidentialité (obligatoires pour un
  site de courtage réel).
