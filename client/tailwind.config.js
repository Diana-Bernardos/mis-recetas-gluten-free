/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          light: 'rgb(242, 209, 198)',
          DEFAULT: 'rgb(242, 209, 198)',
          dark: 'rgb(195, 126, 103)',
        },
        coffee: {
          light: 'rgb(122, 84, 74)',
          DEFAULT: 'rgb(82, 54, 44)',
          dark: '#3e261f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
