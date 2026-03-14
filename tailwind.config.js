/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./examples/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        synth: {
          blue: '#00d2ff',
          red: '#ff4d4d',
          dark: '#121212',
          panel: '#222222',
          module: '#2d2d2d',
        }
      }
    },
  },
  plugins: [],
}
