import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd028911-fdd8-41a3-9c53-4a3b92d0ceef';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWebSocketDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://localhost:${PORT}/json`, res => {
          let body = '';
          res.on('data', c => body += c);
          res.on('end', () => resolve(JSON.parse(body)));
        }).on('error', reject);
      });
      if (Array.isArray(data) && data.length > 0) {
        const pageTarget = data.find(t => t.type === 'page') || data[0];
        if (pageTarget && pageTarget.webSocketDebuggerUrl) return pageTarget.webSocketDebuggerUrl;
      }
    } catch (e) {
      await sleep(500);
    }
  }
  throw new Error('Chrome remote debugger failed to initialize');
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    const WS = globalThis.WebSocket;
    this.ws = new WS(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = event => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };

    await this.send('Page.enable');
    await this.send('DOM.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  }

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile
    });
    await this.send('Emulation.setVisibleSize', { width, height });
  }

  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  }
}

async function waitForRoot(cdp) {
  for (let i = 0; i < 30; i++) {
    const ready = await cdp.evaluate(`Boolean(document.getElementById('root')?.children.length > 0)`);
    if (ready) return true;
    await sleep(400);
  }
  return false;
}

async function main() {
  console.log('Launching headless Chrome for full UI capture...');
  const tempProfile = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_full_' + Date.now();
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempProfile}`
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();
    await cdp.setViewport(1440, 920, false);

    // Initial visit & dismiss modals
    console.log('Visiting initial page to configure localStorage...');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000' });
    await sleep(2000);
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', stepFree: false, gpsAssist: true, onboarded: true, timestamp: new Date().toISOString() }));
    `);

    // 1. HOME VIEW
    console.log('\n--- 1. CAPTURING HOME VIEW ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await waitForRoot(cdp);
    await sleep(2000);
    const homePic = path.join(ARTIFACT_DIR, 'ui_live_home_view.png');
    await cdp.screenshot(homePic);
    console.log('✅ Captured Home View:', homePic);

    // 2. POLE NAVIGATION - MAP TAB (IMAGES 1 & 4)
    console.log('\n--- 2. CAPTURING POLE NAVIGATION: MAP TAB (IMAGES 1 & 4) ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#poles' });
    await waitForRoot(cdp);
    await sleep(3500); // Leaflet tiles and images
    const mapPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_map.png');
    await cdp.screenshot(mapPic);
    console.log('✅ Captured Map Tab:', mapPic);

    // 3. POLE NAVIGATION - LIVE CROWD INTELLIGENCE TAB (IMAGE 3)
    console.log('\n--- 3. CAPTURING POLE NAVIGATION: CROWD INTELLIGENCE (IMAGE 3) ---');
    await cdp.evaluate(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Live Crowd Intelligence'));
      if (btn) btn.click();
    `);
    await sleep(2500);
    const crowdPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_crowd.png');
    await cdp.screenshot(crowdPic);
    console.log('✅ Captured Crowd Intelligence Tab:', crowdPic);

    // 4. POLE NAVIGATION - MILESTONE POLES DIRECTORY TAB (IMAGE 2)
    console.log('\n--- 4. CAPTURING POLE NAVIGATION: MILESTONE POLES DIRECTORY (IMAGE 2) ---');
    await cdp.evaluate(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Milestone Poles Directory'));
      if (btn) btn.click();
    `);
    await sleep(2500);
    const dirPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_directory.png');
    await cdp.screenshot(dirPic);
    console.log('✅ Captured Milestone Poles Directory Tab:', dirPic);

    // 5. POLE NAVIGATION - SMART DISTANCE CALCULATOR TAB
    console.log('\n--- 5. CAPTURING POLE NAVIGATION: SMART DISTANCE CALCULATOR ---');
    await cdp.evaluate(`
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Smart Distance Calculator'));
      if (btn) btn.click();
    `);
    await sleep(2500);
    const calcPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_calculator.png');
    await cdp.screenshot(calcPic);
    console.log('✅ Captured Smart Distance Calculator Tab:', calcPic);

    // 6. AIRPORT ARRIVAL SIMULATOR & GATEWAYS HUB
    console.log('\n--- 6. CAPTURING AIRPORT ARRIVAL SIMULATOR HUB ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#journey' });
    await waitForRoot(cdp);
    await sleep(3500);
    const airportPic = path.join(ARTIFACT_DIR, 'ui_live_airport_arrival_hub.png');
    await cdp.screenshot(airportPic);
    console.log('✅ Captured Airport Arrival Simulator Hub:', airportPic);

    // 7. GLOBAL ZAIREEN STATISTICS & INTELLIGENCE HUB (MODULE H)
    console.log('\n--- 7. CAPTURING GLOBAL ZAIREEN STATISTICS HUB (MODULE H) ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#statistics' });
    await waitForRoot(cdp);
    await sleep(3500);
    const statsPic = path.join(ARTIFACT_DIR, 'ui_live_zaireen_statistics_hub.png');
    await cdp.screenshot(statsPic);
    console.log('✅ Captured Global Zaireen Statistics Hub:', statsPic);

    console.log('\n🎉 ALL 7 LIVE MODULE SCREENSHOTS RECORDED ACCURATELY!');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

main().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
