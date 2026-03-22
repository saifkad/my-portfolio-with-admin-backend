/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/seed.js
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    // Insert default user
    await db.collection('users').insertOne({
      name: 'Saif Al-Diresee',
      title: 'Full Stack Developer',
      email: 'saif@example.com',
      location: 'New York, USA', // <--- Add Location
      bio: 'Passionate developer creating amazing web experiences',
      profileImage: 'https://i.pravatar.cc/150?img=11', // Good placeholder
      backgroundImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    });

    // Insert sample skills
    const skills = [
      { category: 'frontend', name: 'React', proficiency: 90, order: 1 },
      { category: 'frontend', name: 'Next.js', proficiency: 85, order: 2 },
      { category: 'frontend', name: 'TypeScript', proficiency: 80, order: 3 },
      { category: 'backend', name: 'Node.js', proficiency: 85, order: 1 },
      { category: 'backend', name: 'Python', proficiency: 75, order: 2 },
      { category: 'tools', name: 'Git', proficiency: 90, order: 1 },
      { category: 'tools', name: 'Docker', proficiency: 70, order: 2 },
    ];

    await db.collection('skills').insertMany(skills);

    // Insert sample projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with Next.js and Stripe',
        category: 'fullstack',
        image: 'https://via.placeholder.com/400x200',
        technologies: ['Next.js', 'Stripe', 'MongoDB'],
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        featured: true,
        order: 1
      },
      {
        title: 'Task Management App',
        description: 'Real-time task management with React and Firebase',
        category: 'frontend',
        image: 'https://via.placeholder.com/400x200',
        technologies: ['React', 'Firebase', 'Tailwind'],
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        featured: true,
        order: 2
      }
    ];

    await db.collection('projects').insertMany(projects);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seed();