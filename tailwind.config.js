/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#1A1512",
        panel: "#241C17",
        line: "#3A2F27",
        deep: "#120E0C",
        ink: "#F3E9DC",
        mute: "#B8A790",
        amber: "#E8A33D",
        teal: "#4FD1C5",
        danger: "#D9573B",
        ok: "#6FCF7A",
      },
      fontFamily: {
        display: ["Oswald_700Bold"],
        body: ["SourceSans3_400Regular"],
        bodyb: ["SourceSans3_600SemiBold"],
      },
    },
  },
};
