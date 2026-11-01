import mongoose from 'mongoose';

const countryPilgrimStatisticsSchema = new mongoose.Schema({
  countryCode: { type: String, required: true, uppercase: true, index: true }, // ISO 2-letter, e.g. "IQ", "IR", "PK", "IN"
  countryName: { type: String, required: true },
  countryArabicName: { type: String, default: '' },
  flagEmoji: { type: String, default: '🏳️' },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  year: { type: Number, required: true, index: true },
  hijriYear: { type: Number, default: null },
  eventType: { type: String, default: 'arbaeen', index: true },
  reportedPilgrimCount: { type: Number, default: null }, // null if official data not available
  isDataAvailable: { type: Boolean, default: true },
  percentageOfInternational: { type: Number, default: null },
  percentageOfTotal: { type: Number, default: null },
  previousYearCount: { type: Number, default: null },
  yearOverYearChangePercent: { type: Number, default: null },
  measurementType: {
    type: String,
    enum: [
      'border_entry_passport_tally',
      'consular_pilgrim_visa_issuance',
      'domestic_census_sampling',
      'mowkeb_and_delegation_registration',
      'official_air_passenger_manifest',
      'data_unavailable'
    ],
    default: 'border_entry_passport_tally'
  },
  measurementTypeDisplay: { type: String, default: 'Border Entry Passport Control Tally' },
  historicalTrendSummary: { type: String, default: '' },
  primaryEntryPoints: [{ type: String }], // e.g. ["Mehran / Zurbatiyah", "Najaf International Airport"]
  sourceOrganization: { type: String, required: true },
  sourceCitation: { type: String, required: true },
  verificationStatus: {
    type: String,
    enum: ['verified_official', 'official_border_record', 'consular_verified', 'preliminary', 'unavailable'],
    default: 'verified_official'
  },
  lastVerifiedDate: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

countryPilgrimStatisticsSchema.index({ countryCode: 1, year: 1, eventType: 1 }, { unique: true });

const CountryPilgrimStatistics = mongoose.models.CountryPilgrimStatistics || mongoose.model('CountryPilgrimStatistics', countryPilgrimStatisticsSchema);

export default CountryPilgrimStatistics;
