import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EEF3F9",
          100: "#D8E4F2",
          200: "#B1C8E4",
          300: "#82A6D2",
          400: "#5482BC",
          500: "#2B4C8C",
          600: "#223D72",
          700: "#192F59",
          800: "#122342",
          900: "#0B172E",
          950: "#070F1F",
        },
        gold: {
          50: "#FBF7EC",
          100: "#F4E9CC",
          200: "#E8D196",
          300: "#DCB860",
          400: "#CE9F38",
          500: "#B88624",
          600: "#94681A",
          700: "#724E15",
          800: "#543A11",
          900: "#3B280C",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(11, 23, 46, 0.05), 0 8px 24px -8px rgba(11, 23, 46, 0.08)",
        "card-hover": "0 4px 12px rgba(11, 23, 46, 0.08), 0 18px 36px -12px rgba(11, 23, 46, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
