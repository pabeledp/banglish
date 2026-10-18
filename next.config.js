/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  ...(isProd ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(!isProd
    ? {
        async rewrites() {
          return [
            {
              source: '/api/:path*',
              destination: 'https://banglish.bd/api/:path*',
            },
          ];
        },
      }
    : {}),
};

module.exports = nextConfig;
