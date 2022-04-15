module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        roboto: [
          'Roboto',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
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
      backgroundImage: {
        'blog-background_dark': "url('../public/blog-background_dark.jpg')",
        'blog-background': "url('../public/blog-background.jpg')",
      },
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
