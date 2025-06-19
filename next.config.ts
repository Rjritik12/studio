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
    // Consider unoptimized: true if you have issues with images in the exported app.
    // For now, we keep it optimized and you can adjust if needed.
  },
  // Enable static export for Capacitor
  output: 'export',
};

export default nextConfig;
