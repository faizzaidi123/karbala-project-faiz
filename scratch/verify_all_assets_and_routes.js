/**
 * SYSTEM-WIDE VERIFICATION & HEALTH CHECK
 * Tests:
 * 1. Physical existence of all client assets referenced in client/index.html
 * 2. Babel compilation of all client React components
 * 3. Every single REST API endpoint registered in server/routes/apiRoutes.js
 * 4. Error handling and status codes
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import vm from 'vm';
import http from 'http';
import { fileURLToPath } from 'url';

import { connectDB } from '../server/config/db.js';
import apiRoutes from '../server/routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

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

console.log('========================================================================');
console.log('🔍 FULL PROJECT COMPREHENSIVE SYSTEM VERIFICATION');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// STEP 1: Verify all files linked in client/index.html
// -----------------------------------------------------------------------------
console.log('--- 1. Client index.html Assets Verification ---');
const indexHtml = fs.readFileSync(path.join(projectRoot, 'client', 'index.html'), 'utf8');
const assetRegex = /(?:src|href)="([^"]+)"/g;
let match;
const localAssets = [];

while ((match = assetRegex.exec(indexHtml)) !== null) {
  const urlPath = match[1].split('?')[0];
  if (!urlPath.startsWith('http')) {
    localAssets.push(urlPath);
  }
}

for (const asset of localAssets) {
  const fullPath = path.join(projectRoot, 'client', asset);
  const exists = fs.existsSync(fullPath);
  const size = exists ? (fs.statSync(fullPath).size / 1024).toFixed(1) : 0;
  assert(exists, `Asset ${asset} exists on disk (${size} KB)`);
}

// -----------------------------------------------------------------------------
// STEP 2: Babel Compilation of all React Components
// -----------------------------------------------------------------------------
console.log('\n--- 2. React Components Babel Compilation ---');
const babelCode = fs.readFileSync(path.join(projectRoot, 'client', 'vendor', 'babel.min.js'), 'utf8');
const vmContext = { window: {}, console };
vm.createContext(vmContext);
vm.runInContext(babelCode, vmContext);
const Babel = vmContext.Babel || vmContext.window.Babel;

const reactFiles = [
  'client/js/react-app.js',
  'client/js/components/CinematicHomeView.js',
  'client/js/components/DedicatedViews.js',
  'client/js/components/GlobalCinemaNav.js',
  'client/js/components/GlobalZaireenStatisticsHub.js'
];

for (const rf of reactFiles) {
  try {
    const code = fs.readFileSync(path.join(projectRoot, rf), 'utf8');
    const result = Babel.transform(code, { presets: ['react'] });
    assert(result.code && result.code.length > 0, `Component ${rf} compiles successfully (${(result.code.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    assert(false, `Component ${rf} compilation failed: ${err.message}`);
  }
}

// -----------------------------------------------------------------------------
// STEP 3: Live Express Server & All API Endpoints Verification
// -----------------------------------------------------------------------------
console.log('\n--- 3. Comprehensive REST API Endpoints Verification ---');

const app = express();
const PORT = 3006;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(projectRoot, 'client')));

await connectDB();
app.use('/api', apiRoutes);

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const postData = options.data
      ? (typeof options.data === 'string' ? options.data : JSON.stringify(options.data))
      : null;

    const headers = {
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    if (postData && !headers['Content-Length']) {
      headers['Content-Length'] = Buffer.byteLength(postData);
      if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: options.method || 'GET',
      headers
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch (e) {
          json = body;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

const server = app.listen(PORT, async () => {
  try {
    // 3.1 Core System & Location Endpoints
    const health = await request('/api/health');
    assert(health.status === 200 && health.body.status === 'online', 'GET /api/health is online');

    const locations = await request('/api/locations');
    assert(locations.status === 200 && locations.body.present?.length > 0, 'GET /api/locations returns present locations');

    const loc1 = await request('/api/locations/shrine_hussain');
    assert(loc1.status === 200 && loc1.body.name, 'GET /api/locations/shrine_hussain returns location details');

    // 3.2 Timeline & Heritage Personalities
    const timeline = await request('/api/timeline');
    assert(timeline.status === 200 && timeline.body.days?.length === 9, 'GET /api/timeline returns Muharram days (2–10 Muharram)');

    const personalities = await request('/api/personalities');
    assert(personalities.status === 200 && personalities.body.personalities?.length > 0, 'GET /api/personalities returns historical personalities');

    const certainty = await request('/api/certainty');
    assert(certainty.status === 200, 'GET /api/certainty returns 200');

    // 3.3 Bookmarks
    const bookmarks = await request('/api/bookmarks');
    assert(bookmarks.status === 200, 'GET /api/bookmarks returns 200');

    // 3.4 Gallery
    const gallery = await request('/api/gallery');
    assert(gallery.status === 200 && gallery.body.total > 0, `GET /api/gallery returns image library (${gallery.body.total} curated photos)`);

    // 3.5 Pilgrim Services & Smart Ziyarat
    const pilgrimServices = await request('/api/pilgrim-services');
    assert(pilgrimServices.status === 200 && pilgrimServices.body.facilities?.length > 0, 'GET /api/pilgrim-services returns services list');

    const shrineGates = await request('/api/shrine-gates');
    assert(shrineGates.status === 200 && shrineGates.body.gates?.length > 0, 'GET /api/shrine-gates returns gates list');

    const ziyaratPlans = await request('/api/ziyarat-plans');
    assert(ziyaratPlans.status === 200 && ziyaratPlans.body.plans?.length > 0, 'GET /api/ziyarat-plans returns curated plans');

    const destinations = await request('/api/destinations');
    assert(destinations.status === 200 && destinations.body.destinations?.length > 0, 'GET /api/destinations returns navigation destinations');

    const emergency = await request('/api/emergency-contacts');
    assert(emergency.status === 200 && emergency.body.contacts?.length > 0, 'GET /api/emergency-contacts returns emergency contacts');

    const route = await request('/api/route?fromLat=32.61603&fromLng=44.03248&toLat=32.61858&toLng=44.03561');
    assert(route.status === 200 && route.body.route.totalDistanceMeters > 0, `GET /api/route returns pedestrian routing between shrines (${route.body.route.totalDistanceMeters}m, ${route.body.route.durationMinutes} min walk)`);

    const offlinePack = await request('/api/offline-pack');
    assert(offlinePack.status === 200 && offlinePack.body.destinations?.length > 0, 'GET /api/offline-pack returns offline dataset');

    // 3.6 AI Camera Translator
    const translatorSamples = await request('/api/translator/samples');
    assert(translatorSamples.status === 200 && translatorSamples.body.samples?.length > 0, 'GET /api/translator/samples returns signage samples');

    const translation = await request('/api/translator/translate', {
      method: 'POST',
      data: { text: 'باب القبلة', targetLanguage: 'en' }
    });
    assert(translation.status === 200 && translation.body.translatedText, 'POST /api/translator/translate translates Arabic signage to English');

    // 3.7 Landmark Recognition
    const landmarks = await request('/api/landmarks');
    assert(landmarks.status === 200 && landmarks.body.landmarks?.length > 0, 'GET /api/landmarks returns landmarks catalog');

    const landmarkBenchmark = await request('/api/landmarks/benchmark');
    assert(landmarkBenchmark.status === 200 && landmarkBenchmark.body.report.top1AccuracyPercent > 0, 'GET /api/landmarks/benchmark returns benchmark statistics');

    // 3.8 Living Heritage Encyclopedia
    const encPersonalities = await request('/api/encyclopedia/personalities');
    assert(encPersonalities.status === 200 && encPersonalities.body.personalities?.length > 0, 'GET /api/encyclopedia/personalities returns encyclopedia personalities');

    const encFamilyTree = await request('/api/encyclopedia/family-tree');
    assert(encFamilyTree.status === 200 && encFamilyTree.body.nodes?.length > 0, 'GET /api/encyclopedia/family-tree returns family tree graph nodes');

    const encSources = await request('/api/encyclopedia/sources');
    assert(encSources.status === 200 && encSources.body.sources?.length > 0, 'GET /api/encyclopedia/sources returns classical historiographical sources');

    const encTimeline = await request('/api/encyclopedia/timeline');
    assert(encTimeline.status === 200 && encTimeline.body.timeline?.length > 0, 'GET /api/encyclopedia/timeline returns encyclopedia timeline');

    const encGraph = await request('/api/encyclopedia/knowledge-graph');
    assert(encGraph.status === 200 && encGraph.body.knowledgeGraph.personalitiesCount > 0, 'GET /api/encyclopedia/knowledge-graph returns interconnected knowledge graph');

    // 3.9 Ask Karbala AI 3.0
    const aiStarters = await request('/api/ai/starters');
    assert(aiStarters.status === 200 && aiStarters.body.starters?.length > 0, 'GET /api/ai/starters returns conversation starters');

    const aiChat = await request('/api/ai/chat', {
      method: 'POST',
      data: { query: 'Where is Bab al-Qibla?' }
    });
    assert(aiChat.status === 200 && aiChat.body.reply, 'POST /api/ai/chat responds to sacred navigation inquiries');

    // 3.10 Module H: Global Zaireen Statistics & Pilgrimage Intelligence
    const statsOverview = await request('/api/pilgrimage-stats/overview');
    assert(statsOverview.status === 200 && statsOverview.body.overview.latestVerifiedArbaeen, 'GET /api/pilgrimage-stats/overview returns high-level metrics');

    const statsYears = await request('/api/pilgrimage-stats/years');
    assert(statsYears.status === 200 && statsYears.body.count === 16, 'GET /api/pilgrimage-stats/years returns 16 historical years');

    const statsYear2024 = await request('/api/pilgrimage-stats/year/2024');
    assert(statsYear2024.status === 200 && statsYear2024.body.data.attendance.arbaeenAttendance === 21480525, 'GET /api/pilgrimage-stats/year/2024 returns verified 21,480,525 count');

    const statsCountries = await request('/api/pilgrimage-stats/countries');
    assert(statsCountries.status === 200 && statsCountries.body.countries?.length > 0, 'GET /api/pilgrimage-stats/countries returns country demographics');

    const statsTrends = await request('/api/pilgrimage-stats/trends');
    assert(statsTrends.status === 200 && statsTrends.body.baselineYear === 2016, 'GET /api/pilgrimage-stats/trends returns 2016-2026 electronic counter series');

    const statsArbaeen = await request('/api/pilgrimage-stats/arbaeen');
    assert(statsArbaeen.status === 200 && statsArbaeen.body.borderDistributionBreakdown2024?.length === 6, 'GET /api/pilgrimage-stats/arbaeen returns 6 border port distributions');

    const statsSources = await request('/api/pilgrimage-stats/sources');
    assert(statsSources.status === 200 && statsSources.body.sourcesCount >= 5, 'GET /api/pilgrimage-stats/sources returns sovereign source registries');

    const statsCompare = await request('/api/pilgrimage-stats/compare?year1=2024&year2=2023');
    assert(statsCompare.status === 200 && statsCompare.body.comparison.areMethodologiesComparable === true, 'GET /api/pilgrimage-stats/compare correctly identifies homogenous methodology');

    const statsTimeline = await request('/api/pilgrimage-stats/timeline');
    assert(statsTimeline.status === 200 && statsTimeline.body.milestones?.length > 0, 'GET /api/pilgrimage-stats/timeline returns historical milestones');

    const statsCsvAnnual = await request('/api/pilgrimage-stats/export/csv?format=annual');
    assert(statsCsvAnnual.status === 200 && statsCsvAnnual.headers['content-type'].includes('text/csv'), 'GET /api/pilgrimage-stats/export/csv returns valid CSV dataset');

    const statsAuditTrail = await request('/api/pilgrimage-stats/audit-trail');
    assert(statsAuditTrail.status === 200 && Array.isArray(statsAuditTrail.body.auditTrail), 'GET /api/pilgrimage-stats/audit-trail returns audit records');

    console.log('\n========================================================================');
    console.log(`TOTAL SYSTEM RESULTS: ${passed} PASSED / ${failed} FAILED`);
    console.log('========================================================================\n');

    server.close(() => process.exit(failed > 0 ? 1 : 0));
  } catch (err) {
    console.error('Test run failed:', err);
    server.close(() => process.exit(1));
  }
});
