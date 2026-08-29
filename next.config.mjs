/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Add other domains you plan to use (e.g., GitHub, Imgur, AWS)
      {
        protocol: 'https',
        hostname: '**', // Allows all https domains (useful for admin dashboards where users paste any link)
      },
    ],
  },
};

export default nextConfig;
