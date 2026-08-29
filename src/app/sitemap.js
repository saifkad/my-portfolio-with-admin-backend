export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  ];
}