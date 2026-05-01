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
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml' },
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/feed.xml',
        headers: [
          { key: 'Content-Type', value: 'application/rss+xml' },
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
