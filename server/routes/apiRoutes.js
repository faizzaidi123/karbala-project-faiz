import {
  getPilgrimServices,
  getShrineGates,
  getZiyaratPlans,
  getDestinations,
  getEmergencyContacts,
  getPedestrianRoute,
  getOfflineEssentialsPack
} from '../controllers/pilgrimServicesController.js';
import express from 'express';
import { getLocations, getLocationById } from '../controllers/locationController.js';
import { getTimeline } from '../controllers/timelineController.js';
import { getPersonalities } from '../controllers/personalityController.js';
import { getCertainty } from '../controllers/certaintyController.js';
import { getBookmarks, addBookmark, deleteBookmark } from '../controllers/bookmarkController.js';
import { getGallery } from '../controllers/galleryController.js';
import { getMongoStatus } from '../config/db.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    technology: {
      backend: 'Node.js & Express.js (Modular MVC)',
      database: getMongoStatus() ? 'MongoDB (Connected)' : 'MongoDB (In-Memory Fallback Cache)',
      frontend: 'React 18 & Bootstrap 5 & Canvas 2D'
    }
  });
});

// Location routes
router.get('/locations', getLocations);
router.get('/locations/:id', getLocationById);

// Timeline routes
router.get('/timeline', getTimeline);

// Personality routes
router.get('/personalities', getPersonalities);

// Certainty routes
router.get('/certainty', getCertainty);

// Bookmark routes
router.get('/bookmarks', getBookmarks);
router.post('/bookmarks', addBookmark);
router.delete('/bookmarks/:id', deleteBookmark);

// Gallery route (360+ images)
router.get('/gallery', getGallery);


import { translateText, translateUiBatch, getSignSamples } from '../controllers/translatorController.js';
import {
  getLandmarks,
  getLandmarkById,
  recognizeLandmark,
  runLandmarkBenchmark
} from '../controllers/landmarkController.js';
import {
  getEncyclopediaPersonalities,
  getEncyclopediaFamilyTree,
  getEncyclopediaSources,
  getEncyclopediaTimeline,
  getKnowledgeGraph
} from '../controllers/encyclopediaController.js';

// Pilgrim Services & Smart Ziyarat Routes (Phase 5)
router.get('/pilgrim-services', getPilgrimServices);
router.get('/shrine-gates', getShrineGates);
router.get('/ziyarat-plans', getZiyaratPlans);
router.get('/destinations', getDestinations);
router.get('/emergency-contacts', getEmergencyContacts);
router.get('/route', getPedestrianRoute);
router.get('/offline-pack', getOfflineEssentialsPack);

// AI Camera Translator & Multilingual Assistant Routes (Milestone 4)
router.post('/translator/translate', translateText);
router.post('/translator/translate-batch', translateUiBatch);
router.get('/translator/samples', getSignSamples);

// Landmark Recognition & Heritage Knowledge Routes (Milestone 5)
router.get('/landmarks', getLandmarks);
router.get('/landmarks/benchmark', runLandmarkBenchmark);
router.get('/landmarks/:id', getLandmarkById);
router.post('/landmarks/recognize', recognizeLandmark);

// Living Heritage Encyclopedia Routes (Phase 6)
router.get('/encyclopedia/personalities', getEncyclopediaPersonalities);
router.get('/encyclopedia/family-tree', getEncyclopediaFamilyTree);
router.get('/encyclopedia/sources', getEncyclopediaSources);
router.get('/encyclopedia/timeline', getEncyclopediaTimeline);
router.get('/encyclopedia/knowledge-graph', getKnowledgeGraph);
router.get('/encyclopedia/graph', getKnowledgeGraph);

// Ask Karbala AI 3.0 Intelligent Multilingual Companion Routes (Phase 7)
import {
  chatWithAi,
  getAiStarters,
  clearAiConversation
} from '../controllers/aiAssistantController.js';

router.post('/ai/chat', chatWithAi);
router.post('/ai/ask', chatWithAi);
router.get('/ai/starters', getAiStarters);
router.post('/ai/clear', clearAiConversation);

// Module H: Global Karbala Zaireen Statistics & Pilgrimage Intelligence Routes
import {
  getPilgrimageOverview,
  getPilgrimageYears,
  getPilgrimageByYear,
  getCountryPilgrimStats,
  getAttendanceTrends,
  getArbaeenIntelligence,
  getStatisticalSources,
  comparePilgrimageYears,
  getPilgrimageTimeline,
  exportPilgrimageCsv,
  verifyStatisticalEntry,
  getAuditTrail
} from '../controllers/pilgrimageStatsController.js';

router.get('/pilgrimage-stats/overview', getPilgrimageOverview);
router.get('/pilgrimage-stats/years', getPilgrimageYears);
router.get('/pilgrimage-stats/year/:year', getPilgrimageByYear);
router.get('/pilgrimage-stats/countries', getCountryPilgrimStats);
router.get('/pilgrimage-stats/trends', getAttendanceTrends);
router.get('/pilgrimage-stats/arbaeen', getArbaeenIntelligence);
router.get('/pilgrimage-stats/sources', getStatisticalSources);
router.get('/pilgrimage-stats/compare', comparePilgrimageYears);
router.get('/pilgrimage-stats/timeline', getPilgrimageTimeline);
router.get('/pilgrimage-stats/export/csv', exportPilgrimageCsv);
router.get('/pilgrimage-stats/audit-trail', getAuditTrail);
router.post('/pilgrimage-stats/verify', verifyStatisticalEntry);

