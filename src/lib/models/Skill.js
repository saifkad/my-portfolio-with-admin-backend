import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  category: { type: String, enum: ['frontend', 'backend', 'tools'] },
  name: String,
  proficiency: Number,
  icon: String,
  order: {type: Number, default: 0},
});

export default mongoose.models.Skill || mongoose.model('Skill', skillSchema);