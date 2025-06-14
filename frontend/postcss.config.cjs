module.exports = {
  // Tailwind v4 ✨ Use the *new* PostCSS plugin shipped as a separate package
  plugins: [
    require("@tailwindcss/postcss"),
    require("autoprefixer"),
  ],
};