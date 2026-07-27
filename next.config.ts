import type { NextConfig } from 'next';

const backendApiOrigin =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.63.124'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendApiOrigin}/api/:path*`,
      },
    ];
  },
};
export default nextConfig;
