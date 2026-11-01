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
  console.log('--- STARTING PHASE 9.5 CRITICAL MOBILE UI REPAIR VERIFICATION SUITE ---');

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_test_p95'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    console.log('CDP WebSocket URL obtained:', wsUrl);

    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    // 1. Mobile Viewport 390 x 844: Test Repaired Mobile Hero
    console.log('1. Setting mobile viewport (390 x 844) for Discover Karbala Hero...');
    await cdp.setViewport(390, 844, true);
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await sleep(3500);

    // Dismiss onboarding modal if open
    await cdp.evaluate(`
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip') || b.textContent.includes('Save') || b.textContent.includes('Close'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1000);

    await cdp.captureScreenshot('ui_m9_5_01_mobile_hero_discover_390.png');

    // 2. Mobile Viewport 390 x 844: Test Rebuilt Mobile Destination Cards in My Ziyarat
    console.log('2. Navigating to My Ziyarat (#ziyarat) on Mobile Viewport...');
    await cdp.evaluate(`window.location.hash = 'ziyarat';`);
    await sleep(2500);

    // Scroll slightly to bring the rebuilt destination cards into view
    await cdp.evaluate(`window.scrollTo(0, 180);`);
    await sleep(1200);

    // Check images status in browser DOM
    const imgAudit = await cdp.evaluate(`
      const imgs = Array.from(document.querySelectorAll('.shrine-dest-card-v2 img'));
      imgs.map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      }));
    `);
    console.log('Destination Images DOM Audit:', imgAudit);

    await cdp.captureScreenshot('ui_m9_5_02_mobile_destination_cards_390.png');

    // Scroll down to view Tall al-Zaynabiyya and Al-Mukhayyam cards specifically
    await cdp.evaluate(`window.scrollTo(0, 420);`);
    await sleep(1000);
    await cdp.captureScreenshot('ui_m9_5_03_mobile_zaynabiyya_mukhayyam_cards_390.png');

    // 3. Desktop Viewport 1440 x 900: Test Rebuilt Cards on Desktop
    console.log('3. Setting desktop viewport (1440 x 900)...');
    await cdp.setViewport(1440, 900, false);
    await cdp.evaluate(`window.scrollTo(0, 240);`);
    await sleep(1500);
    await cdp.captureScreenshot('ui_m9_5_04_desktop_destination_cards_1440.png');

    console.log('--- PHASE 9.5 VERIFICATION SUITE FINISHED SUCCESSFULLY ---');
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
