import connectDB from '@/lib/mongodb';
import Post from '@/lib/models/Post';

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  let posts = [];
  try {
    await connectDB();
    posts = await Post.find({ published: true }).lean();
  } catch {
    // DB unreachable — homepage-only sitemap is still valid
  }

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt || p.createdAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
  ];
}