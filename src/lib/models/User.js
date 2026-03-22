import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  title: String,
  email: String,
  location: String, // <--- NEW FIELD
  bio: String,
  profileImage: String,
  backgroundImage: String,
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
  },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', userSchema);