const { useState, useEffect, useRef, useMemo, useCallback } = window.React;

import {
  PILGRIMAGE_ANCHORS,
  KEY_LANDMARK_POLES,
  CALIBRATED_POLE_SPACING_METERS,
  getPoleData
} from '/js/data/smartPoleNavigationData.js';

const STORAGE_KEY = 'karbala_zaireen_walk_v1';
const TOTAL_POLES = 1452;
const TOTAL_ROUTE_KM = Number((((TOTAL_POLES - 1) * CALIBRATED_POLE_SPACING_METERS) / 1000).toFixed(2)); // 72.80 km

/**
 * Format seconds into "Xh Ym" or "Ym Zs"
 */
export function formatDuration(totalSeconds, includeSeconds = false) {
  const sec = Math.max(0, Math.round(Number(totalSeconds) || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return includeSeconds ? `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s` : `${h}h ${String(m).padStart(2, '0')}m`;
  }
  if (m > 0) {
    return includeSeconds ? `${m}m ${String(s).padStart(2, '0')}s` : `${m}m`;
  }
  return `${s}s`;
}

/**
 * Format seconds per km into "13 min 02 sec / km"
 */
export function formatPacePerKm(secPerKm) {
  const s = Math.round(Number(secPerKm) || 0);
  if (s <= 0 || s > 7200) return '— / km';
  const mins = Math.floor(s / 60);
  const remSec = s % 60;
  return `${mins} min ${String(remSec).padStart(2, '0')} sec / km`;
}

/**
 * Haversine distance in meters between two [lat, lng] pairs
 */
function haversineMeters(coord1, coord2) {
  if (!coord1 || !coord2) return 0;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1[0])) * Math.cos(toRad(coord2[0])) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Default persisted state for Zaireen Walk Tracker
 */
function getDefaultWalkState() {
  let pilgrimId = localStorage.getItem('karbala_pilgrim_id');
  if (!pilgrimId) {
    pilgrimId = 'pilgrim_' + Math.random().toString(36).slice(2, 10);
    try {
      localStorage.setItem('karbala_pilgrim_id', pilgrimId);
    } catch (_) {}
  }
  return {
    pilgrimId,
    journeyEnabled: false,
    profile: {
      stepLengthMode: 'AUTO', // 'AUTO' | 'CUSTOM'
      heightCm: 170,
      customStepLengthMeters: 0.72,
      effectiveStepLengthMeters: 0.70,
      preferredPaceKmh: 4.5,
      preferredBreakMinutesPerHour: 12,
      dailyTargetSteps: 15000,
      dailyTargetPole: 600,
      batterySaverDefault: false,
      audioAnnouncementsEnabled: false,
      privacyMode: 'PRIVATE',
      shareAnonymousAggregate: false,
      groupCode: '',
      groupNickname: 'Zair'
    },
    activeSession: null,
    sessionsHistory: [],
    groupCheckIns: [],
    lastSyncedAt: null
  };
}

export function loadSavedWalkState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultWalkState();
    const parsed = JSON.parse(raw);
    const def = getDefaultWalkState();
    return {
      ...def,
      ...parsed,
      profile: { ...def.profile, ...(parsed.profile || {}) },
      sessionsHistory: Array.isArray(parsed.sessionsHistory) ? parsed.sessionsHistory : [],
      groupCheckIns: Array.isArray(parsed.groupCheckIns) ? parsed.groupCheckIns : []
    };
  } catch (_) {
    return getDefaultWalkState();
  }
}

export function saveWalkState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('karbala-walk-updated'));
  } catch (_) {}
}

/**
 * HOMEPAGE / PILGRIM HUB CONDITIONAL ACTIVE JOURNEY CARD
 * Shown ONLY if the user has enabled/started a pilgrimage walk or has recorded sessions.
 */
