/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        myBlue: {
          100: '#B3D5F8',
          200: '#377CC3',
        },
        myRed: '#ED5B5B',
        myBeige: {
          100: '#E9DEC5',
        },
        myGrey: {
          100: '#EAEAEA',
          200: '#3F4756',
        },
      },

      fontFamily: {
        exo: ['"Exo 2"', 'sans-serif'],
        source: ['"Source Sans Pro"', 'sans-serif'],
      },

      fontSize: {
        9: '0.5625rem',
      },
      borderRadius: {
        registerLogin: '7.5rem',
        registerImage: '3.75rem',
      },

      container: {
        center: true,
        padding: '1rem',
      },

      boxShadow: {
        '3xl':
          'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('autoprefixer')],
};
