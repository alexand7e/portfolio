/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['alexand7e.dev.br'], // Replace with your allowed domains
    },
    env: {
        PORT: '7000',
    },
};

export default nextConfig;
