/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cookie: {
          100: '#F7EDE0',
          200: '#EDD4B0',
          300: '#C9955A',
          400: '#A0652A',
        },
        herb: {
          100: '#EAF3EC',
          200: '#5A9E6F',
        },
        nutr: {
          200: '#5B9EC9',
        },
        myText: {
          base: '#3D3529',
          heading: '#1F1A14',
          muted: '#9C9080',
        },
        myRed: '#ED5B5B',
        surface: '#FFFDF9',
        myYellow: '#EAB308',
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('autoprefixer')],
};
