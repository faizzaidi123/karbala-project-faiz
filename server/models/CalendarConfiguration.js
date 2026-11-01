import mongoose from 'mongoose';

const CalendarConfigurationSchema = new mongoose.Schema({
  region: { type: String, required: true, unique: true, index: true },
  label: { type: String, required: true },
  timezone: { type: String, default: 'Asia/Kolkata' },
  hijriMethod: { type: String, default: 'Subcontinent Local Crescent Sighting (Ru’yat-e-Hilal)' },
  moonSightingSource: { type: String, default: 'Local Ru’yat-e-Hilal / Marja’ Liaison Office' },
  moonStatus: {
    type: String,
    enum: ['calculated', 'expected', 'awaiting_confirmation', 'confirmed', 'manually_verified'],
    default: 'confirmed'
  },
  manualOffset: { type: Number, default: 0, min: -3, max: 3 },
  dayBoundary: { type: String, enum: ['midnight', 'maghrib'], default: 'midnight' },
  featuredEventSlug: { type: String, default: '' },
  adminNote: { type: String, default: '' },
  lastVerified: { type: Date, default: Date.now },
  auditLog: [
    {
      action: { type: String },
      administrator: { type: String, default: 'Curatorial Calendar Admin' },
      previousOffset: { type: Number },
      newOffset: { type: Number },
      moonStatus: { type: String },
      note: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.models.CalendarConfiguration || mongoose.model('CalendarConfiguration', CalendarConfigurationSchema);
