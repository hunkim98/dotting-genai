/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: "anonymous",
  reactStrictMode: true,
  images: {
    domains: ["oaidalleapiprodscus.blob.core.windows.net"],
  },
};

module.exports = nextConfig;
