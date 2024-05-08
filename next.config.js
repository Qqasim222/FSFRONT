/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["cms-au.foodswitch.com", "df55ejckx5h0p.cloudfront.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms-au.foodswitch.com",
        port: "",
        pathname: "/tgicms_au/*",
      },
      {
        protocol: "https",
        hostname: "df55ejckx5h0p.cloudfront.net",
        port: "",
        pathname: "/production/au/tgicms_au/*",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
