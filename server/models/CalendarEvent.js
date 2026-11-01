import mongoose from 'mongoose';

const CalendarEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  arabicTitle: { type: String, default: '' },
  eventType: {
    type: String,
    enum: ['wiladat', 'shahadat', 'wafat', 'karbala', 'historical', 'ziyarat_occasion', 'sacred_day'],
    required: true,
    index: true
  },
  hijriDay: { type: Number, required: true, min: 1, max: 30, index: true },
  hijriMonth: { type: Number, required: true, min: 1, max: 12, index: true },
  historicalYearAH: { type: String, default: '' },
  gregorianHistoricalDate: { type: String, default: '' },
  gregorianMonthDay: {
    month: { type: Number },
    day: { type: Number }
  },
  personalityIds: [{ type: String }],
  locationIds: [{ type: String }],
  summary: { type: String, required: true },
  fullDescription: { type: String, default: '' },
  sources: [{ type: String }],
  sourceReliability: {
    type: String,
    enum: ['confirmed', 'widely_reported', 'disputed', 'approximate', 'different_narrations'],
    default: 'confirmed'
  },
  dateStatus: {
    type: String,
    enum: ['confirmed', 'widely_reported', 'disputed', 'approximate', 'different_narrations'],
    default: 'confirmed'
  },
  alternateNarrations: { type: String, default: '' },
  calendarNotes: { type: String, default: '' },
  recommendedZiyarat: { type: String, default: '' },
  importance: { type: String, enum: ['critical', 'high', 'medium', 'standard'], default: 'high' },
  visible: { type: Boolean, default: true },
  translations: {
    en: { type: String },
    ar: { type: String },
    ur: { type: String },
    ro: { type: String },
    hi: { type: String },
    fa: { type: String }
  },
  media: [{ type: String }],
  relatedEvents: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.CalendarEvent || mongoose.model('CalendarEvent', CalendarEventSchema);
