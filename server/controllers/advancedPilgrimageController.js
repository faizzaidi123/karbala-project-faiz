/**
 * KARBALA DIGITAL HERITAGE PLATFORM — 5 ADVANCED FEATURES CONTROLLER
 * Feature 1: Live Crowd Map & Segment/Pole/Gate Telemetry
 * Feature 2: Smart Mawkib & Pilgrim Facility Finder (Nearby + Route-Ahead + Offline)
 * Feature 3: Privacy-First Group Journey Mode (Invite Code, Check-in, Meeting Point, Alerts)
 * Feature 4: Journey Journal & Automatic Recap (Multi-year Memory, Privacy-Safe Card)
 * Feature 5: 61 AH Historical Map Time Slider (Progressive Route, Sources, Uncertainty)
 */

import { getMongoStatus } from '../config/db.js';
import {
  CrowdSnapshot,
  FacilityStatus,
  PilgrimGroup,
  GroupCheckIn,
  JourneyJournal
} from '../models/AdvancedPilgrimageModels.js';
import {
  CALIBRATED_POLE_SPACING_METERS,
  getPoleData
} from '../../client/js/data/smartPoleNavigationData.js';
import {
  CINEMATIC_CROWD_PALETTE,
  CROWD_SOURCE_BADGES,
  GRANULAR_CROWD_SEGMENTS,
  SHRINE_GATE_CROWD_DATA,
  SMART_MAWKIB_FACILITIES,
  getPoleCrowdAndFacilitiesSummary,
  getSmartFacilityRecommendations,
  getHistoricalMapStageState
} from '../../client/js/data/advancedPilgrimageData.js';

// In-memory fallback stores when MongoDB is running in local cache mode
const memCrowdReports = new Map();
const memCommunityFacilities = new Map();
const memGroups = new Map(); // groupId or inviteCode -> group object
const memJournals = new Map(); // journeyId -> journal object

// ============================================================================
// FEATURE 1 — LIVE CROWD MAP ENDPOINTS
// ============================================================================

/**
 * GET /api/crowd/current
 * Optional query: ?pole=520
 */
