const pixelCharacterServer = process.env.PIXEL_CHARACTER_GEN + "/:path*";
const pixelizerServer = process.env.PIXELIZER + "/:path*";

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
      {
        source: "/pixelizer/:path*",
        destination: pixelizerServer, // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
