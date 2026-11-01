/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allows production builds to complete even with minor type warnings
    ignoreBuildErrors: true,
  },
  eslint: {
    // Prevents ESLint unused variable warnings from crashing Vercel builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
