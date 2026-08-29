import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  image: String,
  technologies: [String],
  githubUrl: String,
  liveUrl: String,
  featured: Boolean,
  order: { type: Number, default: 0 },
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);