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
  await connectDB();

  // 1. Fetch Data
  const userDoc = await User.findOne({}).lean();
  const skillsDocs = await Skill.find({}).sort({ order: 1 }).lean();
  const projectsDocs = await Project.find({}).sort({ order: 1 }).lean();

  // 2. Convert to Plain JSON (Fixes the warnings)
  const userData = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null;
  const skills = JSON.parse(JSON.stringify(skillsDocs));
  const projects = JSON.parse(JSON.stringify(projectsDocs));

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