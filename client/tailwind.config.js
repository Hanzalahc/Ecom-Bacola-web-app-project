/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff5252",
        secondary: "#373737",
      },
      backgroundColor: {
        primary: "#ff5252",
        secondary: "#f5f0f0",
        whitebg: "#f1f1f1",
        
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      screens: {
        tablet: "600px", // sm & md
        laptop: "1030px", // lg
        desktop: "1280px", // xl
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
