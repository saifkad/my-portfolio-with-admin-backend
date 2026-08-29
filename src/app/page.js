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

export const dynamic = 'force-dynamic';

export default async function Home() {
  let userData = null;
  let skills = [];
  let projects = [];

  try {
    await connectDB();
    const [userDoc, skillsDocs, projectsDocs] = await Promise.all([
      User.findOne({}).lean(),
      Skill.find({}).sort({ order: 1 }).lean(),
      Project.find({}).sort({ order: 1 }).lean(),
    ]);
    userData = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null;
    skills = JSON.parse(JSON.stringify(skillsDocs));
    projects = JSON.parse(JSON.stringify(projectsDocs));
  } catch (error) {
    console.error('DB Error on homepage:', error);
    // Fall through with fallback content — page still renders
  }

  return (
    <>
      <Header />
      <main>
        <Hero userData={userData} />
        <About userData={userData} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}