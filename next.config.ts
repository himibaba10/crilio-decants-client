import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Soft-nav back to a recent /shop?category=… payload without refetching RSC.
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
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
        hostname: "crilio.reactiveferdous.com",
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
