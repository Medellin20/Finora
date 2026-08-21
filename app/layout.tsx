import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BOULANGER FINANCE INTER",
    template: "%s · BOULANGER FINANCE INTER",
  },
  description:
    "Simulez votre prêt, déposez votre dossier en ligne et recevez une réponse de principe le jour même. Prêt personnel, professionnel et immobilier.",
  openGraph: {
    title: "BOULANGER FINANCE INTER",
    description:
      "Simulez, déposez votre dossier, recevez les fonds sous 72 heures ouvrées.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={openSans.variable}
    >
      <body>{children}</body>
    </html>
  );
}
