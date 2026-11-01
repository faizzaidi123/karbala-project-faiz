import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  locationId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  arabicName: String,
  category: String,
  image: String,
  savedAt: { type: Date, default: Date.now }
});

const Bookmark = mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
