import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14171C",
        paper: "#F7F7F5",
        line: "#E4E4E0",
        tierA: "#1F7A4D",
        tierB: "#2563A6",
        tierC: "#B8862F",
        tierD: "#8A8A85",
        signal: "#D64545",
      },
      fontFamily: {
        display: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
