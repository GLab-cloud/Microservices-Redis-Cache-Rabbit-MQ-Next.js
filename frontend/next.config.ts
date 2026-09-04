import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/user/:path*",
        destination: "https://didactic-memory-5rg959677q624qvx-5000.app.github.dev/api/v1/:path*",
      },
      {
        source: "/api/blog/:path*",
        destination: "https://didactic-memory-5rg959677q624qvx-5002.app.github.dev/api/v1/:path*",
      },
      {
        source: "/api/author/:path*",
        destination: "https://didactic-memory-5rg959677q624qvx-5001.app.github.dev/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;