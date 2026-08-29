import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  path: String,
  referrer: String,
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.models.Visit || mongoose.model('Visit', visitSchema);