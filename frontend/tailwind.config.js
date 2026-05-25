/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bullish: '#10B981',
        bearish: '#EF4444',
        neutral: '#F59E0B',
        primary: '#0F172A',
        secondary: '#E2E8F0',
        accent: '#06B6D4',
      },
      backgroundColor: {
        dark: 'rgba(15, 23, 42, 0.7)',
      },
      backdropFilter: {
        blur: 'blur(10px)',
      },
    },
  },
  plugins: [],
};
