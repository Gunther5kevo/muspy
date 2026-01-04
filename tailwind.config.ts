import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6A0DAD',
          dark: '#2B0E3F',
          light: '#E5C7FF',
        },
        gold: {
          DEFAULT: '#C1A35E',
          light: '#E5D9B6',
        },
        lilac: {
          DEFAULT: '#F8F5FF',
          dark: '#E5C7FF',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #2B0E3F 0%, #6A0DAD 50%, #E5C7FF 100%)',
        'gradient-hero': 'linear-gradient(to bottom right, #F8F5FF, #E5C7FF)',
      },
    },
  },
  plugins: [],
};
export default config;