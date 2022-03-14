// You can choose which headers to add to the list
// after learning more below.
const securityHeaders = [
  // faster external page loads
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // disable iframes basiclly
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // don't try and guess data types of items
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // add csp headers?
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // enables strict mode, basiclly yells at you more
  reactStrictMode: true,
  // disable swc minify
  swcMinify: false,
  // create source maps for prod so we know where our errors come from
  productionBrowserSourceMaps: true,
  // outputStandalone: true,
  images: {
    // min cache time to life
    minimumCacheTTL: 60,
    // allows for our logo
    dangerouslyAllowSVG: true,
    // enforce csp for images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // compress web traffic
  compress: true,
  // specify headers
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
