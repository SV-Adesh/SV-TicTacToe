/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'appear': 'appearAnimation 0.4s ease-out forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 1.5s infinite',
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  safelist: [
    'glass',
    'game-board',
    'game-cell',
    'winning-cell',
    'bg-grid-pattern',
    'animate-appear',
    {
      pattern: /bg-(slate|cyan|pink|purple|red|green|amber)-(900|800|700|600|500|400|300)/,
      variants: ['hover', 'focus', 'active'],
    },
    {
      pattern: /text-(slate|cyan|pink|purple|red|green|amber)-(400|300|200)/,
      variants: ['hover', 'focus'],
    },
    {
      pattern: /border-(slate|cyan|pink|purple|red|green|amber)-(500|400|300)/,
    },
    {
      pattern: /rounded-(xl|lg)/,
    },
    {
      pattern: /shadow-/,
    }
  ],
  plugins: [],
}

