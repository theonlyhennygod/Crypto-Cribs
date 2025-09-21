/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize for hydration
  experimental: {
    // Enable optimized client-side navigation
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },

  // Configure webpack for better browser compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure proper handling of client-side only code
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        ws: false, // Add WebSocket fallback for client-side
      };
    }

    // Handle WebSocket module resolution
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        ws: 'ws',
      });
    }

    return config;
  },

  // Headers to improve Chrome compatibility
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/_next/static/css/(.*)",
        headers: [
          {
            key: "Content-Type",
            value: "text/css",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
