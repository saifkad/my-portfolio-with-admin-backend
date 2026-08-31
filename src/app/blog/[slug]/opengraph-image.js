import { ImageResponse } from 'next/og';
import connectDB from '@/lib/mongodb';
import Post from '@/lib/models/Post';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  let title = 'Blog post';
  let tag = '';
  try {
    await connectDB();
    const post = await Post.findOne({ slug: params.slug, published: true }).lean();
    if (post) {
      title = post.title;
      tag = (post.tags || [])[0] || '';
    }
  } catch {
    // fallback values on DB failure — the image must always render
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, opacity: 0.6, marginBottom: 40 }}>
          {'<SaifDev />'} · Blog
        </div>
        <div
          style={{
            display: 'flex', fontSize: 56, fontWeight: 700, textAlign: 'center',
            padding: '0 80px', lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {tag && (
          <div
            style={{
              display: 'flex', fontSize: 28, opacity: 0.7, marginTop: 40,
              border: '2px solid rgba(255,255,255,0.4)', borderRadius: 999,
              padding: '8px 24px',
            }}
          >
            {tag}
          </div>
        )}
      </div>
    ),
    size
  );
}