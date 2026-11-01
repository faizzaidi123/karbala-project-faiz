import mongoose from 'mongoose';

const statisticsVerificationHistorySchema = new mongoose.Schema({
  recordId: { type: String, required: true },
  action: { type: String, enum: ['initial_entry', 'audit_verified', 'revision', 'limitation_updated'], required: true },
  verifiedBy: { type: String, default: 'Karbala Digital Heritage Statistical Board' },
  verifiedAt: { type: Date, default: Date.now },
  changeSummary: { type: String, default: '' },
  referenceLinks: [{ type: String }]
});

const StatisticsVerificationHistory = mongoose.models.StatisticsVerificationHistory || mongoose.model('StatisticsVerificationHistory', statisticsVerificationHistorySchema);

export default StatisticsVerificationHistory;
