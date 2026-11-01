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

async function main() {
  console.log('Launching headless Chrome for Live UI capture...');
  const tempProfile = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_live_ui_' + Date.now();
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

    console.log('Navigating to http://localhost:3000 ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000' });
    
    // Set localStorage before render finishes or reload
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', stepFree: false, gpsAssist: true, onboarded: true, timestamp: new Date().toISOString() }));
    `);

    // Poll until #root is populated
    console.log('Waiting for React root to mount...');
    for (let i = 0; i < 30; i++) {
      const ready = await cdp.evaluate(`Boolean(document.getElementById('root')?.children.length > 0)`);
      if (ready) {
        console.log(`React root mounted in ~${(i + 1) * 500}ms`);
        break;
      }
      await sleep(500);
    }
    await sleep(2000);

    // Dismiss any modal if still open
    await cdp.evaluate(`
      const modal = document.querySelector('.modal.show, .pilgrim-onboarding-modal');
      if (modal) {
        const btn = modal.querySelector('button.btn-close, button.btn-outline-gold, button');
        if (btn) btn.click();
      }
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(b => b.remove());
    `);
    await sleep(1000);

    await cdp.setViewport(1440, 920, false);
    await sleep(1000);

    // 1. Capture Home Screen
    console.log('Capturing 1. Live Home View ...');
    const homePic = path.join(ARTIFACT_DIR, 'ui_live_home_view.png');
    await cdp.screenshot(homePic);
    console.log('✅ Saved:', homePic);

    // 2. Navigate to Smart Pole Navigation
    console.log('Navigating to Pole Navigation (Pill 5) ...');
    await cdp.evaluate(`
      const navBtns = document.querySelectorAll('.lux-exp-tab-btn');
      if (navBtns[5]) navBtns[5].click();
    `);
    await sleep(3500);

    // Capture Map tab with Image 1 (Najaf) and Image 4 (Karbala)
    console.log('Capturing 2. Smart Pole Navigation - Interactive Map & Sanctuary Heroes (Images 1 & 4) ...');
    const mapPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_map.png');
    await cdp.screenshot(mapPic);
    console.log('✅ Saved:', mapPic);

    // 3. Switch to Tab: Crowd Intelligence (Image 3) - Tab Index 2
    console.log('Switching to Crowd Intelligence Tab (Index 2) ...');
    await cdp.evaluate(`
      const poleTabs = document.querySelectorAll('.nav.nav-pills button');
      if (poleTabs[2]) poleTabs[2].click();
    `);
    await sleep(2500);
    console.log('Capturing 3. Live Crowd Intelligence & Aerial Concourse (Image 3) ...');
    const crowdPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_crowd.png');
    await cdp.screenshot(crowdPic);
    console.log('✅ Saved:', crowdPic);

    // 4. Switch to Tab: Milestone Poles Directory (Image 2) - Tab Index 4
    console.log('Switching to Milestone Poles Directory Tab (Index 4) ...');
    await cdp.evaluate(`
      const poleTabs = document.querySelectorAll('.nav.nav-pills button');
      if (poleTabs[4]) poleTabs[4].click();
    `);
    await sleep(2500);
    console.log('Capturing 4. Milestone Poles Directory & Highway 9 Route (Image 2) ...');
    const dirPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_directory.png');
    await cdp.screenshot(dirPic);
    console.log('✅ Saved:', dirPic);

    // 5. Switch to Tab: Smart Distance Calculator - Tab Index 1
    console.log('Switching to Distance Calculator Tab (Index 1) ...');
    await cdp.evaluate(`
      const poleTabs = document.querySelectorAll('.nav.nav-pills button');
      if (poleTabs[1]) poleTabs[1].click();
    `);
    await sleep(2500);
    console.log('Capturing 5. Smart Distance & Duration Calculator ...');
    const calcPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_calculator.png');
    await cdp.screenshot(calcPic);
    console.log('✅ Saved:', calcPic);

    // 6. Navigate to Airport & Journey Hub - Pill Index 4
    console.log('Navigating to Airport & Journey Hub (Pill 4) ...');
    await cdp.evaluate(`
      const navBtns = document.querySelectorAll('.lux-exp-tab-btn');
      if (navBtns[4]) navBtns[4].click();
    `);
    await sleep(3500);
    console.log('Capturing 6. Airport Arrival Simulator & Gateways Hub ...');
    const airportPic = path.join(ARTIFACT_DIR, 'ui_live_airport_arrival_hub.png');
    await cdp.screenshot(airportPic);
    console.log('✅ Saved:', airportPic);

    // 7. Navigate to Global Zaireen Statistics Hub - Pill Index 2
    console.log('Navigating to Global Zaireen Statistics Hub (Pill 2) ...');
    await cdp.evaluate(`
      const navBtns = document.querySelectorAll('.lux-exp-tab-btn');
      if (navBtns[2]) navBtns[2].click();
    `);
    await sleep(3500);
    console.log('Capturing 7. Global Zaireen Statistics Hub (Module H) ...');
    const statsPic = path.join(ARTIFACT_DIR, 'ui_live_zaireen_statistics_hub.png');
    await cdp.screenshot(statsPic);
    console.log('✅ Saved:', statsPic);

    console.log('\n🎉 ALL 7 LIVE UI SCREENSHOTS SUCCESSFULLY CAPTURED AND PERSISTED!');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

main().catch(err => {
  console.error('Error capturing live screenshots:', err);
  process.exit(1);
});
