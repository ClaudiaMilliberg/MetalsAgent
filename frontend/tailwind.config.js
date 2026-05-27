/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sentiment colors
        bullish: '#10B981',
        bearish: '#EF4444',
        neutral: '#F59E0B',
        // Base colors - upgraded to deeper black
        primary: '#0a0e1a',
        secondary: '#E2E8F0',
        accent: '#06B6D4',
        // Neon commodity colors for 2026 aesthetic
        'neon-copper': '#f97316',
        'neon-gold': '#eab308',
        'neon-uranium': '#06b6d4',
        'neon-lithium': '#84cc16',
        'neon-palladium': '#a855f7',
        'neon-nickel': '#ec4899',
        'neon-silver': '#f0f9ff',
        'neon-aluminum': '#22d3ee',
      },
      backgroundColor: {
        dark: 'rgba(10, 14, 26, 0.8)',
        'glass-dark': 'rgba(10, 14, 26, 0.5)',
      },
      backdropFilter: {
        blur: 'blur(10px)',
        'blur-xl': 'blur(20px)',
        'blur-2xl': 'blur(40px)',
      },
      boxShadow: {
        'glow-copper': '0 0 30px rgba(249, 115, 22, 0.3)',
        'glow-gold': '0 0 30px rgba(234, 179, 8, 0.3)',
        'glow-uranium': '0 0 30px rgba(6, 182, 212, 0.3)',
        'glow-lithium': '0 0 30px rgba(132, 204, 22, 0.3)',
        'glow-palladium': '0 0 30px rgba(168, 85, 247, 0.3)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(168, 85, 247, 0.5)' },
          '50%': { 'box-shadow': '0 0 40px rgba(168, 85, 247, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'],
};
