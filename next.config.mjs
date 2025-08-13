// next.config.js

/** @type {import('next').NextConfig} */
import nextPWA from 'next-pwa'
const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  output: 'export', 
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
   trailingSlash: true, 
}

export default withPWA(nextConfig)
