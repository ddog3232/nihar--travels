/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'editor-dark': '#1a1a1a',
        'editor-panel': '#2d2d2d',
        'editor-border': '#404040',
        'editor-accent': '#60a5fa',
      },
    },
  },
  plugins: [],
}
