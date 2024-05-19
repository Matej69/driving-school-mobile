
const colors = require("tailwindcss/colors")

const customColors = require('./app/colors');

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],     
  theme: {
    extend: {
      colors: customColors
    },
  }
}