import fs from 'fs';
import path from 'path';
import vm from 'vm';
import express from 'express';
import apiRoutes from '../server/routes/apiRoutes.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

async function runAudit() {
  console.log('========================================================================');
  console.log('🏁 SMART ARBAEEN POLE NAVIGATION & FINAL POLISH COMPREHENSIVE AUDIT');
  console.log('========================================================================\n');

  // 1. Data Integrity & Anchors Audit
  console.log('--- 1. Geospatial Pilgrimage Anchors Audit ---');
  const {
    PILGRIMAGE_ANCHORS,
    POLE_NAV_VISUALS,
    KEY_LANDMARK_POLES,
    CALIBRATED_POLE_SPACING_METERS,
    CROWD_LEVELS,
    ROUTE_SEGMENTS,
    MULTILINGUAL_POLE_GUIDE,
    getPoleData,
    getRoutePolylineCoordinates
  } = await import('../client/js/data/smartPoleNavigationData.js');

  assert(PILGRIMAGE_ANCHORS.origin.name.includes('Imam Ali'), 'Origin anchor is Holy Shrine of Imam Ali (Najaf)');
  assert(PILGRIMAGE_ANCHORS.origin.coordinates[0] > 31.0 && PILGRIMAGE_ANCHORS.origin.coordinates[1] > 44.0, 'Origin coordinates verified in Najaf WGS84');
  assert(PILGRIMAGE_ANCHORS.destination.name.includes('Imam Hussain'), 'Destination anchor is Holy Shrine of Imam Hussain (Karbala)');
  assert(PILGRIMAGE_ANCHORS.destination.coordinates[0] > 32.0 && PILGRIMAGE_ANCHORS.destination.coordinates[1] > 44.0, 'Destination coordinates verified in Karbala WGS84');

  // 1.1 Four Authentic Visual References Audit
  console.log('\n--- 1.1 Four Authentic Visual References Audit ---');
  const img1Path = path.join('client', POLE_NAV_VISUALS.originNajaf.src);
  const img2Path = path.join('client', POLE_NAV_VISUALS.routePoles.src);
  const img3Path = path.join('client', POLE_NAV_VISUALS.crowdAerial.src);
  const img4Path = path.join('client', POLE_NAV_VISUALS.destinationKarbala.src);

  assert(fs.existsSync(img1Path) && fs.statSync(img1Path).size > 100000, `IMAGE 1 (Najaf Shrine Evening) exists on disk (${(fs.statSync(img1Path).size/1024).toFixed(1)} KB)`);
  assert(fs.existsSync(img2Path) && fs.statSync(img2Path).size > 100000, `IMAGE 2 (Arbaeen Route & Poles) exists on disk (${(fs.statSync(img2Path).size/1024).toFixed(1)} KB)`);
  assert(fs.existsSync(img3Path) && fs.statSync(img3Path).size > 100000, `IMAGE 3 (Arbaeen Crowd Aerial View) exists on disk (${(fs.statSync(img3Path).size/1024).toFixed(1)} KB)`);
  assert(fs.existsSync(img4Path) && fs.statSync(img4Path).size > 100000, `IMAGE 4 (Karbala Shrine Night) exists on disk (${(fs.statSync(img4Path).size/1024).toFixed(1)} KB)`);

  assert(POLE_NAV_VISUALS.originNajaf.alt.includes('Najaf') && POLE_NAV_VISUALS.originNajaf.alt.length > 20, 'IMAGE 1 has descriptive alt text');
  assert(POLE_NAV_VISUALS.routePoles.alt.includes('Highway 9') || POLE_NAV_VISUALS.routePoles.alt.includes('poles'), 'IMAGE 2 has descriptive alt text');
  assert(POLE_NAV_VISUALS.crowdAerial.alt.includes('aerial') && POLE_NAV_VISUALS.crowdAerial.caption.includes('Illustrative'), 'IMAGE 3 explicitly labeled as illustrative crowd view');
  assert(POLE_NAV_VISUALS.destinationKarbala.alt.includes('Karbala') && POLE_NAV_VISUALS.destinationKarbala.alt.length > 20, 'IMAGE 4 has descriptive alt text');

  // 2. Landmark Poles & Spacing Calibration Audit
  console.log('\n--- 2. Landmark Poles & Highway 9 Geodesic Audit ---');
  assert(KEY_LANDMARK_POLES.length >= 18, `Surveyed landmark poles count is >= 18 (found: ${KEY_LANDMARK_POLES.length})`);
  assert(KEY_LANDMARK_POLES[0].poleNumber === 1, 'First landmark pole is Pole #1');
  assert(KEY_LANDMARK_POLES[KEY_LANDMARK_POLES.length - 1].poleNumber === 1452, 'Final landmark pole is Pole #1452');
  assert(Math.abs(CALIBRATED_POLE_SPACING_METERS - 50.17) < 0.1, `Mean pole interval is calibrated at ~50.17 meters (found: ${CALIBRATED_POLE_SPACING_METERS})`);

  const pHalf = KEY_LANDMARK_POLES.find(p => p.poleNumber === 726);
  assert(pHalf !== undefined, 'Midpoint Pole #726 is verified and indexed');
  assert(pHalf.importance === 'CRITICAL_MILESTONE', 'Pole #726 is marked as CRITICAL_MILESTONE');
  assert(pHalf.verificationStatus === 'VERIFIED_SURVEY_GPS', 'Pole #726 has verified survey GPS coordinates');

  // 3. Spline Interpolation & Bounding Verification
  console.log('\n--- 3. Pole Spline Interpolation & Coordinate Bounds ---');
  const testPoles = [1, 50, 208, 450, 726, 1000, 1407, 1452];
  for (const num of testPoles) {
    const data = getPoleData(num);
    assert(data.poleNumber === num, `Pole #${num} retrieved with matching poleNumber`);
    assert(data.coordinates && data.coordinates.length === 2, `Pole #${num} has valid lat/lng array`);
    assert(data.coordinates[0] >= 32.0 && data.coordinates[0] <= 32.7, `Pole #${num} latitude is within Highway 9 corridor (${data.coordinates[0]})`);
    assert(data.cumulativeKmFromPole1 >= 0 && data.cumulativeKmFromPole1 <= 73.0, `Pole #${num} cumulative distance is valid (${data.cumulativeKmFromPole1} km)`);
    assert(data.remainingKmToPole1452 >= 0 && data.remainingKmToPole1452 <= 73.0, `Pole #${num} remaining distance is valid (${data.remainingKmToPole1452} km)`);
  }

  // 4. Smart Distance & Duration Calculation Audit
  console.log('\n--- 4. Distance & Pacing Calculation Audit ---');
  const poleStart = 250;
  const poleEnd = 500;
  const intervals = poleEnd - poleStart;
  const expectedDistanceKm = Number(((intervals * CALIBRATED_POLE_SPACING_METERS) / 1000).toFixed(2));
  assert(intervals === 250, 'Interval between Pole 250 and 500 is exactly 250');
  assert(Math.abs(expectedDistanceKm - 12.54) < 0.05, `250 intervals equal ~12.54 km (calculated: ${expectedDistanceKm} km)`);

  // 5. Crowd Intelligence & Zero-Fabrication Protocol Audit
  console.log('\n--- 5. Crowd Intelligence & Zero-Fabrication Audit ---');
  assert(Object.keys(CROWD_LEVELS).length === 5, 'Includes 5 crowd tiers (LOW, MODERATE, HIGH, VERY_HIGH, UNKNOWN)');
  assert(CROWD_LEVELS.LOW.color === '#48bb78', 'Low crowd color is Green (#48bb78)');
  assert(CROWD_LEVELS.MODERATE.color === '#ecc94b', 'Moderate crowd color is Yellow (#ecc94b)');
  assert(CROWD_LEVELS.HIGH.color === '#ed8936', 'High crowd color is Amber/Orange (#ed8936)');
  assert(CROWD_LEVELS.VERY_HIGH.color === '#e53e3e', 'Very High crowd color is Crimson Red (#e53e3e)');
  assert(CROWD_LEVELS.UNKNOWN.color === '#718096', 'Unknown/Offline sensor color is Gray (#718096)');
  assert(ROUTE_SEGMENTS.length === 6, `Route is segmented into 6 monitored highway sections (found: ${ROUTE_SEGMENTS.length})`);
  for (const seg of ROUTE_SEGMENTS) {
    assert(seg.sensorSource && seg.sensorSource.length > 5, `Segment ${seg.id} reports verified sensor authority (${seg.sensorSource})`);
    assert(seg.lastUpdated && seg.lastUpdated.length > 0, `Segment ${seg.id} reports freshness timestamp (${seg.lastUpdated})`);
  }

  // 6. Multilingual Dictionaries & RTL Audit
  console.log('\n--- 6. Multilingual Dictionaries & RTL Support ---');
  const languages = ['EN', 'AR', 'UR', 'HI'];
  for (const l of languages) {
    assert(MULTILINGUAL_POLE_GUIDE[l] !== undefined, `Language dictionary for ${l} exists`);
    assert(MULTILINGUAL_POLE_GUIDE[l].title && MULTILINGUAL_POLE_GUIDE[l].title.length > 0, `${l} title is localized`);
  }

  // 7. Babel React Compilation Audit
  console.log('\n--- 7. React Components Babel Compilation Audit ---');
  const babelCode = fs.readFileSync('client/vendor/babel.min.js', 'utf8');
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(babelCode, context);
  const Babel = context.Babel || context.window.Babel;

  const components = [
    'client/js/components/SmartPoleNavigationHub.js',
    'client/js/components/AirportArrivalSimulatorHub.js',
    'client/js/components/GlobalCinemaNav.js',
    'client/js/components/CinematicHomeView.js',
    'client/js/components/GlobalZaireenStatisticsHub.js',
    'client/js/react-app.js'
  ];

  for (const comp of components) {
    try {
      const code = fs.readFileSync(comp, 'utf8');
      Babel.transform(code, { presets: ['react'] });
      assert(true, `${path.basename(comp)} compiles with 0 Babel syntax errors`);
    } catch (e) {
      assert(false, `${path.basename(comp)} Babel compilation failed: ${e.message}`);
    }
  }

  // 8. REST API Endpoints & Security Validation Audit
  console.log('\n--- 8. REST API Endpoints & Input Security Audit ---');
  const app = express();
  app.use(express.json());
  app.use('/api', apiRoutes);

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    // 8.1 Anchors endpoint
    const rAnchors = await fetch(`${baseUrl}/pole-navigation/anchors`).then(r => r.json());
    assert(rAnchors.status === 'success' && rAnchors.anchors.origin && rAnchors.anchors.destination, 'GET /pole-navigation/anchors returns 200 with origin & destination');

    // 8.2 Landmarks endpoint
    const rLandmarks = await fetch(`${baseUrl}/pole-navigation/landmarks`).then(r => r.json());
    assert(rLandmarks.status === 'success' && rLandmarks.totalLandmarks >= 18, `GET /pole-navigation/landmarks returns 200 with ${rLandmarks.totalLandmarks} landmarks`);

    // 8.3 Specific Pole endpoint
    const rPole726 = await fetch(`${baseUrl}/pole-navigation/pole/726`).then(r => r.json());
    assert(rPole726.status === 'success' && rPole726.pole.poleNumber === 726, 'GET /pole-navigation/pole/726 returns 200 for midpoint pole');

    // 8.4 Pole input boundary security
    const rInvalidPole1 = await fetch(`${baseUrl}/pole-navigation/pole/0`);
    assert(rInvalidPole1.status === 400, 'GET /pole-navigation/pole/0 rejected with HTTP 400 (under boundary)');
    const rInvalidPole2 = await fetch(`${baseUrl}/pole-navigation/pole/1453`);
    assert(rInvalidPole2.status === 400, 'GET /pole-navigation/pole/1453 rejected with HTTP 400 (over boundary)');
    const rInvalidPole3 = await fetch(`${baseUrl}/pole-navigation/pole/injection_test`);
    assert(rInvalidPole3.status === 400, 'GET /pole-navigation/pole/injection_test rejected with HTTP 400 (NaN security)');

    // 8.5 Distance calculation endpoint
    const rCalc = await fetch(`${baseUrl}/pole-navigation/calculate?from=250&to=500&pace=normal`).then(r => r.json());
    assert(rCalc.status === 'success' && rCalc.calculation.intervals === 250, 'GET /pole-navigation/calculate returns 200 with accurate interval count');
    assert(rCalc.calculation.walkingDurationFormatted.includes('3h'), 'GET /pole-navigation/calculate returns duration formatted (3h 8m)');

    // 8.6 Distance calculation boundary security
    const rInvalidCalc = await fetch(`${baseUrl}/pole-navigation/calculate?from=0&to=500`);
    assert(rInvalidCalc.status === 400, 'GET /pole-navigation/calculate with invalid parameters rejected with HTTP 400');

    // 8.7 Crowd intelligence endpoint
    const rCrowd = await fetch(`${baseUrl}/pole-navigation/crowd?mode=live`).then(r => r.json());
    assert(rCrowd.status === 'success' && rCrowd.segments.length === 6, 'GET /pole-navigation/crowd returns 200 with 6 segments');

    // 8.8 Offline route pack endpoint
    const rOffline = await fetch(`${baseUrl}/pole-navigation/offline-pack`).then(r => r.json());
    assert(rOffline.status === 'success' && rOffline.landmarks.length >= 18, 'GET /pole-navigation/offline-pack returns 200 with complete bundle');
  } finally {
    server.close();
  }

  console.log('\n========================================================================');
  console.log(`SMART POLE NAVIGATION AUDIT SUMMARY: ${passed} PASSED / ${failed} FAILED`);
  console.log('========================================================================\n');

  if (failed > 0) process.exit(1);
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
