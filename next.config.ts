import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    async rewrites() {
        return [
            {
                source: '/admin',
                destination: '/admin/founds',
            },
        ]
    },
    async redirects() {
        return [
            {
                source: '/admin',
                destination: '/admin/founds',
                permanent: true,
            },
        ]
    },
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"],
        serverActions: {
            bodySizeLimit: '100mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
