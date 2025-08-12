import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Fixed: serverExternalPackages (NOT experimental.serverComponentsExternalPackages)
  serverExternalPackages: ['@supabase/supabase-js'],
  
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
