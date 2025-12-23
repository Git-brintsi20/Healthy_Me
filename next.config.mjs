/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization for better performance
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true, // Allow all images including local ones
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Suppress source map warnings in development
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  // Disable source maps in development to avoid warnings
  productionBrowserSourceMaps: false,
}

export default nextConfig
