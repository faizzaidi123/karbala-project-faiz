import mongoose from 'mongoose';

const reflectionSchema = new mongoose.Schema({
  userName: { type: String, default: 'Pilgrim' },
  locationId: String,
  reflectionText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Reflection = mongoose.models.Reflection || mongoose.model('Reflection', reflectionSchema);

export default Reflection;
