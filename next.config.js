/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }, // important for static export
  transpilePackages: ['three'], // three ships ESM; lets Next bundle it for the 3D hero
};

module.exports = nextConfig;
