import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#B8860B',
        ivory: '#F5F0E8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.4em',
        'ultra-wide': '0.6em',
      },
      lineHeight: {
        luxury: '1.8',
      },
    },
  },
  plugins: [],
};

export default config;