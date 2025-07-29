/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: false, // Add this line to bypass optimization issues
  },
   env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  trailingSlash: true, // Helps with path resolution
   "rules": {
    "react/no-unescaped-entities": "off"
  }
};

export default nextConfig;
