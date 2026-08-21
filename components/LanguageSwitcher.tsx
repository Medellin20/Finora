"use client";

import Script from "next/script";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "el", label: "Ελληνικά" },
  { code: "mn", label: "Монгол" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "tr", label: "Türkçe" },
  { code: "zh-CN", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "hi", label: "हिन्दी" },
];

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          options: Record<string, string | boolean>,
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("fr");
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobile) {
      window.googleTranslateElementInit = initTranslate;
      // Le script peut déjà être chargé après une navigation interne.
      initTranslate();
    }
    const saved = window.localStorage.getItem("finora-language");
    if (saved && LANGUAGES.some((item) => item.code === saved)) setLanguage(saved);

    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, [mobile]);

  function initTranslate(attempt = 0) {
    if (document.querySelector(".goog-te-combo")) return;

    const TranslateElement = window.google?.translate?.TranslateElement;
    if (typeof TranslateElement !== "function") {
      // Le script Google déclenche parfois son callback avant d'avoir fini
      // d'exposer le constructeur. On attend brièvement au lieu de planter.
      if (attempt < 20) {
        window.setTimeout(() => initTranslate(attempt + 1), 100);
      }
      return;
    }

    new TranslateElement(
      {
        pageLanguage: "fr",
        includedLanguages: LANGUAGES.map((item) => item.code).join(","),
        autoDisplay: false,
      },
      "google_translate_element"
    );
  }

  function selectLanguage(code: string) {
    setLanguage(code);
    setOpen(false);
    window.localStorage.setItem("finora-language", code);

    // Le cookie est lu par Google Translate au chargement. Cette méthode reste
    // fiable même si son sélecteur n'est pas encore prêt ou sur mobile.
    if (code === "fr") {
      document.cookie = "googtrans=; path=/; max-age=0; SameSite=Lax";
    } else {
      document.cookie = `googtrans=/fr/${code}; path=/; max-age=31536000; SameSite=Lax`;
    }
    window.location.reload();
  }

  const current = LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0];

  return (
    <div ref={root} className={`notranslate relative ${mobile ? "w-full" : ""}`}>
      {!mobile && (
        <>
          <Script
            id="google-translate"
            src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            strategy="afterInteractive"
            onLoad={() => initTranslate()}
          />
          <div id="google_translate_element" className="sr-only" aria-hidden />
        </>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Choisir la langue"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 text-[13px] font-semibold text-ink/75 transition-colors hover:border-forest hover:text-forest ${
          mobile ? "w-full" : ""
        }`}
      >
        <Languages size={16} />
        <span className={mobile ? "" : "hidden xl:inline"}>{current.label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Langues disponibles"
          className={`z-[70] mt-2 max-h-72 overflow-y-auto rounded-2xl border border-line bg-white p-2 shadow-lift ${
            mobile ? "relative w-full" : "absolute right-0 w-52"
          }`}
        >
          {LANGUAGES.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={language === item.code}
              onClick={() => selectLanguage(item.code)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13.5px] transition-colors hover:bg-mint hover:text-forest"
            >
              {item.label}
              {language === item.code && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
