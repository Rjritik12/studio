
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    // Required for 'next export' if using next/image with default loader.
    // Capacitor works best with fully static assets.
    unoptimized: true, // Disable Image Optimization API for static export
  },
  // Enable static export for Capacitor
  output: 'export',
};

export default nextConfig;
