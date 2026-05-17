/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        nexus: {
          blue: '#0058be',
          'blue-light': '#2170e4',
          dark: '#0d1117',
          'dark-surface': '#111827',
          'dark-border': '#1e2535',
          'dark-card': '#1a2236',
        },
      },
    },
  },
  plugins: [],
};
