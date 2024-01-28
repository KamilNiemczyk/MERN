module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#DED0B6',
        'secondary': '#B2A59B',
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
        'serif': ['Roboto Slab', 'serif'],
        'pacifico': ['Pacifico', 'cursive'],
        'monoton': ['Monoton', 'cursive'],
      },
    },
  },
  plugins: [],
}