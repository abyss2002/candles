import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'czgdlffhyvsyfnppxnbx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: true,
  },
  output: 'export',
};

export default nextConfig;
