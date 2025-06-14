// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
      },
      colors: {
        primary: {
        },
      },
      /* Handy animations – shadcn/ui already pulls tailwindcss-animate */
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn .4s ease-out both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
