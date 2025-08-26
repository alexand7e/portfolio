/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['github.com'], // Replace with your allowed domains
    },
    experimental: {
        outputFileTracingRoot: undefined,
    },
};

export default nextConfig;
