/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'github.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'alexand7e.dev.br',
                port: '',
                pathname: '/**',
            },
        ],
    },
    env: {
        PORT: '7000',
    },
};

export default nextConfig;
