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
          console.error('[Browser Console Error]:', txt);
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text;
        this.consoleErrors.push(desc);
        console.error('[Browser Exception]:', desc);
      }
    };
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
    if (res.exceptionDetails) {
      const err = res.exceptionDetails.exception?.description || res.exceptionDetails.text || 'CDP Evaluation Exception';
      console.error('Evaluate Exception:', err);
      throw new Error(err);
    }
    return res.result?.value;
  }

  async captureScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
  }

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: isMobile
    });
  }
}

async function main() {
  console.log('--- STARTING PHASE 8 SACRED LUXURY UX & MOBILE VERIFICATION ---');
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1440,900',
    'http://localhost:3000'
  ], { detached: false });

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log('Navigating to http://localhost:3000/#home...');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await sleep(3500);

    // 1. Desktop Discover Karbala Homepage
    await cdp.setViewport(1440, 900, false);
    await cdp.captureScreenshot('ui_m8_01_discover_hero_portals.png');

    // 2. Desktop My Ziyarat Navigation
    console.log('Navigating to My Ziyarat (#ziyarat)...');
    await cdp.evaluate(`window.location.hash = 'ziyarat';`);
    await sleep(2500);
    await cdp.captureScreenshot('ui_m8_02_ziyarat_wayfinding_cards.png');

    // 3. Desktop Start Walking Route Preview
    console.log('Starting walking route to Imam Hussain Shrine...');
    await cdp.evaluate(`
      const btn = document.querySelector('.start-navigation-cta-btn');
      if (btn) btn.click();
    `);
    await sleep(2000);
    await cdp.captureScreenshot('ui_m8_03_ziyarat_route_preview.png');

    // 4. Desktop Ask Karbala AI 3.0 Conversational Companion
    console.log('Navigating to Ask Karbala AI (#ai)...');
    await cdp.evaluate(`window.location.hash = 'ai';`);
    await sleep(2500);

    // Send a query in Roman Urdu
    await cdp.evaluate(`
      const textarea = document.querySelector('.chat-composer-input');
      if (textarea) {
        textarea.value = 'Imam Hussain ka Roza kahan hai?';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    `);
    await sleep(400);
    await cdp.evaluate(`
      const sendBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ask AI'));
      if (sendBtn) sendBtn.click();
    `);
    await sleep(3000);
    await cdp.captureScreenshot('ui_m8_04_ask_karbala_conversational.png');

    // 5. Senior Pilgrim Mode (Aa+) Enlarged Typography
    console.log('Toggling Senior Pilgrim Mode (Aa+)...');
    await cdp.evaluate(`
      const aaBtn = document.querySelector('button[title*="Senior Pilgrim"]');
      if (aaBtn) aaBtn.click();
    `);
    await sleep(1000);
    await cdp.captureScreenshot('ui_m8_05_senior_mode_accessibility.png');
    // Toggle back
    await cdp.evaluate(`
      const aaBtn = document.querySelector('button[title*="Senior Pilgrim"]');
      if (aaBtn) aaBtn.click();
    `);
    await sleep(500);

    // 6. Emergency Assistance Sheet
    console.log('Opening Emergency Assistance Sheet...');
    await cdp.evaluate(`
      const emgBtn = document.querySelector('.lux-action-pill.emergency');
      if (emgBtn) emgBtn.click();
    `);
    await sleep(1000);
    await cdp.captureScreenshot('ui_m8_06_emergency_assistance_sheet.png');
    // Close modal
    await cdp.evaluate(`
      const closeBtn = document.querySelector('.emergency-sheet-card button');
      if (closeBtn) closeBtn.click();
    `);
    await sleep(500);

    // 7. Spatial Digital Twin Canvas
    console.log('Navigating to Spatial Map (#map)...');
    await cdp.evaluate(`window.location.hash = 'map';`);
    await sleep(3000);
    await cdp.captureScreenshot('ui_m8_07_spatial_twin_canvas.png');

    // 8. Mobile Viewport (390 x 844) - Mobile Discover
    console.log('Switching to mobile viewport (390x844)...');
    await cdp.setViewport(390, 844, true);
    await cdp.evaluate(`window.location.hash = 'home';`);
    await sleep(2500);
    await cdp.captureScreenshot('ui_m8_08_mobile_discover_thumb_bar.png');

    // 9. Mobile My Ziyarat Navigation
    console.log('Mobile My Ziyarat...');
    await cdp.evaluate(`window.location.hash = 'ziyarat';`);
    await sleep(2500);
    await cdp.captureScreenshot('ui_m8_09_mobile_ziyarat_navigation.png');

    // 10. Mobile Ask Karbala AI
    console.log('Mobile Ask Karbala AI...');
    await cdp.evaluate(`window.location.hash = 'ai';`);
    await sleep(2500);
    await cdp.captureScreenshot('ui_m8_10_mobile_ai_companion.png');

    // 11. Mobile Emergency Assistance
    console.log('Mobile Emergency Assistance...');
    await cdp.evaluate(`
      const emgTab = document.querySelector('.mobile-nav-item.emergency-item');
      if (emgTab) emgTab.click();
    `);
    await sleep(1000);
    await cdp.captureScreenshot('ui_m8_11_mobile_emergency_sheet.png');

    console.log('--- VERIFICATION SUITE FINISHED ---');
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
