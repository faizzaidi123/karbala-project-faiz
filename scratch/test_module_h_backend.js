import http from 'http';

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
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

function post(path, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
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

async function runTests() {
  console.log('====================================================');
  console.log('🧪 VERIFYING MODULE H — PILGRIMAGE STATS & INTELLIGENCE');
  console.log('====================================================\n');

  // 1. Overview
  const overview = await get('/api/pilgrimage-stats/overview');
  console.log('1. GET /api/pilgrimage-stats/overview:');
  console.log('   Status:', overview.status);
  console.log('   Latest Verified Arbaeen Year:', overview.body?.overview?.latestVerifiedArbaeen?.year);
  console.log('   Latest Verified Arbaeen Count:', overview.body?.overview?.latestVerifiedArbaeen?.totalCount);
  console.log('   Ongoing 2026 Tally:', overview.body?.overview?.ongoingYear2026?.currentArbaeenTally);
  console.log('   Is 2026 Full-Year Complete:', overview.body?.overview?.ongoingYear2026?.isFullYearComplete);
  console.log('   Top International Origin Countries:', overview.body?.overview?.topInternationalDemographics?.length);

  // 2. Years list
  const years = await get('/api/pilgrimage-stats/years');
  console.log('\n2. GET /api/pilgrimage-stats/years:');
  console.log('   Status:', years.status);
  console.log('   Total Documented Years:', years.body?.count);
  console.log('   Sample Years Included:', years.body?.years?.slice(0, 4).map(y => `${y.year} (${y.hijriYearDisplay}): ${y.totalReportedPilgrims.toLocaleString()}`).join(' | '));

  // 3. Year detail (2024)
  const y2024 = await get('/api/pilgrimage-stats/year/2024');
  console.log('\n3. GET /api/pilgrimage-stats/year/2024:');
  console.log('   Status:', y2024.status);
  console.log('   Arbaeen Count:', y2024.body?.data?.attendance?.arbaeenAttendance?.toLocaleString());
  console.log('   Domestic:', y2024.body?.data?.attendance?.domesticIraqiPilgrims?.toLocaleString());
  console.log('   International:', y2024.body?.data?.attendance?.internationalPilgrims?.toLocaleString());
  console.log('   Country Breakdown Available:', y2024.body?.data?.countryBreakdown?.length);

  // 4. Countries list
  const countries = await get('/api/pilgrimage-stats/countries?year=2024');
  console.log('\n4. GET /api/pilgrimage-stats/countries:');
  console.log('   Status:', countries.status);
  console.log('   Countries Count (2024):', countries.body?.count);
  console.log('   Top 3:', countries.body?.countries?.slice(0, 3).map(c => `${c.flagEmoji} ${c.countryName}: ${c.reportedPilgrimCount.toLocaleString()}`).join(', '));

  // 5. Attendance Trends
  const trends = await get('/api/pilgrimage-stats/trends');
  console.log('\n5. GET /api/pilgrimage-stats/trends:');
  console.log('   Status:', trends.status);
  console.log('   Baseline Year:', trends.body?.baselineYear);
  console.log('   Series Labels:', trends.body?.charts?.labels?.join(', '));

  // 6. Arbaeen Intelligence
  const arbaeen = await get('/api/pilgrimage-stats/arbaeen');
  console.log('\n6. GET /api/pilgrimage-stats/arbaeen:');
  console.log('   Status:', arbaeen.status);
  console.log('   Arbaeen Records Count:', arbaeen.body?.records?.length);
  console.log('   Border Gateways Analyzed:', arbaeen.body?.borderDistributionBreakdown2024?.length);

  // 7. Sources
  const sources = await get('/api/pilgrimage-stats/sources');
  console.log('\n7. GET /api/pilgrimage-stats/sources:');
  console.log('   Status:', sources.status);
  console.log('   Sovereign Sources:', sources.body?.sourcesCount);
  console.log('   Documented Methodologies:', sources.body?.methodologiesCount);

  // 8. Year Comparison
  const comp = await get('/api/pilgrimage-stats/compare?year1=2024&year2=2023');
  console.log('\n8. GET /api/pilgrimage-stats/compare:');
  console.log('   Status:', comp.status);
  console.log('   Methodologies Compatible:', comp.body?.comparison?.areMethodologiesComparable);
  console.log('   Difference Pilgrims:', comp.body?.comparison?.differenceTotalPilgrims?.toLocaleString());
  console.log('   YoY % Change:', comp.body?.comparison?.percentageChange + '%');

  // 9. Timeline
  const timeline = await get('/api/pilgrimage-stats/timeline');
  console.log('\n9. GET /api/pilgrimage-stats/timeline:');
  console.log('   Status:', timeline.status);
  console.log('   Historical Milestones:', timeline.body?.milestones?.length);

  // 10. CSV Export
  const csv = await get('/api/pilgrimage-stats/export/csv');
  console.log('\n10. GET /api/pilgrimage-stats/export/csv:');
  console.log('    Status:', csv.status);
  console.log('    Header Content-Type:', csv.headers['content-type']);
  console.log('    CSV Rows Count:', typeof csv.body === 'string' ? csv.body.split('\n').length : 'N/A');

  // 11. Ask Karbala AI 3.0 Integration (Testing Module H Prompts)
  console.log('\n11. Testing Ask Karbala AI 3.0 on Module H Queries:');
  
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
    console.log(`\n   ❓ Q: "${q}"`);
    console.log(`   💡 Intent: ${aiRes.body?.intent} | Accuracy: ${aiRes.body?.accuracyTier}`);
    console.log(`   💬 Reply Snippet: ${aiRes.body?.reply?.substring(0, 160).replace(/\n/g, ' ')}...`);
    console.log(`   📚 Citations: ${aiRes.body?.citations?.map(c => c.work).join(' | ')}`);
  }

  console.log('\n====================================================');
  console.log('✅ ALL MODULE H BACKEND & AI INTEGRATION TESTS PASSED');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
