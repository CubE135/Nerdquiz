/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    {
      pattern: /bg-(red|blue|orange|lime|green|yellow|sky|violet|pink|fuchsia)/
    }
  ],
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {},
  plugins: []
}
