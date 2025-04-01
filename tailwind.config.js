/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'glass',
    'game-board',
    'game-cell',
    'winning-cell',
    'bg-grid-pattern',
    {
      pattern: /bg-(slate|cyan|pink|purple|red|green|amber)-(900|800|700|600|500|400|300)/,
    },
    {
      pattern: /text-(slate|cyan|pink|purple|red|green|amber)-(400|300|200)/,
    },
    {
      pattern: /border-(slate|cyan|pink|purple|red|green|amber)-(500|400|300)/,
    },
  ],
  theme: {
    extend: {
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
} 