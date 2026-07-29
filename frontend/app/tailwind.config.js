/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#F5C400',
          bright: '#FFD60A',
          amber: '#FFB300',
          dark: '#CA8A04',
          pale: '#FDE68A',
        },
        app: {
          bg: '#0A0A0A',
          card: '#161616',
          card2: '#101010',
        },
        'lime-accent': '#A3E635',
        'amber-accent': '#F59E0B',
        'red-accent': '#EF4444',
        'text-sec': '#B0AA9A',
        'border-accent': 'rgba(255, 214, 10, 0.09)',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
