/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#4f46e5',
        background: '#f5f6fa',
        foreground: '#1a202c',
        primary: {
          DEFAULT: '#4f46e5',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#eef2ff',
          foreground: '#4f46e5',
        },
        muted: {
          DEFAULT: '#f8fafc',
          foreground: '#718096',
        },
        accent: {
          DEFAULT: '#eef2ff',
          foreground: '#4f46e5',
        },
        destructive: {
          DEFAULT: '#e53e3e',
          foreground: '#ffffff',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1a202c',
        },
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
    },
  },
  plugins: [],
};
