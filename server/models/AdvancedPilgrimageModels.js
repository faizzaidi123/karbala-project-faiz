import mongoose from 'mongoose';

/**
 * 1. CROWD SNAPSHOT MODEL (Feature 1 — Live Crowd Map & Segment Telemetry)
 */
const CrowdSnapshotSchema = new mongoose.Schema(
  {
    segmentId: { type: String, required: true, index: true },
    targetType: {
      type: String,
      enum: ['ROUTE_SEGMENT', 'POLE_SECTOR', 'SHRINE_GATE'],
      default: 'ROUTE_SEGMENT'
    },
    name: { type: String, required: true },
    fromPole: { type: Number, default: null },
    toPole: { type: Number, default: null },
    gateId: { type: String, default: null },
    crowdLevel: {
      type: String,
      enum: ['LOW', 'MODERATE', 'BUSY', 'VERY_BUSY', 'UNKNOWN'],
      default: 'UNKNOWN'
    },
    sourceType: {
      type: String,
      enum: ['LIVE', 'ESTIMATED', 'REPORTED', 'STALE'],
      default: 'ESTIMATED'
    },
    averageWalkingSpeedKmh: { type: Number, default: null },
    freshnessMinutes: { type: Number, default: 0 },
    lastVerifiedAt: { type: Date, default: Date.now },
    sensorOrReporterSource: { type: String, default: '' },
    lessCongestedAlternative: { type: String, default: null }
  },
  { timestamps: true }
);

/**
 * 2. FACILITY STATUS MODEL (Feature 2 — Smart Mawkib & Pilgrim Facility Finder)
 */
const FacilityStatusSchema = new mongoose.Schema(
  {
    facilityId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    arabicName: { type: String, default: '' },
    poleNumber: { type: Number, required: true, index: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    services: [
      {
        type: String,
        enum: [
          'mawkib',
          'water',
          'food',
          'tea',
          'rest',
          'washroom',
          'medical',
          'pharmacy',
          'prayer',
          'charging',
          'wheelchair',
          'lost_found',
          'emergency'
        ]
      }
    ],
    availabilityStatus: {
      type: String,
      enum: ['OPEN_NOW', 'LIMITED_CAPACITY', 'TEMPORARILY_CLOSED', 'UNKNOWN'],
      default: 'OPEN_NOW'
    },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'COMMUNITY_REPORTED', 'UNVERIFIED', 'TEMPORARILY_CLOSED', 'UNKNOWN'],
      default: 'VERIFIED'
    },
    genderFamilyNotes: { type: String, default: 'General & Family Sections Available' },
    accessibility: { type: String, default: 'Ground-level step-free roadside access' },
    lastVerified: { type: Date, default: Date.now },
    source: { type: String, default: 'Astan Field Service Registry' },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

/**
 * 3. PILGRIM GROUP, MEMBER, CHECK-IN & MEETING POINT MODELS (Feature 3 — Group Journey Mode)
 */
const GroupMemberSchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true },
    displayName: { type: String, required: true },
    role: { type: String, enum: ['LEADER', 'MEMBER'], default: 'MEMBER' },
    walkingStatus: {
      type: String,
      enum: ['WALKING', 'RESTING', 'AT_MEETING_POINT', 'OFFLINE', 'CHECKED_IN'],
      default: 'CHECKED_IN'
    },
    approximatePole: { type: Number, default: null },
    exactCoordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    batteryPercent: { type: Number, default: null },
    stepsShared: { type: Number, default: null },
    journeyProgressPercent: { type: Number, default: null },
    activeAlert: {
      type: String,
      enum: ['NONE', 'NEED_HELP', 'WAITING_HERE', 'MEET_ME_HERE', 'RETURNING_TO_GROUP', 'EMERGENCY'],
      default: 'NONE'
    },
    alertNote: { type: String, default: '' },
    privacySettings: {
      sharePole: { type: Boolean, default: true },
      shareExactLocation: { type: Boolean, default: false },
      shareSteps: { type: Boolean, default: false },
      shareJourneyProgress: { type: Boolean, default: false },
      shareBattery: { type: Boolean, default: false },
      shareStatus: { type: Boolean, default: true }
    },
    lastCheckInAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const MeetingPointSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pointType: {
      type: String,
      enum: ['POLE', 'SHRINE_GATE', 'VERIFIED_MAWKIB', 'LANDMARK'],
      default: 'POLE'
    },
    poleNumber: { type: Number, default: null },
    gateId: { type: String, default: null },
    facilityId: { type: String, default: null },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    notes: { type: String, default: '' },
    createdBy: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const PilgrimGroupSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true, unique: true, index: true },
    groupName: { type: String, required: true },
    groupCategory: {
      type: String,
      enum: ['FAMILY', 'FRIENDS', 'ZAIREEN_CARAVAN'],
      default: 'FAMILY'
    },
    inviteCode: { type: String, required: true, unique: true, index: true },
    isPubliclySearchable: { type: Boolean, default: false },
    createdByMemberId: { type: String, required: true },
    members: [GroupMemberSchema],
    meetingPoint: { type: MeetingPointSchema, default: null }
  },
  { timestamps: true }
);

const GroupCheckInSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true, index: true },
    memberId: { type: String, required: true },
    displayName: { type: String, required: true },
    walkingStatus: { type: String, default: 'CHECKED_IN' },
    approximatePole: { type: Number, default: null },
    activeAlert: { type: String, default: 'NONE' },
    note: { type: String, default: 'I am OK' },
    checkedInAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

/**
 * 4. JOURNEY JOURNAL, ENTRY & RECAP MODELS (Feature 4 — Journey Journal & Automatic Recap)
 */
const JournalEntrySchema = new mongoose.Schema(
  {
    entryId: { type: String, required: true },
    journeyYearLabel: { type: String, default: '2026 Arbaeen Journey' },
    dayNumber: { type: Number, default: 1 },
    entryType: {
      type: String,
      enum: [
        'TEXT_NOTE',
        'PHOTO',
        'LOCATION',
        'POLE',
        'ZIYARAT_MOMENT',
        'REFLECTION',
        'BOOKMARKED_EVENT',
        'VOICE_NOTE',
        'AUTO_MILESTONE'
      ],
      default: 'TEXT_NOTE'
    },
    isAutomaticMilestone: { type: Boolean, default: false },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    poleNumber: { type: Number, default: null },
    locationName: { type: String, default: '' },
    mediaDataUrl: { type: String, default: null },
    voiceTranscript: { type: String, default: '' },
    storyChapter: {
      type: String,
      enum: ['NAJAF_DEPARTURE', 'FIRST_MAWKIB', 'NIGHT_WALK', 'FINAL_POLES', 'KARBALA_ARRIVAL', 'GENERAL'],
      default: 'GENERAL'
    },
    isPrivate: { type: Boolean, default: true },
    timeLabel: { type: String, default: '' },
    recordedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const JourneyJournalSchema = new mongoose.Schema(
  {
    journeyId: { type: String, required: true, unique: true, index: true },
    pilgrimId: { type: String, required: true, index: true },
    journeyYearLabel: { type: String, default: '2026 Arbaeen Journey' },
    isPrivate: { type: Boolean, default: true },
    entries: [JournalEntrySchema]
  },
  { timestamps: true }
);

/**
 * 5. HISTORICAL MAP STATE MODEL (Feature 5 — 61 AH Historical Map Time Slider)
 */
const HistoricalMapStateSchema = new mongoose.Schema(
  {
    stageSlug: { type: String, required: true, unique: true, index: true },
    orderIndex: { type: Number, required: true },
    title: { type: String, required: true },
    arabicTitle: { type: String, default: '' },
    dateLabel: { type: String, required: true },
    geographyConfidence: {
      type: String,
      enum: ['HISTORICALLY_ATTESTED', 'APPROXIMATE_LOCATION', 'HISTORICAL_RECONSTRUCTION'],
      default: 'HISTORICALLY_ATTESTED'
    },
    summary: { type: String, default: '' },
    primarySources: [{ type: String }]
  },
  { timestamps: true }
);

export const CrowdSnapshot =
  mongoose.models.CrowdSnapshot || mongoose.model('CrowdSnapshot', CrowdSnapshotSchema);
export const FacilityStatus =
  mongoose.models.FacilityStatus || mongoose.model('FacilityStatus', FacilityStatusSchema);
export const PilgrimGroup =
  mongoose.models.PilgrimGroup || mongoose.model('PilgrimGroup', PilgrimGroupSchema);
export const GroupCheckIn =
  mongoose.models.GroupCheckIn || mongoose.model('GroupCheckIn', GroupCheckInSchema);
export const JourneyJournal =
  mongoose.models.JourneyJournal || mongoose.model('JourneyJournal', JourneyJournalSchema);
export const HistoricalMapState =
  mongoose.models.HistoricalMapState || mongoose.model('HistoricalMapState', HistoricalMapStateSchema);
