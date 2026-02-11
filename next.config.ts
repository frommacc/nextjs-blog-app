import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'adorable-kookabura-514.convex.cloud',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'dependable-alligator-696.eu-west-1.convex.cloud',
        port: '',
      },
    ],
  },
}

export default nextConfig
