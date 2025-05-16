// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true, // Habilita Server Actions
  },
};

module.exports = nextConfig;