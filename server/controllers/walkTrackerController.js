/**
 * KARBALA DIGITAL TWIN — ZAIREEN WALK TRACKER & STEP INTELLIGENCE CONTROLLER
 * Connects directly with the 1,452-Pole Arbaeen Navigation System (Route 9 / Tareeq Ya Hussain)
 * Supports MongoDB + In-Memory / Offline Sync fallback with strict Measured vs Estimated accuracy.
 */

import {
  CALIBRATED_POLE_SPACING_METERS,
  KEY_LANDMARK_POLES,
  getPoleData
} from '../../client/js/data/smartPoleNavigationData.js';
import { getMongoStatus } from '../config/db.js';
import {
  WalkSession,
  WalkJourney,
  UserWalkingProfile
} from '../models/WalkTrackerModels.js';

// In-memory store for fallback / instant local response when MongoDB is offline
const memoryStore = {
  sessions: new Map(),
  journeys: new Map(),
  profiles: new Map(),
  groups: new Map()
};

function formatClockTime(date = new Date()) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function getTimeOfDayTag(date = new Date()) {
  const hr = date.getHours();
  if (hr >= 5 && hr < 12) return 'Morning Walk';
  if (hr >= 12 && hr < 17) return 'Afternoon Walk';
  if (hr >= 17 && hr < 21) return 'Evening Walk';
  return 'Night Walk';
}

export function formatPacePerKm(speedKmH) {
  if (!speedKmH || speedKmH <= 0.2) return '— / km';
  const totalSecPerKm = Math.round(3600 / speedKmH);
  const mins = Math.floor(totalSecPerKm / 60);
  const secs = String(totalSecPerKm % 60).padStart(2, '0');
  return `${mins} min ${secs} sec / km`;
}