export const getCrowdCurrent = async (req, res) => {
  try {
    const poleNum = req.query.pole ? parseInt(req.query.pole, 10) : 520;
    const poleSummary = getPoleCrowdAndFacilitiesSummary(isNaN(poleNum) ? 520 : poleNum);

    const segments = GRANULAR_CROWD_SEGMENTS.map((seg) => {
      const customOverride = memCrowdReports.get(seg.segmentId);
      const effective = customOverride ? { ...seg, ...customOverride } : seg;
      return {
        ...effective,
        palette: CINEMATIC_CROWD_PALETTE[effective.crowdLevel] || CINEMATIC_CROWD_PALETTE.UNKNOWN,
        sourceBadge: CROWD_SOURCE_BADGES[effective.sourceType] || CROWD_SOURCE_BADGES.ESTIMATED
      };
    });

    res.json({
      status: 'success',
      generatedAt: new Date().toISOString(),
      paletteLegend: CINEMATIC_CROWD_PALETTE,
      sourceBadges: CROWD_SOURCE_BADGES,
      poleInspector: poleSummary,
      shrineGates: SHRINE_GATE_CROWD_DATA.map((g) => ({
        ...g,
        palette: CINEMATIC_CROWD_PALETTE[g.crowdLevel] || CINEMATIC_CROWD_PALETTE.UNKNOWN
      })),
      segments
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/crowd/route
 * Returns granular Najaf -> Karbala segment crowd breakdown + smart route suggestions
 */
export const getCrowdRoute = async (req, res) => {
  try {
    const segments = GRANULAR_CROWD_SEGMENTS.map((seg) => {
      const customOverride = memCrowdReports.get(seg.segmentId);
      const effective = customOverride ? { ...seg, ...customOverride } : seg;
      const fromData = getPoleData(effective.fromPole);
      const toData = getPoleData(effective.toPole);

      // Find verified rest/medical Mawkibs inside this segment (Cross-Feature: Crowd + Mawkib)
      const verifiedRestOptions = SMART_MAWKIB_FACILITIES.filter(
        (f) =>
          f.poleNumber >= effective.fromPole - 25 &&
          f.poleNumber <= effective.toPole + 25 &&
          f.verificationStatus === 'VERIFIED' &&
          (f.services.includes('rest') || f.services.includes('medical'))
      );

      return {
        ...effective,
        coordinates: [fromData.coordinates, toData.coordinates],
        palette: CINEMATIC_CROWD_PALETTE[effective.crowdLevel] || CINEMATIC_CROWD_PALETTE.UNKNOWN,
        sourceBadge: CROWD_SOURCE_BADGES[effective.sourceType] || CROWD_SOURCE_BADGES.ESTIMATED,
        verifiedRestOptions
      };
    });

    res.json({
      status: 'success',
      totalSegments: segments.length,
      segments
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/crowd/report
 * Admin/field verified update or anonymized movement slowdown report
 */
export const postCrowdReport = async (req, res) => {
  try {
    const { segmentId, crowdLevel, averageWalkingSpeedKmh, sourceType = 'REPORTED', sensorSource } = req.body || {};
    if (!segmentId || !CINEMATIC_CROWD_PALETTE[crowdLevel]) {
      return res.status(400).json({ status: 'error', message: 'Valid segmentId and crowdLevel required.' });
    }

    const updateObj = {
      crowdLevel,
      sourceType: CROWD_SOURCE_BADGES[sourceType] ? sourceType : 'REPORTED',
      averageWalkingSpeedKmh: Number(averageWalkingSpeedKmh) || CINEMATIC_CROWD_PALETTE[crowdLevel].avgSpeedKmh,
      freshnessMinutes: 1,
      lastUpdateLabel: 'Updated 1 minute ago',
      sensorSource: sensorSource || 'Verified Field Observer Update'
    };

    memCrowdReports.set(segmentId, updateObj);

    if (getMongoStatus()) {
      await CrowdSnapshot.create({
        segmentId,
        name: segmentId,
        ...updateObj
      }).catch(() => {});
    }

    res.json({ status: 'success', updated: { segmentId, ...updateObj } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ============================================================================
// FEATURE 2 — SMART MAWKIB & PILGRIM FACILITY FINDER ENDPOINTS
// ============================================================================

function getAllMergedFacilities() {
  const communityList = Array.from(memCommunityFacilities.values());
  return [...SMART_MAWKIB_FACILITIES, ...communityList].sort((a, b) => a.poleNumber - b.poleNumber);
}

/**
 * GET /api/facilities/nearby
 * Query: ?pole=520&maxDistanceMeters=2500&service=medical&openNow=true
 */
export const getFacilitiesNearby = async (req, res) => {
  try {
    const currentPole = Math.max(1, Math.min(1452, parseInt(req.query.pole, 10) || 520));
    const maxDistanceMeters = parseInt(req.query.maxDistanceMeters, 10) || 5000;
    const serviceFilter = (req.query.service || '').toLowerCase().trim();
    const openNowOnly = req.query.openNow === 'true';

    const allFacilities = getAllMergedFacilities();
    const enriched = allFacilities
      .map((fac) => {
        const poleDelta = fac.poleNumber - currentPole;
        const distanceMeters = Math.round(Math.abs(poleDelta) * CALIBRATED_POLE_SPACING_METERS);
        return {
          ...fac,
          poleDelta,
          direction: poleDelta >= 0 ? 'AHEAD' : 'BEHIND',
          distanceMeters,
          walkingMinutesEstimate: Math.max(1, Math.round(distanceMeters / 68)) // ~4.1 km/h
        };
      })
      .filter((f) => {
        if (f.distanceMeters > maxDistanceMeters) return false;
        if (openNowOnly && f.availabilityStatus !== 'OPEN_NOW') return false;
        if (serviceFilter && serviceFilter !== 'all' && !f.services.includes(serviceFilter)) return false;
        return true;
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);

    res.json({
      status: 'success',
      currentPole,
      count: enriched.length,
      recommendations: getSmartFacilityRecommendations(currentPole),
      facilities: enriched
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/facilities/ahead
 * Query: ?currentPole=650&rangePoles=100&service=...
 */
export const getFacilitiesAhead = async (req, res) => {
  try {
    const currentPole = Math.max(1, Math.min(1452, parseInt(req.query.currentPole || req.query.pole, 10) || 650));
    const rangePoles = Math.max(10, Math.min(1452, parseInt(req.query.rangePoles, 10) || 100)); // 100 poles ~ 5 km
    const serviceFilter = (req.query.service || '').toLowerCase().trim();

    const allFacilities = getAllMergedFacilities();
    const aheadList = allFacilities
      .filter((f) => f.poleNumber >= currentPole && f.poleNumber <= currentPole + rangePoles)
      .map((fac) => {
        const poleDelta = fac.poleNumber - currentPole;
        const distanceMeters = Math.round(poleDelta * CALIBRATED_POLE_SPACING_METERS);
        return {
          ...fac,
          poleDelta,
          direction: 'AHEAD',
          distanceMeters,
          walkingMinutesEstimate: Math.max(1, Math.round(distanceMeters / 68))
        };
      })
      .filter((f) => !serviceFilter || serviceFilter === 'all' || f.services.includes(serviceFilter))
      .sort((a, b) => a.poleNumber - b.poleNumber);

    res.json({
      status: 'success',
      currentPole,
      targetMaxPole: Math.min(1452, currentPole + rangePoles),
      approxRangeKm: Number(((rangePoles * CALIBRATED_POLE_SPACING_METERS) / 1000).toFixed(1)),
      count: aheadList.length,
      recommendations: getSmartFacilityRecommendations(currentPole),
      facilitiesAhead: aheadList
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/facilities/status
 * Submit community-reported Mawkib or facility update (Strictly marked COMMUNITY_REPORTED, never auto-verified)
 */
export const postCommunityFacilityReport = async (req, res) => {
  try {
    const { name, poleNumber, services = ['mawkib', 'water'], genderFamilyNotes, description } = req.body || {};
    const pNum = Math.max(1, Math.min(1452, parseInt(poleNumber, 10) || 1));
    if (!name) {
      return res.status(400).json({ status: 'error', message: 'Mawkib or facility name is required.' });
    }

    const poleCoords = getPoleData(pNum).coordinates;
    const facilityId = 'comm_mwk_' + Date.now();
    const newFac = {
      facilityId,
      name: String(name).trim(),
      arabicName: '',
      poleNumber: pNum,
      coordinates: { lat: poleCoords[0], lng: poleCoords[1] },
      services: Array.isArray(services) && services.length ? services : ['mawkib', 'water'],
      availabilityStatus: 'OPEN_NOW',
      verificationStatus: 'COMMUNITY_REPORTED', // Never auto-verified!
      genderFamilyNotes: genderFamilyNotes || 'Community submitted — verify on arrival',
      accessibility: 'Roadside access',
      lastVerified: 'Just reported (Community)',
      source: 'Community Reported Submission (Pending Official Verification)',
      openHours: 'Reported Open',
      description: description || `Community-reported facility near Pole ${pNum}.`
    };

    memCommunityFacilities.set(facilityId, newFac);

    if (getMongoStatus()) {
      await FacilityStatus.create(newFac).catch(() => {});
    }

    res.json({ status: 'success', facility: newFac });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ============================================================================
// FEATURE 3 — PRIVACY-FIRST GROUP JOURNEY MODE ENDPOINTS
// ============================================================================

function computeGroupSummary(group) {
  const nowMs = Date.now();
  let walkingCount = 0;
  let restingCount = 0;
  let offlineCount = 0;
  let notCheckedInRecentlyCount = 0;

  const enrichedMembers = (group.members || []).map((m) => {
    const lastMs = m.lastCheckInAt ? new Date(m.lastCheckInAt).getTime() : nowMs;
    const minutesSinceCheckIn = Math.max(0, Math.round((nowMs - lastMs) / 60000));
    const isStale = minutesSinceCheckIn > 45;

    if (isStale) {
      notCheckedInRecentlyCount++;
    } else if (m.walkingStatus === 'WALKING') {
      walkingCount++;
    } else if (m.walkingStatus === 'RESTING') {
      restingCount++;
    } else if (m.walkingStatus === 'OFFLINE') {
      offlineCount++;
    } else {
      walkingCount++;
    }

    // Enforce privacy settings: only expose what the member explicitly enabled
    const priv = m.privacySettings || {};
    return {
      memberId: m.memberId,
      displayName: m.displayName,
      role: m.role,
      walkingStatus: priv.shareStatus !== false ? m.walkingStatus : 'PRIVATE',
      approximatePole: priv.sharePole !== false ? m.approximatePole : null,
      approximatePositionLabel:
        priv.sharePole !== false && m.approximatePole
          ? `Near Pole ${m.approximatePole}`
          : 'Position Private',
      exactCoordinates: priv.shareExactLocation === true ? m.exactCoordinates : null,
      batteryPercent: priv.shareBattery === true ? m.batteryPercent : null,
      stepsShared: priv.shareSteps === true ? m.stepsShared : null,
      journeyProgressPercent: priv.shareJourneyProgress === true ? m.journeyProgressPercent : null,
      activeAlert: m.activeAlert || 'NONE',
      alertNote: m.alertNote || '',
      minutesSinceCheckIn,
      freshnessLabel:
        minutesSinceCheckIn === 0
          ? 'Checked in just now'
          : `Checked in ${minutesSinceCheckIn} min ago`,
      isStaleCheckIn: isStale,
      privacySettings: priv
    };
  });

  return {
    ...group,
    members: enrichedMembers,
    statusSummary: {
      totalMembers: enrichedMembers.length,
      walkingCount,
      restingCount,
      offlineCount,
      notCheckedInRecentlyCount
    }
  };
}

/**
 * POST /api/groups
 * Create a private Arbaeen group with invite code
 */
export const createPilgrimGroup = async (req, res) => {
  try {
    const {
      groupName = 'My Arbaeen Family Group',
      groupCategory = 'FAMILY',
      creatorId = 'pilgrim_1',
      creatorName = 'Group Leader',
      currentPole = 1
    } = req.body || {};

    const inviteCode =
      'KARBALA-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    const groupId = 'grp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

    const newGroup = {
      groupId,
      groupName: String(groupName).trim(),
      groupCategory,
      inviteCode,
      isPubliclySearchable: false, // Never publicly searchable by default
      createdByMemberId: creatorId,
      members: [
        {
          memberId: creatorId,
          displayName: creatorName,
          role: 'LEADER',
          walkingStatus: 'WALKING',
          approximatePole: Math.max(1, Math.min(1452, Number(currentPole) || 1)),
          exactCoordinates: null,
          batteryPercent: null,
          stepsShared: null,
          journeyProgressPercent: null,
          activeAlert: 'NONE',
          alertNote: '',
          privacySettings: {
            sharePole: true,
            shareExactLocation: false,
            shareSteps: false,
            shareJourneyProgress: false,
            shareBattery: false,
            shareStatus: true
          },
          lastCheckInAt: new Date().toISOString()
        }
      ],
      meetingPoint: {
        title: 'Pole 726 (Halfway Milestone Medical & Broadcast Plaza)',
        pointType: 'POLE',
        poleNumber: 726,
        notes: 'Meet beside the Central Astan Reunion Desk at Pole 726.',
        createdBy: creatorName,
        createdAt: new Date().toISOString()
      }
    };

    memGroups.set(groupId, newGroup);
    memGroups.set(inviteCode, newGroup);

    if (getMongoStatus()) {
      await PilgrimGroup.create(newGroup).catch(() => {});
    }

    res.json({
      status: 'success',
      group: computeGroupSummary(newGroup)
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/groups/:id
 */
export const getPilgrimGroup = async (req, res) => {
  try {
    const key = req.params.id;
    let group = memGroups.get(key);

    if (!group && getMongoStatus()) {
      const doc = await PilgrimGroup.findOne({
        $or: [{ groupId: key }, { inviteCode: key }]
      }).lean();
      if (doc) {
        group = doc;
        memGroups.set(doc.groupId, doc);
        memGroups.set(doc.inviteCode, doc);
      }
    }

    if (!group) {
      return res.status(404).json({ status: 'error', message: 'Group not found. Verify your private invite code.' });
    }

    res.json({
      status: 'success',
      group: computeGroupSummary(group)
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/groups/:id/join
 */
export const joinPilgrimGroup = async (req, res) => {
  try {
    const key = req.params.id;
    const { memberId, displayName = 'Group Member', approximatePole = 1 } = req.body || {};
    let group = memGroups.get(key);

    if (!group) {
      return res.status(404).json({ status: 'error', message: 'Invalid invite code or group ID.' });
    }

    const mId = memberId || 'mem_' + Date.now();
    const existingIdx = group.members.findIndex((m) => m.memberId === mId);
    const memberObj = {
      memberId: mId,
      displayName: String(displayName).trim(),
      role: existingIdx === 0 ? 'LEADER' : 'MEMBER',
      walkingStatus: 'WALKING',
      approximatePole: Math.max(1, Math.min(1452, Number(approximatePole) || 1)),
      exactCoordinates: null,
      batteryPercent: null,
      stepsShared: null,
      journeyProgressPercent: null,
      activeAlert: 'NONE',
      alertNote: '',
      privacySettings: {
        sharePole: true,
        shareExactLocation: false,
        shareSteps: false,
        shareJourneyProgress: false,
        shareBattery: false,
        shareStatus: true
      },
      lastCheckInAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      group.members[existingIdx] = { ...group.members[existingIdx], ...memberObj };
    } else {
      group.members.push(memberObj);
    }

    memGroups.set(group.groupId, group);
    memGroups.set(group.inviteCode, group);

    res.json({
      status: 'success',
      group: computeGroupSummary(group)
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/groups/:id/checkin
 * "I'M OK" / Check-in + Privacy Update + Optional Manual Alert
 */
export const checkInPilgrimGroup = async (req, res) => {
  try {
    const key = req.params.id;
    const {
      memberId,
      displayName,
      walkingStatus = 'WALKING',
      approximatePole,
      activeAlert = 'NONE',
      alertNote = '',
      privacySettings,
      batteryPercent,
      stepsShared,
      journeyProgressPercent
    } = req.body || {};

    let group = memGroups.get(key);
    if (!group) {
      return res.status(404).json({ status: 'error', message: 'Group not found.' });
    }

    const idx = group.members.findIndex((m) => m.memberId === memberId);
    const nowIso = new Date().toISOString();

    if (idx >= 0) {
      const existing = group.members[idx];
      const nextPrivacy = privacySettings ? { ...existing.privacySettings, ...privacySettings } : existing.privacySettings;
      group.members[idx] = {
        ...existing,
        displayName: displayName || existing.displayName,
        walkingStatus,
        approximatePole: approximatePole !== undefined ? Math.max(1, Math.min(1452, Number(approximatePole))) : existing.approximatePole,
        activeAlert,
        alertNote,
        privacySettings: nextPrivacy,
        batteryPercent: nextPrivacy.shareBattery ? batteryPercent : null,
        stepsShared: nextPrivacy.shareSteps ? stepsShared : null,
        journeyProgressPercent: nextPrivacy.shareJourneyProgress ? journeyProgressPercent : null,
        lastCheckInAt: nowIso
      };
    } else {
      group.members.push({
        memberId: memberId || 'mem_' + Date.now(),
        displayName: displayName || 'Pilgrim Member',
        role: 'MEMBER',
        walkingStatus,
        approximatePole: Math.max(1, Math.min(1452, Number(approximatePole) || 1)),
        activeAlert,
        alertNote,
        privacySettings: privacySettings || {
          sharePole: true,
          shareExactLocation: false,
          shareSteps: false,
          shareJourneyProgress: false,
          shareBattery: false,
          shareStatus: true
        },
        lastCheckInAt: nowIso
      });
    }

    if (getMongoStatus()) {
      await GroupCheckIn.create({
        groupId: group.groupId,
        memberId: memberId || 'pilgrim',
        displayName: displayName || 'Pilgrim',
        walkingStatus,
        approximatePole,
        activeAlert,
        note: alertNote || 'I am OK'
      }).catch(() => {});
    }

    res.json({
      status: 'success',
      group: computeGroupSummary(group)
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/groups/:id/meeting-point
 */
export const setGroupMeetingPoint = async (req, res) => {
  try {
    const key = req.params.id;
    const { title, pointType = 'POLE', poleNumber = 800, notes = '', createdBy = 'Group Leader' } = req.body || {};

    let group = memGroups.get(key);
    if (!group) {
      return res.status(404).json({ status: 'error', message: 'Group not found.' });
    }

    const pNum = Math.max(1, Math.min(1452, Number(poleNumber) || 800));
    const poleCoords = getPoleData(pNum).coordinates;

    group.meetingPoint = {
      title: title || `Pole ${pNum} Meeting Point`,
      pointType,
      poleNumber: pNum,
      coordinates: { lat: poleCoords[0], lng: poleCoords[1] },
      notes,
      createdBy,
      createdAt: new Date().toISOString()
    };

    memGroups.set(group.groupId, group);
    memGroups.set(group.inviteCode, group);

    res.json({
      status: 'success',
      group: computeGroupSummary(group)
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ============================================================================
// FEATURE 4 — JOURNEY JOURNAL & AUTOMATIC RECAP ENDPOINTS
// ============================================================================

/**
 * GET /api/journey/:id/journal
 */
export const getJourneyJournal = async (req, res) => {
  try {
    const journeyId = req.params.id || 'default_journey';
    let journal = memJournals.get(journeyId);

    if (!journal && getMongoStatus()) {
      const doc = await JourneyJournal.findOne({ journeyId }).lean();
      if (doc) {
        journal = doc;
        memJournals.set(journeyId, doc);
      }
    }

    if (!journal) {
      journal = {
        journeyId,
        pilgrimId: journeyId,
        journeyYearLabel: '2026 Arbaeen Journey',
        isPrivate: true,
        entries: []
      };
      memJournals.set(journeyId, journal);
    }

    res.json({
      status: 'success',
      journal
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/journey/:id/journal
 */
export const addJourneyJournalEntry = async (req, res) => {
  try {
    const journeyId = req.params.id || 'default_journey';
    const {
      journeyYearLabel = '2026 Arbaeen Journey',
      dayNumber = 1,
      entryType = 'TEXT_NOTE',
      isAutomaticMilestone = false,
      title,
      content = '',
      poleNumber = null,
      locationName = '',
      mediaDataUrl = null,
      voiceTranscript = '',
      storyChapter = 'GENERAL',
      timeLabel
    } = req.body || {};

    if (!title) {
      return res.status(400).json({ status: 'error', message: 'Journal entry title is required.' });
    }

    let journal = memJournals.get(journeyId) || {
      journeyId,
      pilgrimId: journeyId,
      journeyYearLabel,
      isPrivate: true,
      entries: []
    };

    const newEntry = {
      entryId: 'jrn_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      journeyYearLabel,
      dayNumber: Number(dayNumber) || 1,
      entryType,
      isAutomaticMilestone: Boolean(isAutomaticMilestone),
      title: String(title).trim(),
      content: String(content).trim(),
      poleNumber: poleNumber ? Number(poleNumber) : null,
      locationName,
      mediaDataUrl: mediaDataUrl || null,
      voiceTranscript: voiceTranscript || '',
      storyChapter,
      isPrivate: true,
      timeLabel: timeLabel || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      recordedAt: new Date().toISOString()
    };

    journal.entries = [newEntry, ...(journal.entries || [])];
    memJournals.set(journeyId, journal);

    if (getMongoStatus()) {
      await JourneyJournal.findOneAndUpdate(
        { journeyId },
        { $set: { pilgrimId: journeyId, journeyYearLabel, isPrivate: true }, $push: { entries: newEntry } },
        { upsert: true }
      ).catch(() => {});
    }

    res.json({
      status: 'success',
      entry: newEntry,
      journal
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/journey/:id/recap
 */
export const getJourneyRecap = async (req, res) => {
  try {
    const journeyId = req.params.id || 'default_journey';
    const journal = memJournals.get(journeyId) || {
      journeyId,
      journeyYearLabel: '2026 Arbaeen Journey',
      isPrivate: true,
      entries: []
    };

    res.json({
      status: 'success',
      recap: {
        journeyId,
        journeyYearLabel: journal.journeyYearLabel,
        isPrivate: true,
        origin: 'Najaf',
        destination: 'Karbala',
        journalMomentsCount: (journal.entries || []).length,
        entries: journal.entries || [],
        privacyNotice: 'Exact GPS coordinates are excluded from shareable recap cards.'
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ============================================================================
// FEATURE 5 — 61 AH HISTORICAL MAP TIME SLIDER ENDPOINT
// ============================================================================

/**
 * GET /api/history/map-state/:date
 * Examples: /api/history/map-state/madinah, /api/history/map-state/2-muharram, /api/history/map-state/7-muharram, /api/history/map-state/10-muharram
 */
export const getHistoricalMapStateByDate = async (req, res) => {
  try {
    const dateParam = req.params.date || '2-muharram';
    const state = getHistoricalMapStageState(dateParam);
    res.json({
      status: 'success',
      ...state
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
