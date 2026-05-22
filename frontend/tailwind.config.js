/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0B0F19',
        card: 'rgba(255,255,255,0.06)',
        border: 'rgba(255,255,255,0.08)',
        primary: '#F8FAFC',
        secondary: '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(to bottom right, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.2)',
      }
    },
  },
  plugins: [],
}
