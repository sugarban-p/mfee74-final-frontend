import type { NextConfig } from 'next';

const backendApiOrigin =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendApiOrigin}/api/:path*`,
      },
    ];
  },
};
// module.exports = {
//   allowedDevOrigins: ['192.168.63.124'],
// }
export default nextConfig;
