import mongoose from 'mongoose';

const pilgrimageStatisticsSchema = new mongoose.Schema({
  year: { type: Number, required: true, index: true },
  hijriYear: { type: Number, required: true },
  hijriYearDisplay: { type: String, required: true }, // e.g. "1446 AH"
  eventType: {
    type: String,
    enum: ['arbaeen', 'ashura', 'nisf_shaban', 'annual_total', 'eid_ghadir', 'arafah', 'all_events'],
    required: true,
    index: true
  },
  eventNameDisplay: { type: String, required: true },
  totalReportedPilgrims: { type: Number, required: true },
  arbaeenAttendance: { type: Number, default: null },
  ashuraAttendance: { type: Number, default: null },
  nisfShabanAttendance: { type: Number, default: null },
  domesticIraqiPilgrims: { type: Number, default: null },
  internationalPilgrims: { type: Number, default: null },
  representedCountriesCount: { type: Number, default: null },
  yearOverYearChangePercent: { type: Number, default: null }, // e.g. +2.4 or -26.1
  isYoYCompatible: { type: Boolean, default: true },
  reportingAuthority: { type: String, required: true }, // e.g. "Al-Abbas Holy Shrine (General Secretariat) Electronic Counter System"
  reportingAuthorityArabic: { type: String, default: '' },
  officialPublicationDate: { type: String, required: true }, // e.g. "20 Safar 1446 AH / 25 August 2024"
  verificationStatus: {
    type: String,
    enum: ['verified_official', 'preliminary_official', 'official_border_record', 'historical_estimate', 'unverified_media'],
    default: 'verified_official',
    index: true
  },
  measurementType: {
    type: String,
    enum: ['electronic_axis_counter', 'border_crossing_sum', 'multi_source_reconciliation', 'official_survey', 'preliminary_tally'],
    required: true
  },
  measurementDefinition: { type: String, required: true },
  reportingPeriodStart: { type: String, default: null },
  reportingPeriodEnd: { type: String, default: null },
  isYearComplete: { type: Boolean, default: true }, // false for 2026 ongoing figures
  sourceId: { type: String, required: true },
  methodologyNotes: { type: String, default: '' },
  limitationNotes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  lastVerifiedAt: { type: Date, default: Date.now }
});

pilgrimageStatisticsSchema.index({ year: 1, eventType: 1 }, { unique: true });

const PilgrimageStatistics = mongoose.models.PilgrimageStatistics || mongoose.model('PilgrimageStatistics', pilgrimageStatisticsSchema);

export default PilgrimageStatistics;
