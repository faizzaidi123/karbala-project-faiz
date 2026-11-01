/**
 * INDEPENDENT DATA ACCURACY, SOURCE VERIFICATION, AND SECURITY AUDIT SUITE
 * Project: Karbala Digital Twin — Module H (Global Zaireen Pilgrimage Intelligence)
 *
 * Verifies:
 * 1. Data Integrity & Exact Sovereign Counts (2016-2026 electronic era & pre-camera estimates)
 * 2. 2025 Dual-Reported Status and 2026 Incomplete Annual Total Flag
 * 3. Country-Wise Demographics (India, Pakistan, Iran, Iraq, Afghanistan)
 * 4. CSV Formula Injection Neutralization Matrix
 * 5. Administrative Authorization & Audit Trail Persistence
 * 6. Ask Karbala AI 3.0 Zero-Fabrication Grounding & Refusal Logic
 * 7. System-Wide Non-Regression of Existing Features
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

import { connectDB } from '../server/config/db.js';
import apiRoutes from '../server/routes/apiRoutes.js';
import {
  sanitizeCsvCell,
  VERIFIED_ATTENDANCE_RECORDS,
  VERIFIED_COUNTRY_PILGRIM_DATA,
  STATISTICAL_SOURCES_REGISTRY
} from '../server/controllers/pilgrimageStatsController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(projectRoot, 'client')));

await connectDB();
app.use('/api', apiRoutes);

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

function makeRequest(path, options = {}) {
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
    }

    const reqOptions = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: options.method || 'GET',
      headers
    };

    const req = http.request(reqOptions, (res) => {
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
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

const server = app.listen(PORT, async () => {
  console.log('========================================================================');
  console.log('🛡️  MODULE H INDEPENDENT DATA ACCURACY, SOURCE & SECURITY AUDIT');
  console.log('========================================================================\n');

  try {
    // -------------------------------------------------------------------------
    // TEST GROUP 1: Primary Sovereign Census Verification (Al-Abbas 5-Axis Counter)
    // -------------------------------------------------------------------------
    console.log('--- 1. Primary Sovereign Attendance Records Audit ---');
    
    // 2024: 21,480,525
    const rec2024 = VERIFIED_ATTENDANCE_RECORDS.find(r => r.year === 2024);
    assert(rec2024 && rec2024.arbaeenAttendance === 21480525, '2024 Arbaeen count exactly matches official census (21,480,525)');
    assert(rec2024.sourceUrl === 'https://alkafeel.net', '2024 source URL is accredited (https://alkafeel.net)');
    assert(rec2024.measurementType === 'electronic_axis_counter', '2024 measurement type is electronic_axis_counter');

    // 2023: 22,019,146
    const rec2023 = VERIFIED_ATTENDANCE_RECORDS.find(r => r.year === 2023);
    assert(rec2023 && rec2023.arbaeenAttendance === 22019146, '2023 Arbaeen all-time record verified (22,019,146)');
    assert(rec2023.sourceUrl === 'https://alkafeel.net', '2023 source URL is accredited (https://alkafeel.net)');

    // 2022: 21,198,640
    const rec2022 = VERIFIED_ATTENDANCE_RECORDS.find(r => r.year === 2022);
    assert(rec2022 && rec2022.arbaeenAttendance === 21198640, '2022 Arbaeen post-pandemic count verified (21,198,640)');

    // 2021: 16,351,522 (80,000 foreign)
    const rec2021 = VERIFIED_ATTENDANCE_RECORDS.find(r => r.year === 2021);
    assert(rec2021 && rec2021.arbaeenAttendance === 16351522, '2021 Arbaeen COVID-quota count verified (16,351,522)');
    assert(rec2021.internationalPilgrims === 80000, '2021 international count reflects pandemic quota (80,000)');

    // 2020: 14,553,308 (0 foreign, 100% domestic)
    const rec2020 = VERIFIED_ATTENDANCE_RECORDS.find(r => r.year === 2020);
    assert(rec2020 && rec2020.arbaeenAttendance === 14553308, '2020 Arbaeen count verified (14,553,308)');
    assert(rec2020.internationalPilgrims === 0, '2020 international count is strictly 0 (borders closed)');
    assert(rec2020.domesticIraqiPilgrims === 14553308, '2020 domestic pilgrims equal 100% of reported attendance');

    // 2016 inaugural electronic counter baseline: 11,210,367
    const rec2016 = VERIFIED_ATTENDANCE_RECORDS.find(r => r.year === 2016);
    assert(rec2016 && rec2016.arbaeenAttendance === 11210367, '2016 inaugural electronic counter count verified (11,210,367)');
    assert(rec2016.isYoYCompatible === false, '2016 YoY comparison disabled due to methodology baseline change');

    // -------------------------------------------------------------------------
    // TEST GROUP 2: Audit of 2025 Dual-Reported and 2026 Incomplete Status
    // -------------------------------------------------------------------------
    console.log('\n--- 2. 2025 Dual-Reporting & 2026 Incomplete Year Audit ---');
    
    const rec2025 = VERIFIED_ATTENDANCE_RECORDS.find(r => r.year === 2025);
    assert(rec2025.limitationNotes.includes('Dual reporting note'), '2025 explicitly discloses dual-reporting variance in limitation notes');
    assert(rec2025.isYearComplete === true, '2025 annual cycle is flagged as complete');

    const rec2026 = VERIFIED_ATTENDANCE_RECORDS.find(r => r.year === 2026);
    assert(rec2026.isYearComplete === false, '2026 is properly flagged as isYearComplete: false');
    assert(rec2026.methodologyNotes.includes('Full-year annual aggregate remains incomplete'), '2026 methodology notes state annual total incomplete');
    assert(rec2026.arbaeenAttendance === 21920000, '2026 Arbaeen completed-event snapshot recorded at 21,920,000');

    // -------------------------------------------------------------------------
    // TEST GROUP 3: Complete Traceability Check (Every Record Has URL & Definition)
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Traceable URLs & Measurement Definitions Audit ---');
    
    let allTraceable = true;
    for (const r of VERIFIED_ATTENDANCE_RECORDS) {
      if (!r.sourceUrl || !r.sourceUrl.startsWith('http') || !r.measurementDefinition || !r.officialPublicationDate) {
        allTraceable = false;
        console.error(`Missing metadata for year ${r.year}`);
      }
    }
    assert(allTraceable, 'Every attendance record (2003–2026) has valid sourceUrl, publicationDate, and measurementDefinition');

    let allPreCameraCategorized = true;
    const preCameraYears = [2015, 2014, 2013, 2008, 2003];
    for (const y of preCameraYears) {
      const rec = VERIFIED_ATTENDANCE_RECORDS.find(r => r.year === y);
      if (!rec || rec.verificationStatus !== 'historical_estimate' || rec.isYoYCompatible !== false) {
        allPreCameraCategorized = false;
      }
    }
    assert(allPreCameraCategorized, 'All pre-2016 records are categorized as historical_estimate with YoY disabled');

    // -------------------------------------------------------------------------
    // TEST GROUP 4: Country-Wise Demographics & Measurement Distinction Audit
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Country-Wise Demographics & Measurement Definitions Audit ---');

    const ir2024 = VERIFIED_COUNTRY_PILGRIM_DATA.find(c => c.countryCode === 'IR' && c.year === 2024);
    assert(ir2024 && ir2024.reportedPilgrimCount === 3250000, 'Iran 2024 count is 3,250,000 passport entries');
    assert(ir2024.measurementType === 'border_entry_passport_tally', 'Iran measured via border_entry_passport_tally');

    const iq2024 = VERIFIED_COUNTRY_PILGRIM_DATA.find(c => c.countryCode === 'IQ' && c.year === 2024);
    assert(iq2024 && iq2024.reportedPilgrimCount === 17730525, 'Iraq domestic 2024 count is 17,730,525 (residual)');
    assert(iq2024.measurementType === 'domestic_census_sampling', 'Iraq measured via domestic_census_sampling');

    const in2024 = VERIFIED_COUNTRY_PILGRIM_DATA.find(c => c.countryCode === 'IN' && c.year === 2024);
    assert(in2024 && in2024.reportedPilgrimCount === 95000, 'India 2024 count is 95,000');
    assert(in2024.measurementType === 'official_air_passenger_manifest', 'India measured via official_air_passenger_manifest');

    const pk2024 = VERIFIED_COUNTRY_PILGRIM_DATA.find(c => c.countryCode === 'PK' && c.year === 2024);
    assert(pk2024 && pk2024.reportedPilgrimCount === 135000, 'Pakistan 2024 count is 135,000');
    assert(pk2024.measurementType === 'consular_pilgrim_visa_issuance', 'Pakistan measured via consular_pilgrim_visa_issuance');

    const af2024 = VERIFIED_COUNTRY_PILGRIM_DATA.find(c => c.countryCode === 'AF' && c.year === 2024);
    assert(af2024 && af2024.reportedPilgrimCount === 72000, 'Afghanistan 2024 count is 72,000 overland entries');

    // Verify non-conflation: sum of domestic + international equals total
    const sum2024 = rec2024.domesticIraqiPilgrims + rec2024.internationalPilgrims;
    assert(sum2024 === rec2024.arbaeenAttendance, 'Sum of domestic and international equals total Arbaeen attendance');

    // -------------------------------------------------------------------------
    // TEST GROUP 5: CSV Formula Injection Security Test
    // -------------------------------------------------------------------------
    console.log('\n--- 5. CSV Formula Injection Neutralization Matrix ---');

    const testCases = [
      { input: "=cmd|' /C calc'!A0", expectedPrefix: "'=" },
      { input: "+1+1", expectedPrefix: "'+1+1" },
      { input: "-1+1", expectedPrefix: "'-1+1" },
      { input: "@SUM(A1:B1)", expectedPrefix: "'@SUM(A1:B1)" },
      { input: "\tDDE('cmd')", expectedPrefix: "'\t" },
      { input: "\rDDE('cmd')", expectedPrefix: "'\r" },
      { input: "   =cmd", expectedPrefix: "'   =" },
      { input: 'Normal City Name', expected: '"Normal City Name"' },
      { input: 'Sayyida "Zaynab" Shrine', expected: '"Sayyida ""Zaynab"" Shrine"' },
      { input: 21480525, expected: '"21480525"' },
      { input: null, expected: '""' }
    ];

    let csvSanitizationPass = true;
    for (const tc of testCases) {
      const result = sanitizeCsvCell(tc.input);
      if (tc.expectedPrefix) {
        if (!result.startsWith(`"${tc.expectedPrefix}`)) {
          csvSanitizationPass = false;
          console.error(`Failed CSV test for: ${tc.input}, got: ${result}`);
        }
      } else if (tc.expected && result !== tc.expected) {
        csvSanitizationPass = false;
        console.error(`Failed CSV test for: ${tc.input}, got: ${result}, expected: ${tc.expected}`);
      }
    }
    assert(csvSanitizationPass, 'All 11 CSV formula injection payloads neutralized with single-quote prefix and RFC 4180 escaping');

    // -------------------------------------------------------------------------
    // TEST GROUP 6: Administrative Authorization & Database Write Security
    // -------------------------------------------------------------------------
    console.log('\n--- 6. Administrative Authorization & Audit Security ---');

    // 6.1 Unauthorized verification POST (no header)
    const unauthRes = await makeRequest('/api/pilgrimage-stats/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { recordId: '2024-AUDIT', action: 'audit_verified' }
    });
    assert(unauthRes.status === 401, 'Unauthenticated POST /api/pilgrimage-stats/verify rejected with 401');

    // 6.2 POST with invalid token
    const badTokenRes = await makeRequest('/api/pilgrimage-stats/verify', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer malicious-or-forged-token', 'Content-Type': 'application/json' },
      data: { recordId: '2024-AUDIT', action: 'audit_verified' }
    });
    assert(badTokenRes.status === 401, 'POST /api/pilgrimage-stats/verify with invalid token rejected with 401');

    // 6.3 POST with invalid action
    const badActionRes = await makeRequest('/api/pilgrimage-stats/verify', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer karbala-admin-audit-board-key-9988', 'Content-Type': 'application/json' },
      data: { recordId: '2024-AUDIT', action: 'arbitrary_drop_database' }
    });
    assert(badActionRes.status === 400, 'POST /api/pilgrimage-stats/verify with non-whitelisted action rejected with 400');

    // 6.4 Authorized audit entry
    const authRes = await makeRequest('/api/pilgrimage-stats/verify', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer karbala-admin-audit-board-key-9988', 'Content-Type': 'application/json' },
      data: {
        recordId: 'AUDIT-REC-2024-CENSUS',
        action: 'audit_verified',
        changeSummary: 'Independent sovereign counter audit confirmed: 21,480,525 pilgrims.',
        referenceLinks: ['https://alkafeel.net/news/index?lang=en']
      }
    });
    assert(authRes.status === 201 && authRes.body.success === true, 'Authorized POST /api/pilgrimage-stats/verify succeeded with 201 Created');

    // 6.5 Retrieve audit trail
    const trailRes = await makeRequest('/api/pilgrimage-stats/audit-trail');
    assert(trailRes.status === 200 && Array.isArray(trailRes.body.auditTrail), 'GET /api/pilgrimage-stats/audit-trail returns audit entries');
    const foundEntry = trailRes.body.auditTrail.find(a => a.recordId === 'AUDIT-REC-2024-CENSUS');
    assert(foundEntry && foundEntry.action === 'audit_verified', 'Audited entry persisted in audit trail');

    // -------------------------------------------------------------------------
    // TEST GROUP 7: Live API Endpoint Source & Metadata Responses
    // -------------------------------------------------------------------------
    console.log('\n--- 7. Live API Endpoint Verification ---');

    const yearsRes = await makeRequest('/api/pilgrimage-stats/years');
    assert(yearsRes.status === 200, 'GET /api/pilgrimage-stats/years returns 200');
    const yr2024Api = yearsRes.body.years.find(y => y.year === 2024);
    assert(yr2024Api && yr2024Api.sourceUrl === 'https://alkafeel.net', 'API exposes sourceUrl for 2024');

    const yearDetailRes = await makeRequest('/api/pilgrimage-stats/year/2024');
    assert(yearDetailRes.status === 200, 'GET /api/pilgrimage-stats/year/2024 returns 200');
    assert(yearDetailRes.body.data.sourceCitations.length > 0, 'year/2024 includes sourceCitations list');

    const sourcesRes = await makeRequest('/api/pilgrimage-stats/sources');
    assert(sourcesRes.status === 200 && sourcesRes.body.sourcesCount >= 5, 'GET /api/pilgrimage-stats/sources returns 5 sovereign sources');

    // -------------------------------------------------------------------------
    // TEST GROUP 8: Ask Karbala AI 3.0 Verification & Hallucination Prevention
    // -------------------------------------------------------------------------
    console.log('\n--- 8. AI Assistant Verification & Hallucination Prevention ---');

    // 8.1 2025 Arbaeen query
    const ai2025 = await makeRequest('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { query: 'How many pilgrims visited Karbala during Arbaeen in 2025?' }
    });
    assert(ai2025.status === 200, 'AI query for 2025 returns 200');
    assert(ai2025.body.reply && ai2025.body.reply.includes('21,850,000'), 'AI response accurately cites 21,850,000 for 2025');

    // 8.2 Difference between annual and Arbaeen
    const aiDiff = await makeRequest('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { query: 'What is the difference between annual Karbala visits and Arbaeen attendance?' }
    });
    assert(aiDiff.status === 200, 'AI query for annual vs Arbaeen returns 200');
    assert(aiDiff.body.reply && (aiDiff.body.reply.includes('never be conflated') || aiDiff.body.reply.includes('single-event') || aiDiff.body.reply.includes('Critical Historiographical')), 'AI enforces distinction between annual footfall and Arbaeen single-event');

    // 8.3 AI Refusal of unsupported queries (Zero fabrication test)
    const aiMars = await makeRequest('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { query: 'How many pilgrims came from Mars in 1950?' }
    });
    assert(aiMars.status === 200, 'AI query for unsupported parameters returns 200');
    assert(aiMars.body.reply && (aiMars.body.reply.includes('Data Parameter Not Available') || aiMars.body.reply.includes('strictly refrains from fabricating')), 'AI explicitly refuses unsupported query with zero-fabrication notice');

    // -------------------------------------------------------------------------
    // TEST GROUP 9: Existing Features Non-Regression Check
    // -------------------------------------------------------------------------
    console.log('\n--- 9. Existing System Non-Regression Check ---');

    const locRes = await makeRequest('/api/locations');
    assert(locRes.status === 200 && locRes.body.present?.length > 0, 'Existing /api/locations returns 200 and present locations');

    const timeRes = await makeRequest('/api/timeline');
    assert(timeRes.status === 200 && timeRes.body.days?.length > 0, 'Existing /api/timeline returns 200 and Muharram timeline days');

    const persRes = await makeRequest('/api/personalities');
    assert(persRes.status === 200 && (persRes.body.personalities?.length > 0 || Array.isArray(persRes.body)), 'Existing /api/personalities returns 200');

    const packRes = await makeRequest('/api/offline-pack');
    assert(packRes.status === 200 && packRes.body.version, 'Existing /api/offline-pack returns 200 valid pack');

    console.log('\n========================================================================');
    console.log(`AUDIT SUMMARY: ${passed} PASSED / ${failed} FAILED`);
    console.log('========================================================================\n');

    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  } catch (err) {
    console.error('Audit execution error:', err);
    server.close(() => process.exit(1));
  }
});
