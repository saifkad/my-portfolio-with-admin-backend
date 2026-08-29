/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Baked in at build time — shown in the admin panel
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  images: {
    remotePatterns: [
      // Allow any https host (admin can paste any image URL)
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;