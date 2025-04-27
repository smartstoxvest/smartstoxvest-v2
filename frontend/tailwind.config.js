/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // <- allow Tailwind inside all your pages/components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
