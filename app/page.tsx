import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Atouts,
  BandeauCta,
  Etapes,
  Faq,
  Hero,
  Solutions,
  Temoignages,
} from "@/components/Sections";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      <Header settings={settings} />
      <main>
        <Hero settings={settings} />
        <Atouts />
        <Etapes />
        <Solutions />
        <Temoignages />
        <Faq />
        <BandeauCta settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
