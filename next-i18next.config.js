const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'el',
    locales: ['el', 'en'],
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
};
