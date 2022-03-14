const {url} = require('inspector');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    listStyleType: {
      roman: 'upper-roman',
      circle: 'circle',
      square: 'square',
    },
  },
  plugins: [],
};
