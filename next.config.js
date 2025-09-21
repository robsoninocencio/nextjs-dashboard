/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // ppr: 'incremental', // Mantido como experimento ativo
    serverActions: {}, // Mantido como objeto vazio
    typedRoutes: true, // Mantido como experimento ativo
  },
};

module.exports = nextConfig;
