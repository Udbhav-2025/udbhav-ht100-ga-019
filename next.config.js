/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.stability.ai'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure Sharp works correctly in server-side code
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      // Sharp is a native module, should work fine in server-side
    }
    return config;
  },
}

module.exports = nextConfig
