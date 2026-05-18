/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f3f7f4',
          100: '#e3ede5',
          200: '#c7dccc',
          300: '#a1c3a9',
          400: '#76a583',
          500: '#558865',
          600: '#426c50',
          700: '#365742',
          800: '#2d4637',
          900: '#263a2e',
        },
        warm: {
          50: '#faf8f5',
          100: '#f4efe6',
          200: '#e8ddc8',
          300: '#d6c39e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
