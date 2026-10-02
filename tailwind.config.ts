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
        ritual: {
          black: "#000000",
          elevated: "#111827",
          surface: "#1F2937",
          green: "#19D184",
          lime: "#BFFF00",
          pink: "#FF1DCE",
          gold: "#FACC15",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Fira Code", "monospace"],
      },
      boxShadow: {
        "glow-green": "0 0 30px -5px rgba(25, 209, 132, 0.25)",
        "glow-pink": "0 0 30px -5px rgba(255, 29, 206, 0.2)",
        "glow-lime": "0 0 30px -5px rgba(191, 255, 0, 0.2)",
        "glow-gold": "0 0 30px -5px rgba(250, 204, 21, 0.2)",
        card: "0 4px 40px -12px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "pulse-green": "pulseGreen 2s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "glow-breathe": "glowBreathe 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "scan-line": "scanLine 4s linear infinite",
      },
      keyframes: {
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 15px -3px rgba(25, 209, 132, 0.3)" },
          "50%": { boxShadow: "0 0 30px -3px rgba(25, 209, 132, 0.5)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 15px -3px rgba(250, 204, 21, 0.3)" },
          "50%": { boxShadow: "0 0 30px -3px rgba(250, 204, 21, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowBreathe: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-green":
          "radial-gradient(ellipse at 20% 50%, rgba(25, 209, 132, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255, 29, 206, 0.05) 0%, transparent 50%)",
        "mesh-hero":
          "radial-gradient(ellipse at 30% 0%, rgba(25, 209, 132, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 100%, rgba(255, 29, 206, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(191, 255, 0, 0.04) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
