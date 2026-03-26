import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

// 1. Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// 2. Define Schemas locally (needed for standalone scripts)
const userSchema = new mongoose.Schema({
  name: String,
  title: String,
  profileImage: String,
  backgroundImage: String,
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
  },
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  // ... other fields
});

// 3. Create Models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

async function fixImages() {
  try {
    console.log('Connecting to Database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // --- FIX USER PROFILE ---
    console.log('Fixing User Profile images...');
    const user = await User.findOneAndUpdate(
      {}, // Find the first user
      {
        profileImage: 'https://placehold.co/150x150/blue/white?text=Avatar',
        backgroundImage: 'https://placehold.co/1200x600/blue/white?text=Workspace+Background'
      },
      { new: true, upsert: true }
    );
    console.log(`User updated: ${user.name}`);

    // --- FIX PROJECT IMAGES ---
    console.log('Fixing Project images...');
    const projects = await Project.find({});

    for (const project of projects) {
      // If the image is invalid (doesn't start with http), replace it
      if (!project.image || !project.image.startsWith('http')) {
        project.image = `https://placehold.co/600x400/2563eb/white?text=${encodeURIComponent(project.title)}`;
        await project.save();
        console.log(`Fixed image for project: ${project.title}`);
      }
    }

    console.log('\n✅ All images fixed! Restart your dev server (Ctrl+C, then npm run dev) to see changes.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close connection
    mongoose.connection.close();
  }
}

fixImages();