/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F1115', // Deep Onyx
        surface: '#1A1D24', // Dark Slate
        primary: {
          DEFAULT: '#00F2FE', // Neon Cyan
          foreground: '#0F1115'
        },
        secondary: {
          DEFAULT: '#4FACFE', // Toxic Green
          foreground: '#0F1115'
        },
        muted: {
          DEFAULT: '#272A34',
          foreground: '#9CA3AF'
        },
        accent: {
          DEFAULT: '#00F2FE',
          foreground: '#0F1115'
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Oswald', 'Bebas Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
