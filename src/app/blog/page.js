import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

export const revalidate = 3600;

export const metadata = {
  title: 'Blog',
  description: 'Notes on what I build, break, and learn along the way.',
};

function readingTime(content) {
  return `${Math.max(1, Math.ceil((content || '').split(/\s+/).filter(Boolean).length / 200))} min read`;
}

async function getPosts() {
  try {
    await connectDB();
    return JSON.parse(JSON.stringify(
      await Post.find({ published: true }).sort({ createdAt: -1 }).lean()
    ));
  } catch (error) {
    console.error('DB Error on blog page:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main className="pt-28 pb-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-12">
            Notes on what I build, break, and learn along the way.
          </p>

          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-500">Nothing published yet — first post coming soon.</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h2 className="text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-500 mt-2">
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </time>
                    <span>· {readingTime(post.content)}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-3">
                    {post.excerpt || `${(post.content || '').replace(/[#*>`]/g, '').slice(0, 160)}…`}
                  </p>
                  {post.tags?.length > 0 && (
                    <div className="flex gap-2 mt-4">
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
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}