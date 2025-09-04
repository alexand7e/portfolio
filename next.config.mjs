/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    localeDetection: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/?l=pt',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
