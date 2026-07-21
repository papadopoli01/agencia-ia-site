/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05050A',
        neon: {
          purple: '#8A05BE',
          purpledeep: '#4C0F82',
          blue: '#00D2FF',
        },
        ink: '#F5F3FF',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: 0.35, transform: 'scale(1)' },
          '50%': { opacity: 0.55, transform: 'scale(1.12)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
