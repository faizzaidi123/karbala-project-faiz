import fs from 'fs';
import path from 'path';
import vm from 'vm';
import express from 'express';
import apiRoutes from '../server/routes/apiRoutes.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n================================================================');
  console.log('PHASE 1 ADD-ON — SMART AIRPORT ARRIVAL & ZAIREEN JOURNEY AUDIT');
  console.log('================================================================\n');

  // Test 1: Verify Manifest
  console.log('--- 1. Visual Manifest Verification ---');
  const manifestPath = 'client/assets/zaireen_journey_manifest.json';
  assert(fs.existsSync(manifestPath), `Manifest exists at ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(Array.isArray(manifest) && manifest.length >= 26, `Manifest contains ${manifest.length} registered visual assets`);

  // Test 2: Verify All 27 Assets on Disk
  console.log('\n--- 2. On-Disk Visual Asset Integrity ---');
  let missingAssets = 0;
  let emptyAssets = 0;
  for (const item of manifest) {
    const assetPath = path.join('client', item.localPath);
    if (!fs.existsSync(assetPath)) {
      console.error(`    Missing asset: ${assetPath}`);
      missingAssets++;
    } else {
      const size = fs.statSync(assetPath).size;
      if (size < 500) {
        console.error(`    Asset too small (<500B): ${assetPath}`);
        emptyAssets++;
      }
    }
  }
  assert(missingAssets === 0, `All ${manifest.length} assets exist on disk (0 missing)`);
  assert(emptyAssets === 0, `All ${manifest.length} assets are substantial in size (>500B)`);

  // Test 3: Sovereign Airport Integrity & Non-Operational Status of Karbala Airport
  console.log('\n--- 3. Sovereign Airport Integrity & Zero-Hallucination Audit ---');
  const kibAsset = manifest.find(m => m.id === 'airport_karbala_kib');
  assert(kibAsset !== undefined, 'Karbala International Airport asset is indexed in manifest');
  assert(kibAsset.badgeText.includes('NON-OPERATIONAL') || kibAsset.badgeText.includes('UNDER CONSTRUCTION'), 'Karbala Airport is explicitly flagged as NON-OPERATIONAL / UNDER CONSTRUCTION');

  const { AIRPORTS_DATA, ARRIVAL_STEPS, TRANSPORT_MODES, HOTELS_DATA, HOLY_SHRINES_DATA, OFFLINE_PACK_DATA } = await import('../client/js/data/zaireenJourneyData.js');
  const kibData = AIRPORTS_DATA.find(a => a.id === 'kib');
  assert(kibData.status === 'NON_OPERATIONAL', 'Karbala Airport status is strictly NON_OPERATIONAL');
  assert(kibData.statusBadge.includes('UNDER CONSTRUCTION'), 'Karbala Airport statusBadge warns users about construction');

  // Test 4: 10-Stage Arrival Simulator Steps Verification
  console.log('\n--- 4. 10-Stage Arrival Simulator Verification ---');
  assert(ARRIVAL_STEPS.length === 10, `Arrival Simulator has exactly 10 sequential stages (found: ${ARRIVAL_STEPS.length})`);
  const stepTitles = ARRIVAL_STEPS.map(s => s.title);
  assert(stepTitles.some(t => t.includes('Landing')), 'Stage 1 includes Aircraft Landing');
  assert(stepTitles.some(t => t.includes('Passport') || t.includes('Immigration')), 'Stage 2 includes Immigration & Passport Control');
  assert(stepTitles.some(t => t.includes('Baggage')), 'Stage 3 includes Baggage Carousel');
  assert(stepTitles.some(t => t.includes('SIM') || t.includes('Telecommunications')), 'Stage 4 includes SIM & Mobile Connectivity');
  assert(stepTitles.some(t => t.includes('Currency')), 'Stage 5 includes Currency Exchange (IQD)');
  assert(stepTitles.some(t => t.includes('Transport')), 'Stage 6 includes Regulated Ground Transport');
  assert(stepTitles.some(t => t.includes('Hotel')), 'Stage 7 includes Hotel Check-In');
  assert(stepTitles.some(t => t.includes('Haramayn') || t.includes('Shrine')), 'Stage 8 includes Bayn al-Haramayn Approach');
  assert(stepTitles.some(t => t.includes('Accessibility')), 'Stage 9 includes Accessibility & Electric Carts');
  assert(stepTitles.some(t => t.includes('Emergency')), 'Stage 10 includes 24/7 Astan Guidance & Emergency Hotlines');

  // Test 5: Holy Shrines of Iraq Architecture Verification
  console.log('\n--- 5. Holy Shrines of Iraq Architectural Accuracy ---');
  assert(HOLY_SHRINES_DATA.length >= 5, `Includes 5 primary holy shrines of Iraq (found: ${HOLY_SHRINES_DATA.length})`);
  const shrineIds = HOLY_SHRINES_DATA.map(s => s.id);
  assert(shrineIds.includes('imam_hussain'), 'Includes Holy Shrine of Imam Hussain (Karbala)');
  assert(shrineIds.includes('al_abbas'), 'Includes Holy Shrine of Al-Abbas (Karbala)');
  assert(shrineIds.includes('imam_ali'), 'Includes Holy Shrine of Imam Ali (Najaf)');
  assert(shrineIds.includes('al_kadhimayn'), 'Includes Holy Shrine of Al-Kadhimayn (Baghdad)');
  assert(shrineIds.includes('al_askari'), 'Includes Holy Shrine of Al-Askari (Samarra)');

  // Test 6: Offline Arrival Pack Resources Verification
  console.log('\n--- 6. Offline Travel Pack & Emergency Directory ---');
  assert(OFFLINE_PACK_DATA.checklists.length >= 10, `Checklist contains ${OFFLINE_PACK_DATA.checklists.length} essential items`);
  assert(OFFLINE_PACK_DATA.phrases.length >= 8, `Phrasebook contains ${OFFLINE_PACK_DATA.phrases.length} practical Arabic phrases`);
  assert(OFFLINE_PACK_DATA.emergencyContacts.some(c => c.number === '122'), 'Emergency directory includes National Ambulance 122');
  assert(OFFLINE_PACK_DATA.emergencyContacts.some(c => c.number === '104'), 'Emergency directory includes National Police 104');
  assert(OFFLINE_PACK_DATA.currencyRates.currencies.length >= 5, 'Currency converter includes 5+ foreign currencies to IQD');

  // Test 7: Babel React Component Syntax Verification
  console.log('\n--- 7. Babel Compilation & Syntax Verification ---');
  const babelCode = fs.readFileSync('client/vendor/babel.min.js', 'utf8');
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(babelCode, context);
  const Babel = context.Babel || context.window.Babel;

  const componentsToTest = [
    'client/js/components/AirportArrivalSimulatorHub.js',
    'client/js/components/GlobalCinemaNav.js',
    'client/js/components/CinematicHomeView.js',
    'client/js/components/GlobalZaireenStatisticsHub.js',
    'client/js/react-app.js'
  ];

  for (const compPath of componentsToTest) {
    try {
      const code = fs.readFileSync(compPath, 'utf8');
      Babel.transform(code, { presets: ['react'] });
      assert(true, `${path.basename(compPath)} passes Babel compilation (0 syntax errors)`);
    } catch (e) {
      assert(false, `${path.basename(compPath)} Babel error: ${e.message}`);
    }
  }

  // Test 8: Backend API Endpoints Verification
  console.log('\n--- 8. REST API Integration Endpoints ---');
  const app = express();
  app.use(express.json());
  app.use('/api', apiRoutes);

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    const endpoints = [
      { path: '/zaireen-journey/manifest', check: d => d.status === 'success' && d.totalAssets >= 26 },
      { path: '/zaireen-journey/airports', check: d => d.status === 'success' && d.airports.length === 4 },
      { path: '/zaireen-journey/steps', check: d => d.status === 'success' && d.totalSteps === 10 },
      { path: '/zaireen-journey/shrines', check: d => d.status === 'success' && d.totalShrines === 5 },
      { path: '/zaireen-journey/offline-pack', check: d => d.status === 'success' && d.offlineReady === true }
    ];

    for (const ep of endpoints) {
      const res = await fetch(`${baseUrl}${ep.path}`);
      const data = await res.json();
      assert(res.status === 200 && ep.check(data), `GET ${ep.path} returns HTTP 200 with valid data structure`);
    }
  } finally {
    server.close();
  }

  console.log('\n================================================================');
  console.log(`PHASE 1 ADD-ON TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
