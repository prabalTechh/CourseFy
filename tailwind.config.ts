import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Custom CSS variables for colors
        foreground: "var(--foreground)",
      },
      fontFamily: {
        jersey: ['"Jersey 25"', ...defaultTheme.fontFamily.sans], // Add Jersey 25
      },
    },
  },
  plugins: [], // No additional plugins
} satisfies Config;
