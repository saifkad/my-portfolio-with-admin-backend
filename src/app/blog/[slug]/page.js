import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import connectDB from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

export const revalidate = 3600;

// Pre-render all published posts at build time; new ones render on demand
export async function generateStaticParams() {
  try {
    await connectDB();
    const posts = await Post.find({ published: true }).select('slug').lean();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    await connectDB();
    const post = await Post.findOne({ slug: params.slug, published: true }).lean();
    if (!post) return {};
    return {
      title: post.title,
      description: post.excerpt || (post.content || '').slice(0, 160),
    };
  } catch {
    return {};
  }
}

async function getPost(slug) {
  try {
    await connectDB();
    return await Post.findOne({ slug, published: true }).lean();
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound(); // drafts and unknown slugs get the 404

  const html = marked.parse(post.content || '');
  const minutes = Math.max(1, Math.ceil((post.content || '').split(/\s+/).filter(Boolean).length / 200));

  return (
    <>
      <Header />
      <main className="pt-28 pb-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link href="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            ← All posts
          </Link>

          <h1 className="text-4xl font-bold mt-4 mb-3 leading-tight">{post.title}</h1>
          <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-500 mb-8">
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </time>
            <span>· {minutes} min read</span>
          </div>

          {post.tags?.length > 0 && (
            <div className="flex gap-2 mb-8">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <article
            className="prose-blog bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}