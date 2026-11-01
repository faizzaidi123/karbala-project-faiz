import {
  getPilgrimServices,
  getShrineGates,
  getZiyaratPlans,
  getDestinations,
  getEmergencyContacts,
  getPedestrianRoute
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


// Pilgrim Services & Smart Ziyarat Routes (Phase 5)
router.get('/pilgrim-services', getPilgrimServices);
router.get('/shrine-gates', getShrineGates);
router.get('/ziyarat-plans', getZiyaratPlans);
router.get('/destinations', getDestinations);
router.get('/emergency-contacts', getEmergencyContacts);
router.get('/route', getPedestrianRoute);

export default router;
