/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

module.exports = {
  reactStrictMode: true,
  i18n,
  images: {
    remotePatterns: [
      {
        // Local development
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/images/**',
      },
      {
        // Production backend on Render
        protocol: 'https',
        hostname: '*.onrender.com',
        pathname: '/images/**',
      },
      {
        // Cloudinary
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};
