// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- UPDATED IMAGE CONFIGURATION ---
  images: {
    // The `remotePatterns` array is the new, recommended way to allow external images.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**', // Allows any path on this hostname
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // Allows any path for Google user profile images
      },
      // Note: 'localhost' is generally not needed for remotePatterns
      // as local images are handled differently. If you have a specific
      // use case for it, you can add a pattern for it too.
    ],
    // The formats configuration is still valid and can be kept.
    formats: ['image/avif', 'image/webp'],
  },
  
  // Your existing security headers configuration (unchanged)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);