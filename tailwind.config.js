module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    listStyleType: {
      roman: 'upper-roman',
      disc: 'disc',
      circle: 'circle',
      square: 'square',
      decimal: 'decimal',
      loweralpha: 'lower-alpha',
      upperalpha: 'upper-alpha',
      lowerroman: 'lower-roman',
      upperroman: 'upper-roman',
    },
    safelist: [
      'text-2xl',
      'text-3xl',
      {
        pattern: /bg-(red|emerald|blue|sky|fuchsia|yellow)-(400|500)/,
      },
    ],
  },
  plugins: [],
};
