import mongoose from 'mongoose';

const statisticalSourcesSchema = new mongoose.Schema({
  sourceId: { type: String, required: true, unique: true }, // e.g. "SRC-ABBAS-COUNT", "SRC-BORDER-COMM", "SRC-PLANNING-CSO"
  sourceOrganization: { type: String, required: true },
  sourceOrganizationArabic: { type: String, default: '' },
  reportTitle: { type: String, required: true },
  reportTitleArabic: { type: String, default: '' },
  publicationDate: { type: String, required: true },
  reportingPeriod: { type: String, required: true },
  sourceUrl: { type: String, default: '' },
  category: {
    type: String,
    enum: ['holy_shrine_authority', 'border_immigration', 'ministry_transport', 'central_statistics', 'academic_research'],
    required: true
  },
  authorityType: { type: String, default: 'Official Shrine Custodianship' },
  reliabilityRating: { type: String, default: 'Primary Certified Authority' },
  archivalStatus: { type: String, default: 'Digitally Preserved' },
  reconciliationNotes: { type: String, default: '' }
});

const StatisticalSources = mongoose.models.StatisticalSources || mongoose.model('StatisticalSources', statisticalSourcesSchema);

export default StatisticalSources;
