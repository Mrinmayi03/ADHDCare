// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          50: "#669b9bff",  // your custom pastel mint/teal
        },
      },
    },
  },
  plugins: [],
};