export function ActiveJourneyHomeCard({ onContinueJourney }) {
  const [walkState, setWalkState] = useState(() => loadSavedWalkState());

  useEffect(() => {
    const refresh = () => setWalkState(loadSavedWalkState());
    window.addEventListener('karbala-walk-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('karbala-walk-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const hasJourney = Boolean(
    walkState.journeyEnabled ||
    walkState.activeSession ||
    (walkState.sessionsHistory && walkState.sessionsHistory.length > 0)
  );

  if (!hasJourney) return null;

  // Compute today's steps and current pole
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayHistorySteps = (walkState.sessionsHistory || [])
    .filter((s) => (s.dateKey || (s.startedAt || '').slice(0, 10)) === todayKey)
    .reduce((acc, s) => acc + (Number(s.totalSteps) || 0), 0);

  const activeSteps = walkState.activeSession ? Number(walkState.activeSession.totalSteps) || 0 : 0;
  const todayTotalSteps = todayHistorySteps + activeSteps;

  const currentPole = walkState.activeSession
    ? Number(walkState.activeSession.currentPole) || 1
    : (walkState.sessionsHistory[0]?.endingPole || 1);

  const distanceRemainingKm = Number(
    Math.max(0, ((TOTAL_POLES - currentPole) * CALIBRATED_POLE_SPACING_METERS) / 1000).toFixed(1)
  );
  const progressPercent = Number((((currentPole - 1) / (TOTAL_POLES - 1)) * 100).toFixed(1));

  return (
    <div
      className="zaireen-active-journey-banner my-3 p-3 p-md-4 rounded-4 border shadow-lg position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(16, 22, 31, 0.96) 0%, rgba(10, 13, 18, 0.99) 100%)',
        borderColor: 'rgba(198, 166, 107, 0.48)'
      }}
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span
              className="badge rounded-pill px-2.5 py-1 fw-bold"
              style={{
                background: 'rgba(198, 166, 107, 0.18)',
                color: '#dfc08a',
                border: '1px solid rgba(198, 166, 107, 0.45)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em'
              }}
            >
              <i className="bi bi-person-walking me-1"></i> YOUR ARBAEEN JOURNEY
            </span>
            {walkState.activeSession && (
              <span className={`badge rounded-pill px-2 py-1 ${walkState.activeSession.status === 'ACTIVE' ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: '0.68rem' }}>
                {walkState.activeSession.status === 'ACTIVE' ? '● LIVE WALKING' : '❚❚ PAUSED (REST)'}
              </span>
            )}
          </div>
          <div className="d-flex flex-wrap align-items-baseline gap-3 mt-1">
            <span className="h4 font-display text-white mb-0">
              Pole <span style={{ color: '#dfc08a' }}>{currentPole}</span> <small className="text-secondary fs-6">/ 1,452</small>
            </span>
            <span className="text-light fw-semibold">
              <i className="bi bi-footprints me-1 text-warning"></i>
              {todayTotalSteps.toLocaleString()} Steps Today
            </span>
            <span className="text-secondary small">
              • <strong className="text-white">{distanceRemainingKm} km</strong> to Karbala ({progressPercent}%)
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 shadow"
          style={{
            background: 'linear-gradient(135deg, #dfc08a, #c6a66b)',
            color: '#0a0d12',
            border: 'none'
          }}
          onClick={() => onContinueJourney && onContinueJourney(currentPole)}
        >
          <span>Continue Journey</span>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

/**
 * MAIN ZAIREEN WALK TRACKER & STEP INTELLIGENCE COMPONENT
 * Integrated inside SmartPoleNavigationHub
 */
export function ZaireenWalkTracker({
  selectedPoleNumber,
  onSelectPole,
  onJumpToMapPole,
  nightMode = true
}) {
  const [walkState, setWalkState] = useState(() => loadSavedWalkState());
  const [subView, setSubView] = useState('dashboard'); // 'dashboard' | 'analytics' | 'estimator' | 'history' | 'settings'
  const [startingPoleInput, setStartingPoleInput] = useState(() => {
    const saved = loadSavedWalkState();
    if (saved.activeSession) return saved.activeSession.currentPole;
    if (saved.sessionsHistory?.length > 0) return saved.sessionsHistory[0].endingPole || 1;
    return selectedPoleNumber || 1;
  });
  const [dataModeChoice, setDataModeChoice] = useState('ESTIMATED'); // 'DEVICE_MEASURED' | 'GPS_TRACKED' | 'ESTIMATED'
  const [deviceMotionSupported, setDeviceMotionSupported] = useState(false);
  const [deviceMotionAuthorized, setDeviceMotionAuthorized] = useState(false);
  const [gpsWatchError, setGpsWatchError] = useState(null);
  const [gpsAccuracyMeters, setGpsAccuracyMeters] = useState(null);
  const [manualStepAdd, setManualStepAdd] = useState(100);
  const [sessionPeriodTag, setSessionPeriodTag] = useState(() => {
    const hr = new Date().getHours();
    if (hr >= 4 && hr < 12) return 'Morning Walk';
    if (hr >= 12 && hr < 17) return 'Afternoon Walk';
    if (hr >= 17 && hr < 21) return 'Evening Walk';
    return 'Night Walk';
  });

  // Walk Estimator standalone inputs
  const [estFromPole, setEstFromPole] = useState(1);
  const [estToPole, setEstToPole] = useState(1452);
  const [estPaceKmh, setEstPaceKmh] = useState(4.5);
  const [estStepLengthM, setEstStepLengthM] = useState(0.70);

  // Daily summary filter ('today' | 'yesterday' | '7days' | 'journey')
  const [summaryRange, setSummaryRange] = useState('today');

  // Graph metric & period selector
  const [graphMetric, setGraphMetric] = useState('steps'); // 'steps' | 'distance' | 'pace'
  const [graphScope, setGraphScope] = useState('session'); // 'session' | 'today' | 'journey'

  // Live tick for active/rest elapsed timers
  const [, setTick] = useState(0);
  const lastTickTimeRef = useRef(Date.now());
  const gpsWatchIdRef = useRef(null);
  const lastGpsFixRef = useRef(null);
  const lastStepTimestampRef = useRef(0);
  const announcedMilestonesRef = useRef(new Set());

  // Persist changes to localStorage
  const updateWalkState = useCallback((updater) => {
    setWalkState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveWalkState(next);
      return next;
    });
  }, []);

  // Sync with backend API silently when online (never fails offline)
  const syncBackendApi = useCallback(async (endpoint, method = 'POST', payload = null) => {
    try {
      const opts = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (payload && method !== 'GET') {
        opts.body = JSON.stringify(payload);
      }
      const res = await fetch(`/api/walk/${endpoint}`, opts);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {
      // Offline-resilient: local state remains authoritative when offline
    }
    return null;
  }, []);

  // Detect DeviceMotionEvent capability
  useEffect(() => {
    const hasMotion = typeof window !== 'undefined' && 'DeviceMotionEvent' in window;
    setDeviceMotionSupported(hasMotion);
  }, []);

  // Optional calm voice announcement helper
  const speakCalmAnnouncement = useCallback((text) => {
    if (!walkState.profile?.audioAnnouncementsEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    } catch (_) {}
  }, [walkState.profile?.audioAnnouncementsEnabled]);

  // Effective step length in meters
  const effectiveStepLength = useMemo(() => {
    const prof = walkState.profile || {};
    if (prof.stepLengthMode === 'CUSTOM' && Number(prof.customStepLengthMeters) >= 0.35 && Number(prof.customStepLengthMeters) <= 1.25) {
      return Number(prof.customStepLengthMeters);
    }
    const h = Number(prof.heightCm) || 170;
    return Number(Math.max(0.45, Math.min(0.95, (h * 0.414) / 100)).toFixed(2));
  }, [walkState.profile]);

  // 1-second timer loop for active walking vs paused rest time
  useEffect(() => {
    if (!walkState.activeSession) return;
    lastTickTimeRef.current = Date.now();

    const intervalMs = walkState.activeSession.batterySaver ? 2000 : 1000;
    const timer = setInterval(() => {
      const now = Date.now();
      const deltaSec = Math.max(0, Math.round((now - lastTickTimeRef.current) / 1000));
      lastTickTimeRef.current = now;
      if (deltaSec <= 0) return;

      updateWalkState((prev) => {
        if (!prev.activeSession) return prev;
        const sess = { ...prev.activeSession };

        if (sess.status === 'ACTIVE') {
          sess.activeWalkingSeconds = (Number(sess.activeWalkingSeconds) || 0) + deltaSec;
          sess.continuousWalkingSincePauseSec = (Number(sess.continuousWalkingSincePauseSec) || 0) + deltaSec;
        } else if (sess.status === 'PAUSED') {
          // Crucial rule: Paused time is NEVER counted as active walking time
          sess.restSeconds = (Number(sess.restSeconds) || 0) + deltaSec;
        }
        sess.totalJourneySeconds = (Number(sess.activeWalkingSeconds) || 0) + (Number(sess.restSeconds) || 0);
        return { ...prev, activeSession: sess };
      });
      setTick((t) => t + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [walkState.activeSession?.sessionId, walkState.activeSession?.status, walkState.activeSession?.batterySaver, updateWalkState]);

  // DeviceMotion accelerometer step counter (when mode === 'DEVICE_MEASURED' and session is ACTIVE)
  useEffect(() => {
    const sess = walkState.activeSession;
    if (!sess || sess.status !== 'ACTIVE' || sess.dataMode !== 'DEVICE_MEASURED') return;
    if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) return;

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc || (acc.x === null && acc.y === null && acc.z === null)) return;
      const mag = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
      const now = Date.now();
      // Peak threshold ~11.8 m/s² with minimum 330ms debounce between human steps
      if (mag > 11.8 && now - lastStepTimestampRef.current > 330) {
        lastStepTimestampRef.current = now;
        recordStepIncrement(1, 'MEASURED');
      }
    };

    window.addEventListener('devicemotion', handleMotion, { passive: true });
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [walkState.activeSession?.sessionId, walkState.activeSession?.status, walkState.activeSession?.dataMode]);

  // GPS route tracking when session is ACTIVE and dataMode === 'GPS_TRACKED'
  useEffect(() => {
    const sess = walkState.activeSession;
    if (!sess || sess.status !== 'ACTIVE' || sess.dataMode !== 'GPS_TRACKED') {
      if (gpsWatchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
        gpsWatchIdRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      setGpsWatchError('Geolocation is not supported by this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setGpsAccuracyMeters(Math.round(accuracy || 0));
        setGpsWatchError(null);

        // Ignore wildly inaccurate fixes (>250m)
        if (accuracy && accuracy > 250) return;

        const now = Date.now();
        const currentCoord = [latitude, longitude];

        if (lastGpsFixRef.current) {
          const dtSec = Math.max(1, (now - lastGpsFixRef.current.time) / 1000);
          const distM = haversineMeters(lastGpsFixRef.current.coord, currentCoord);
          const speedMps = distM / dtSec;

          // Filter unrealistic GPS jumps (>12 m/s ~ 43 km/h) and tiny jitter (<3m)
          if (speedMps <= 12 && distM >= 3) {
            // Find nearest pole along Najaf -> Karbala corridor
            let closestPoleNum = sess.currentPole;
            let minPoleDist = Infinity;
            for (let p = 1; p <= TOTAL_POLES; p += 5) {
              const pd = getPoleData(p);
              const d = haversineMeters(currentCoord, pd.coordinates);
              if (d < minPoleDist) {
                minPoleDist = d;
                closestPoleNum = p;
              }
            }

            updateWalkState((prev) => {
              if (!prev.activeSession || prev.activeSession.status !== 'ACTIVE') return prev;
              const s = { ...prev.activeSession };
              s.gpsDistanceMeters = Math.round((Number(s.gpsDistanceMeters) || 0) + distM);
              s.distanceWalkedMeters = s.gpsDistanceMeters;
              s.distanceAccuracyLabel = 'GPS_MEASURED';
              // Estimate steps from GPS distance if not using hardware step sensor
              if (s.stepsAccuracyLabel !== 'MEASURED') {
                s.totalSteps = Math.round(s.distanceWalkedMeters / effectiveStepLength);
                s.stepsAccuracyLabel = 'ESTIMATED_FROM_ROUTE';
              }
              if (minPoleDist <= 2500 && closestPoleNum > s.currentPole) {
                s.previousPole = s.currentPole;
                s.currentPole = closestPoleNum;
                s.nextPole = Math.min(TOTAL_POLES, closestPoleNum + 1);
                s.polesCompleted = Math.max(0, s.currentPole - s.startingPole);
                s.polesRemaining = Math.max(0, TOTAL_POLES - s.currentPole);
              }
              return { ...prev, activeSession: s };
            });
          }
        }
        lastGpsFixRef.current = { coord: currentCoord, time: now };
      },
      (err) => {
        setGpsWatchError(`GPS Signal Notice: ${err.message}`);
      },
      {
        enableHighAccuracy: !sess.batterySaver,
        maximumAge: sess.batterySaver ? 25000 : 8000,
        timeout: 15000
      }
    );

    gpsWatchIdRef.current = watchId;
    return () => {
      if (gpsWatchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(gpsWatchIdRef.current);
        gpsWatchIdRef.current = null;
      }
    };
  }, [walkState.activeSession?.sessionId, walkState.activeSession?.status, walkState.activeSession?.dataMode, walkState.activeSession?.batterySaver, effectiveStepLength, updateWalkState]);

  // Helper to check and record calm milestones
  const checkCalmMilestones = useCallback((sess) => {
    const milestones = [...(sess.milestonesAchieved || [])];
    const existingKeys = new Set(milestones.map((m) => m.key));
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const stepThresholds = [
      { key: 'STEPS_5000', val: 5000, label: '5,000 Steps Completed — May your footsteps be accepted.' },
      { key: 'STEPS_10000', val: 10000, label: '10,000 Steps Completed — Steady progress toward Karbala.' },
      { key: 'STEPS_20000', val: 20000, label: '20,000 Steps Completed — Remember to hydrate and pace gently.' }
    ];
    stepThresholds.forEach((t) => {
      if (sess.totalSteps >= t.val && !existingKeys.has(t.key)) {
        milestones.push({ key: t.key, label: t.label, achievedAt: nowTime });
        existingKeys.add(t.key);
        if (!announcedMilestonesRef.current.has(t.key)) {
          announcedMilestonesRef.current.add(t.key);
          speakCalmAnnouncement(t.label);
        }
      }
    });

    if (sess.distanceWalkedMeters >= 25000 && !existingKeys.has('DIST_25KM')) {
      const label = '25 km Walked — Over one-third of the Najaf–Karbala corridor.';
      milestones.push({ key: 'DIST_25KM', label, achievedAt: nowTime });
      speakCalmAnnouncement(label);
    }

    if (sess.polesCompleted >= 500 && !existingKeys.has('POLES_500')) {
      const label = '500 Poles Completed along Tareeq Ya Hussain.';
      milestones.push({ key: 'POLES_500', label, achievedAt: nowTime });
      speakCalmAnnouncement(label);
    }

    return milestones;
  }, [speakCalmAnnouncement]);

  // Increment steps (from device motion or user step logging) and update route metrics
  const recordStepIncrement = useCallback((addedSteps, accuracyType = 'ESTIMATED_FROM_ROUTE') => {
    const count = Math.max(1, Math.round(Number(addedSteps) || 0));
    const nowIso = new Date().toISOString();
    const nowClock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    updateWalkState((prev) => {
      if (!prev.activeSession) return prev;
      const sess = { ...prev.activeSession };
      sess.totalSteps = (Number(sess.totalSteps) || 0) + count;
      if (accuracyType === 'MEASURED') {
        sess.deviceMeasuredSteps = (Number(sess.deviceMeasuredSteps) || 0) + count;
        sess.stepsAccuracyLabel = 'MEASURED';
      }

      const addedDistMeters = count * effectiveStepLength;
      if (sess.distanceAccuracyLabel !== 'GPS_MEASURED') {
        sess.estimatedDistanceMeters = Math.round((Number(sess.estimatedDistanceMeters) || 0) + addedDistMeters);
        sess.distanceWalkedMeters = sess.estimatedDistanceMeters;
        sess.distanceAccuracyLabel = 'ESTIMATED_FROM_STEPS';
      }

      // Advance poles automatically based on distance walked from startingPole
      const polesPassedFromDistance = Math.floor(sess.distanceWalkedMeters / CALIBRATED_POLE_SPACING_METERS);
      const calculatedPole = Math.min(TOTAL_POLES, sess.startingPole + polesPassedFromDistance);
      if (calculatedPole > sess.currentPole) {
        sess.previousPole = sess.currentPole;
        sess.currentPole = calculatedPole;
        sess.nextPole = Math.min(TOTAL_POLES, calculatedPole + 1);
        sess.polesCompleted = Math.max(0, sess.currentPole - sess.startingPole);
        sess.polesRemaining = Math.max(0, TOTAL_POLES - sess.currentPole);

        // Add timeline entry on notable pole intervals (every 5 poles or landmark)
        const lastTimelinePole = (sess.timelineEvents || [])
          .slice()
          .reverse()
          .find((e) => e.eventType === 'POLE_REACHED')?.poleNumber;
        if (!lastTimelinePole || sess.currentPole - lastTimelinePole >= 5 || sess.currentPole === TOTAL_POLES) {
          sess.timelineEvents = [
            ...(sess.timelineEvents || []),
            {
              timestamp: nowIso,
              timeLabel: nowClock,
              eventType: 'POLE_REACHED',
              label: `Pole ${sess.currentPole}`,
              poleNumber: sess.currentPole,
              stepsAtEvent: sess.totalSteps
            }
          ];
          speakCalmAnnouncement(`Pole ${sess.currentPole} reached. ${sess.polesRemaining} poles remaining to Karbala.`);
        }
      }

      // Append time-series sample for real Steps vs Time analytics & SVG graphs
      const samples = [...(sess.samples || [])];
      samples.push({
        timestamp: nowIso,
        elapsedWalkingSeconds: sess.activeWalkingSeconds || 1,
        cumulativeSteps: sess.totalSteps,
        deltaSteps: count,
        cumulativeDistanceMeters: sess.distanceWalkedMeters,
        currentPole: sess.currentPole,
        stepsPerMinute: sess.activeWalkingSeconds > 0 ? Math.round((sess.totalSteps / sess.activeWalkingSeconds) * 60) : 100,
        speedKmh: sess.activeWalkingSeconds > 0 ? Number(((sess.distanceWalkedMeters / 1000) / (sess.activeWalkingSeconds / 3600)).toFixed(2)) : 4.5,
        sourceMode: sess.dataMode
      });
      sess.samples = samples.slice(-300);
      sess.milestonesAchieved = checkCalmMilestones(sess);

      return { ...prev, activeSession: sess };
    });
  }, [effectiveStepLength, checkCalmMilestones, speakCalmAnnouncement, updateWalkState]);

  // Advance or set current pole directly (e.g., pilgrim checks in at a physical pole sign)
  const handleCheckInPole = useCallback((targetPoleNum) => {
    const nextPoleVal = Math.max(1, Math.min(TOTAL_POLES, Math.round(Number(targetPoleNum) || 1)));
    const nowIso = new Date().toISOString();
    const nowClock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    updateWalkState((prev) => {
      if (!prev.activeSession) return prev;
      const sess = { ...prev.activeSession };
      const poleDelta = Math.max(0, nextPoleVal - sess.currentPole);
      const distAddedMeters = Math.round(poleDelta * CALIBRATED_POLE_SPACING_METERS);
      const stepsAdded = Math.round(distAddedMeters / effectiveStepLength);

      sess.previousPole = sess.currentPole;
      sess.currentPole = nextPoleVal;
      sess.nextPole = Math.min(TOTAL_POLES, nextPoleVal + 1);
      sess.polesCompleted = Math.max(0, nextPoleVal - sess.startingPole);
      sess.polesRemaining = Math.max(0, TOTAL_POLES - nextPoleVal);

      if (poleDelta > 0) {
        sess.distanceWalkedMeters = (Number(sess.distanceWalkedMeters) || 0) + distAddedMeters;
        sess.estimatedDistanceMeters = sess.distanceWalkedMeters;
        if (sess.stepsAccuracyLabel !== 'MEASURED') {
          sess.totalSteps = (Number(sess.totalSteps) || 0) + stepsAdded;
          sess.stepsAccuracyLabel = 'ESTIMATED_FROM_ROUTE';
        }
      }

      sess.timelineEvents = [
        ...(sess.timelineEvents || []),
        {
          timestamp: nowIso,
          timeLabel: nowClock,
          eventType: 'POLE_REACHED',
          label: `Pole ${nextPoleVal}`,
          poleNumber: nextPoleVal,
          stepsAtEvent: sess.totalSteps
        }
      ];

      const samples = [...(sess.samples || [])];
      samples.push({
        timestamp: nowIso,
        elapsedWalkingSeconds: sess.activeWalkingSeconds || 1,
        cumulativeSteps: sess.totalSteps,
        deltaSteps: stepsAdded,
        cumulativeDistanceMeters: sess.distanceWalkedMeters,
        currentPole: sess.currentPole,
        stepsPerMinute: sess.activeWalkingSeconds > 0 ? Math.round((sess.totalSteps / sess.activeWalkingSeconds) * 60) : 100,
        speedKmh: sess.activeWalkingSeconds > 0 ? Number(((sess.distanceWalkedMeters / 1000) / (sess.activeWalkingSeconds / 3600)).toFixed(2)) : 4.5,
        sourceMode: sess.dataMode
      });
      sess.samples = samples.slice(-300);
      sess.milestonesAchieved = checkCalmMilestones(sess);

      return { ...prev, activeSession: sess };
    });

    if (onSelectPole) onSelectPole(nextPoleVal);
    speakCalmAnnouncement(`Checked in at Pole ${nextPoleVal}. ${Math.max(0, TOTAL_POLES - nextPoleVal)} poles remaining to Karbala.`);
  }, [effectiveStepLength, checkCalmMilestones, onSelectPole, speakCalmAnnouncement, updateWalkState]);

  // Request iOS/mobile DeviceMotion permission if user picks DEVICE_MEASURED
  const handleSelectDataMode = async (mode) => {
    setDataModeChoice(mode);
    if (mode === 'DEVICE_MEASURED' && typeof window !== 'undefined' && typeof window.DeviceMotionEvent?.requestPermission === 'function') {
      try {
        const perm = await window.DeviceMotionEvent.requestPermission();
        setDeviceMotionAuthorized(perm === 'granted');
      } catch (_) {
        setDeviceMotionAuthorized(false);
      }
    } else if (mode === 'DEVICE_MEASURED' && deviceMotionSupported) {
      setDeviceMotionAuthorized(true);
    }

    if (walkState.activeSession) {
      updateWalkState((prev) => {
        if (!prev.activeSession) return prev;
        return {
          ...prev,
          activeSession: {
            ...prev.activeSession,
            dataMode: mode,
            stepsAccuracyLabel: mode === 'DEVICE_MEASURED' && deviceMotionSupported ? 'MEASURED' : 'ESTIMATED_FROM_ROUTE',
            distanceAccuracyLabel: mode === 'GPS_TRACKED' ? 'GPS_MEASURED' : 'ESTIMATED_FROM_STEPS'
          }
        };
      });
    }
  };

  // START WALKING SESSION
  const handleStartWalk = async () => {
    const startPole = Math.max(1, Math.min(TOTAL_POLES, Math.round(Number(startingPoleInput) || 1)));
    const now = new Date();
    const nowIso = now.toISOString();
    const nowClock = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const sessionId = 'walk_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);

    const newSession = {
      sessionId,
      pilgrimId: walkState.pilgrimId,
      journeyId: 'journey_' + walkState.pilgrimId,
      routeKey: 'NAJAF_KARBALA_POLES',
      status: 'ACTIVE',
      dataMode: dataModeChoice,
      stepsAccuracyLabel: dataModeChoice === 'DEVICE_MEASURED' && deviceMotionSupported ? 'MEASURED' : 'ESTIMATED_FROM_ROUTE',
      distanceAccuracyLabel: dataModeChoice === 'GPS_TRACKED' ? 'GPS_MEASURED' : 'ESTIMATED_FROM_STEPS',
      sessionPeriodLabel: sessionPeriodTag,
      startedAt: nowIso,
      dateKey: nowIso.slice(0, 10),
      activeWalkingSeconds: 0,
      restSeconds: 0,
      totalJourneySeconds: 0,
      continuousWalkingSincePauseSec: 0,
      totalSteps: 0,
      deviceMeasuredSteps: 0,
      distanceWalkedMeters: 0,
      gpsDistanceMeters: 0,
      estimatedDistanceMeters: 0,
      startingPole: startPole,
      currentPole: startPole,
      previousPole: Math.max(1, startPole - 1),
      nextPole: Math.min(TOTAL_POLES, startPole + 1),
      polesCompleted: 0,
      polesRemaining: Math.max(0, TOTAL_POLES - startPole),
      stepLengthMeters: effectiveStepLength,
      stepLengthSource: walkState.profile?.stepLengthMode === 'CUSTOM' ? 'CUSTOM' : 'AUTO_ESTIMATE',
      batterySaver: Boolean(walkState.profile?.batterySaverDefault),
      audioAnnouncements: Boolean(walkState.profile?.audioAnnouncementsEnabled),
      privacyMode: walkState.profile?.privacyMode || 'PRIVATE',
      timelineEvents: [
        {
          timestamp: nowIso,
          timeLabel: nowClock,
          eventType: 'WALK_STARTED',
          label: 'Walk Started',
          poleNumber: startPole,
          stepsAtEvent: 0
        }
      ],
      samples: [],
      milestonesAchieved: []
    };

    updateWalkState((prev) => ({
      ...prev,
      journeyEnabled: true,
      activeSession: newSession
    }));

    if (onSelectPole) onSelectPole(startPole);
    speakCalmAnnouncement(`Walk started at Pole ${startPole}. Bismillah.`);

    await syncBackendApi('start', 'POST', {
      pilgrimId: walkState.pilgrimId,
      startingPole: startPole,
      dataMode: dataModeChoice,
      stepLengthMeters: effectiveStepLength,
      stepLengthSource: newSession.stepLengthSource,
      batterySaver: newSession.batterySaver,
      audioAnnouncements: newSession.audioAnnouncements
    });
  };

  // PAUSE WALKING SESSION
  const handlePauseWalk = async () => {
    const nowIso = new Date().toISOString();
    const nowClock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    updateWalkState((prev) => {
      if (!prev.activeSession) return prev;
      const sess = { ...prev.activeSession };
      sess.status = 'PAUSED';
      sess.pausedAt = nowIso;
      sess.timelineEvents = [
        ...(sess.timelineEvents || []),
        {
          timestamp: nowIso,
          timeLabel: nowClock,
          eventType: 'REST_STARTED',
          label: 'Rest',
          poleNumber: sess.currentPole,
          stepsAtEvent: sess.totalSteps
        }
      ];
      return { ...prev, activeSession: sess };
    });

    speakCalmAnnouncement('Walk paused for rest.');
    if (walkState.activeSession) {
      await syncBackendApi('pause', 'POST', {
        sessionId: walkState.activeSession.sessionId,
        activeWalkingSeconds: walkState.activeSession.activeWalkingSeconds,
        restSeconds: walkState.activeSession.restSeconds,
        totalSteps: walkState.activeSession.totalSteps,
        distanceWalkedMeters: walkState.activeSession.distanceWalkedMeters,
        currentPole: walkState.activeSession.currentPole
      });
    }
  };

  // RESUME WALKING SESSION
  const handleResumeWalk = async () => {
    const nowIso = new Date().toISOString();
    const nowClock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    lastTickTimeRef.current = Date.now();

    updateWalkState((prev) => {
      if (!prev.activeSession) return prev;
      const sess = { ...prev.activeSession };
      sess.status = 'ACTIVE';
      sess.pausedAt = null;
      sess.continuousWalkingSincePauseSec = 0;
      sess.timelineEvents = [
        ...(sess.timelineEvents || []),
        {
          timestamp: nowIso,
          timeLabel: nowClock,
          eventType: 'WALK_RESUMED',
          label: 'Walk Resumed',
          poleNumber: sess.currentPole,
          stepsAtEvent: sess.totalSteps
        }
      ];
      return { ...prev, activeSession: sess };
    });

    speakCalmAnnouncement('Walk resumed.');
    if (walkState.activeSession) {
      await syncBackendApi('resume', 'POST', {
        sessionId: walkState.activeSession.sessionId,
        restSeconds: walkState.activeSession.restSeconds,
        currentPole: walkState.activeSession.currentPole
      });
    }
  };

  // FINISH WALKING SESSION
  const handleFinishWalk = async () => {
    if (!walkState.activeSession) return;
    const nowIso = new Date().toISOString();
    const nowClock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const sess = { ...walkState.activeSession };

    const walkSec = Math.max(1, Number(sess.activeWalkingSeconds) || 1);
    const distKm = (Number(sess.distanceWalkedMeters) || 0) / 1000;
    const avgStepsPerMin = sess.totalSteps > 0 ? Math.round((sess.totalSteps / walkSec) * 60) : 0;
    const avgSpeedKmh = distKm > 0 ? Number((distKm / (walkSec / 3600)).toFixed(2)) : 0;
    const avgPaceSecPerKm = distKm > 0.01 ? Math.round(walkSec / distKm) : 0;

    const completedRecord = {
      ...sess,
      status: 'COMPLETED',
      endedAt: nowIso,
      endingPole: sess.currentPole,
      averageStepsPerMinute: avgStepsPerMin,
      averageSpeedKmh: avgSpeedKmh,
      averagePaceSecPerKm: avgPaceSecPerKm,
      timelineEvents: [
        ...(sess.timelineEvents || []),
        {
          timestamp: nowIso,
          timeLabel: nowClock,
          eventType: 'WALK_FINISHED',
          label: `Walk Finished at Pole ${sess.currentPole}`,
          poleNumber: sess.currentPole,
          stepsAtEvent: sess.totalSteps
        }
      ]
    };

    updateWalkState((prev) => ({
      ...prev,
      journeyEnabled: true,
      activeSession: null,
      sessionsHistory: [completedRecord, ...(prev.sessionsHistory || [])]
    }));

    setStartingPoleInput(sess.currentPole);
    speakCalmAnnouncement(`Walk session completed at Pole ${sess.currentPole}. Total steps: ${sess.totalSteps}.`);

    await syncBackendApi('finish', 'POST', {
      sessionId: sess.sessionId,
      pilgrimId: walkState.pilgrimId,
      activeWalkingSeconds: sess.activeWalkingSeconds,
      restSeconds: sess.restSeconds,
      totalSteps: sess.totalSteps,
      distanceWalkedMeters: sess.distanceWalkedMeters,
      currentPole: sess.currentPole
    });
  };

  // Computed live metrics for the active or most recent state
  const liveMetrics = useMemo(() => {
    const sess = walkState.activeSession;
    const currentPoleNum = sess ? sess.currentPole : Math.max(1, Math.min(TOTAL_POLES, Number(startingPoleInput) || 1));
    const prevPoleNum = Math.max(1, currentPoleNum - 1);
    const nextPoleNum = Math.min(TOTAL_POLES, currentPoleNum + 1);
    const polesCompleted = sess ? Math.max(0, currentPoleNum - sess.startingPole) : Math.max(0, currentPoleNum - 1);
    const polesRemaining = Math.max(0, TOTAL_POLES - currentPoleNum);
    const distanceWalkedMeters = sess ? Number(sess.distanceWalkedMeters) || 0 : 0;
    const distanceWalkedKm = Number((distanceWalkedMeters / 1000).toFixed(2));
    const distanceRemainingMeters = Math.round(polesRemaining * CALIBRATED_POLE_SPACING_METERS);
    const distanceRemainingKm = Number((distanceRemainingMeters / 1000).toFixed(2));

    const activeSec = sess ? Number(sess.activeWalkingSeconds) || 0 : 0;
    const restSec = sess ? Number(sess.restSeconds) || 0 : 0;
    const totalSec = activeSec + restSec;
    const totalSteps = sess ? Number(sess.totalSteps) || 0 : 0;

    // Speed & Pace calculations
    const avgSpeedKmh =
      activeSec >= 10 && distanceWalkedKm > 0.005
        ? Number(Math.min(9.5, distanceWalkedKm / (activeSec / 3600)).toFixed(1))
        : Number(walkState.profile?.preferredPaceKmh || 4.5);

    // Recent sample speed for Current Speed
    const recentSample = sess?.samples?.length ? sess.samples[sess.samples.length - 1] : null;
    const currentSpeedKmh = recentSample?.speedKmh
      ? Number(Math.min(9.5, Math.max(1.5, recentSample.speedKmh)).toFixed(1))
      : avgSpeedKmh;

    const avgPaceSecPerKm = avgSpeedKmh > 0 ? Math.round(3600 / avgSpeedKmh) : 800;
    const currentPaceSecPerKm = currentSpeedKmh > 0 ? Math.round(3600 / currentSpeedKmh) : avgPaceSecPerKm;

    const stepsPerMinute =
      activeSec >= 15 && totalSteps > 0
        ? Math.round(Math.min(165, (totalSteps / activeSec) * 60))
        : Math.round(((avgSpeedKmh * 1000) / 60) / effectiveStepLength);

    // Remaining time & steps to Karbala
    const estimatedStepsRemaining = Math.round(distanceRemainingMeters / effectiveStepLength);
    const walkingOnlyHoursRemaining = avgSpeedKmh > 0 ? distanceRemainingKm / avgSpeedKmh : 0;
    const walkingOnlySecondsRemaining = Math.round(walkingOnlyHoursRemaining * 3600);

    const breakMinsPerHr = Number(walkState.profile?.preferredBreakMinutesPerHour) || 12;
    const plannedBreakSeconds = Math.round(walkingOnlyHoursRemaining * breakMinsPerHr * 60);
    const totalRemainingWithBreaksSec = walkingOnlySecondsRemaining + plannedBreakSeconds;

    const estimatedArrivalDate = new Date(Date.now() + totalRemainingWithBreaksSec * 1000);
    const estimatedArrivalStr = estimatedArrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Single-pole interval (Pole N -> Pole N+1)
    const singlePoleDistMeters = Math.round(CALIBRATED_POLE_SPACING_METERS); // 50 metres
    const singlePoleSteps = Math.round(CALIBRATED_POLE_SPACING_METERS / effectiveStepLength);
    const speedMps = (avgSpeedKmh * 1000) / 3600;
    const singlePoleTimeSec = speedMps > 0 ? Math.round(CALIBRATED_POLE_SPACING_METERS / speedMps) : 40;

    // Corridor progress percentage (Pole 1 -> 1452)
    const routeProgressPct = Number((((currentPoleNum - 1) / (TOTAL_POLES - 1)) * 100).toFixed(1));

    // Gentle 90-minute rest recommendation check
    const continuousWalkSec = sess ? Number(sess.continuousWalkingSincePauseSec) || 0 : 0;
    const showGentleRestRecommendation = sess?.status === 'ACTIVE' && continuousWalkSec >= 90 * 60;

    return {
      currentPoleNum,
      prevPoleNum,
      nextPoleNum,
      polesCompleted,
      polesRemaining,
      distanceWalkedMeters,
      distanceWalkedKm,
      distanceRemainingMeters,
      distanceRemainingKm,
      activeSec,
      restSec,
      totalSec,
      totalSteps,
      avgSpeedKmh,
      currentSpeedKmh,
      avgPaceSecPerKm,
      currentPaceSecPerKm,
      stepsPerMinute,
      estimatedStepsRemaining,
      walkingOnlySecondsRemaining,
      totalRemainingWithBreaksSec,
      estimatedArrivalStr,
      singlePoleDistMeters,
      singlePoleSteps,
      singlePoleTimeSec,
      routeProgressPct,
      showGentleRestRecommendation
    };
  }, [walkState.activeSession, walkState.profile, startingPoleInput, effectiveStepLength]);

  // REAL RECORDED STEPS VS TIME ANALYTICS (10 Min, 30 Min, 1 Hour, 2 Hours, Today)
  // Strictly computed from recorded samples and sessions — never invented!
  const stepsVsTimeAnalytics = useMemo(() => {
    const sess = walkState.activeSession;
    const samples = sess?.samples || [];
    const activeSec = sess?.activeWalkingSeconds || 0;

    const getStepsForDurationWindow = (windowSec) => {
      if (!sess) {
        // Check if most recent finished session has enough walking time
        const latest = walkState.sessionsHistory?.[0];
        if (!latest || (latest.activeWalkingSeconds || 0) < windowSec * 0.25) return null;
        if ((latest.activeWalkingSeconds || 0) <= windowSec) return latest.totalSteps;
        const rate = latest.totalSteps / latest.activeWalkingSeconds;
        return Math.round(rate * windowSec);
      }
      if (activeSec <= 0 || sess.totalSteps <= 0) return null;
      // Find sample closest to windowSec in active session
      const targetSample = samples.find((smp) => smp.elapsedWalkingSeconds >= windowSec);
      if (targetSample) return targetSample.cumulativeSteps;
      if (activeSec >= windowSec * 0.5) {
        return Math.round((sess.totalSteps / activeSec) * Math.min(activeSec, windowSec));
      }
      return null;
    };

    const todayKey = new Date().toISOString().slice(0, 10);
    const todayCompletedSteps = (walkState.sessionsHistory || [])
      .filter((s) => (s.dateKey || (s.startedAt || '').slice(0, 10)) === todayKey)
      .reduce((acc, s) => acc + (Number(s.totalSteps) || 0), 0);
    const todayTotalSteps = todayCompletedSteps + (sess ? Number(sess.totalSteps) || 0 : 0);

    return [
      { label: '10 Minutes', windowSec: 600, steps: getStepsForDurationWindow(600) },
      { label: '30 Minutes', windowSec: 1800, steps: getStepsForDurationWindow(1800) },
      { label: '1 Hour', windowSec: 3600, steps: getStepsForDurationWindow(3600) },
      { label: '2 Hours', windowSec: 7200, steps: getStepsForDurationWindow(7200) },
      { label: 'Today', windowSec: null, steps: todayTotalSteps > 0 ? todayTotalSteps : null }
    ];
  }, [walkState.activeSession, walkState.sessionsHistory]);

  // DAILY STEP SUMMARY & MULTI-DAY JOURNEY TOTALS
  const journeyAndDailyAnalytics = useMemo(() => {
    const allSessions = [
      ...(walkState.activeSession ? [walkState.activeSession] : []),
      ...(walkState.sessionsHistory || [])
    ];

    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const yestDate = new Date(now.getTime() - 86400000);
    const yesterdayKey = yestDate.toISOString().slice(0, 10);
    const sevenDaysAgoMs = now.getTime() - 7 * 86400000;

    const filterSessions = (range) => {
      return allSessions.filter((s) => {
        const dKey = s.dateKey || (s.startedAt || '').slice(0, 10);
        if (range === 'today') return dKey === todayKey;
        if (range === 'yesterday') return dKey === yesterdayKey;
        if (range === '7days') return new Date(s.startedAt || now).getTime() >= sevenDaysAgoMs;
        return true; // 'journey'
      });
    };

    const aggregate = (list) => {
      const steps = list.reduce((sum, s) => sum + (Number(s.totalSteps) || 0), 0);
      const distMeters = list.reduce((sum, s) => sum + (Number(s.distanceWalkedMeters) || 0), 0);
      const walkSec = list.reduce((sum, s) => sum + (Number(s.activeWalkingSeconds) || 0), 0);
      const restSec = list.reduce((sum, s) => sum + (Number(s.restSeconds) || 0), 0);
      const poles = list.reduce((sum, s) => sum + (Number(s.polesCompleted) || 0), 0);
      const uniqueDays = new Set(list.map((s) => s.dateKey || (s.startedAt || '').slice(0, 10))).size;
      return {
        steps,
        distanceKm: Number((distMeters / 1000).toFixed(2)),
        walkSec,
        restSec,
        poles,
        daysWalking: uniqueDays,
        sessionCount: list.length
      };
    };

    // Group by Day for Day 1 vs Day 2 vs Day 3 comparison
    const byDateMap = new Map();
    allSessions.forEach((s) => {
      const dKey = s.dateKey || (s.startedAt || '').slice(0, 10) || todayKey;
      if (!byDateMap.has(dKey)) {
        byDateMap.set(dKey, { dateKey: dKey, steps: 0, distanceMeters: 0, walkSec: 0, poles: 0 });
      }
      const entry = byDateMap.get(dKey);
      entry.steps += Number(s.totalSteps) || 0;
      entry.distanceMeters += Number(s.distanceWalkedMeters) || 0;
      entry.walkSec += Number(s.activeWalkingSeconds) || 0;
      entry.poles += Number(s.polesCompleted) || 0;
    });

    const dailyBreakdown = Array.from(byDateMap.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));

    // Non-competitive Personal Bests
    let mostStepsOneDay = 0;
    let mostPolesOneDay = 0;
    dailyBreakdown.forEach((d) => {
      if (d.steps > mostStepsOneDay) mostStepsOneDay = d.steps;
      if (d.poles > mostPolesOneDay) mostPolesOneDay = d.poles;
    });

    let longestSessionSec = 0;
    let longestDistanceMeters = 0;
    let fastestAvgSpeedKmh = 0;
    allSessions.forEach((s) => {
      if ((s.activeWalkingSeconds || 0) > longestSessionSec) longestSessionSec = s.activeWalkingSeconds || 0;
      if ((s.distanceWalkedMeters || 0) > longestDistanceMeters) longestDistanceMeters = s.distanceWalkedMeters || 0;
      const spd = Number(s.averageSpeedKmh) || 0;
      if (spd > fastestAvgSpeedKmh) fastestAvgSpeedKmh = spd;
    });

    // Session Pace Comparison (Morning Walk vs Evening Walk, etc.)
    const periodMap = new Map();
    allSessions.forEach((s) => {
      const label = s.sessionPeriodLabel || 'Walk Session';
      const sec = Number(s.activeWalkingSeconds) || 0;
      const stp = Number(s.totalSteps) || 0;
      if (sec >= 10 && stp > 0) {
        const spm = Math.round((stp / sec) * 60);
        if (!periodMap.has(label)) periodMap.set(label, []);
        periodMap.get(label).push(spm);
      }
    });
    const sessionPaceComparisons = Array.from(periodMap.entries()).map(([label, arr]) => ({
      label,
      stepsPerMin: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)
    }));

    return {
      currentRangeSummary: aggregate(filterSessions(summaryRange)),
      totalJourney: aggregate(allSessions),
      dailyBreakdown,
      personalBests: {
        mostStepsOneDay,
        mostPolesOneDay,
        longestSessionSec,
        longestDistanceKm: Number((longestDistanceMeters / 1000).toFixed(2)),
        fastestAvgSpeedKmh: Number(fastestAvgSpeedKmh.toFixed(1))
      },
      sessionPaceComparisons
    };
  }, [walkState.activeSession, walkState.sessionsHistory, summaryRange]);

  // Standalone Walk Estimator Computation
  const estimatorResult = useMemo(() => {
    const startP = Math.max(1, Math.min(TOTAL_POLES, Number(estFromPole) || 1));
    const endP = Math.max(1, Math.min(TOTAL_POLES, Number(estToPole) || TOTAL_POLES));
    const polesCount = Math.abs(endP - startP);
    const distMeters = Math.round(polesCount * CALIBRATED_POLE_SPACING_METERS);
    const distKm = Number((distMeters / 1000).toFixed(2));
    const stepLen = Math.max(0.4, Math.min(1.2, Number(estStepLengthM) || effectiveStepLength));
    const paceKmh = Math.max(1.5, Math.min(8.0, Number(estPaceKmh) || 4.5));
    const estSteps = Math.round(distMeters / stepLen);
    const estSeconds = Math.round((distKm / paceKmh) * 3600);
    return {
      startP,
      endP,
      polesCount,
      distMeters,
      distKm,
      stepLen,
      paceKmh,
      estSteps,
      estSeconds
    };
  }, [estFromPole, estToPole, estPaceKmh, estStepLengthM, effectiveStepLength]);

  // Current pole facility details from existing smartPoleNavigationData.js
  const currentPoleDetails = useMemo(() => {
    return getPoleData(liveMetrics.currentPoleNum);
  }, [liveMetrics.currentPoleNum]);

  // Build SVG Graph Data Points from real recorded samples/sessions
  const graphPoints = useMemo(() => {
    let rawPoints = [];
    if (graphScope === 'session') {
      const samples = walkState.activeSession?.samples || walkState.sessionsHistory?.[0]?.samples || [];
      rawPoints = samples.map((s, idx) => ({
        label: formatDuration(s.elapsedWalkingSeconds || idx * 60),
        steps: s.cumulativeSteps || 0,
        distance: Number(((s.cumulativeDistanceMeters || 0) / 1000).toFixed(2)),
        pace: s.stepsPerMinute || 0
      }));
    } else if (graphScope === 'today') {
      const todayKey = new Date().toISOString().slice(0, 10);
      const todaySess = [
        ...(walkState.sessionsHistory || []).filter((s) => (s.dateKey || (s.startedAt || '').slice(0, 10)) === todayKey).reverse(),
        ...(walkState.activeSession ? [walkState.activeSession] : [])
      ];
      todaySess.forEach((s, idx) => {
        const sec = Math.max(1, s.activeWalkingSeconds || 1);
        rawPoints.push({
          label: s.startedAt ? new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : `#${idx + 1}`,
          steps: s.totalSteps || 0,
          distance: Number(((s.distanceWalkedMeters || 0) / 1000).toFixed(2)),
          pace: Math.round(((s.totalSteps || 0) / sec) * 60)
        });
      });
    } else {
      // 'journey' daily points
      rawPoints = journeyAndDailyAnalytics.dailyBreakdown.map((d, idx) => ({
        label: `Day ${idx + 1} (${d.dateKey.slice(5)})`,
        steps: d.steps,
        distance: Number((d.distanceMeters / 1000).toFixed(2)),
        pace: d.walkSec > 0 ? Math.round((d.steps / d.walkSec) * 60) : 0
      }));
    }
    return rawPoints;
  }, [graphScope, walkState.activeSession, walkState.sessionsHistory, journeyAndDailyAnalytics.dailyBreakdown]);

  const activeSession = walkState.activeSession;
  const isBatterySaver = Boolean(activeSession?.batterySaver || walkState.profile?.batterySaverDefault);

  // Voluntary Group Check-in Handler
  const handleVoluntaryGroupCheckIn = () => {
    const nowClock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const entry = {
      id: 'chk_' + Date.now(),
      nickname: walkState.profile?.groupNickname || 'Zair',
      groupCode: walkState.profile?.groupCode || 'ARBAEEN-GROUP',
      poleNumber: liveMetrics.currentPoleNum,
      status: activeSession ? (activeSession.status === 'ACTIVE' ? 'Walking' : 'Resting at Mawkib') : 'Checked In',
      checkedInAt: nowClock
    };
    updateWalkState((prev) => ({
      ...prev,
      groupCheckIns: [entry, ...(prev.groupCheckIns || []).slice(0, 9)]
    }));
  };

  return (
    <div className={`zaireen-walk-tracker ${isBatterySaver ? 'battery-saver-active' : ''}`}>
      {/* ================= TOP TRACKER HEADER & DATA MODE BAR ================= */}
      <div
        className="p-3 p-md-4 rounded-4 mb-4 border shadow-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 22, 32, 0.97) 0%, rgba(9, 13, 19, 0.99) 100%)',
          borderColor: 'rgba(198, 166, 107, 0.42)'
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span
                className="badge rounded-pill px-3 py-1.5 fw-bold"
                style={{
                  background: 'rgba(198, 166, 107, 0.18)',
                  color: '#dfc08a',
                  border: '1px solid rgba(198, 166, 107, 0.45)'
                }}
              >
                <i className="bi bi-person-walking me-1"></i> ZAIREEN WALK TRACKER & STEP INTELLIGENCE
              </span>

              {/* Active Data Mode Badge */}
              <span className="badge rounded-pill px-2.5 py-1 bg-dark border border-secondary text-light">
                <i className="bi bi-cpu me-1 text-warning"></i>
                Mode:{' '}
                <strong>
                  {(activeSession?.dataMode || dataModeChoice) === 'DEVICE_MEASURED'
                    ? 'MODE 1: DEVICE MEASURED'
                    : (activeSession?.dataMode || dataModeChoice) === 'GPS_TRACKED'
                    ? 'MODE 2: GPS TRACKED'
                    : 'MODE 3: ESTIMATED (ROUTE + STEP LENGTH)'}
                </strong>
              </span>

              {/* Privacy Default Badge */}
              <span className="badge rounded-pill px-2.5 py-1 bg-dark border border-secondary text-info">
                <i className="bi bi-shield-lock-fill me-1"></i>
                Privacy: {walkState.profile?.privacyMode || 'PRIVATE'}
              </span>

              {isBatterySaver && (
                <span className="badge rounded-pill px-2.5 py-1 bg-success-subtle text-success border border-success">
                  <i className="bi bi-battery-charging me-1"></i> Battery Saver Active
                </span>
              )}
            </div>

            <h2 className="h4 font-display text-white mb-1">
              Live Arbaeen Pilgrimage Walk & 1,452-Pole Step Telemetry
            </h2>
            <p className="text-secondary small mb-0">
              Synchronized directly with the Najaf → Karbala 1,452-pole GIS corridor ({CALIBRATED_POLE_SPACING_METERS}m calibrated spacing). Offline-resilient local storage with automatic cloud sync.
            </p>
          </div>

          {/* Primary Session Controls (Start / Pause / Resume / Finish) */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            {!activeSession ? (
              <div className="d-flex flex-wrap align-items-center gap-2">
                <div className="input-group input-group-sm" style={{ width: '165px' }}>
                  <span className="input-group-text bg-dark text-secondary border-secondary">Start Pole</span>
                  <input
                    type="number"
                    min="1"
                    max="1452"
                    className="form-control bg-dark text-white border-secondary fw-bold"
                    value={startingPoleInput}
                    onChange={(e) => setStartingPoleInput(e.target.value)}
                  />
                </div>
                <select
                  className="form-select form-select-sm bg-dark text-light border-secondary"
                  style={{ width: '145px' }}
                  value={sessionPeriodTag}
                  onChange={(e) => setSessionPeriodTag(e.target.value)}
                >
                  <option value="Morning Walk">Morning Walk</option>
                  <option value="Afternoon Walk">Afternoon Walk</option>
                  <option value="Evening Walk">Evening Walk</option>
                  <option value="Night Walk">Night Walk</option>
                </select>
                <button
                  type="button"
                  className="btn rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 shadow"
                  style={{
                    background: 'linear-gradient(135deg, #dfc08a, #c6a66b)',
                    color: '#0a0d12',
                    border: 'none'
                  }}
                  onClick={handleStartWalk}
                >
                  <i className="bi bi-play-circle-fill fs-5"></i>
                  <span>Start Walking</span>
                </button>
              </div>
            ) : (
              <div className="d-flex flex-wrap align-items-center gap-2">
                {activeSession.status === 'ACTIVE' ? (
                  <button
                    type="button"
                    className="btn btn-warning text-dark rounded-pill px-3.5 py-2 fw-bold d-inline-flex align-items-center gap-1.5"
                    onClick={handlePauseWalk}
                  >
                    <i className="bi bi-pause-circle-fill"></i>
                    <span>Pause (Rest)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success rounded-pill px-3.5 py-2 fw-bold d-inline-flex align-items-center gap-1.5"
                    onClick={handleResumeWalk}
                  >
                    <i className="bi bi-play-circle-fill"></i>
                    <span>Resume Walk</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                  onClick={handleFinishWalk}
                >
                  <i className="bi bi-check2-circle text-warning"></i>
                  <span>Finish Walk</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sub-navigation pills inside Zaireen Walk Tracker */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="nav nav-pills gap-2 flex-nowrap overflow-x-auto pb-1">
            {[
              { id: 'dashboard', icon: 'bi-speedometer2', label: 'Live Walk Dashboard' },
              { id: 'analytics', icon: 'bi-graph-up-arrow', label: 'Steps vs Time & Graphs' },
              { id: 'estimator', icon: 'bi-Signpost-split', label: 'Steps to Karbala & Estimator' },
              { id: 'history', icon: 'bi-clock-history', label: 'My Walk History & Journey Totals' },
              { id: 'settings', icon: 'bi-sliders', label: 'Step Length, Modes & Privacy' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold text-nowrap d-inline-flex align-items-center gap-1.5`}
                style={{
                  background: subView === tab.id ? 'rgba(198, 166, 107, 0.22)' : 'rgba(255,255,255,0.04)',
                  color: subView === tab.id ? '#dfc08a' : '#cbd5e1',
                  border: '1px solid ' + (subView === tab.id ? 'rgba(198, 166, 107, 0.55)' : 'rgba(255,255,255,0.09)')
                }}
                onClick={() => setSubView(tab.id)}
              >
                <i className={`bi ${tab.icon}`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Battery Saver & Audio Toggles */}
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2.5 py-1 ${isBatterySaver ? 'btn-success' : 'btn-outline-secondary text-light'}`}
              onClick={() => {
                updateWalkState((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, batterySaverDefault: !isBatterySaver },
                  activeSession: prev.activeSession
                    ? { ...prev.activeSession, batterySaver: !isBatterySaver }
                    : null
                }));
              }}
              title="Reduce GPS polling & animations to conserve battery on long Arbaeen walks"
            >
              <i className="bi bi-battery-half me-1"></i>
              Battery Saver {isBatterySaver ? 'ON' : 'OFF'}
            </button>

            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2.5 py-1 ${walkState.profile?.audioAnnouncementsEnabled ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'}`}
              onClick={() => {
                const nextVal = !walkState.profile?.audioAnnouncementsEnabled;
                updateWalkState((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, audioAnnouncementsEnabled: nextVal }
                }));
              }}
              title="Optional calm voice announcements at pole milestones"
            >
              <i className={`bi ${walkState.profile?.audioAnnouncementsEnabled ? 'bi-volume-up-fill' : 'bi-volume-mute'} me-1`}></i>
              Voice {walkState.profile?.audioAnnouncementsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Gentle 90-minute Rest Recommendation Alert (non-medical, calm) */}
      {liveMetrics.showGentleRestRecommendation && (
        <div
          className="alert d-flex align-items-center justify-content-between gap-3 rounded-4 mb-4 border"
          style={{
            background: 'rgba(198, 166, 107, 0.14)',
            borderColor: 'rgba(198, 166, 107, 0.45)',
            color: '#f8fafc'
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cup-hot-fill fs-4 text-warning"></i>
            <div>
              <strong>You've been walking for 90 minutes. Consider resting when convenient.</strong>
              <div className="small text-secondary">
                Pause your walk timer whenever you stop at a Mawkib so rest time is tracked separately from active walking time.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-warning text-dark rounded-pill px-3 fw-bold text-nowrap"
            onClick={handlePauseWalk}
          >
            Pause for Rest
          </button>
        </div>
      )}

      {/* ================= SUBVIEW 1: LIVE WALK DASHBOARD ================= */}
      {subView === 'dashboard' && (
        <div>
          {/* NAJAF -> KARBALA PREMIUM WALK PROGRESS BAR */}
          <div
            className="p-3 p-md-4 rounded-4 mb-4 border shadow"
            style={{
              background: 'rgba(13, 18, 26, 0.95)',
              borderColor: 'rgba(198, 166, 107, 0.32)'
            }}
          >
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-warning font-display" style={{ letterSpacing: '0.08em' }}>
                  NAJAF (POLE 1)
                </span>
                <span className="text-secondary small">→ Tareeq Ya Hussain Corridor →</span>
              </div>
              <div className="text-center">
                <span className="badge bg-dark border border-warning text-warning px-3 py-1 rounded-pill fw-bold">
                  Pole {liveMetrics.currentPoleNum} / {TOTAL_POLES} • Progress: {liveMetrics.routeProgressPct}%
                </span>
              </div>
              <div className="fw-bold text-warning font-display" style={{ letterSpacing: '0.08em' }}>
                KARBALA (POLE 1,452)
              </div>
            </div>

            {/* Visual ASCII + Luxury Progress Bar */}
            <div
              className="progress rounded-pill my-2"
              style={{ height: '16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(198,166,107,0.3)' }}
            >
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${Math.max(2, liveMetrics.routeProgressPct)}%`,
                  background: 'linear-gradient(90deg, #9f7a3c 0%, #dfc08a 55%, #10b981 100%)'
                }}
              />
            </div>

            <div className="row g-2 mt-2 pt-2 border-top text-center" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="col-6 col-md-2">
                <div className="text-secondary" style={{ fontSize: '0.72rem' }}>DISTANCE COMPLETED</div>
                <div className="fw-bold text-white">{liveMetrics.distanceWalkedKm} km</div>
              </div>
              <div className="col-6 col-md-2">
                <div className="text-secondary" style={{ fontSize: '0.72rem' }}>DISTANCE REMAINING</div>
                <div className="fw-bold text-warning">{liveMetrics.distanceRemainingKm} km</div>
              </div>
              <div className="col-6 col-md-2">
                <div className="text-secondary" style={{ fontSize: '0.72rem' }}>STEPS COMPLETED</div>
                <div className="fw-bold text-white">{liveMetrics.totalSteps.toLocaleString()}</div>
              </div>
              <div className="col-6 col-md-2">
                <div className="text-secondary" style={{ fontSize: '0.72rem' }}>POLES COMPLETED</div>
                <div className="fw-bold text-white">{liveMetrics.polesCompleted.toLocaleString()}</div>
              </div>
              <div className="col-6 col-md-2">
                <div className="text-secondary" style={{ fontSize: '0.72rem' }}>ACTIVE / REST TIME</div>
                <div className="fw-bold text-white">
                  {formatDuration(liveMetrics.activeSec)} <span className="text-secondary">/ {formatDuration(liveMetrics.restSec)}</span>
                </div>
              </div>
              <div className="col-6 col-md-2">
                <div className="text-secondary" style={{ fontSize: '0.72rem' }}>ESTIMATED ARRIVAL</div>
                <div className="fw-bold text-info" title="Calculated from your average pace and planned rest intervals">
                  ~{liveMetrics.estimatedArrivalStr} <small className="text-secondary">(Est.)</small>
                </div>
              </div>
            </div>
          </div>

          {/* PRIMARY GLANCEABLE METRIC CARDS (Big Numbers + Measured vs Estimated Accuracy Labels) */}
          <div className="row g-3 mb-4">
            {/* 1. Total Steps Card */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3.5 rounded-4 h-100 border" style={{ background: 'rgba(15, 21, 30, 0.92)', borderColor: 'rgba(198,166,107,0.3)' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-secondary small fw-semibold text-uppercase">Total Steps</span>
                  <span className={`badge rounded-pill ${activeSession?.stepsAccuracyLabel === 'MEASURED' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-light'}`} style={{ fontSize: '0.68rem' }}>
                    {activeSession?.stepsAccuracyLabel === 'MEASURED' ? 'Measured (Device)' : 'Estimated from step length'}
                  </span>
                </div>
                <div className="display-6 fw-bold font-display text-white my-1">
                  {liveMetrics.totalSteps.toLocaleString()} <span className="fs-6 text-warning fw-normal">Steps</span>
                </div>
                <div className="small text-secondary">
                  Step Pace: <strong className="text-light">{liveMetrics.stepsPerMinute} steps/min</strong> • Step Len: <strong className="text-light">{effectiveStepLength}m</strong>
                </div>
              </div>
            </div>

            {/* 2. Active Walking vs Rest Time Card */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3.5 rounded-4 h-100 border" style={{ background: 'rgba(15, 21, 30, 0.92)', borderColor: 'rgba(198,166,107,0.3)' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-secondary small fw-semibold text-uppercase">Walking Time</span>
                  <span className="badge rounded-pill bg-success-subtle text-success" style={{ fontSize: '0.68rem' }}>
                    Measured Timer
                  </span>
                </div>
                <div className="display-6 fw-bold font-display text-white my-1">
                  {formatDuration(liveMetrics.activeSec, true)}
                </div>
                <div className="small text-secondary d-flex justify-content-between">
                  <span>Rest: <strong className="text-warning">{formatDuration(liveMetrics.restSec)}</strong></span>
                  <span>Total: <strong className="text-light">{formatDuration(liveMetrics.totalSec)}</strong></span>
                </div>
              </div>
            </div>

            {/* 3. Distance Walked & Speed Card */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3.5 rounded-4 h-100 border" style={{ background: 'rgba(15, 21, 30, 0.92)', borderColor: 'rgba(198,166,107,0.3)' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-secondary small fw-semibold text-uppercase">Distance Walked</span>
                  <span className={`badge rounded-pill ${activeSession?.distanceAccuracyLabel === 'GPS_MEASURED' ? 'bg-info-subtle text-info' : 'bg-secondary-subtle text-light'}`} style={{ fontSize: '0.68rem' }}>
                    {activeSession?.distanceAccuracyLabel === 'GPS_MEASURED' ? 'GPS Measured' : 'Estimated Distance'}
                  </span>
                </div>
                <div className="display-6 fw-bold font-display text-white my-1">
                  {liveMetrics.distanceWalkedKm} <span className="fs-6 text-warning fw-normal">km Completed</span>
                </div>
                <div className="small text-secondary">
                  Avg Speed: <strong className="text-light">{liveMetrics.avgSpeedKmh} km/h</strong> ({formatPacePerKm(liveMetrics.avgPaceSecPerKm)})
                </div>
              </div>
            </div>

            {/* 4. Current Pole & Remaining Poles Card */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3.5 rounded-4 h-100 border" style={{ background: 'rgba(15, 21, 30, 0.92)', borderColor: 'rgba(198,166,107,0.3)' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-secondary small fw-semibold text-uppercase">Arbaeen Pole Position</span>
                  <span className="badge rounded-pill bg-warning-subtle text-warning" style={{ fontSize: '0.68rem' }}>
                    Next Pole: {liveMetrics.nextPoleNum}
                  </span>
                </div>
                <div className="display-6 fw-bold font-display text-warning my-1">
                  Pole {liveMetrics.currentPoleNum}
                </div>
                <div className="small text-secondary">
                  <strong className="text-light">{liveMetrics.polesRemaining.toLocaleString()} Poles Remaining</strong> • Prev: #{liveMetrics.prevPoleNum}
                </div>
              </div>
            </div>
          </div>

          {/* LIVE FIELD CONTROLS (Pole Check-in & Step Logging + Single Pole Interval Card) */}
          <div className="row g-3 mb-4">
            {/* Walk Between Two Poles Card (Pole N -> Pole N+1) */}
            <div className="col-12 col-lg-5">
              <div className="p-3.5 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.28)' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h3 className="h6 font-display text-warning mb-0">
                    <i className="bi bi-signpost-2-fill me-1.5"></i>
                    WALK BETWEEN TWO POLES: Pole {liveMetrics.currentPoleNum} → Pole {liveMetrics.nextPoleNum}
                  </h3>
                  <span className="badge bg-dark border border-secondary text-secondary small">Live Interval</span>
                </div>
                <div className="row g-2 text-center mt-2">
                  <div className="col-3">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Approx Distance</div>
                      <div className="fw-bold text-white">{liveMetrics.singlePoleDistMeters} metres</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Your Avg Pace</div>
                      <div className="fw-bold text-warning">{liveMetrics.avgSpeedKmh} km/h</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Estimated Time</div>
                      <div className="fw-bold text-info">{liveMetrics.singlePoleTimeSec} seconds</div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Estimated Steps</div>
                      <div className="fw-bold text-success">{liveMetrics.singlePoleSteps} steps</div>
                    </div>
                  </div>
                </div>
                <div className="small text-secondary mt-2">
                  Calculated dynamically from calibrated pole spacing ({CALIBRATED_POLE_SPACING_METERS}m), your step length ({effectiveStepLength}m), and your walking speed ({liveMetrics.avgSpeedKmh} km/h).
                </div>
              </div>
            </div>

            {/* Interactive Field Check-In & Step Recording Controls */}
            <div className="col-12 col-lg-7">
              <div className="p-3.5 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.28)' }}>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                  <h3 className="h6 font-display text-white mb-0">
                    <i className="bi bi-compass me-1.5 text-warning"></i>
                    Live Route Check-In & Step Controls
                  </h3>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning rounded-pill px-3 py-1"
                    onClick={() => onJumpToMapPole && onJumpToMapPole(liveMetrics.currentPoleNum)}
                  >
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    Show "YOU ARE HERE" (Pole #{liveMetrics.currentPoleNum}) on Map
                  </button>
                </div>

                {activeSession ? (
                  <div className="row g-2 align-items-center mt-1">
                    <div className="col-12 col-md-6">
                      <div className="d-flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          className="btn btn-sm btn-warning text-dark fw-bold rounded-pill px-3"
                          onClick={() => handleCheckInPole(liveMetrics.currentPoleNum + 1)}
                        >
                          +1 Pole (#{Math.min(TOTAL_POLES, liveMetrics.currentPoleNum + 1)})
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning rounded-pill px-2.5"
                          onClick={() => handleCheckInPole(liveMetrics.currentPoleNum + 5)}
                        >
                          +5 Poles
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning rounded-pill px-2.5"
                          onClick={() => handleCheckInPole(liveMetrics.currentPoleNum + 10)}
                        >
                          +10 Poles
                        </button>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="d-flex align-items-center gap-1.5">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light rounded-pill px-2.5"
                          onClick={() => recordStepIncrement(manualStepAdd, 'ESTIMATED_FROM_ROUTE')}
                        >
                          +{manualStepAdd} Steps
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light rounded-pill px-2.5"
                          onClick={() => recordStepIncrement(500, 'ESTIMATED_FROM_ROUTE')}
                        >
                          +500 Steps
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light rounded-pill px-2.5"
                          onClick={() => recordStepIncrement(1000, 'ESTIMATED_FROM_ROUTE')}
                        >
                          +1,000 Steps
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-secondary small py-2">
                    Click <strong>"Start Walking"</strong> above to begin live step counting, pole progression, active/rest timers, and real-time session timeline logging.
                  </div>
                )}

                {/* Nearby Facilities at Current Pole (Reusing existing smartPoleNavigationData dataset) */}
                {currentPoleDetails && (
                  <div className="mt-3 pt-2 border-top d-flex flex-wrap align-items-center justify-content-between gap-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="small">
                      <span className="text-secondary me-2">Nearby at Pole #{currentPoleDetails.poleNumber} ({currentPoleDetails.sector}):</span>
                      <span className="badge bg-dark border border-secondary text-light me-1">
                        <i className="bi bi-house-heart-fill text-warning me-1"></i>{currentPoleDetails.nearestMawkib}
                      </span>
                      <span className="badge bg-dark border border-secondary text-info me-1">
                        <i className="bi bi-hospital-fill me-1"></i>{currentPoleDetails.nearestMedical}
                      </span>
                      <span className="badge bg-dark border border-secondary text-success me-1">
                        <i className="bi bi-droplet-fill me-1"></i>Water & Rest
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SESSION TIMELINE & CALM MILESTONES + WALK GOALS */}
          <div className="row g-3">
            {/* Session Timeline (Generated strictly from user's actual tracked session) */}
            <div className="col-12 col-lg-6">
              <div className="p-3.5 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.25)' }}>
                <h3 className="h6 font-display text-warning mb-3">
                  <i className="bi bi-journal-check me-1.5"></i>
                  SESSION TIMELINE (REAL RECORDED EVENTS)
                </h3>
                {activeSession?.timelineEvents?.length ? (
                  <div className="d-flex flex-column gap-2" style={{ maxHeight: '230px', overflowY: 'auto' }}>
                    {activeSession.timelineEvents.map((ev, idx) => (
                      <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                        <div className="d-flex align-items-center gap-2.5">
                          <span className="badge bg-warning text-dark fw-bold font-monospace">{ev.timeLabel}</span>
                          <span className="fw-semibold text-white">{ev.label}</span>
                        </div>
                        <span className="text-secondary small">
                          Pole #{ev.poleNumber} • {(ev.stepsAtEvent || 0).toLocaleString()} steps
                        </span>
                      </div>
                    ))}
                  </div>
                ) : walkState.sessionsHistory?.[0]?.timelineEvents?.length ? (
                  <div className="d-flex flex-column gap-2" style={{ maxHeight: '230px', overflowY: 'auto' }}>
                    <div className="small text-secondary mb-1">Most Recent Completed Session Timeline:</div>
                    {walkState.sessionsHistory[0].timelineEvents.map((ev, idx) => (
                      <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                        <div className="d-flex align-items-center gap-2.5">
                          <span className="badge bg-secondary text-light font-monospace">{ev.timeLabel}</span>
                          <span className="fw-semibold text-white">{ev.label}</span>
                        </div>
                        <span className="text-secondary small">Pole #{ev.poleNumber}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-secondary small py-3">
                    No walk session events recorded yet. Start a walk session to log real timestamps for Walk Started, Pole Check-ins, Rest pauses, and Resumes.
                  </div>
                )}
              </div>
            </div>

            {/* Personal Walk Goals & Calm Milestones (No competitive leaderboard) */}
            <div className="col-12 col-lg-6">
              <div className="p-3.5 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.25)' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3 className="h6 font-display text-warning mb-0">
                    <i className="bi bi-flag-fill me-1.5"></i>
                    PERSONAL WALK GOALS & CALM MILESTONES
                  </h3>
                  <span className="badge bg-dark border border-secondary text-secondary small">Non-Competitive</span>
                </div>

                {/* Today's Step Target Progress */}
                {(() => {
                  const targetSteps = Number(walkState.profile?.dailyTargetSteps) || 15000;
                  const targetPole = Number(walkState.profile?.dailyTargetPole) || 600;
                  const todaySteps = journeyAndDailyAnalytics.currentRangeSummary.steps;
                  const stepPct = Math.min(100, Math.round((todaySteps / targetSteps) * 100));
                  const polePct = Math.min(100, Math.round((liveMetrics.currentPoleNum / targetPole) * 100));
                  return (
                    <div>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-light">Today's Step Target: <strong>{targetSteps.toLocaleString()} steps</strong></span>
                          <span className="text-warning fw-bold">{todaySteps.toLocaleString()} ({stepPct}%)</span>
                        </div>
                        <div className="progress rounded-pill" style={{ height: '8px', background: 'rgba(255,255,255,0.08)' }}>
                          <div className="progress-bar bg-warning" style={{ width: `${stepPct}%` }} />
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-light">Target Pole Goal: <strong>Reach Pole {targetPole}</strong></span>
                          <span className="text-info fw-bold">Pole {liveMetrics.currentPoleNum} ({polePct}%)</span>
                        </div>
                        <div className="progress rounded-pill" style={{ height: '8px', background: 'rgba(255,255,255,0.08)' }}>
                          <div className="progress-bar bg-info" style={{ width: `${polePct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Calm Milestones Achieved */}
                <div className="mt-2 pt-2 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="small text-secondary mb-1.5">Milestones Reached:</div>
                  {(activeSession?.milestonesAchieved?.length || 0) > 0 ? (
                    <div className="d-flex flex-column gap-1.5">
                      {activeSession.milestonesAchieved.map((m, i) => (
                        <div key={i} className="small p-2 rounded-3 bg-dark border border-warning border-opacity-25 text-light">
                          <i className="bi bi-check-circle-fill text-warning me-1.5"></i>
                          {m.label} <span className="text-secondary ms-1">({m.achievedAt})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="small text-secondary">
                      Calm milestones (5,000 steps • 10,000 steps • 20,000 steps • 25 km • 500 Poles) will appear quietly as you walk.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBVIEW 2: STEPS VS TIME ANALYTICS & WALKING GRAPHS ================= */}
      {subView === 'analytics' && (
        <div>
          <div className="row g-3 mb-4">
            {/* Steps vs Time Breakdown Card */}
            <div className="col-12 col-lg-6">
              <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.3)' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h3 className="h5 font-display text-white mb-0">
                    <i className="bi bi-stopwatch-fill text-warning me-2"></i>
                    Steps vs Time Analytics
                  </h3>
                  <span className="badge bg-dark border border-secondary text-secondary">Recorded Data Only</span>
                </div>
                <p className="text-secondary small mb-3">
                  How many steps did I walk, and how long did it take me? Derived strictly from your recorded walking sessions.
                </p>

                <div className="d-flex flex-column gap-2">
                  {stepsVsTimeAnalytics.map((row, idx) => (
                    <div
                      key={idx}
                      className="d-flex align-items-center justify-content-between p-2.5 px-3 rounded-3 bg-dark border border-secondary border-opacity-25"
                    >
                      <span className="fw-semibold text-light">{row.label}</span>
                      {row.steps !== null ? (
                        <span className="fw-bold text-warning fs-6">
                          → {row.steps.toLocaleString()} Steps
                        </span>
                      ) : (
                        <span className="text-secondary small">
                          Not yet recorded for this duration
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Walking Speed & Step Pace Comparison Card */}
            <div className="col-12 col-lg-6">
              <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.3)' }}>
                <h3 className="h5 font-display text-white mb-3">
                  <i className="bi bi-speedometer text-warning me-2"></i>
                  Walking Speed & Step Pace Intelligence
                </h3>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary small">Current Speed</div>
                      <div className="h4 fw-bold text-white mb-0">{liveMetrics.currentSpeedKmh} km/h</div>
                      <div className="small text-secondary">{formatPacePerKm(liveMetrics.currentPaceSecPerKm)}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary small">Average Speed</div>
                      <div className="h4 fw-bold text-warning mb-0">{liveMetrics.avgSpeedKmh} km/h</div>
                      <div className="small text-secondary">{formatPacePerKm(liveMetrics.avgPaceSecPerKm)}</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25 mb-3 d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-secondary small">Current Cadence (Steps Per Minute)</div>
                    <div className="h4 fw-bold text-info mb-0">{liveMetrics.stepsPerMinute} steps/min</div>
                  </div>
                  <span className="badge bg-dark border border-info text-info">Step Pace</span>
                </div>

                {/* Session Comparison (e.g., Morning Walk vs Evening Walk) */}
                <div className="small text-secondary fw-semibold mb-2">SESSION PACE COMPARISON:</div>
                {journeyAndDailyAnalytics.sessionPaceComparisons.length > 0 ? (
                  <div className="d-flex flex-column gap-1.5">
                    {journeyAndDailyAnalytics.sessionPaceComparisons.map((c, i) => (
                      <div key={i} className="d-flex justify-content-between p-2 rounded-3 bg-dark border border-secondary border-opacity-25 small">
                        <span className="text-light">{c.label}</span>
                        <strong className="text-warning">{c.stepsPerMin} steps/min</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="small text-secondary">
                    Complete walks tagged as Morning Walk, Afternoon Walk, Evening Walk, or Night Walk to compare your step cadence across times of day.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LIGHTWEIGHT SVG WALKING ANALYTICS GRAPH */}
          <div className="p-4 rounded-4 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.3)' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <div>
                <h3 className="h5 font-display text-white mb-0">
                  <i className="bi bi-bar-chart-line-fill text-warning me-2"></i>
                  Walking Telemetry Graph
                </h3>
                <p className="text-secondary small mb-0">
                  Lightweight mobile-first vector chart generated from your recorded checkpoints.
                </p>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <div className="btn-group btn-group-sm">
                  {[
                    { id: 'steps', label: 'Steps by Time' },
                    { id: 'distance', label: 'Distance by Time (km)' },
                    { id: 'pace', label: 'Pace by Time (steps/min)' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`btn ${graphMetric === m.id ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
                      onClick={() => setGraphMetric(m.id)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="btn-group btn-group-sm">
                  {[
                    { id: 'session', label: 'Hourly / Session' },
                    { id: 'today', label: 'Today' },
                    { id: 'journey', label: 'Journey' }
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      className={`btn ${graphScope === sc.id ? 'btn-info text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
                      onClick={() => setGraphScope(sc.id)}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {graphPoints.length > 0 ? (
              <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                {(() => {
                  const values = graphPoints.map((p) => Number(p[graphMetric]) || 0);
                  const maxVal = Math.max(1, ...values);
                  const svgW = 720;
                  const svgH = 200;
                  const padX = 45;
                  const padY = 24;
                  const plotW = svgW - padX * 2;
                  const plotH = svgH - padY * 2;

                  const coords = graphPoints.map((pt, i) => {
                    const x = padX + (graphPoints.length === 1 ? plotW / 2 : (i / (graphPoints.length - 1)) * plotW);
                    const val = Number(pt[graphMetric]) || 0;
                    const y = padY + plotH - (val / maxVal) * plotH;
                    return { x, y, val, label: pt.label };
                  });

                  const polylineStr = coords.map((c) => `${c.x},${c.y}`).join(' ');

                  return (
                    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-100" style={{ maxHeight: '220px' }}>
                      <line x1={padX} y1={padY + plotH} x2={svgW - padX} y2={padY + plotH} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                      <line x1={padX} y1={padY} x2={padX} y2={padY + plotH} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                      {coords.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#dfc08a"
                          strokeWidth="3"
                          points={polylineStr}
                        />
                      )}
                      {coords.map((c, idx) => (
                        <g key={idx}>
                          <circle cx={c.x} cy={c.y} r="5" fill="#10b981" stroke="#0a0d12" strokeWidth="1.5" />
                          <text x={c.x} y={Math.max(14, c.y - 8)} fill="#f8fafc" fontSize="10" textAnchor="middle">
                            {c.val.toLocaleString()}
                          </text>
                          <text x={c.x} y={svgH - 5} fill="#94a3b8" fontSize="9.5" textAnchor="middle">
                            {c.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  );
                })()}
              </div>
            ) : (
              <div className="p-4 text-center text-secondary small bg-dark rounded-3 border border-secondary border-opacity-25">
                Start walking or log pole/step checkpoints to render real-time telemetry curves.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SUBVIEW 3: HOW MANY STEPS / HOW LONG UNTIL KARBALA & WALK ESTIMATOR ================= */}
      {subView === 'estimator' && (
        <div>
          <div className="row g-3 mb-4">
            {/* "How Many Steps to Karbala?" Card */}
            <div className="col-12 col-lg-6">
              <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.35)' }}>
                <span className="badge bg-warning text-dark fw-bold rounded-pill mb-2">STEP INTELLIGENCE</span>
                <h3 className="h5 font-display text-white mb-3">
                  How Many Steps to Karbala?
                </h3>

                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <div className="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary small">Current Pole</div>
                      <div className="h5 fw-bold text-warning mb-0">Pole {liveMetrics.currentPoleNum}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary small">Distance Left</div>
                      <div className="h5 fw-bold text-white mb-0">{liveMetrics.distanceRemainingKm} km</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary small">Est. Steps Left</div>
                      <div className="h5 fw-bold text-success mb-0">~{liveMetrics.estimatedStepsRemaining.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="small text-secondary p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                  <strong>Calculation Basis:</strong> Remaining {liveMetrics.polesRemaining.toLocaleString()} pole intervals × {CALIBRATED_POLE_SPACING_METERS}m = {liveMetrics.distanceRemainingMeters.toLocaleString()}m divided by your personal step length ({effectiveStepLength}m).
                </div>
              </div>
            </div>

            {/* "How Long Until Karbala?" Card */}
            <div className="col-12 col-lg-6">
              <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.35)' }}>
                <span className="badge bg-info text-dark fw-bold rounded-pill mb-2">TIME INTELLIGENCE</span>
                <h3 className="h5 font-display text-white mb-3">
                  How Long Until Karbala?
                </h3>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary small">Walking Time Remaining (Continuous)</div>
                      <div className="h4 fw-bold text-white mb-0">
                        ~{formatDuration(liveMetrics.walkingOnlySecondsRemaining)}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2.5 rounded-3 bg-dark border border-warning border-opacity-25">
                      <div className="text-secondary small">With Planned Mawkib Breaks</div>
                      <div className="h4 fw-bold text-warning mb-0">
                        ~{formatDuration(liveMetrics.totalRemainingWithBreaksSec)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="small text-secondary p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                  <strong>Calculation Basis:</strong> Based on your average walking speed of <strong>{liveMetrics.avgSpeedKmh} km/h</strong> plus {walkState.profile?.preferredBreakMinutesPerHour || 12} min/hour planned rest & prayer pauses.
                </div>
              </div>
            </div>
          </div>

          {/* CUSTOM WALK ESTIMATOR (Pole A -> Pole B) */}
          <div className="p-4 rounded-4 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.35)' }}>
            <h3 className="h5 font-display text-warning mb-1">
              <i className="bi bi-calculator me-2"></i>
              Custom Arbaeen Walk Estimator (Any Pole to Any Pole)
            </h3>
            <p className="text-secondary small mb-3">
              Select your Starting Pole, Destination Pole, Walking Pace, and Step Length to calculate approximate distance, estimated steps, and walking time.
            </p>

            <div className="row g-3 mb-3">
              <div className="col-6 col-md-3">
                <label className="form-label small text-secondary">Starting Pole (1–1452)</label>
                <input
                  type="number"
                  min="1"
                  max="1452"
                  className="form-control bg-dark text-white border-secondary"
                  value={estFromPole}
                  onChange={(e) => setEstFromPole(e.target.value)}
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small text-secondary">Destination Pole (1–1452)</label>
                <input
                  type="number"
                  min="1"
                  max="1452"
                  className="form-control bg-dark text-white border-secondary"
                  value={estToPole}
                  onChange={(e) => setEstToPole(e.target.value)}
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small text-secondary">Average Walking Speed (km/h)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.5"
                  max="8.0"
                  className="form-control bg-dark text-white border-secondary"
                  value={estPaceKmh}
                  onChange={(e) => setEstPaceKmh(e.target.value)}
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small text-secondary">Personal Step Length (metres)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.40"
                  max="1.15"
                  className="form-control bg-dark text-white border-secondary"
                  value={estStepLengthM}
                  onChange={(e) => setEstStepLengthM(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-3 text-center">
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                  <div className="text-secondary small">Pole Span</div>
                  <div className="h4 fw-bold text-white mb-0">
                    Pole {estimatorResult.startP} → {estimatorResult.endP}
                  </div>
                  <div className="small text-secondary">{estimatorResult.polesCount} Poles</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                  <div className="text-secondary small">Approx Distance</div>
                  <div className="h4 fw-bold text-warning mb-0">{estimatorResult.distKm} km</div>
                  <div className="small text-secondary">{estimatorResult.distMeters.toLocaleString()} metres</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                  <div className="text-secondary small">Estimated Steps</div>
                  <div className="h4 fw-bold text-success mb-0">~{estimatorResult.estSteps.toLocaleString()}</div>
                  <div className="small text-secondary">@ {estimatorResult.stepLen}m / step</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25">
                  <div className="text-secondary small">Estimated Walking Time</div>
                  <div className="h4 fw-bold text-info mb-0">~{formatDuration(estimatorResult.estSeconds)}</div>
                  <div className="small text-secondary">@ {estimatorResult.paceKmh} km/h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBVIEW 4: MY WALK HISTORY, DAILY SUMMARY & JOURNEY TOTALS ================= */}
      {subView === 'history' && (
        <div>
          {/* Daily Step Summary & Multi-Day Total Journey Row */}
          <div className="row g-3 mb-4">
            {/* Daily Summary Filterable Card */}
            <div className="col-12 col-lg-6">
              <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.3)' }}>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <h3 className="h5 font-display text-white mb-0">
                    <i className="bi bi-calendar-check text-warning me-2"></i>
                    Daily Step Summary
                  </h3>
                  <div className="btn-group btn-group-sm">
                    {[
                      { id: 'today', label: 'Today' },
                      { id: 'yesterday', label: 'Yesterday' },
                      { id: '7days', label: '7 Days' },
                      { id: 'journey', label: 'Entire Journey' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        className={`btn ${summaryRange === r.id ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
                        onClick={() => setSummaryRange(r.id)}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="row g-2 text-center">
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary small">Steps</div>
                      <div className="h5 fw-bold text-white mb-0">
                        {journeyAndDailyAnalytics.currentRangeSummary.steps.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary small">Distance</div>
                      <div className="h5 fw-bold text-warning mb-0">
                        {journeyAndDailyAnalytics.currentRangeSummary.distanceKm} km
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary small">Walking</div>
                      <div className="h5 fw-bold text-info mb-0">
                        {formatDuration(journeyAndDailyAnalytics.currentRangeSummary.walkSec)}
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary small">Poles</div>
                      <div className="h5 fw-bold text-success mb-0">
                        {journeyAndDailyAnalytics.currentRangeSummary.poles.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-Day Cumulative Journey Total (Never resets when a daily session ends) */}
            <div className="col-12 col-lg-6">
              <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.3)' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3 className="h5 font-display text-warning mb-0">
                    <i className="bi bi-globe-central-south-asia me-2"></i>
                    TOTAL JOURNEY (MULTI-DAY CUMULATIVE)
                  </h3>
                  <span className="badge bg-dark border border-warning text-warning">
                    {journeyAndDailyAnalytics.totalJourney.daysWalking} Days Walking
                  </span>
                </div>

                <div className="row g-2 text-center">
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Total Steps</div>
                      <div className="fw-bold text-white">{journeyAndDailyAnalytics.totalJourney.steps.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Total Distance</div>
                      <div className="fw-bold text-warning">{journeyAndDailyAnalytics.totalJourney.distanceKm} km</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Poles Completed</div>
                      <div className="fw-bold text-success">{journeyAndDailyAnalytics.totalJourney.poles.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Walking Time</div>
                      <div className="fw-bold text-info">{formatDuration(journeyAndDailyAnalytics.totalJourney.walkSec)}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>Rest Time</div>
                      <div className="fw-bold text-secondary">{formatDuration(journeyAndDailyAnalytics.totalJourney.restSec)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Day 1 vs Day 2 vs Day 3 Comparison & Informative Personal Bests */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-6">
              <div className="p-3.5 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.25)' }}>
                <h3 className="h6 font-display text-white mb-2">
                  <i className="bi bi-calendar3-range text-warning me-2"></i>
                  Multi-Day Period Comparison (Day 1 vs Day 2 vs Day 3)
                </h3>
                {journeyAndDailyAnalytics.dailyBreakdown.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {journeyAndDailyAnalytics.dailyBreakdown.map((d, idx) => (
                      <div key={d.dateKey} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                        <div>
                          <strong className="text-warning me-2">Day {idx + 1}</strong>
                          <span className="text-secondary small">({d.dateKey})</span>
                        </div>
                        <div className="small text-light">
                          <strong>{d.steps.toLocaleString()}</strong> steps • <strong>{(d.distanceMeters / 1000).toFixed(1)} km</strong> • <strong>{d.poles}</strong> poles
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-secondary small py-2">No multi-day logs recorded yet.</div>
                )}
              </div>
            </div>

            {/* Personal Bests (Informative, Non-Competitive) */}
            <div className="col-12 col-lg-6">
              <div className="p-3.5 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.25)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h6 font-display text-white mb-0">
                    <i className="bi bi-bookmark-star text-warning me-2"></i>
                    Personal Journey Records (Informative)
                  </h3>
                  <span className="badge bg-dark border border-secondary text-secondary small">Private • No Leaderboard</span>
                </div>
                <div className="row g-2 small">
                  <div className="col-6">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <span className="text-secondary d-block">Most Steps in One Day</span>
                      <strong className="text-white">{journeyAndDailyAnalytics.personalBests.mostStepsOneDay.toLocaleString()} steps</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <span className="text-secondary d-block">Longest Walking Session</span>
                      <strong className="text-white">{formatDuration(journeyAndDailyAnalytics.personalBests.longestSessionSec)}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <span className="text-secondary d-block">Longest Session Distance</span>
                      <strong className="text-warning">{journeyAndDailyAnalytics.personalBests.longestDistanceKm} km</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded-3 bg-dark border border-secondary border-opacity-25">
                      <span className="text-secondary d-block">Most Poles in One Day</span>
                      <strong className="text-success">{journeyAndDailyAnalytics.personalBests.mostPolesOneDay} poles</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MY WALK HISTORY LIST */}
          <div className="p-4 rounded-4 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.3)' }}>
            <h3 className="h5 font-display text-warning mb-3">
              <i className="bi bi-clock-history me-2"></i>
              MY WALK HISTORY
            </h3>

            {walkState.sessionsHistory?.length > 0 ? (
              <div className="d-flex flex-column gap-2.5">
                {walkState.sessionsHistory.map((sess, idx) => {
                  const dateLabel = sess.startedAt
                    ? new Date(sess.startedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                    : sess.dateKey;
                  const distKm = Number(((sess.distanceWalkedMeters || 0) / 1000).toFixed(2));
                  return (
                    <div
                      key={sess.sessionId || idx}
                      className="p-3 rounded-3 bg-dark border border-secondary border-opacity-25 d-flex flex-wrap align-items-center justify-content-between gap-3"
                    >
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h4 className="h6 fw-bold text-white mb-0">{dateLabel}</h4>
                          <span className="badge bg-secondary-subtle text-light small">{sess.sessionPeriodLabel || 'Najaf → Karbala'}</span>
                          <span className="badge bg-dark border border-secondary text-secondary small">{sess.dataMode}</span>
                        </div>
                        <div className="text-warning fw-semibold mt-1">
                          Pole {sess.startingPole} → {sess.endingPole || sess.currentPole} ({sess.polesCompleted || 0} Poles)
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-3 text-end">
                        <div>
                          <div className="text-secondary" style={{ fontSize: '0.7rem' }}>STEPS</div>
                          <div className="fw-bold text-white">{(sess.totalSteps || 0).toLocaleString()} Steps</div>
                        </div>
                        <div>
                          <div className="text-secondary" style={{ fontSize: '0.7rem' }}>DISTANCE</div>
                          <div className="fw-bold text-warning">{distKm} km</div>
                        </div>
                        <div>
                          <div className="text-secondary" style={{ fontSize: '0.7rem' }}>WALKING TIME</div>
                          <div className="fw-bold text-info">{formatDuration(sess.activeWalkingSeconds || 0)} Walking</div>
                        </div>
                        <div>
                          <div className="text-secondary" style={{ fontSize: '0.7rem' }}>AVG SPEED / PACE</div>
                          <div className="fw-bold text-light">
                            {sess.averageSpeedKmh || 4.5} km/h ({sess.averageStepsPerMinute || 100} spm)
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-secondary small py-3">
                No completed walk sessions in your history yet. When you click <strong>Finish Walk</strong>, your session will be saved here with full pole, step, distance, and pace metrics.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SUBVIEW 5: PERSONAL STEP LENGTH, THREE DATA MODES & PRIVACY ================= */}
      {subView === 'settings' && (
        <div className="row g-3">
          {/* Personal Step Length & Targets */}
          <div className="col-12 col-lg-6">
            <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.3)' }}>
              <h3 className="h5 font-display text-warning mb-2">
                <i className="bi bi-rulers me-2"></i>
                Personal Step Length & Daily Targets
              </h3>
              <p className="text-secondary small mb-3">
                Do not assume every pilgrim's step length is identical. Choose Automatic Estimate (from height) or set your exact Custom Step Length.
              </p>

              <div className="btn-group w-100 mb-3">
                <button
                  type="button"
                  className={`btn ${walkState.profile?.stepLengthMode !== 'CUSTOM' ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
                  onClick={() =>
                    updateWalkState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, stepLengthMode: 'AUTO' }
                    }))
                  }
                >
                  Automatic Estimate (From Height)
                </button>
                <button
                  type="button"
                  className={`btn ${walkState.profile?.stepLengthMode === 'CUSTOM' ? 'btn-warning text-dark fw-bold' : 'btn-dark text-light border-secondary'}`}
                  onClick={() =>
                    updateWalkState((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, stepLengthMode: 'CUSTOM' }
                    }))
                  }
                >
                  Custom Step Length
                </button>
              </div>

              {walkState.profile?.stepLengthMode !== 'CUSTOM' ? (
                <div className="mb-3">
                  <label className="form-label small text-light">Your Height (cm)</label>
                  <input
                    type="number"
                    min="120"
                    max="220"
                    className="form-control bg-dark text-white border-secondary"
                    value={walkState.profile?.heightCm || 170}
                    onChange={(e) =>
                      updateWalkState((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, heightCm: Number(e.target.value) || 170 }
                      }))
                    }
                  />
                  <div className="small text-secondary mt-1">
                    Effective Auto-Estimated Step Length: <strong className="text-warning">{effectiveStepLength} metres</strong>
                  </div>
                </div>
              ) : (
                <div className="mb-3">
                  <label className="form-label small text-light">Custom Step Length (metres, e.g. 0.72)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.35"
                    max="1.20"
                    className="form-control bg-dark text-white border-secondary"
                    value={walkState.profile?.customStepLengthMeters || 0.72}
                    onChange={(e) =>
                      updateWalkState((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, customStepLengthMeters: Number(e.target.value) || 0.72 }
                      }))
                    }
                  />
                </div>
              )}

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small text-light">Today's Target Steps</label>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    className="form-control bg-dark text-white border-secondary"
                    value={walkState.profile?.dailyTargetSteps || 15000}
                    onChange={(e) =>
                      updateWalkState((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, dailyTargetSteps: Number(e.target.value) || 15000 }
                      }))
                    }
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-light">Target Pole Goal</label>
                  <input
                    type="number"
                    min="1"
                    max="1452"
                    className="form-control bg-dark text-white border-secondary"
                    value={walkState.profile?.dailyTargetPole || 600}
                    onChange={(e) =>
                      updateWalkState((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, dailyTargetPole: Number(e.target.value) || 600 }
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Three Data Modes & Privacy / Voluntary Group Walking */}
          <div className="col-12 col-lg-6">
            <div className="p-4 rounded-4 h-100 border" style={{ background: 'rgba(13, 19, 28, 0.95)', borderColor: 'rgba(198,166,107,0.3)' }}>
              <h3 className="h5 font-display text-warning mb-2">
                <i className="bi bi-layers-half me-2"></i>
                Three Data Modes & Privacy Controls
              </h3>

              <div className="d-flex flex-column gap-2 mb-3">
                {[
                  {
                    id: 'DEVICE_MEASURED',
                    title: 'MODE 1 — DEVICE MEASURED',
                    desc: deviceMotionSupported
                      ? 'Uses browser/mobile accelerometer motion sensor for step detection. Labeled as Measured.'
                      : 'Hardware step sensor unavailable on this desktop browser; automatically falls back to clearly labeled route estimation.'
                  },
                  {
                    id: 'GPS_TRACKED',
                    title: 'MODE 2 — GPS TRACKED',
                    desc: 'Tracks corridor distance and nearest Arbaeen pole via GPS with jump filtering and battery-saver throttling.'
                  },
                  {
                    id: 'ESTIMATED',
                    title: 'MODE 3 — ESTIMATED',
                    desc: 'Calculates steps and distance from your Arbaeen pole check-ins and personal step length.'
                  }
                ].map((m) => (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-3 border cursor-pointer ${
                      (activeSession?.dataMode || dataModeChoice) === m.id ? 'border-warning bg-dark' : 'border-secondary border-opacity-25 bg-dark'
                    }`}
                    onClick={() => handleSelectDataMode(m.id)}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <strong className="text-white small">{m.title}</strong>
                      {(activeSession?.dataMode || dataModeChoice) === m.id && (
                        <span className="badge bg-warning text-dark">Active Mode</span>
                      )}
                    </div>
                    <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{m.desc}</div>
                  </div>
                ))}
              </div>

              {gpsWatchError && (
                <div className="small text-warning mb-2">{gpsWatchError}</div>
              )}

              {/* Privacy & Voluntary Group Check-in */}
              <div className="pt-2 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <strong className="small text-light">
                    <i className="bi bi-shield-check text-success me-1"></i>
                    Privacy Mode (Default: PRIVATE)
                  </strong>
                  <select
                    className="form-select form-select-sm bg-dark text-light border-secondary"
                    style={{ width: '175px' }}
                    value={walkState.profile?.privacyMode || 'PRIVATE'}
                    onChange={(e) =>
                      updateWalkState((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, privacyMode: e.target.value }
                      }))
                    }
                  >
                    <option value="PRIVATE">PRIVATE (Only Me)</option>
                    <option value="GROUP_CHECKIN_ONLY">GROUP CHECK-IN ONLY</option>
                    <option value="ANONYMOUS_AGGREGATE">ANONYMOUS AGGREGATE</option>
                  </select>
                </div>

                {/* Voluntary Group Check-in Box */}
                <div className="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="small fw-semibold text-warning">My Caravan / Group Voluntary Check-In</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning rounded-pill py-0 px-2.5"
                      onClick={handleVoluntaryGroupCheckIn}
                    >
                      Post Pole #{liveMetrics.currentPoleNum} Check-In
                    </button>
                  </div>
                  <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
                    Continuous live GPS location is NEVER exposed publicly. Only voluntary approximate pole check-ins are logged.
                  </div>
                  {walkState.groupCheckIns?.length > 0 && (
                    <div className="mt-2 d-flex flex-column gap-1">
                      {walkState.groupCheckIns.slice(0, 3).map((g) => (
                        <div key={g.id} className="small d-flex justify-content-between text-light">
                          <span>{g.nickname}: <strong>{g.status}</strong> (~Pole #{g.poleNumber})</span>
                          <span className="text-secondary">{g.checkedInAt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
