import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0F0F12", soft: "#17171C", raised: "#1F1F26" },
        beige: { DEFAULT: "#E8DCC8" },
        gold: { DEFAULT: "#C9A96A", light: "#DCC18A" },
        azure: { DEFAULT: "#7FA8D7" },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "Tajawal", "system-ui", "sans-serif"],
        display: ["var(--font-amiri)", "Amiri", "serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: { float: "float 7s ease-in-out infinite" },
    },
  },
  plugins: [],
};

export default config;
