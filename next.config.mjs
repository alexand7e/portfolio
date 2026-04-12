/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Removendo i18n para usar implementação customizada
  // i18n: {
  //   locales: ['pt', 'en'],
  //   defaultLocale: 'pt',
  //   localeDetection: false, // Corrigido para false
  // },
  images: {
    domains: ['github.com', 'api.github.com'],
  },
  // Permitir requisições para api.github.com
  async redirects() {
    return [
      { source: '/now', destination: '/agora', permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/github/:path*',
        destination: 'https://api.github.com/:path*',
      },
    ];
  },
};

export default nextConfig;
