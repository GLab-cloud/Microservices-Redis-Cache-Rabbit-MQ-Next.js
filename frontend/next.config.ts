import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/user/:path*",
        destination: "http://localhost:5000/api/v1/:path*",
      },
      {
        source: "/api/blog/:path*",
        destination: "http://localhost:5002/api/v1/:path*",
      },
      {
        source: "/api/author/:path*",
        destination: "http://localhost:5001/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;