/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"], // Added Montserrat
        segoe: ['"Segoe UI"', "Roboto", "Arial", "sans-serif"], // Include fallbacks
        "segoe-light": ['"Segoe UI Light"', "Roboto", "Arial", "sans-serif"],
        "segoe-bold": ['"Segoe UI Bold"', "Roboto", "Arial", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};
