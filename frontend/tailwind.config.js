/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        background: "#F9FAFD",
        primary: "#5146E5",
        secondary: "#E1E7FE",
        secondarytext: "#8686D0"
      }
    },
  },
  plugins: [],
}