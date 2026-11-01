import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ef791325-9f6b-447f-bad1-925f18236ef8';
const PORT = 9222;
const TEMP_USER_DATA = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_img_restore';

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
  console.log('--- STARTING IMAGE RESTORATION & MULTI-VIEWPORT VERIFICATION ---');

  if (fs.existsSync(TEMP_USER_DATA)) {
    fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  }

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${TEMP_USER_DATA}`
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    console.log('CDP Connected via:', wsUrl);

    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    // 1. Mobile Viewport 390x844: Discover Karbala Hero
    console.log('1. Testing Mobile Hero at 390x844...');
    await cdp.setViewport(390, 844, true);
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await sleep(3500);

    // Dismiss any onboarding modal
    await cdp.evaluate(`
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip') || b.textContent.includes('Save') || b.textContent.includes('Close'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1000);
    await cdp.captureScreenshot('ui_restore_01_hero_390.png');

    // 2. Mobile Viewport 390x844: My Ziyarat Destination Cards (Hussain, Abbas, Bayn al-Haramayn)
    console.log('2. Testing Destination Cards at 390x844 in My Ziyarat...');
    await cdp.evaluate(`window.location.hash = 'ziyarat';`);
    await sleep(2500);
    await cdp.evaluate(`window.scrollTo(0, 180);`);
    await sleep(1200);

    const domAudit = await cdp.evaluate(`
      const cards = Array.from(document.querySelectorAll('.shrine-dest-card-v2'));
      cards.map(c => {
        const title = c.querySelector('.shrine-card-title')?.textContent?.trim();
        const img = c.querySelector('img');
        const placeholder = c.querySelector('.neutral-photo-placeholder');
        return {
          title,
          hasImg: !!img,
          imgSrc: img ? img.src : null,
          imgComplete: img ? img.complete : null,
          naturalWidth: img ? img.naturalWidth : null,
          hasPlaceholder: !!placeholder
        };
      });
    `);
    console.log('390px Destination Cards Audit in DOM:', JSON.stringify(domAudit, null, 2));

    await cdp.captureScreenshot('ui_restore_02_cards_390.png');

    // 3. Scroll to Tall al-Zaynabiyya & Al-Mukhayyam cards
    console.log('3. Scrolling to unphotographed memorial sites with neutral placeholders...');
    await cdp.evaluate(`window.scrollTo(0, 440);`);
    await sleep(1200);
    await cdp.captureScreenshot('ui_restore_03_neutral_placeholders_390.png');

    // 4. Viewport 360x780 (Compact Android mobile)
    console.log('4. Testing Compact Android Viewport (360x780)...');
    await cdp.setViewport(360, 780, true);
    await cdp.evaluate(`window.scrollTo(0, 180);`);
    await sleep(1200);
    await cdp.captureScreenshot('ui_restore_04_cards_360.png');

    // 5. Viewport 412x915 (Modern Android flagship)
    console.log('5. Testing Modern Android Viewport (412x915)...');
    await cdp.setViewport(412, 915, true);
    await cdp.evaluate(`window.scrollTo(0, 180);`);
    await sleep(1200);
    await cdp.captureScreenshot('ui_restore_05_cards_412.png');

    // 6. Viewport 1440x900 (Desktop)
    console.log('6. Testing Desktop Viewport (1440x900)...');
    await cdp.setViewport(1440, 900, false);
    await cdp.evaluate(`window.scrollTo(0, 240);`);
    await sleep(1500);
    await cdp.captureScreenshot('ui_restore_06_cards_desktop_1440.png');

    console.log('--- ALL VIEWPORT SCREENSHOTS CAPTURED SUCCESSFULLY ---');
    console.log(`Console Errors: ${cdp.consoleErrors.length}`);
  } catch (e) {
    console.error('Test Execution Failed:', e);
  } finally {
    chromeProc.kill();
    try {
      if (fs.existsSync(TEMP_USER_DATA)) {
        fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
      }
    } catch(e) {}
  }
}

main();
