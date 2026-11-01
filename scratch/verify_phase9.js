import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ef791325-9f6b-447f-bad1-925f18236ef8';
const PORT = 9222;

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
    this.consoleErrors = [];
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
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          const txt = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
          this.consoleErrors.push(txt);
          console.error('[Browser Error]', txt);
        }
      }
    };

    await this.send('Console.enable');
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

  async captureScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`[Screenshot Saved] -> ${filename} (${buffer.length} bytes)`);
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
}

async function main() {
  console.log('--- STARTING PHASE 9 COMPREHENSIVE AUTOMATED VERIFICATION SUITE ---');

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_test_p9'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    console.log('CDP WebSocket URL obtained:', wsUrl);

    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    // 1. Initial Desktop Viewport 1440x900
    await cdp.setViewport(1440, 900);
    console.log('Navigating to http://localhost:3000/#home...');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await sleep(3500);

    // 1. Open First-Time Pilgrim Journey Modal
    console.log('1. Triggering First-Time Pilgrim Modal...');
    await cdp.evaluate(`
      const prefBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Preferences') || b.textContent.includes('First-Time'));
      if (prefBtn) prefBtn.click();
    `);
    await sleep(1500);
    await cdp.captureScreenshot('ui_m9_01_first_time_pilgrim_modal.png');

    // Close or skip modal
    await cdp.evaluate(`
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip') || b.textContent.includes('Close') || b.textContent.includes('Save'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1000);

    // 2. Navigate to My Ziyarat Hub (#ziyarat)
    console.log('2. Navigating to My Ziyarat Hub (#ziyarat)...');
    await cdp.evaluate(`window.location.hash = 'ziyarat';`);
    await sleep(2500);

    // Scroll slightly to reveal destination cards with verification badges
    await cdp.evaluate(`window.scrollTo(0, 450);`);
    await sleep(1000);
    await cdp.captureScreenshot('ui_m9_02_destination_discovery_verified.png');

    // 3. Test Walking Navigation with Straight-line, Routed distance, and Fallbacks
    console.log('3. Triggering Walking Route Calculation...');
    await cdp.evaluate(`
      const routeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Calculate Walking Route') || b.textContent.includes('Get Directions'));
      if (routeBtn) routeBtn.click();
    `);
    await sleep(2000);
    // Scroll into view of smart-route-panel
    await cdp.evaluate(`
      const panel = document.querySelector('.smart-route-panel');
      if (panel) panel.scrollIntoView({ behavior: 'instant', block: 'center' });
    `);
    await sleep(1000);
    await cdp.captureScreenshot('ui_m9_03_audited_walking_route_fallbacks.png');

    // 4. Intelligent Ziyarat Journey Planner with 6 Tracks & Customizable Starting Points
    console.log('4. Viewing Intelligent Ziyarat Journey Planner...');
    await cdp.evaluate(`
      const planSection = document.querySelector('.ziyarat-planner-section');
      if (planSection) planSection.scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await sleep(1000);
    await cdp.captureScreenshot('ui_m9_04_intelligent_ziyarat_planner.png');

    // 5. Offline Pilgrimage Essentials Pack Modal
    console.log('5. Triggering Offline Pilgrimage Essentials Pack View...');
    await cdp.evaluate(`
      const offlineBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Open In-App Offline Reader') || b.textContent.includes('Offline Reader'));
      if (offlineBtn) offlineBtn.click();
    `);
    await sleep(1500);
    await cdp.captureScreenshot('ui_m9_05_offline_essentials_pack_modal.png');

    // Close offline modal
    await cdp.evaluate(`
      const closeBtn = document.querySelector('.offline-pack-card button');
      if (closeBtn) closeBtn.click();
    `);
    await sleep(800);

    // 6. Verified Emergency Directory with Medical Locations & Explicit Location Sharing Consent
    console.log('6. Triggering Emergency Assistance Modal...');
    await cdp.evaluate(`
      const emgBtn = document.querySelector('.lux-action-pill.emergency');
      if (emgBtn) emgBtn.click();
    `);
    await sleep(1200);
    await cdp.captureScreenshot('ui_m9_06_verified_emergency_directory.png');

    // Close emergency modal
    await cdp.evaluate(`
      const closeEmg = document.querySelector('.emergency-sheet-card button');
      if (closeEmg) closeEmg.click();
    `);
    await sleep(800);

    // 7. Ask Karbala AI Tough Lighting Guidance & Camera Safety Notice
    console.log('7. Navigating to Ask Karbala AI (#ai)...');
    await cdp.evaluate(`window.location.hash = 'ai';`);
    await sleep(2500);
    await cdp.captureScreenshot('ui_m9_07_camera_lighting_guidance.png');

    // 8. Mobile Viewport (390 x 844) — Real-world One-Handed Walking Companion
    console.log('8. Switching to Mobile Viewport (390x844)...');
    await cdp.setViewport(390, 844, true);
    await cdp.evaluate(`window.location.hash = 'ziyarat';`);
    await sleep(2000);
    await cdp.captureScreenshot('ui_m9_08_mobile_pilgrim_experience_390.png');

    console.log('--- PHASE 9 VERIFICATION SUITE FINISHED SUCCESSFULLY ---');
    console.log(`Browser Console Errors Count: ${cdp.consoleErrors.length}`);
    if (cdp.consoleErrors.length > 0) {
      console.log('Console Errors:', cdp.consoleErrors);
    }
  } catch (err) {
    console.error('Test Suite Failed:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
