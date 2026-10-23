// Vite (unlike CRA/webpack) does not run PostCSS without this file.
// Without it, the @tailwind directives in src/index.css are not processed.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
