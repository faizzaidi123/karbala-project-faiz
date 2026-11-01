import http from 'http';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function testAll() {
  console.log('Testing Phase 9 Endpoints...');
  
  // 1. Offline Pack
  const offline = await get('http://localhost:3000/api/offline-pack');
  console.log('1. /api/offline-pack:', offline.status, 'Title:', offline.body?.title, 'Destinations:', offline.body?.destinations?.length, 'Hotlines:', offline.body?.emergencyHotlines?.length);
  
  // 2. Ziyarat Plans
  const plans = await get('http://localhost:3000/api/ziyarat-plans');
  console.log('2. /api/ziyarat-plans:', plans.status, 'Count:', plans.body?.count, 'Theological notice present:', !!plans.body?.theologicalNotice);
  
  // 3. Emergency Contacts
  const emg = await get('http://localhost:3000/api/emergency-contacts');
  console.log('3. /api/emergency-contacts:', emg.status, 'Verified contacts:', emg.body?.verifiedCount);
  
  // 4. Pedestrian Route
  const route = await get('http://localhost:3000/api/route?fromLat=32.61520&fromLng=44.03245&toLat=32.61860&toLng=44.03584');
  console.log('4. /api/route:', route.status, 
    'Straight-Line:', route.body?.route?.straightLineDistanceMeters + 'm', 
    'Routed:', route.body?.route?.routedDistanceMeters + 'm',
    'Duration:', route.body?.route?.durationMinutes + 'min',
    'Accessible:', route.body?.route?.accessibleStepFree,
    'Google Maps Fallback:', !!route.body?.route?.externalFallbacks?.googleMapsUrl,
    'OSM Fallback:', !!route.body?.route?.externalFallbacks?.openStreetMapUrl
  );
}

testAll().catch(console.error);
