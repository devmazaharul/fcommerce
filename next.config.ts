import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",       // সব host allow করতে ** বা * ব্যবহার করা যায়
        port: "",             // optional
        pathname: "/**",      // optional, সব path allow
      },
    ],
  },
};

export default nextConfig;
