import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST() {
  const username = process.env.GITHUB_USERNAME;
  if (!username) {
    return NextResponse.json({ error: 'GITHUB_USERNAME is not configured' }, { status: 500 });
  }

  try {
    await connectDB();
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
      { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' }
    );
    if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
    const repos = await res.json();

    // Your 6 most recently pushed, non-forked repos
    const candidates = repos.filter((r) => !r.fork).slice(0, 6);

    let added = 0;
    let updated = 0;
    for (const repo of candidates) {
      const data = {
        title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        description: repo.description || '',
        category: 'GitHub',
        image: '',
        technologies: [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 5),
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || '',
        featured: false,
        order: 999,
      };
      const existing = await Project.findOne({ githubUrl: repo.html_url });
      if (existing) {
        await Project.findByIdAndUpdate(existing._id, data);
        updated++;
      } else {
        await Project.create(data);
        added++;
      }
    }

    revalidatePath('/');
    return NextResponse.json({ success: true, added, updated });
  } catch (error) {
    console.error('GitHub sync error:', error);
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
  }
}