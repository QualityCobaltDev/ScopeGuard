import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1240px"
        }
      },
      colors: {
        background: "rgb(var(--bg) / <alpha-value>)",
        foreground: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        brand: {
          DEFAULT: "#6C8DFF",
          soft: "#9CB2FF",
          dark: "#4566E0"
        },
        accent: "#43D8C9"
      },
      boxShadow: {
        glow: "0 20px 80px rgba(76, 111, 255, 0.25)"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 10% 20%, rgba(108,141,255,0.22), transparent 45%), radial-gradient(circle at 80% 10%, rgba(67,216,201,0.16), transparent 40%), radial-gradient(circle at 50% 100%, rgba(108,141,255,0.12), transparent 38%)"
      }
    }
  },
  plugins: []
};

export default config;
