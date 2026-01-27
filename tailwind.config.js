/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        "brand-red": "#E11D48",
        "brand-red-dark": "#9F1239",
        "brand-black": "#0B0B0F",
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(225, 29, 72, 0.25)',
      },
    },
  },
  plugins: [],
};
