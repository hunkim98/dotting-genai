const serverDestination = process.env.NEXT_PUBLIC_AI_URL + "/:path*";

/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: "anonymous",
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/genai/:path*",
        destination: serverDestination, // Proxy to Backend
      },
      // {
      //   source: "/image/upload",
      //   destination: "https://image.simpledimpleworld.com/upload", // Proxy to Backend
      // },
    ];
  },
};

module.exports = nextConfig;
