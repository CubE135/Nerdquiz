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
    './nuxt.config.{js,ts}',
    './node_modules/flowbite/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        lightorange: '#FBC65B',
        darkorange: '#F29400',
        darkgray: '#131413',
        black: '#000000'
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
