import mongoose from 'mongoose';

const pilgrimageEventsSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true }, // e.g. "arbaeen", "ashura", "nisf_shaban", "arafah"
  nameEnglish: { type: String, required: true },
  nameArabic: { type: String, required: true },
  islamicDate: { type: String, required: true }, // e.g. "20 Safar"
  significance: { type: String, required: true },
  historicalOrigin: { type: String, default: '' },
  peakDurationDays: { type: Number, default: 1 },
  averageScale: { type: String, default: 'Millions' },
  historicalHighAttendance: {
    year: Number,
    count: Number,
    source: String
  },
  countingMethodologyUsed: { type: String, default: '' }
});

const PilgrimageEvents = mongoose.models.PilgrimageEvents || mongoose.model('PilgrimageEvents', pilgrimageEventsSchema);

export default PilgrimageEvents;
