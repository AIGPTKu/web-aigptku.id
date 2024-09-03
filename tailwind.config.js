/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6B46C1", // Purple color
        secondary: "#805AD5",
        accent: "#9F7AEA",
        neutral: "#B794F4",
        "base-100": "#E9D8FD",
      },
    },
  },
  plugins: [],
};
