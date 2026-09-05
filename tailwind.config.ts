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
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc8fb",
          400: "#36aaf5",
          500: "#0c8ee9",
          600: "#026fc7",
          700: "#0359a1",
          800: "#074b85",
          900: "#0b3f6f",
          950: "#07284a",
        },
        navy: {
          800: "#132338",
          850: "#0f1c2e",
          900: "#0B192C",
          950: "#060E18",
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
        fintech: "0 10px 25px -5px rgba(11, 25, 44, 0.08), 0 8px 10px -6px rgba(11, 25, 44, 0.04)",
        card: "0 4px 20px -2px rgba(11, 25, 44, 0.06), 0 2px 6px -1px rgba(11, 25, 44, 0.03)",
        glow: "0 0 25px -3px rgba(2, 111, 199, 0.25)",
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
