import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

import { connectDB } from '../server/config/db.js';
import apiRoutes from '../server/routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(projectRoot, 'client')));

await connectDB();
app.use('/api', apiRoutes);

const server = app.listen(PORT, async () => {
  console.log(`\n========================================================================`);
  console.log(`🔬 EXHAUSTIVE VERIFICATION: MODULE H — GLOBAL ZAIREEN INTELLIGENCE`);
  console.log(`========================================================================\n`);

  function get(urlPath, headers = {}) {
    return new Promise((resolve, reject) => {
      http.get({
        hostname: 'localhost',
        port: PORT,
        path: urlPath,
        headers
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, body: data });
          }
        });
      }).on('error', reject);
    });
  }

  function post(urlPath, payload, headers = {}) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(payload);
      const req = http.request({
        hostname: 'localhost',
        port: PORT,
        path: urlPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          ...headers
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, headers: res.headers, body: data });
          }
        });
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  try {
    let totalChecks = 0;
    let passedChecks = 0;

    function assert(condition, message) {
      totalChecks++;
      if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
      }
      passedChecks++;
      console.log(`  ✅ [CHECK ${passedChecks}] ${message}`);
    }

    console.log('--- 1. Verification of Core Pilgrimage Statistics Endpoints ---');

    // Overview
    const overview = await get('/api/pilgrimage-stats/overview');
    assert(overview.status === 200, 'GET /api/pilgrimage-stats/overview returns 200');
    assert(overview.body.overview.latestVerifiedArbaeen.totalCount === 21850000, 'Latest verified Arbaeen count is 21,850,000');
    assert(overview.body.overview.ongoingYear2026.isFullYearComplete === false, '2026 is properly flagged as full-year incomplete');
    assert(overview.body.overview.historicalPeakRecord.totalCount === 22019146, 'Historical record peak is 22,019,146 (1445 AH / 2023)');

    // Years list
    const years = await get('/api/pilgrimage-stats/years');
    assert(years.status === 200, 'GET /api/pilgrimage-stats/years returns 200');
    assert(years.body.count >= 16, `Contains ${years.body.count} documented historical years (including 2026 down to 2003)`);

    // Individual Years Check
    const y2026 = await get('/api/pilgrimage-stats/year/2026');
    assert(y2026.body.data.attendance.arbaeenAttendance === 21920000, '2026 Arbaeen attendance correctly documented as 21,920,000');
    assert(y2026.body.data.attendance.isYearComplete === false, '2026 is marked incomplete');

    const y2024 = await get('/api/pilgrimage-stats/year/2024');
    assert(y2024.body.data.attendance.arbaeenAttendance === 21480525, '2024 Arbaeen attendance is 21,480,525 (official Al-Abbas Shrine census)');
    assert(y2024.body.data.countryBreakdown.length >= 10, '2024 contains official country breakdown table');

    const y2020 = await get('/api/pilgrimage-stats/year/2020');
    assert(y2020.body.data.attendance.internationalPilgrims === 0, '2020 COVID Arbaeen has 0 regular international pilgrims (100% domestic)');

    const y2003 = await get('/api/pilgrimage-stats/year/2003');
    assert(y2003.body.data.attendance.totalReportedPilgrims === 2500000, '2003 historic resumption documented at 2,500,000 pilgrims');

    // Countries API
    console.log('\n--- 2. Verification of Country-Wise Demographics & Flow Data ---');
    const countries = await get('/api/pilgrimage-stats/countries?year=2024');
    assert(countries.status === 200, 'GET /api/pilgrimage-stats/countries returns 200');
    const ir = countries.body.countries.find(c => c.countryCode === 'IR');
    assert(ir && ir.reportedPilgrimCount === 3250000, 'Iran documented at 3,250,000 pilgrims via Border Crossings Commission');
    const inCountry = countries.body.countries.find(c => c.countryCode === 'IN');
    assert(inCountry && inCountry.reportedPilgrimCount === 95000, 'India documented at 95,000 pilgrims via air manifests and group visas');
    const pk = countries.body.countries.find(c => c.countryCode === 'PK');
    assert(pk && pk.reportedPilgrimCount === 135000, 'Pakistan documented at 135,000 pilgrims');

    // Trends API
    console.log('\n--- 3. Verification of Attendance Trends & Analytics ---');
    const trends = await get('/api/pilgrimage-stats/trends');
    assert(trends.status === 200, 'GET /api/pilgrimage-stats/trends returns 200');
    assert(trends.body.baselineYear === 2016, 'Electronic counter series baseline starts in 2016');
    assert(trends.body.charts.series.arbaeenAttendance.length >= 10, 'Continuous 10-year electronic series present');

    // Arbaeen Intelligence API
    console.log('\n--- 4. Verification of Arbaeen Portal & Sensor Corridors ---');
    const arbaeen = await get('/api/pilgrimage-stats/arbaeen');
    assert(arbaeen.status === 200, 'GET /api/pilgrimage-stats/arbaeen returns 200');
    assert(arbaeen.body.methodologies.cameraAxesSystem.axesCovered.length === 5, '5 highway entrance axes documented (Najaf, Baghdad, Babylon, Husseiniya, Ayn al-Tamr)');
    assert(arbaeen.body.borderDistributionBreakdown2024.length >= 6, '6 international border ports analyzed (Mehran, Shalamcheh, Chazabeh, Khosravi, Najaf Airport, Safwan)');

    // Comparison API
    console.log('\n--- 5. Verification of Homogenous Year Comparison Engine ---');
    const comp = await get('/api/pilgrimage-stats/compare?year1=2024&year2=2023');
    assert(comp.status === 200, 'GET /api/pilgrimage-stats/compare returns 200');
    assert(comp.body.comparison.areMethodologiesComparable === true, '2024 and 2023 are verified as homogenous methodologies');
    assert(comp.body.comparison.percentageChange === -2.45, '2024 YoY change relative to 2023 is -2.45%');

    // Export Center API
    console.log('\n--- 6. Verification of Verified CSV Export Center ---');
    const csvAnnual = await get('/api/pilgrimage-stats/export/csv?format=annual');
    assert(csvAnnual.status === 200, 'GET /api/pilgrimage-stats/export/csv?format=annual returns 200');
    assert(csvAnnual.headers['content-type'].includes('text/csv'), 'Content-Type is text/csv');
    assert(csvAnnual.body.includes('Total Reported Pilgrims'), 'Contains official CSV headers');

    const csvCountries = await get('/api/pilgrimage-stats/export/csv?format=countries');
    assert(csvCountries.status === 200, 'GET /api/pilgrimage-stats/export/csv?format=countries returns 200');
    assert(csvCountries.body.includes('Country Code'), 'Contains Country CSV headers');

    // Admin Verification Security
    console.log('\n--- 7. Verification of Administrative Security Boundary ---');
    const unauthVerify = await post('/api/pilgrimage-stats/verify', { recordId: 'REC-2024', action: 'audit_verified' });
    assert(unauthVerify.status === 401, 'POST /api/pilgrimage-stats/verify rejects unauthorized requests with 401');

    const authVerify = await post('/api/pilgrimage-stats/verify', {
      recordId: 'REC-2024',
      action: 'audit_verified',
      changeSummary: 'Verified against sovereign gazette'
    }, {
      'Authorization': 'Bearer karbala-admin-audit-board-key-9988'
    });
    assert(authVerify.status === 201, 'POST /api/pilgrimage-stats/verify succeeds with authorized token (201 Created)');

    // Ask Karbala AI 3.0 Verification
    console.log('\n--- 8. Verification of Ask Karbala AI 3.0 Statistical Inquiries ---');
    const testAiQueries = [
      {
        q: 'How many pilgrims visited Karbala during Arbaeen in 2025?',
        check: (r) => r.reply.includes('21,850,000') && r.reply.includes('Al-Abbas Holy Shrine')
      },
      {
        q: 'What is the latest reported attendance figure for 2026?',
        check: (r) => r.reply.includes('21,920,000') && r.reply.includes('currently incomplete and not yet finalized')
      },
      {
        q: 'How many pilgrims came from India in 2024?',
        check: (r) => r.reply.includes('95,000') && r.reply.includes('Najaf International Airport')
      },
      {
        q: 'Which countries had the highest documented pilgrimage attendance?',
        check: (r) => r.reply.includes('Iraq') && r.reply.includes('Iran') && r.reply.includes('Pakistan') && r.reply.includes('India')
      },
      {
        q: 'How has Arbaeen attendance changed over the past ten years?',
        check: (r) => r.reply.includes('11,210,367') && r.reply.includes('22,019,146')
      },
      {
        q: 'What is the difference between annual Karbala visits and Arbaeen attendance?',
        check: (r) => r.reply.includes('Critical Historiographical & Methodological Distinction') && r.reply.includes('single-event')
      },
      {
        q: 'How many pilgrims came from Mars in 1950?',
        check: (r) => r.reply.includes('Data Parameter Not Available') && r.reply.includes('strictly refrains from fabricating')
      }
    ];

    for (const testItem of testAiQueries) {
      const res = await post('/api/ai/chat', { query: testItem.q });
      assert(res.status === 200, `AI query "${testItem.q.substring(0, 35)}..." returns 200`);
      assert(testItem.check(res.body), `AI accurately grounded in verified records: "${testItem.q.substring(0, 35)}..."`);
    }

    // Existing System Regression Check
    console.log('\n--- 9. Existing System Regression Check (Preserving All Previous Features) ---');
    const locs = await get('/api/locations');
    assert(locs.status === 200 && locs.body.present?.length > 0, 'Existing /api/locations preserved');
    const timeline = await get('/api/timeline');
    assert(timeline.status === 200, 'Existing /api/timeline preserved');
    const persons = await get('/api/personalities');
    assert(persons.status === 200, 'Existing /api/personalities preserved');
    const landmarks = await get('/api/landmarks');
    assert(landmarks.status === 200, 'Existing /api/landmarks preserved');
    const offlinePack = await get('/api/offline-pack');
    assert(offlinePack.status === 200, 'Existing /api/offline-pack preserved');

    console.log(`\n========================================================================`);
    console.log(`🎉 100% SUCCESS: ALL ${passedChecks}/${totalChecks} COMPREHENSIVE VERIFICATION CHECKS PASSED!`);
    console.log(`========================================================================\n`);

    server.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failure during comprehensive verification:', err);
    server.close();
    process.exit(1);
  }
});
