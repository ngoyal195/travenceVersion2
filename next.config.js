/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three'],

  // GitHub Pages project repository
  basePath: '/travenceVersion2',
};

module.exports = nextConfig;
