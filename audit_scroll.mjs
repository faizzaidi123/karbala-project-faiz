import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9247;
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
  const tmpDir = path.join(process.env.TEMP, 'chrome_karbala_scroll_' + Date.now());
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

    await cdp.send('Runtime.evaluate', {
      expression: `localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', stepFree: false, gpsAssist: true, onboarded: true, timestamp: new Date().toISOString() }));`
    });

    await cdp.send('Page.navigate', { url: 'http://localhost:3000/' });
    await sleep(4000);

    // Click Airport Tab
    await cdp.send('Runtime.evaluate', {
      expression: `(function() {
        var items = Array.from(document.querySelectorAll('.lux-nav-item, nav button, .nav-link, button'));
        var airportTab = items.find(el => el.textContent.toLowerCase().includes('airport') || el.textContent.toLowerCase().includes('journey'));
        if (airportTab) airportTab.click();
      })()`
    });
    await sleep(1500);

    // Set mobile viewport 390x844
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });
    await sleep(1000);

    // Capture full-page screenshot of airport on mobile
    const ssFullAirport = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'karbala_airport_mobile_fullpage.png'), Buffer.from(ssFullAirport.data, 'base64'));
    console.log('Saved karbala_airport_mobile_fullpage.png');

    // Click Home View
    await cdp.send('Runtime.evaluate', {
      expression: `(function() {
        var homeBtn = document.querySelector('.lux-brand-lockup') || Array.from(document.querySelectorAll('.lux-nav-item, button')).find(el => el.textContent.includes('Home') || el.textContent.includes('Discover'));
        if (homeBtn) homeBtn.click();
      })()`
    });
    await sleep(1500);

    // Scroll down on Home view
    await cdp.send('Runtime.evaluate', { expression: `window.scrollBy(0, 700);` });
    await sleep(1000);
    const ssHomeScrolled = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'karbala_home_mobile_scrolled.png'), Buffer.from(ssHomeScrolled.data, 'base64'));
    console.log('Saved karbala_home_mobile_scrolled.png');

  } finally {
    proc.kill();
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

run().catch(console.error);