export function formatDurationHm(seconds) {
  const s = Math.max(0, Math.round(Number(seconds) || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${String(mins).padStart(2, '0')}m`;
  return `${mins}m`;
}

/**
 * Helper: get or initialize user walking profile
 */
async function resolveUserProfile(userId = 'local_pilgrim') {
  if (getMongoStatus()) {
    try {
      let p = await UserWalkingProfile.findOne({ userId }).lean();
      if (!p) {
        p = await UserWalkingProfile.create({ userId });
        p = p.toObject();
      }
      return p;
    } catch (_) {}
  }
  if (!memoryStore.profiles.has(userId)) {
    memoryStore.profiles.set(userId, {
      userId,
      heightCm: 170,
      stepLengthMeters: 0.72,
      stepLengthMode: 'AUTO',
      preferredPaceProfile: 'normal',
      privacyMode: 'PRIVATE',
      shareAnonymousAggregate: false,
      shareGroupStatus: false,
      audioAnnouncementsEnabled: false,
      batterySaverEnabled: false,
      dailyStepGoal: 15000,
      targetPoleGoal: 600,
      groupCode: '',
      groupDisplayName: 'Pilgrim'
    });
  }
  return memoryStore.profiles.get(userId);
}

/**
 * Helper: save session to Mongo + Memory
 */
async function persistSession(sessionObj) {
  memoryStore.sessions.set(sessionObj.sessionId, sessionObj);
  if (getMongoStatus()) {
    try {
      await WalkSession.findOneAndUpdate(
        { sessionId: sessionObj.sessionId },
        { $set: sessionObj },
        { upsert: true, new: true }
      );
    } catch (_) {}
  }
  return sessionObj;
}

/**
 * Helper: list all sessions for user
 */
async function getUserSessions(userId = 'local_pilgrim') {
  const memList = Array.from(memoryStore.sessions.values()).filter(s => s.userId === userId);
  if (getMongoStatus()) {
    try {
      const dbList = await WalkSession.find({ userId }).sort({ startedAt: -1 }).lean();
      const map = new Map();
      dbList.forEach(s => map.set(s.sessionId, s));
      memList.forEach(s => map.set(s.sessionId, s));
      return Array.from(map.values()).sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    } catch (_) {}
  }
  return memList.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
}

/**
 * POST /api/walk/start
 * Starts a new Live Walk Session along Route 9 (Najaf -> Karbala)
 */
export const startWalkSession = async (req, res) => {
  try {
    const {
      userId = 'local_pilgrim',
      journeyId = 'arbaeen_1448_default',
      startPole = 1,
      stepLengthMeters,
      stepLengthMode = 'AUTO',
      dataSource = 'ESTIMATED',
      batterySaver = false,
      audioAnnouncements = false,
      privacyMode = 'PRIVATE',
      timezone = 'Asia/Baghdad'
    } = req.body || {};

    const profile = await resolveUserProfile(userId);
    const effectiveStepLength = Number(stepLengthMeters) > 0.3 && Number(stepLengthMeters) < 1.5
      ? Number(stepLengthMeters)
      : (profile.stepLengthMeters || 0.72);

    const validatedPole = Math.max(1, Math.min(1452, parseInt(startPole, 10) || 1));
    const now = new Date();
    const sessionId = `walk_${now.getTime()}_${Math.random().toString(36).slice(2, 7)}`;

    const newSession = {
      sessionId,
      userId,
      journeyId,
      route: 'Najaf → Karbala (Route 9 / Tareeq Ya Hussain)',
      status: 'ACTIVE',
      timeOfDayTag: getTimeOfDayTag(now),
      startedAt: now.toISOString(),
      endedAt: null,
      lastUpdatedAt: now.toISOString(),
      activeDuration: 0,
      restDuration: 0,
      steps: 0,
      distanceMeters: 0,
      gpsDistanceMeters: 0,
      estimatedDistanceMeters: 0,
      averagePace: '— / km',
      averageSpeed: 0,
      currentSpeed: 0,
      stepsPerMinute: 0,
      startPole: validatedPole,
      endPole: validatedPole,
      currentPole: validatedPole,
      polesCompleted: 0,
      dataSource: ['DEVICE_MEASURED', 'GPS_TRACKED', 'ESTIMATED'].includes(dataSource) ? dataSource : 'ESTIMATED',
      stepLengthMeters: effectiveStepLength,
      stepLengthMode: stepLengthMode === 'CUSTOM' ? 'CUSTOM' : 'AUTO',
      batterySaver: Boolean(batterySaver),
      audioAnnouncements: Boolean(audioAnnouncements),
      privacyMode: ['PRIVATE', 'GROUP_ONLY', 'ANONYMOUS_AGGREGATE'].includes(privacyMode) ? privacyMode : 'PRIVATE',
      timezone,
      syncStatus: 'SYNCED',
      timelineEvents: [
        {
          time: formatClockTime(now),
          timestamp: now.toISOString(),
          type: 'START',
          label: `Walk Started at Pole #${validatedPole}`,
          poleNumber: validatedPole,
          steps: 0,
          distanceMeters: 0
        }
      ],
      samples: [
        {
          timestamp: now.toISOString(),
          elapsedActiveSeconds: 0,
          elapsedRestSeconds: 0,
          cumulativeSteps: 0,
          distanceMeters: 0,
          currentPole: validatedPole,
          stepsPerMinute: 0,
          speedKmH: 0,
          dataSource: ['DEVICE_MEASURED', 'GPS_TRACKED', 'ESTIMATED'].includes(dataSource) ? dataSource : 'ESTIMATED',
          eventType: 'START',
          label: `Session started at Pole ${validatedPole}`
        }
      ]
    };

    await persistSession(newSession);

    res.json({
      status: 'success',
      session: newSession,
      currentPoleDetails: getPoleData(validatedPole)
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/walk/pause
 * Pauses an active session so rest time is tracked separately from active walking time
 */
export const pauseWalkSession = async (req, res) => {
  try {
    const { sessionId, userId = 'local_pilgrim', steps, activeDuration, restDuration, currentPole, distanceMeters } = req.body || {};
    const sessions = await getUserSessions(userId);
    const target = sessionId
      ? sessions.find(s => s.sessionId === sessionId)
      : sessions.find(s => s.status === 'ACTIVE');

    if (!target) {
      return res.status(404).json({ status: 'error', message: 'No active walk session found to pause.' });
    }

    const now = new Date();
    target.status = 'PAUSED';
    target.lastUpdatedAt = now.toISOString();
    if (typeof steps === 'number') target.steps = steps;
    if (typeof activeDuration === 'number') target.activeDuration = activeDuration;
    if (typeof restDuration === 'number') target.restDuration = restDuration;
    if (typeof currentPole === 'number') {
      target.currentPole = Math.max(1, Math.min(1452, currentPole));
      target.endPole = target.currentPole;
      target.polesCompleted = Math.max(0, target.currentPole - target.startPole);
    }
    if (typeof distanceMeters === 'number') target.distanceMeters = distanceMeters;

    target.timelineEvents = target.timelineEvents || [];
    target.timelineEvents.push({
      time: formatClockTime(now),
      timestamp: now.toISOString(),
      type: 'PAUSE',
      label: `Rest / Pause at Pole #${target.currentPole}`,
      poleNumber: target.currentPole,
      steps: target.steps,
      distanceMeters: target.distanceMeters
    });

    await persistSession(target);
    res.json({ status: 'success', session: target });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/walk/resume
 * Resumes a paused walk session
 */
export const resumeWalkSession = async (req, res) => {
  try {
    const { sessionId, userId = 'local_pilgrim', restDuration } = req.body || {};
    const sessions = await getUserSessions(userId);
    const target = sessionId
      ? sessions.find(s => s.sessionId === sessionId)
      : sessions.find(s => s.status === 'PAUSED' || s.status === 'ACTIVE');

    if (!target) {
      return res.status(404).json({ status: 'error', message: 'No paused walk session found to resume.' });
    }

    const now = new Date();
    target.status = 'ACTIVE';
    target.lastUpdatedAt = now.toISOString();
    if (typeof restDuration === 'number') target.restDuration = restDuration;

    target.timelineEvents = target.timelineEvents || [];
    target.timelineEvents.push({
      time: formatClockTime(now),
      timestamp: now.toISOString(),
      type: 'RESUME',
      label: `Walk Resumed from Pole #${target.currentPole}`,
      poleNumber: target.currentPole,
      steps: target.steps,
      distanceMeters: target.distanceMeters
    });

    await persistSession(target);
    res.json({ status: 'success', session: target });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/walk/sync
 * Syncs live or offline-queued walk telemetry (steps, GPS, pole progress, samples, timeline events)
 */
export const syncWalkSession = async (req, res) => {
  try {
    const payload = req.body || {};
    const userId = payload.userId || 'local_pilgrim';
    const sessionId = payload.sessionId;

    if (!sessionId) {
      return res.status(400).json({ status: 'error', message: 'sessionId is required to sync.' });
    }

    const sessions = await getUserSessions(userId);
    let existing = sessions.find(s => s.sessionId === sessionId) || {};

    const merged = {
      ...existing,
      ...payload,
      userId,
      sessionId,
      lastUpdatedAt: new Date().toISOString(),
      syncStatus: 'SYNCED'
    };

    if (merged.activeDuration > 0 && merged.distanceMeters > 0) {
      const km = merged.distanceMeters / 1000;
      const hrs = merged.activeDuration / 3600;
      merged.averageSpeed = Number((km / hrs).toFixed(2));
      merged.averagePace = formatPacePerKm(merged.averageSpeed);
      merged.stepsPerMinute = Math.round((merged.steps || 0) / (merged.activeDuration / 60));
    }

    await persistSession(merged);
    res.json({ status: 'success', session: merged });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * POST /api/walk/finish
 * Completes and archives a walking session into Walk History & Journey Totals
 */
export const finishWalkSession = async (req, res) => {
  try {
    const {
      sessionId,
      userId = 'local_pilgrim',
      steps,
      activeDuration,
      restDuration,
      distanceMeters,
      gpsDistanceMeters,
      estimatedDistanceMeters,
      currentPole,
      timelineEvents,
      samples
    } = req.body || {};

    const sessions = await getUserSessions(userId);
    let target = sessionId
      ? sessions.find(s => s.sessionId === sessionId)
      : sessions.find(s => s.status === 'ACTIVE' || s.status === 'PAUSED');

    const now = new Date();
    if (!target) {
      // Allow finishing an offline-created session directly
      target = {
        sessionId: sessionId || `walk_${now.getTime()}`,
        userId,
        journeyId: 'arbaeen_1448_default',
        route: 'Najaf → Karbala (Route 9 / Tareeq Ya Hussain)',
        startedAt: new Date(now.getTime() - ((activeDuration || 0) + (restDuration || 0)) * 1000).toISOString(),
        startPole: req.body?.startPole || 1,
        stepLengthMeters: req.body?.stepLengthMeters || 0.72,
        dataSource: req.body?.dataSource || 'ESTIMATED',
        timelineEvents: [],
        samples: []
      };
    }

    target.status = 'FINISHED';
    target.endedAt = now.toISOString();
    target.lastUpdatedAt = now.toISOString();
    if (typeof steps === 'number') target.steps = steps;
    if (typeof activeDuration === 'number') target.activeDuration = activeDuration;
    if (typeof restDuration === 'number') target.restDuration = restDuration;
    if (typeof distanceMeters === 'number') target.distanceMeters = distanceMeters;
    if (typeof gpsDistanceMeters === 'number') target.gpsDistanceMeters = gpsDistanceMeters;
    if (typeof estimatedDistanceMeters === 'number') target.estimatedDistanceMeters = estimatedDistanceMeters;
    if (typeof currentPole === 'number') {
      target.currentPole = Math.max(1, Math.min(1452, currentPole));
      target.endPole = target.currentPole;
      target.polesCompleted = Math.max(0, target.endPole - (target.startPole || 1));
    }
    if (Array.isArray(timelineEvents)) target.timelineEvents = timelineEvents;
    if (Array.isArray(samples)) target.samples = samples;

    if (target.activeDuration > 0 && target.distanceMeters > 0) {
      const km = target.distanceMeters / 1000;
      const hrs = target.activeDuration / 3600;
      target.averageSpeed = Number((km / hrs).toFixed(2));
      target.averagePace = formatPacePerKm(target.averageSpeed);
      target.stepsPerMinute = Math.round((target.steps || 0) / Math.max(1, target.activeDuration / 60));
    }

    target.timelineEvents = target.timelineEvents || [];
    target.timelineEvents.push({
      time: formatClockTime(now),
      timestamp: now.toISOString(),
      type: 'FINISH',
      label: `Walk Completed at Pole #${target.endPole || target.currentPole}`,
      poleNumber: target.endPole || target.currentPole,
      steps: target.steps,
      distanceMeters: target.distanceMeters
    });

    await persistSession(target);
    res.json({ status: 'success', session: target });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/walk/current
 * Returns active/paused walk session and user profile if available
 */
export const getCurrentWalkSession = async (req, res) => {
  try {
    const userId = req.query.userId || 'local_pilgrim';
    const profile = await resolveUserProfile(userId);
    const sessions = await getUserSessions(userId);
    const activeSession = sessions.find(s => s.status === 'ACTIVE' || s.status === 'PAUSED') || null;

    res.json({
      status: 'success',
      activeSession,
      profile,
      currentPoleDetails: activeSession ? getPoleData(activeSession.currentPole || 1) : null
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/walk/history
 * Returns completed and active sessions for the pilgrim
 */
export const getWalkHistory = async (req, res) => {
  try {
    const userId = req.query.userId || 'local_pilgrim';
    const sessions = await getUserSessions(userId);

    res.json({
      status: 'success',
      totalSessions: sessions.length,
      sessions
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/walk/summary/today
 * Computes Today, Yesterday, and 7-Day step/distance/time/pole analytics from real recorded sessions
 */
export const getWalkSummaryToday = async (req, res) => {
  try {
    const userId = req.query.userId || 'local_pilgrim';
    const sessions = await getUserSessions(userId);

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const yesterdayDate = new Date(now.getTime() - 86400000);
    const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

    const aggregateRange = (list) => {
      let steps = 0;
      let distanceMeters = 0;
      let activeDuration = 0;
      let restDuration = 0;
      let polesCompleted = 0;
      let highestPole = 1;

      list.forEach(s => {
        steps += Number(s.steps) || 0;
        distanceMeters += Number(s.distanceMeters) || 0;
        activeDuration += Number(s.activeDuration) || 0;
        restDuration += Number(s.restDuration) || 0;
        polesCompleted += Number(s.polesCompleted) || 0;
        if ((s.currentPole || 1) > highestPole) highestPole = s.currentPole;
      });

      const distanceKm = Number((distanceMeters / 1000).toFixed(2));
      const avgSpeedKmH = activeDuration > 0 ? Number(((distanceMeters / 1000) / (activeDuration / 3600)).toFixed(2)) : 0;

      return {
        sessionsCount: list.length,
        steps,
        distanceMeters: Math.round(distanceMeters),
        distanceKm,
        activeDurationSeconds: Math.round(activeDuration),
        activeDurationFormatted: formatDurationHm(activeDuration),
        restDurationSeconds: Math.round(restDuration),
        restDurationFormatted: formatDurationHm(restDuration),
        totalDurationFormatted: formatDurationHm(activeDuration + restDuration),
        polesCompleted,
        highestPole,
        averageSpeedKmH: avgSpeedKmH,
        averagePaceFormatted: formatPacePerKm(avgSpeedKmH),
        stepsPerMinute: activeDuration > 0 ? Math.round(steps / (activeDuration / 60)) : 0
      };
    };

    const todaySessions = sessions.filter(s => (s.startedAt || '').slice(0, 10) === todayStr);
    const yesterdaySessions = sessions.filter(s => (s.startedAt || '').slice(0, 10) === yesterdayStr);
    const sevenDaySessions = sessions.filter(s => new Date(s.startedAt) >= sevenDaysAgo);

    res.json({
      status: 'success',
      date: todayStr,
      today: aggregateRange(todaySessions),
      yesterday: aggregateRange(yesterdaySessions),
      last7Days: aggregateRange(sevenDaySessions)
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/walk/summary/journey
 * Returns multi-day Arbaeen Journey totals, Day-by-Day Period Comparison, and Personal Bests
 */
export const getWalkSummaryJourney = async (req, res) => {
  try {
    const userId = req.query.userId || 'local_pilgrim';
    const profile = await resolveUserProfile(userId);
    const sessions = await getUserSessions(userId);

    // Group by calendar day for Day 1 vs Day 2 vs Day 3 comparison
    const byDayMap = new Map();
    sessions.slice().reverse().forEach(s => {
      const dayKey = (s.startedAt || new Date().toISOString()).slice(0, 10);
      if (!byDayMap.has(dayKey)) {
        byDayMap.set(dayKey, []);
      }
      byDayMap.get(dayKey).push(s);
    });

    const dayComparisons = [];
    let dayIndex = 1;
    let mostStepsOneDay = 0;
    let mostPolesOneDay = 0;

    for (const [dateStr, dayList] of byDayMap.entries()) {
      const steps = dayList.reduce((acc, s) => acc + (Number(s.steps) || 0), 0);
      const distanceMeters = dayList.reduce((acc, s) => acc + (Number(s.distanceMeters) || 0), 0);
      const activeDuration = dayList.reduce((acc, s) => acc + (Number(s.activeDuration) || 0), 0);
      const restDuration = dayList.reduce((acc, s) => acc + (Number(s.restDuration) || 0), 0);
      const polesCompleted = dayList.reduce((acc, s) => acc + (Number(s.polesCompleted) || 0), 0);
      const speedKmH = activeDuration > 0 ? Number(((distanceMeters / 1000) / (activeDuration / 3600)).toFixed(2)) : 0;

      if (steps > mostStepsOneDay) mostStepsOneDay = steps;
      if (polesCompleted > mostPolesOneDay) mostPolesOneDay = polesCompleted;

      dayComparisons.push({
        dayNumber: dayIndex++,
        date: dateStr,
        steps,
        distanceKm: Number((distanceMeters / 1000).toFixed(2)),
        activeDurationSeconds: activeDuration,
        walkingTimeFormatted: formatDurationHm(activeDuration),
        restDurationSeconds: restDuration,
        restTimeFormatted: formatDurationHm(restDuration),
        polesCompleted,
        averageSpeedKmH: speedKmH,
        averagePaceFormatted: formatPacePerKm(speedKmH)
      });
    }

    const totalSteps = sessions.reduce((acc, s) => acc + (Number(s.steps) || 0), 0);
    const totalDistanceMeters = sessions.reduce((acc, s) => acc + (Number(s.distanceMeters) || 0), 0);
    const totalActiveSeconds = sessions.reduce((acc, s) => acc + (Number(s.activeDuration) || 0), 0);
    const totalRestSeconds = sessions.reduce((acc, s) => acc + (Number(s.restDuration) || 0), 0);
    const totalPolesCompleted = sessions.reduce((acc, s) => acc + (Number(s.polesCompleted) || 0), 0);
    const furthestPole = sessions.reduce((maxP, s) => Math.max(maxP, Number(s.currentPole) || 1), 1);

    // Personal Records (Non-competitive, informative only)
    const longestSessionSec = sessions.reduce((m, s) => Math.max(m, Number(s.activeDuration) || 0), 0);
    const longestDistanceMeters = sessions.reduce((m, s) => Math.max(m, Number(s.distanceMeters) || 0), 0);
    const fastestSpeedKmH = sessions.reduce((m, s) => Math.max(m, Number(s.averageSpeed) || 0), 0);

    // Anonymous Consented Aggregate Insights (only from sessions where privacyMode === 'ANONYMOUS_AGGREGATE')
    const allRecordedSessions = Array.from(memoryStore.sessions.values());
    const consentedSessions = allRecordedSessions.filter(s => s.privacyMode === 'ANONYMOUS_AGGREGATE');
    const consentedSteps = consentedSessions.reduce((acc, s) => acc + (Number(s.steps) || 0), 0);

    res.json({
      status: 'success',
      profile,
      journeyTotal: {
        hasStartedJourney: sessions.length > 0,
        totalSessions: sessions.length,
        daysWalking: byDayMap.size,
        steps: totalSteps,
        distanceMeters: Math.round(totalDistanceMeters),
        distanceKm: Number((totalDistanceMeters / 1000).toFixed(2)),
        walkingTimeSeconds: Math.round(totalActiveSeconds),
        walkingTimeFormatted: formatDurationHm(totalActiveSeconds),
        restTimeSeconds: Math.round(totalRestSeconds),
        restTimeFormatted: formatDurationHm(totalRestSeconds),
        totalJourneyTimeFormatted: formatDurationHm(totalActiveSeconds + totalRestSeconds),
        polesCompleted: Math.min(1452, totalPolesCompleted),
        currentPole: furthestPole,
        polesRemaining: Math.max(0, 1452 - furthestPole),
        progressPercent: Number(((furthestPole / 1452) * 100).toFixed(1))
      },
      dayComparisons,
      personalRecords: {
        mostStepsInOneDay: mostStepsOneDay,
        longestWalkingSessionFormatted: formatDurationHm(longestSessionSec),
        fastestAverageSpeedKmH: fastestSpeedKmH,
        fastestAveragePaceFormatted: formatPacePerKm(fastestSpeedKmH),
        longestSingleSessionDistanceKm: Number((longestDistanceMeters / 1000).toFixed(2)),
        mostPolesInOneDay: mostPolesOneDay
      },
      anonymousAggregate: {
        consentedPilgrimsCount: new Set(consentedSessions.map(s => s.userId)).size,
        totalConsentedStepsToday: consentedSteps,
        note: 'Calculated strictly from pilgrims who explicitly opted in to Anonymous Aggregate Sharing.'
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * GET /api/walk/estimate
 * Intelligent Walk Estimator & "How Many Steps / How Long Until Karbala?" Calculator
 * Query params: fromPole, toPole (default 1452), stepLengthMeters (default 0.72), speedKmH (default 4.5), includeRests (true/false)
 */
export const calculateWalkEstimate = async (req, res) => {
  try {
    const fromPole = Math.max(1, Math.min(1452, parseInt(req.query.fromPole || req.query.from || 1, 10)));
    const toPole = Math.max(1, Math.min(1452, parseInt(req.query.toPole || req.query.to || 1452, 10)));
    const stepLengthMeters = Math.max(0.4, Math.min(1.2, parseFloat(req.query.stepLengthMeters) || 0.72));
    const speedKmH = Math.max(1.5, Math.min(8.0, parseFloat(req.query.speedKmH) || 4.5));

    const start = Math.min(fromPole, toPole);
    const end = Math.max(fromPole, toPole);
    const poleIntervals = end - start;

    // Route 9 calibrated pole distance: 50.17 meters per pole interval
    const routeDistanceMeters = Math.round(poleIntervals * CALIBRATED_POLE_SPACING_METERS);
    const routeDistanceKm = Number((routeDistanceMeters / 1000).toFixed(2));

    // Also calculate full remaining distance to Imam Hussain Shrine (Pole 1452 + 3.8 km city approach)
    const remainingPolesTo1452 = Math.max(0, 1452 - fromPole);
    const highwayMetersTo1452 = Math.round(remainingPolesTo1452 * CALIBRATED_POLE_SPACING_METERS);
    const totalMetersToHaram = highwayMetersTo1452 + 3800; // 3.8 km from Pole 1452 into Bayn al-Haramayn

    // Step calculations using personal step length
    const estimatedStepsSegment = Math.round(routeDistanceMeters / stepLengthMeters);
    const estimatedStepsToPole1452 = Math.round(highwayMetersTo1452 / stepLengthMeters);
    const estimatedStepsToHaram = Math.round(totalMetersToHaram / stepLengthMeters);

    // Single pole interval (e.g., Pole 420 -> Pole 421)
    const singlePoleMeters = CALIBRATED_POLE_SPACING_METERS; // 50.17m
    const singlePoleSteps = Math.round(singlePoleMeters / stepLengthMeters);
    const singlePoleSeconds = Math.round((singlePoleMeters / 1000 / speedKmH) * 3600);

    // Time calculations (Walking-only vs With planned rests: ~12 mins rest per hour of walking)
    const walkingOnlyMinutes = Math.round((routeDistanceKm / speedKmH) * 60);
    const plannedRestMinutes = Math.round(walkingOnlyMinutes * 0.2); // 12m per 60m
    const totalJourneyMinutesWithRest = walkingOnlyMinutes + plannedRestMinutes;

    const milestonesEnRoute = KEY_LANDMARK_POLES.filter(p => p.poleNumber >= start && p.poleNumber <= end);

    res.json({
      status: 'success',
      label: 'ESTIMATED_FROM_ROUTE_AND_STEP_PROFILE',
      inputs: {
        fromPole: start,
        toPole: end,
        stepLengthMeters,
        speedKmH,
        averagePaceFormatted: formatPacePerKm(speedKmH),
        calibratedPoleSpacingMeters: CALIBRATED_POLE_SPACING_METERS
      },
      singlePoleInterval: {
        fromPole: start,
        toPole: Math.min(1452, start + 1),
        approxDistanceMeters: Math.round(singlePoleMeters),
        exactCalibratedMeters: singlePoleMeters,
        estimatedSteps: singlePoleSteps,
        estimatedTimeSeconds: singlePoleSeconds
      },
      segmentEstimate: {
        poleIntervals,
        approxDistanceMeters: routeDistanceMeters,
        approxDistanceKm: routeDistanceKm,
        estimatedSteps: estimatedStepsSegment,
        walkingOnlyMinutes,
        walkingOnlyFormatted: formatDurationHm(walkingOnlyMinutes * 60),
        plannedRestMinutes,
        withPlannedBreaksMinutes: totalJourneyMinutesWithRest,
        withPlannedBreaksFormatted: formatDurationHm(totalJourneyMinutesWithRest * 60)
      },
      toKarbalaSummary: {
        currentPole: fromPole,
        remainingPolesTo1452,
        highwayDistanceRemainingKm: Number((highwayMetersTo1452 / 1000).toFixed(2)),
        totalDistanceToHaramKm: Number((totalMetersToHaram / 1000).toFixed(2)),
        estimatedStepsToPole1452,
        estimatedStepsToHaram,
        calculationBasis: `Remaining route distance (${(highwayMetersTo1452 / 1000).toFixed(2)} km to Pole 1452) ÷ personal step length (${stepLengthMeters}m)`
      },
      milestonesEnRoute
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

/**
 * PUT /api/walk/profile
 * Updates user walking profile (step length, goals, privacy, battery saver, audio, group check-in)
 */
export const updateWalkingProfile = async (req, res) => {
  try {
    const userId = req.body?.userId || 'local_pilgrim';
    const current = await resolveUserProfile(userId);
    const updated = {
      ...current,
      ...req.body,
      userId
    };

    // If heightCm provided and stepLengthMode is AUTO, calculate biomechanical step length (~0.415 * height)
    if (updated.stepLengthMode === 'AUTO' && updated.heightCm) {
      updated.stepLengthMeters = Number(((Number(updated.heightCm) * 0.415) / 100).toFixed(2));
    }

    memoryStore.profiles.set(userId, updated);
    if (getMongoStatus()) {
      try {
        await UserWalkingProfile.findOneAndUpdate(
          { userId },
          { $set: updated },
          { upsert: true, new: true }
        );
      } catch (_) {}
    }

    res.json({ status: 'success', profile: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
