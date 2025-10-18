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
};

export default nextConfig;
