/**
 * KARBALA DIGITAL TWIN — SMART POLE NAVIGATION CONTROLLER
 * Najaf-to-Karbala Sacred Route Telemetry (Route 9 / Tareeq Ya Hussain)
 */

import {
  PILGRIMAGE_ANCHORS,
  KEY_LANDMARK_POLES,
  CALIBRATED_POLE_SPACING_METERS,
  CROWD_LEVELS,
  ROUTE_SEGMENTS,
  getPoleData,
  getRoutePolylineCoordinates
} from '../../client/js/data/smartPoleNavigationData.js';
import {
  SMART_MAWKIB_FACILITIES,
  GRANULAR_CROWD_SEGMENTS,
  HISTORICAL_61AH_TIME_SLIDER_STAGES
} from '../../client/js/data/advancedPilgrimageData.js';

/**
 * GET /api/pole-navigation/anchors
 * Returns origin and destination anchors with coordinates
 */
export const getPilgrimageAnchors = (req, res) => {
  res.json({
    status: 'success',
    anchors: PILGRIMAGE_ANCHORS
  });
};

/**
 * GET /api/pole-navigation/landmarks
 * Returns all verified surveyed landmark poles
 */
export const getLandmarkPoles = (req, res) => {
  res.json({
    status: 'success',
    totalLandmarks: KEY_LANDMARK_POLES.length,
    calibratedSpacingMeters: CALIBRATED_POLE_SPACING_METERS,
    totalPolesOnHighway: 1452,
    landmarks: KEY_LANDMARK_POLES
  });
};

/**
 * GET /api/pole-navigation/pole/:number
 * Returns details for a specific pole (1 to 1452)
 */
export const getPoleByNumber = (req, res) => {
  const poleNumber = parseInt(req.params.number, 10);
  if (isNaN(poleNumber) || poleNumber < 1 || poleNumber > 1452) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid pole number. Route 9 poles range from 1 to 1,452.'
    });
  }

  const pole = getPoleData(poleNumber);
  res.json({
    status: 'success',
    pole
  });
};

/**
 * GET /api/pole-navigation/calculate
 * Query params: from (number), to (number), pace ('relaxed' | 'normal' | 'brisk' | 'night')
 */
export const calculatePoleDistance = (req, res) => {
  const from = parseInt(req.query.from || req.query.fromPole, 10);
  const to = parseInt(req.query.to || req.query.toPole, 10);
  const pace = req.query.pace || 'normal';

  if (isNaN(from) || isNaN(to) || from < 1 || from > 1452 || to < 1 || to > 1452) {
    return res.status(400).json({
      status: 'error',
      message: 'Both "from" and "to" query parameters must be integers between 1 and 1,452.'
    });
  }

  const fromPole = Math.min(from, to);
  const toPole = Math.max(from, to);
  const intervals = toPole - fromPole;

  // Calibrated route distance (50.17 meters per interval)
  const distanceKm = Number(((intervals * CALIBRATED_POLE_SPACING_METERS) / 1000).toFixed(2));

  // Pacing speeds (km/h) factoring hourly rest intervals
  const speeds = {
    relaxed: 3.0, // Strollers, elderly, frequent rests
    normal: 4.0,  // Standard zaireen group pace
    brisk: 4.8,   // Agile solo walker
    night: 3.8    // Night walkers with illumination
  };

  const speedKmH = speeds[pace] || speeds.normal;
  const totalMinutes = Math.round((distanceKm / speedKmH) * 60);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  // Find landmark poles in this interval
  const milestonesEnRoute = KEY_LANDMARK_POLES.filter(
    p => p.poleNumber >= fromPole && p.poleNumber <= toPole
  );

  res.json({
    status: 'success',
    calculation: {
      fromPole,
      toPole,
      intervals,
      calibratedDistanceKm: distanceKm,
      paceSelected: pace,
      walkingDurationFormatted: `${hours}h ${mins}m`,
      totalMinutes,
      accuracyLevel: 'CALIBRATED_SEGMENT_DISTANCE',
      methodologyNote: 'Calculated using Highway 9 calibrated mean pole spacing (50.17m per interval). Real road terrain, overpasses, and pedestrian detours may introduce ±3-5% variance.',
      milestonesCount: milestonesEnRoute.length,
      milestonesEnRoute
    }
  });
};

/**
 * GET /api/pole-navigation/crowd
 * Returns live vs historical crowd status for route segments
 */
export const getCrowdIntelligence = (req, res) => {
  const mode = req.query.mode === 'historical' ? 'HISTORICAL_ARBAEEN_BENCHMARK' : 'LIVE_OBSERVATIONAL';

  res.json({
    status: 'success',
    mode,
    disclaimer: 'Live crowd information is reported from authorized field optical sensors and checkpoint observers. When sensors are offline, segments are marked as Unknown.',
    crowdLevelsLegend: CROWD_LEVELS,
    segments: ROUTE_SEGMENTS.map(seg => ({
      ...seg,
      effectiveCrowdLevel: mode === 'historical' ? seg.historicalPeakLevel : seg.liveCrowdLevel,
      effectiveCrowdDetails: CROWD_LEVELS[mode === 'historical' ? seg.historicalPeakLevel : seg.liveCrowdLevel]
    }))
  });
};

/**
 * GET /api/pole-navigation/offline-pack
 * Returns complete bundle for offline download
 */
export const getOfflineRoutePack = (req, res) => {
  res.json({
    status: 'success',
    title: 'Najaf to Karbala Smart Pole Navigation & Mawkib Offline Survival Pack',
    version: '5.0.0',
    generatedAt: new Date().toISOString(),
    routeSummary: {
      origin: PILGRIMAGE_ANCHORS.origin.name,
      destination: PILGRIMAGE_ANCHORS.destination.name,
      totalPoles: 1452,
      totalHighwayKm: 72.84,
      totalJourneyKm: 84.84
    },
    landmarks: KEY_LANDMARK_POLES,
    essentialMawkibFacilities: SMART_MAWKIB_FACILITIES,
    cachedCrowdSnapshot: {
      statusWhenOffline: 'STALE',
      notice: 'Cached crowd snapshot — mark as STALE when device is offline.',
      segments: GRANULAR_CROWD_SEGMENTS
    },
    historicalTimeSliderStages: HISTORICAL_61AH_TIME_SLIDER_STAGES,
    emergencyContacts: [
      { name: 'Iraqi National Ambulance', number: '122' },
      { name: 'Iraqi National Police', number: '104' },
      { name: 'Civil Defense', number: '115' },
      { name: 'Astan Al-Hussainiya Central Guidance', number: '+964 32 322 0000' },
      { name: 'Astan Al-Abbasiya Central Helpdesk', number: '+964 32 322 0001' }
    ]
  });
};
