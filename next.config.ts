import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Any HTTPS image (for flexibility)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Performance
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
