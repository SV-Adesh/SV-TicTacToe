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
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 1.5s infinite',
        'win-pulse': 'winPulse 1.5s infinite',
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
    // Ensure these classes are never purged
    'glass',
    'game-board',
    'game-cell',
    'winning-cell',
    'animate-appear',
    'bg-grid-pattern',
    'text-shadow',
    'text-glow',
    'x-symbol',
    'o-symbol',
    'glass',
    {
      pattern: /bg-(slate|cyan|pink|purple|red|green|amber)-(500|600|700|800|900)/,
    },
    {
      pattern: /text-(slate|cyan|pink|purple|red|green|amber)-(300|400|500)/,
    },
    {
      pattern: /border-(slate|cyan|pink|purple|red|green|amber)-(500|600|700)/,
    },
  ],
  plugins: [],
}

