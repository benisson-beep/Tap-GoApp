import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#00A3E0", // AC Mobility signature cyan
          600: "#008ec2",
          700: "#00739e",
          800: "#005a7a",
          900: "#00425a",
          950: "#002838",
        },
        ac: {
          cyan: "#00A3E0",
          royal: "#163B82",
          navy: "#0B2050",
          dark: "#071533",
        },
        navy: {
          800: "#112852",
          850: "#0e2247",
          900: "#0B1C3B",
          950: "#061024",
        },
        momo: {
          yellow: "#FFCC00",
          yellowHover: "#E6B800",
          dark: "#1A1600",
          light: "#FFF9E6",
        },
        airtel: {
          red: "#ED1C24",
          redHover: "#D0131A",
          dark: "#2A0506",
          light: "#FDF0F1",
        },
      },
      boxShadow: {
        fintech: "0 10px 25px -5px rgba(11, 32, 80, 0.08), 0 8px 10px -6px rgba(11, 32, 80, 0.04)",
        card: "0 4px 20px -2px rgba(11, 32, 80, 0.06), 0 2px 6px -1px rgba(11, 32, 80, 0.03)",
        glow: "0 0 25px -3px rgba(0, 163, 224, 0.35)",
        cardGlow: "0 12px 30px -5px rgba(0, 163, 224, 0.25), 0 4px 12px -2px rgba(11, 32, 80, 0.2)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
export default config;
