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
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(projectRoot, 'client')));

await connectDB();
app.use('/api', apiRoutes);

const server = app.listen(PORT, async () => {
  console.log(`Server started on http://localhost:${PORT} for automated test verification`);

  function get(urlPath) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}${urlPath}`, (res) => {
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

  function post(urlPath, payload) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(payload);
      const req = http.request({
        hostname: 'localhost',
        port: PORT,
        path: urlPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  try {
    console.log('Testing Module H API Endpoints:');

    // 1. Overview
    const overview = await get('/api/pilgrimage-stats/overview');
    if (overview.status !== 200 || !overview.body?.overview?.latestVerifiedArbaeen) {
      throw new Error(`Overview failed: status ${overview.status}`);
    }
    console.log('✅ GET /api/pilgrimage-stats/overview (200 OK) - Latest Arbaeen:', overview.body.overview.latestVerifiedArbaeen.totalCount);

    // 2. Years list
    const years = await get('/api/pilgrimage-stats/years');
    if (years.status !== 200 || years.body?.count < 5) {
      throw new Error(`Years list failed: status ${years.status}`);
    }
    console.log(`✅ GET /api/pilgrimage-stats/years (200 OK) - ${years.body.count} documented years`);

    // 3. Year detail (2024)
    const y2024 = await get('/api/pilgrimage-stats/year/2024');
    if (y2024.status !== 200 || y2024.body?.data?.attendance?.totalReportedPilgrims !== 21480525) {
      throw new Error(`Year 2024 failed: status ${y2024.status}`);
    }
    console.log('✅ GET /api/pilgrimage-stats/year/2024 (200 OK) - Arbaeen:', y2024.body.data.attendance.arbaeenAttendance);

    // 4. Countries list
    const countries = await get('/api/pilgrimage-stats/countries?year=2024');
    if (countries.status !== 200 || countries.body?.count < 10) {
      throw new Error(`Countries failed: status ${countries.status}`);
    }
    console.log(`✅ GET /api/pilgrimage-stats/countries (200 OK) - ${countries.body.count} countries returned`);

    // 5. Attendance Trends
    const trends = await get('/api/pilgrimage-stats/trends');
    if (trends.status !== 200 || !trends.body?.charts?.labels) {
      throw new Error(`Trends failed: status ${trends.status}`);
    }
    console.log('✅ GET /api/pilgrimage-stats/trends (200 OK) - Baseline year:', trends.body.baselineYear);

    // 6. Arbaeen Intelligence
    const arbaeen = await get('/api/pilgrimage-stats/arbaeen');
    if (arbaeen.status !== 200 || !arbaeen.body?.methodologies?.cameraAxesSystem) {
      throw new Error(`Arbaeen intelligence failed: status ${arbaeen.status}`);
    }
    console.log('✅ GET /api/pilgrimage-stats/arbaeen (200 OK) - Methodologies:', !!arbaeen.body.methodologies);

    // 7. Sources
    const sources = await get('/api/pilgrimage-stats/sources');
    if (sources.status !== 200 || sources.body?.sourcesCount < 4) {
      throw new Error(`Sources failed: status ${sources.status}`);
    }
    console.log(`✅ GET /api/pilgrimage-stats/sources (200 OK) - ${sources.body.sourcesCount} sovereign sources`);

    // 8. Year Comparison
    const comp = await get('/api/pilgrimage-stats/compare?year1=2024&year2=2023');
    if (comp.status !== 200 || !comp.body?.comparison?.areMethodologiesComparable) {
      throw new Error(`Comparison failed: status ${comp.status}`);
    }
    console.log('✅ GET /api/pilgrimage-stats/compare (200 OK) - YoY change:', comp.body.comparison.percentageChange + '%');

    // 9. Timeline
    const timeline = await get('/api/pilgrimage-stats/timeline');
    if (timeline.status !== 200 || timeline.body?.milestones?.length < 5) {
      throw new Error(`Timeline failed: status ${timeline.status}`);
    }
    console.log(`✅ GET /api/pilgrimage-stats/timeline (200 OK) - ${timeline.body.milestones.length} milestones`);

    // 10. CSV Export
    const csv = await get('/api/pilgrimage-stats/export/csv');
    if (csv.status !== 200 || typeof csv.body !== 'string' || !csv.body.includes('Total Reported Pilgrims')) {
      throw new Error(`CSV export failed: status ${csv.status}`);
    }
    console.log('✅ GET /api/pilgrimage-stats/export/csv (200 OK) - Valid CSV returned');

    // 11. Ask Karbala AI 3.0 Verification
    console.log('\nTesting Ask Karbala AI 3.0 Module H Prompt Queries:');
    const aiQueries = [
      'How many pilgrims visited Karbala during Arbaeen in 2025?',
      'What is the latest reported attendance figure for 2026?',
      'How many pilgrims came from India in 2024?',
      'Which countries had the highest documented pilgrimage attendance?',
      'How has Arbaeen attendance changed over the past ten years?',
      'What is the difference between annual Karbala visits and Arbaeen attendance?'
    ];

    for (const q of aiQueries) {
      const aiRes = await post('/api/ai/chat', { query: q });
      if (aiRes.status !== 200 || aiRes.body?.intent !== 'pilgrimage_statistics') {
        throw new Error(`AI prompt "${q}" failed with intent: ${aiRes.body?.intent}`);
      }
      console.log(`✅ AI Response for: "${q.substring(0, 45)}..." -> Intent: ${aiRes.body.intent}`);
    }

    console.log('\n========================================================================');
    console.log('🎉 ALL BACKEND APIS & ASK KARBALA AI MODULE H TESTS PASSED SUCCESSFULLY!');
    console.log('========================================================================');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification failure:', err);
    server.close();
    process.exit(1);
  }
});
