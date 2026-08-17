/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#22543f',
        leaf: '#48bb78',
        // leaf/danger are bright enough for fills but fail WCAG AA as text on white.
        // These darker pairs are the text-safe versions (both >4.5:1).
        leafText: '#2f7a4f',
        earth: '#f5f5f0',
        danger: '#e53e3e',
        dangerText: '#9b2c2c',
        caution: '#b7791f',
      }
    },
  },
  plugins: [],
}
