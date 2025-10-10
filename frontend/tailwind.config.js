/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navbar: "#1c2529",
        content: "#A1D1B1",
        primary: "#22c55e",
        secondary: "#A1D1B1",
      },
    },
  },
  darkMode: "class", // enable class-based dark mode
  plugins: [],
};
