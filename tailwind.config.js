/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#F5F7FA',
        'app-surface': '#FFFFFF',
        'app-border': '#E6E8EC',
        'app-text': '#0F172A',
        'app-muted': '#475569',
        'app-primary': '#1E8E64',
        'app-primary-900': '#0B3D2E',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      width: {
        'sidebar': '240px',
      },
      margin: {
        'sidebar': '240px',
      },
      borderRadius: {
        'card': '16px',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #0B3D2E 0%, #1E8E64 100%)',
      },
      maxWidth: {
        'screen-2xl': '1536px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }
    },
  },
  plugins: [],
}
