/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['JetBrains Mono', 'monospace'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'teal': {
          500: '#3DA8AC',  // Primary teal from logo
          600: '#298D91',  // Darker teal from logo
          700: '#2A8B90',  // Even darker teal
        },
        'cyan': {
          400: '#40B5B3',  // Light cyan from logo
          500: '#3EAFB8',  // Medium cyan from logo
        },
        'emerald': {
          500: '#33938A',  // Green-teal from logo
          600: '#2F9597',  // Darker green-teal
        },
      },
    },
  },
  plugins: [],
}
