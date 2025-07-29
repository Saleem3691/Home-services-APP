/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        "rich-slate": "#1e293b",
        "lightest-slate": "#e2e8f0",
        "light-slate": "#94a3b8",
        "accent": "#7c3aed",
        
      }
    }
  },
  plugins: [],
}