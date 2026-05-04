import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "board-shake": {
          "0%,100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        "cursor-pulse": {
          "0%,100%": { opacity: "1", filter: "brightness(1.2)" },
          "50%": { opacity: "0.85", filter: "brightness(1.6)" },
        },
      },
      animation: {
        "board-shake": "board-shake 0.38s ease",
        "cursor-pulse": "cursor-pulse 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
