import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9246;
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd028911-fdd8-41a3-9c53-4a3b92d0ceef';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://localhost:${PORT}/json`, (res) => {
          let b = '';
          res.on('data', (c) => (b += c));
          res.on('end', () => resolve(JSON.parse(b)));
        }).on('error', reject);
      });
      if (Array.isArray(data) && data.length > 0) {
        const target = data.find((t) => t.type === 'page') || data[0];
        if (target && target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
      }
    } catch (e) {
      await sleep(300);
    }
  }
  throw new Error('Debugger failed');
}

class CDP {
  constructor(url) {
    this.url = url;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    const WS = globalThis.WebSocket;
    this.ws = new WS(this.url);
    await new Promise((res, rej) => {
      this.ws.onopen = res;
      this.ws.onerror = rej;
    });
    this.ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const cb = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) cb.rej(new Error(msg.error.message));
        else cb.res(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = this.id++;
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function run() {
  const tmpDir = path.join(process.env.TEMP, 'chrome_karbala_views_' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  const proc = spawn(CHROME, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    `--user-data-dir=${tmpDir}`,
    'http://localhost:3000/'
  ]);

  try {
    const wsUrl = await getWsUrl();
    const cdp = new CDP(wsUrl);
    await cdp.connect();

    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    console.log('Pre-setting onboarding in localStorage...');
    await cdp.send('Runtime.evaluate', {
      expression: `(function() {
        localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', stepFree: false, gpsAssist: true, onboarded: true, timestamp: new Date().toISOString() }));
      })()`
    });

    // Reload page with pre-set localStorage
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/' });
    console.log('Navigated, waiting 4s for React to mount...');
    await sleep(4000);

    // Also close any modal if still present
    await cdp.send('Runtime.evaluate', {
      expression: `(function() {
        var skipBtn = document.querySelector('.emergency-sheet-card button');
        if (skipBtn) skipBtn.click();
      })()`
    });
    await sleep(1000);

    async function captureScreen(name, width, height, isMobile = false) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: isMobile
      });
      await sleep(1200);
      const ss = await cdp.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(ARTIFACT_DIR, `${name}.png`), Buffer.from(ss.data, 'base64'));
      console.log(`Saved ${name}.png (${width}x${height})`);
    }

    // 1. Home View
    await captureScreen('karbala_home_desktop_1440', 1440, 900, false);
    await captureScreen('karbala_home_tablet_768', 768, 1024, true);
    await captureScreen('karbala_home_mobile_390', 390, 844, true);

    // 2. Click Airport & Journey Tab
    console.log('Navigating to Airport view...');
    await cdp.send('Runtime.evaluate', {
      expression: `(function() {
        var items = Array.from(document.querySelectorAll('.lux-nav-item, nav button, .nav-link, button'));
        var airportTab = items.find(el => el.textContent.toLowerCase().includes('airport') || el.textContent.toLowerCase().includes('journey'));
        if (airportTab) airportTab.click();
      })()`
    });
    await sleep(1500);
    await captureScreen('karbala_airport_desktop_1440', 1440, 900, false);
    await captureScreen('karbala_airport_mobile_390', 390, 844, true);

    // 3. Click Smart Pole Navigation
    console.log('Navigating to Pole Navigation view...');
    await cdp.send('Runtime.evaluate', {
      expression: `(function() {
        var items = Array.from(document.querySelectorAll('.lux-nav-item, nav button, .nav-link, button'));
        var poleTab = items.find(el => el.textContent.toLowerCase().includes('pole') || el.textContent.toLowerCase().includes('navigation'));
        if (poleTab) poleTab.click();
      })()`
    });
    await sleep(1500);
    await captureScreen('karbala_poles_desktop_1440', 1440, 900, false);
    await captureScreen('karbala_poles_mobile_390', 390, 844, true);

    // 4. Click Global Statistics Hub
    console.log('Navigating to Statistics Hub...');
    await cdp.send('Runtime.evaluate', {
      expression: `(function() {
        var items = Array.from(document.querySelectorAll('.lux-nav-item, nav button, .nav-link, button'));
        var statTab = items.find(el => el.textContent.toLowerCase().includes('statistic') || el.textContent.toLowerCase().includes('zaireen'));
        if (statTab) statTab.click();
      })()`
    });
    await sleep(1500);
    await captureScreen('karbala_stats_desktop_1440', 1440, 900, false);
    await captureScreen('karbala_stats_mobile_390', 390, 844, true);

  } finally {
    proc.kill();
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

run().catch(console.error);
