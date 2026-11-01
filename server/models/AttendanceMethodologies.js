import mongoose from 'mongoose';

const attendanceMethodologiesSchema = new mongoose.Schema({
  methodologyId: { type: String, required: true, unique: true }, // e.g. "METH-ELECTRONIC-AXIS", "METH-BORDER-PASSPORT"
  name: { type: String, required: true },
  nameArabic: { type: String, default: '' },
  description: { type: String, required: true },
  implementingAgency: { type: String, required: true },
  installationYear: { type: Number, default: 2016 },
  axesCovered: [{
    axisName: String,
    axisArabic: String,
    corridor: String,
    sensorsCount: Number
  }],
  strengths: [{ type: String }],
  knownLimitations: [{ type: String }],
  dataHandlingPolicy: { type: String, default: '' }
});

const AttendanceMethodologies = mongoose.models.AttendanceMethodologies || mongoose.model('AttendanceMethodologies', attendanceMethodologiesSchema);

export default AttendanceMethodologies;
