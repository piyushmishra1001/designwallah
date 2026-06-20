import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#10141C",
          soft: "#171C26",
          line: "#262D3A",
        },
        paper: {
          DEFAULT: "#F7F6F2",
          dim: "#E8E6DE",
        },
        signal: {
          DEFAULT: "#E8A33D",
          dim: "#8A6526",
        },
        flag: {
          DEFAULT: "#E0654A",
          dim: "#7A3527",
        },
        slate: {
          mute: "#6B7280",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
