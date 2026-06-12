/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0a0813',
        surface: 'rgba(21,16,31,0.7)',
        surface2: 'rgba(28,21,48,0.7)',
        surface3: 'rgba(36,27,58,0.7)',
        border: '#2c2240',
        accent: '#8b5cf6',
        accent2: '#a78bfa',
        accent3: '#c4b5fd',
        win: '#34d399',
        loss: '#f87171',
        be: '#9ca3af',
      },
      boxShadow: {
        glow: '0 0 24px -8px rgba(139, 92, 246, 0.45)',
      },
    },
  },
  plugins: [],
}
