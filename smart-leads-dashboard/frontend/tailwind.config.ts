import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        sidebar: '#0f172a',
        surface: '#1a2332',
        'surface-2': '#1e2a3a',
        'surface-3': '#243044',
        'border-dark': '#2a3a50',
      },
    },
  },
  plugins: [],
};

export default config;
