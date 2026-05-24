/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        app: "#050608",
        panel: "#0f1318",
        panelSoft: "#141a20",
        line: "rgba(255,255,255,0.08)",
        primary: "#6ee7b7",
        primaryDeep: "#17c7a1",
        accent: "#4f7cff",
        danger: "#ff6b7a",
        warning: "#ffb84d",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 80px rgba(79, 124, 255, 0.18)",
        glass: "0 18px 60px rgba(0, 0, 0, 0.25)",
      },
      backgroundImage: {
        hero:
          "radial-gradient(circle at top left, rgba(79,124,255,0.24), transparent 30%), radial-gradient(circle at top right, rgba(110,231,183,0.18), transparent 26%), linear-gradient(180deg, rgba(12,16,22,0.95), rgba(5,6,8,1))",
        panel:
          "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2.8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.9" },
        },
      },
    },
  },
  plugins: [],
};
