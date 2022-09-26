/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TODO: Remove once integration with BE is complete
  images: {
    domains: ["placebeard.it"],
  },
};

module.exports = nextConfig;
