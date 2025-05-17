/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // Mantido como objeto vazio
    typedRoutes: true, // Mantido como experimento ativo
  },
};

module.exports = nextConfig;