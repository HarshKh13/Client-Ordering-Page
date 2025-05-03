/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'cdn.shopify.com',
            pathname: '/s/files/**', // Match the path pattern of your images
          },
        ],
      }
};

export default nextConfig;
