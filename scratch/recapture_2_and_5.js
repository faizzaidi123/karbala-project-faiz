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
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_k3_recapture'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();
    await cdp.setViewport(390, 844, true);

    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#ziyarat' });
    await sleep(2500);

    // Dismiss onboarding
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ lang: 'en', stepFree: false, gpsAssistance: true }));
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip') || b.textContent.includes('Save Preferences'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1000);

    // 1. Recapture Planner Reordering
    console.log('Opening amenities drawer and selecting planner tab...');
    await cdp.evaluate(`
      const drawerTrigger = document.querySelector('.amenities-drawer-trigger');
      if (drawerTrigger) {
        drawerTrigger.scrollIntoView({ behavior: 'instant', block: 'center' });
        drawerTrigger.click();
      }
    `);
    await sleep(1500);

    await cdp.evaluate(`
      const plannerTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ziyarat Planner Tracks'));
      if (plannerTab) {
        plannerTab.click();
      }
    `);
    await sleep(1500);

    await cdp.evaluate(`
      const seqSection = Array.from(document.querySelectorAll('div, h4')).find(el => el.textContent.includes('Editable Pilgrimage Sequence'));
      if (seqSection) {
        seqSection.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollBy(0, 450);
      }
    `);
    await sleep(1200);

    await cdp.captureScreenshot('ui_k3_02_itinerary_planner_reorder.png');

    // 2. Recapture Emergency Modal focused on Column 18 Protocol
    console.log('Opening Emergency Modal and scrolling to Column 18 protocol...');
    await cdp.evaluate(`
      const emergBtn = document.querySelector('button.mobile-nav-item.emergency-item') || 
                       document.querySelector('button.lux-action-pill.emergency') || 
                       document.querySelector('.emergency-persistent-pill');
      if (emergBtn) emergBtn.click();
    `);
    await sleep(2000);

    await cdp.evaluate(`
      const card = document.querySelector('.column-18-protocol-card');
      if (card) {
        card.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) modalBody.scrollTop = 500;
      }
    `);
    await sleep(1200);

    await cdp.captureScreenshot('ui_k3_05_column18_emergency_safety.png');
    console.log('Recapture finished successfully!');
  } catch (e) {
    console.error('Recapture failed:', e);
  } finally {
    chromeProc.kill();
  }
}

main();
