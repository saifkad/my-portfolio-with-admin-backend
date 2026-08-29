import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Skill from '@/lib/models/Skill';
import Project from '@/lib/models/Project';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Skills from '@/components/home/Skills';
import Projects from '@/components/home/Projects';
import Contact from '@/components/home/Contact';
import Footer from '@/components/home/Footer';
import VisitTracker from '@/components/VisitTracker';

// Static homepage, revalidated hourly (and instantly on every admin save — Part 3)
export const revalidate = 3600;

async function getData() {
  try {
    await connectDB();
    const [userDoc, skillsDocs, projectsDocs] = await Promise.all([
      User.findOne({}).lean(),
      Skill.find({}).sort({ order: 1 }).lean(),
      Project.find({}).sort({ order: 1 }).lean(),
    ]);
    return {
      userData: userDoc ? JSON.parse(JSON.stringify(userDoc)) : null,
      skills: JSON.parse(JSON.stringify(skillsDocs)),
      projects: JSON.parse(JSON.stringify(projectsDocs)),
    };
  } catch (error) {
    console.error('DB Error on homepage:', error);
    return { userData: null, skills: [], projects: [] }; // page still renders with fallbacks
  }
}

export async function generateMetadata() {
  const { userData } = await getData();
  const description = (userData?.heroIntro || userData?.bio || 'Professional developer portfolio').slice(0, 160);
  return {
    title: userData ? `${userData.name} — ${userData.title || 'Developer'}` : 'Portfolio',
    description,
  };
}

export default async function Home() {
  const { userData, skills, projects } = await getData();
  const base = process.env.NEXT_PUBLIC_BASE_URL || '';

  const jsonLd = userData && {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: userData.name,
    jobTitle: userData.title,
    url: base,
    sameAs: Object.values(userData.socialLinks || {}).filter(Boolean),
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header />
      <main>
        <Hero userData={userData} />
        <About userData={userData} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Contact />
      </main>
      <Footer />
      <VisitTracker /> {/* Part 6 */}
    </>
  );
}