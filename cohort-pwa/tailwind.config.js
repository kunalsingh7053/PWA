/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        metallic: {
          red: '#df0505',
          dark: '#3d0a0a',
          orange: '#ff6b35',
        },
      },
    },
  },
  plugins: [],
}
