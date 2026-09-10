import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // Required in Next.js 16+ so /_next/image can fetch from Local WP (.local / private network)
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "crilio-decants.local",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "crilio-decants.local",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
