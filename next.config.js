/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    images: {
      unoptimized: true
    }
  },
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId}) {
    return {
      "/": {page: "/"}
    }
  },
  assetPrefix: './'
}

module.exports = nextConfig
