import mongoose from 'mongoose';

/**
 * ZAIREEN WALK INTELLIGENCE — MONGOOSE MODELS
 * WalkJourney, WalkSession, WalkSample, UserWalkingProfile
 */

const WalkSampleSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  elapsedActiveSeconds: { type: Number, default: 0 },
  elapsedRestSeconds: { type: Number, default: 0 },
  cumulativeSteps: { type: Number, default: 0 },
  distanceMeters: { type: Number, default: 0 },
  currentPole: { type: Number, default: 1 },
  stepsPerMinute: { type: Number, default: 0 },
  speedKmH: { type: Number, default: 0 },
  dataSource: { type: String, enum: ['DEVICE_MEASURED', 'GPS_TRACKED', 'ESTIMATED'], default: 'ESTIMATED' },
  eventType: {
    type: String,
    enum: ['START', 'PAUSE', 'RESUME', 'POLE_REACHED', 'MILESTONE', 'SAMPLE', 'FINISH'],
    default: 'SAMPLE'
  },
  label: { type: String, default: '' }
}, { _id: false });

const WalkSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true, default: 'local_pilgrim' },
  journeyId: { type: String, required: true, index: true, default: 'arbaeen_1448_default' },
  route: { type: String, default: 'Najaf → Karbala (Route 9 / Tareeq Ya Hussain)' },
  status: { type: String, enum: ['ACTIVE', 'PAUSED', 'FINISHED'], default: 'ACTIVE' },
  timeOfDayTag: { type: String, enum: ['Morning Walk', 'Afternoon Walk', 'Evening Walk', 'Night Walk'], default: 'Morning Walk' },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null },
  lastUpdatedAt: { type: Date, default: Date.now },
  activeDuration: { type: Number, default: 0 }, // seconds
  restDuration: { type: Number, default: 0 },   // seconds
  steps: { type: Number, default: 0 },
  distanceMeters: { type: Number, default: 0 },
  gpsDistanceMeters: { type: Number, default: 0 },
  estimatedDistanceMeters: { type: Number, default: 0 },
  averagePace: { type: String, default: '13m 20s / km' }, // e.g. "13 min 02 sec / km"
  averageSpeed: { type: Number, default: 4.5 },           // km/h
  currentSpeed: { type: Number, default: 4.5 },           // km/h
  stepsPerMinute: { type: Number, default: 100 },
  startPole: { type: Number, default: 1, min: 1, max: 1452 },
  endPole: { type: Number, default: 1, min: 1, max: 1452 },
  currentPole: { type: Number, default: 1, min: 1, max: 1452 },
  polesCompleted: { type: Number, default: 0 },
  dataSource: {
    type: String,
    enum: ['DEVICE_MEASURED', 'GPS_TRACKED', 'ESTIMATED'],
    default: 'ESTIMATED'
  },
  stepLengthMeters: { type: Number, default: 0.72 },
  stepLengthMode: { type: String, enum: ['AUTO', 'CUSTOM'], default: 'AUTO' },
  batterySaver: { type: Boolean, default: false },
  audioAnnouncements: { type: Boolean, default: false },
  privacyMode: { type: String, enum: ['PRIVATE', 'GROUP_ONLY', 'ANONYMOUS_AGGREGATE'], default: 'PRIVATE' },
  timezone: { type: String, default: 'Asia/Baghdad' },
  syncStatus: { type: String, enum: ['SYNCED', 'OFFLINE_QUEUED', 'LOCAL_ONLY'], default: 'SYNCED' },
  timelineEvents: [
    {
      time: { type: String },
      timestamp: { type: Date, default: Date.now },
      type: { type: String },
      label: { type: String },
      poleNumber: { type: Number },
      steps: { type: Number },
      distanceMeters: { type: Number }
    }
  ],
  samples: [WalkSampleSchema]
}, { timestamps: true });

const WalkJourneySchema = new mongoose.Schema({
  journeyId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, default: 'Najaf → Karbala Arbaeen Walk' },
  startedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  startPole: { type: Number, default: 1 },
  currentPole: { type: Number, default: 1 },
  targetPole: { type: Number, default: 1452 },
  totalSteps: { type: Number, default: 0 },
  totalDistanceMeters: { type: Number, default: 0 },
  totalActiveSeconds: { type: Number, default: 0 },
  totalRestSeconds: { type: Number, default: 0 },
  totalPolesCompleted: { type: Number, default: 0 },
  daysWalking: { type: Number, default: 1 },
  dailyGoals: {
    targetSteps: { type: Number, default: 15000 },
    targetPole: { type: Number, default: 600 }
  }
}, { timestamps: true });

const UserWalkingProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  heightCm: { type: Number, default: 170 },
  stepLengthMeters: { type: Number, default: 0.72 },
  stepLengthMode: { type: String, enum: ['AUTO', 'CUSTOM'], default: 'AUTO' },
  preferredPaceProfile: { type: String, enum: ['relaxed', 'normal', 'brisk', 'night'], default: 'normal' },
  privacyMode: { type: String, enum: ['PRIVATE', 'GROUP_ONLY', 'ANONYMOUS_AGGREGATE'], default: 'PRIVATE' },
  shareAnonymousAggregate: { type: Boolean, default: false },
  shareGroupStatus: { type: Boolean, default: false },
  audioAnnouncementsEnabled: { type: Boolean, default: false },
  batterySaverEnabled: { type: Boolean, default: false },
  dailyStepGoal: { type: Number, default: 15000 },
  targetPoleGoal: { type: Number, default: 600 },
  groupCode: { type: String, default: '' },
  groupDisplayName: { type: String, default: 'Pilgrim' }
}, { timestamps: true });

export const WalkSession = mongoose.models.WalkSession || mongoose.model('WalkSession', WalkSessionSchema);
export const WalkJourney = mongoose.models.WalkJourney || mongoose.model('WalkJourney', WalkJourneySchema);
export const UserWalkingProfile = mongoose.models.UserWalkingProfile || mongoose.model('UserWalkingProfile', UserWalkingProfileSchema);

export default {
  WalkSession,
  WalkJourney,
  UserWalkingProfile
};
