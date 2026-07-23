/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/shop',
        permanent: true, // Set to true for permanent 301 redirect
      },
    ];
  },
};

module.exports = nextConfig;