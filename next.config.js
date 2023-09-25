const pixelCharacterServer = process.env.PIXEL_CHARACTER_GEN + "/:path*";

/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: "anonymous",
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/pixel_character/:path*",
        destination: pixelCharacterServer, // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
