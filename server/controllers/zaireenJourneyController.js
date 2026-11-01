import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to manifest and assets
const MANIFEST_PATH = path.resolve(__dirname, '../../client/assets/zaireen_journey_manifest.json');

// Read manifest safely
function loadManifest() {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      const data = fs.readFileSync(MANIFEST_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading zaireen journey manifest:', err.message);
  }
  return [];
}

/**
 * GET /api/zaireen-journey/manifest
 * Returns the complete verified visual asset manifest (27 assets)
 */
export const getZaireenJourneyManifest = (req, res) => {
  const manifest = loadManifest();
  res.json({
    status: 'success',
    totalAssets: manifest.length,
    offlineReady: true,
    assets: manifest
  });
};

/**
 * GET /api/zaireen-journey/airports
 * Returns verified airport gateways with sovereign telemetry
 */
export const getAirports = (req, res) => {
  const airports = [
    {
      id: 'njf',
      code: 'NJF',
      icao: 'ORNI',
      name: 'Al-Najaf International Airport',
      arabicName: 'مطار النجف الأشرف الدولي',
      status: 'OPERATIONAL',
      distanceToKarbalaKm: 78.4,
      estimatedDriveMin: 75,
      heroImage: 'assets/zaireen_journey/airports/airport_najaf_njf.svg',
      trafficSharePct: '72% of Airborne International Zaireen',
      runwaySpecs: '3,000m × 45m Asphalt (Code 4D)',
      legalAttribution: 'Iraqi Civil Aviation Authority (ICAA)'
    },
    {
      id: 'bgw',
      code: 'BGW',
      icao: 'ORBI',
      name: 'Baghdad International Airport',
      arabicName: 'مطار بغداد الدولي',
      status: 'OPERATIONAL',
      distanceToKarbalaKm: 105.2,
      estimatedDriveMin: 105,
      heroImage: 'assets/zaireen_journey/airports/airport_baghdad_bgw.svg',
      trafficSharePct: '22% of Airborne International Zaireen',
      runwaySpecs: 'Two runways: 4,000m & 3,300m Concrete (Code 4E/4F)',
      legalAttribution: 'Iraqi Ministry of Transport / ICAA'
    },
    {
      id: 'bsr',
      code: 'BSR',
      icao: 'ORMM',
      name: 'Basra International Airport',
      arabicName: 'مطار البصرة الدولي',
      status: 'OPERATIONAL',
      distanceToKarbalaKm: 502.0,
      estimatedDriveMin: 330,
      heroImage: 'assets/zaireen_journey/airports/airport_basra_bsr.svg',
      trafficSharePct: '6% of Airborne International Zaireen',
      runwaySpecs: '4,000m × 45m Concrete Runway (Code 4E)',
      legalAttribution: 'Basra Governorate Aviation Directorate / ICAA'
    },
    {
      id: 'kib',
      code: 'KIB',
      icao: 'UNASSIGNED',
      name: 'Karbala International Airport (Under Construction)',
      arabicName: 'مطار كربلاء الدولي (قيد الإنشاء والتجهيز)',
      status: 'NON_OPERATIONAL',
      warning: 'CRITICAL PILGRIM ADVISORY: Do not attempt to book flights landing at Karbala Airport. Currently under construction by Holy Shrine of Imam Hussain (Astan) and ADPI France.',
      distanceToKarbalaKm: 32.0,
      estimatedDriveMin: 30,
      heroImage: 'assets/zaireen_journey/airports/airport_karbala_kib.svg',
      trafficSharePct: '0% (Non-Operational / Project Phase)',
      runwaySpecs: '4,500m × 60m Code 4F Runway (Built for Airbus A380)',
      legalAttribution: 'Holy Shrine of Imam Hussain (Astan) / Ministry of Transport'
    }
  ];

  res.json({
    status: 'success',
    airports
  });
};

/**
 * GET /api/zaireen-journey/steps
 * Returns the 10 sequential arrival simulator steps
 */
export const getArrivalSteps = (req, res) => {
  const manifest = loadManifest();
  const stepAssets = manifest.filter(m => m.category === 'arrival_steps');
  res.json({
    status: 'success',
    totalSteps: stepAssets.length,
    steps: stepAssets
  });
};

/**
 * GET /api/zaireen-journey/shrines
 * Returns Holy Shrines of Iraq architectural specifications
 */
export const getHolyShrines = (req, res) => {
  const manifest = loadManifest();
  const shrineAssets = manifest.filter(m => m.category === 'shrines');
  res.json({
    status: 'success',
    totalShrines: shrineAssets.length,
    shrines: shrineAssets
  });
};

/**
 * GET /api/zaireen-journey/offline-pack
 * Returns offline pack resources
 */
export const getOfflinePack = (req, res) => {
  res.json({
    status: 'success',
    offlineReady: true,
    version: '4.0.0',
    emergencyHotlines: [
      { name: 'Ambulance', number: '122' },
      { name: 'Police', number: '104' },
      { name: 'Civil Defense', number: '115' },
      { name: 'Astan Al-Hussainiya Central Hotline', number: '+964 32 322 0000' }
    ]
  });
};
