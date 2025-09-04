/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    localeDetection: false,
  },
};

export default nextConfig;