// Phase 1 Add-on: Zaireen Journey & Smart Airport Arrival Simulator Routes
import {
  getZaireenJourneyManifest,
  getAirports,
  getArrivalSteps,
  getHolyShrines,
  getOfflinePack
} from '../controllers/zaireenJourneyController.js';

router.get('/zaireen-journey/manifest', getZaireenJourneyManifest);
router.get('/zaireen-journey/airports', getAirports);
router.get('/zaireen-journey/steps', getArrivalSteps);
router.get('/zaireen-journey/shrines', getHolyShrines);
router.get('/zaireen-journey/offline-pack', getOfflinePack);

// Part 1: Najaf to Karbala Smart Pole Navigation & Crowd Intelligence Routes
import {
  getPilgrimageAnchors,
  getLandmarkPoles,
  getPoleByNumber,
  calculatePoleDistance,
  getCrowdIntelligence,
  getOfflineRoutePack
} from '../controllers/poleNavigationController.js';

router.get('/pole-navigation/anchors', getPilgrimageAnchors);
router.get('/pole-navigation/landmarks', getLandmarkPoles);
router.get('/pole-navigation/pole/:number', getPoleByNumber);
router.get('/pole-navigation/calculate', calculatePoleDistance);
router.get('/pole-navigation/crowd', getCrowdIntelligence);
router.get('/pole-navigation/offline-pack', getOfflineRoutePack);

// Daily Ahlul Bayt Calendar, "Today in History", Claim Checker & Universal Search Routes
import {
  getCalendarToday,
  getCalendarUpcoming,
  getCalendarMonth,
  getCalendarDateDetail,
  convertCalendarDate,
  getEventBySlug,
  getCalendarConfigurations,
  updateAdminCalendarConfig,
  verifyHistoricalClaim,
  universalSearch
} from '../controllers/calendarController.js';

router.get('/calendar/today', getCalendarToday);
router.get('/calendar/upcoming', getCalendarUpcoming);
router.get('/calendar/month/:month', getCalendarMonth);
router.get('/calendar/date/:month/:day', getCalendarDateDetail);
router.get('/calendar/convert', convertCalendarDate);
router.post('/calendar/convert', convertCalendarDate);
router.get('/calendar/config', getCalendarConfigurations);
router.put('/admin/calendar/config', updateAdminCalendarConfig);
router.post('/admin/calendar/config', updateAdminCalendarConfig);
router.get('/events/:slug', getEventBySlug);
router.post('/claim-check', verifyHistoricalClaim);
router.get('/claim-check', verifyHistoricalClaim);
router.get('/search', universalSearch);

// Live Zaireen Walk Tracker & Step Intelligence Routes
import {
  startWalkSession,
  pauseWalkSession,
  resumeWalkSession,
  syncWalkSession,
  finishWalkSession,
  getCurrentWalkSession,
  getWalkHistory,
  getWalkSummaryToday,
  getWalkSummaryJourney,
  calculateWalkEstimate,
  updateWalkingProfile
} from '../controllers/walkTrackerController.js';

router.post('/walk/start', startWalkSession);
router.post('/walk/pause', pauseWalkSession);
router.post('/walk/resume', resumeWalkSession);
router.post('/walk/sync', syncWalkSession);
router.post('/walk/finish', finishWalkSession);
router.get('/walk/current', getCurrentWalkSession);
router.get('/walk/history', getWalkHistory);
router.get('/walk/summary/today', getWalkSummaryToday);
router.get('/walk/summary/journey', getWalkSummaryJourney);
router.get('/walk/estimate', calculateWalkEstimate);
router.put('/walk/profile', updateWalkingProfile);

// 5 Advanced Pilgrimage & Historical Explorer Features Routes
import {
  getCrowdCurrent,
  getCrowdRoute,
  postCrowdReport,
  getFacilitiesNearby,
  getFacilitiesAhead,
  postCommunityFacilityReport,
  createPilgrimGroup,
  getPilgrimGroup,
  joinPilgrimGroup,
  checkInPilgrimGroup,
  setGroupMeetingPoint,
  getJourneyJournal,
  addJourneyJournalEntry,
  getJourneyRecap,
  getHistoricalMapStateByDate
} from '../controllers/advancedPilgrimageController.js';

// Feature 1: Live Crowd Map
router.get('/crowd/current', getCrowdCurrent);
router.get('/crowd/route', getCrowdRoute);
router.post('/crowd/report', postCrowdReport);

// Feature 2: Smart Mawkib & Pilgrim Facility Finder
router.get('/facilities/nearby', getFacilitiesNearby);
router.get('/facilities/ahead', getFacilitiesAhead);
router.post('/facilities/status', postCommunityFacilityReport);

// Feature 3: Privacy-First Group Journey Mode
router.post('/groups', createPilgrimGroup);
router.get('/groups/:id', getPilgrimGroup);
router.post('/groups/:id/join', joinPilgrimGroup);
router.post('/groups/:id/checkin', checkInPilgrimGroup);
router.post('/groups/:id/meeting-point', setGroupMeetingPoint);

// Feature 4: Journey Journal & Automatic Recap
router.get('/journey/:id/journal', getJourneyJournal);
router.post('/journey/:id/journal', addJourneyJournalEntry);
router.get('/journey/:id/recap', getJourneyRecap);

// Feature 5: 61 AH Historical Map Time Slider
router.get('/history/map-state/:date', getHistoricalMapStateByDate);

export default router;

