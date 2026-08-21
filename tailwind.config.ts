import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A1F1B",
        forest: {
          DEFAULT: "#0D4F3C",
          deep: "#0A3A2C",
          light: "#16785C",
        },
        mint: "#E3F2EA",
        paper: "#F7F7F4",
        amber: {
          DEFAULT: "#E8A33D",
          soft: "#FBEBD0",
        },
        line: "#DCDFD8",
      },
      fontFamily: {
        display: ["var(--font-open-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-open-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,31,27,.04), 0 12px 32px -12px rgba(10,31,27,.14)",
        lift: "0 2px 4px rgba(10,31,27,.05), 0 24px 48px -20px rgba(10,31,27,.25)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        marquee: "marquee 44s linear infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
