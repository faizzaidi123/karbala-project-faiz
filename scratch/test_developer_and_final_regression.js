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
  console.log('=== STARTING FINAL MASTER REGRESSION & DEVELOPER CREDIT VERIFICATION ===');

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_final_reg'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    console.log('CDP WebSocket URL obtained:', wsUrl);

    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    // 1. Desktop 1440 x 900: About the Developer Section
    console.log('\n--- 1. Testing About the Developer on Desktop (1440 x 900) ---');
    await cdp.setViewport(1440, 900, false);
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await sleep(2500);

    // Dismiss onboarding modal
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ lang: 'en', stepFree: false, gpsAssistance: true }));
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip') || b.textContent.includes('Save Preferences'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1000);

    // Scroll directly to #about-developer
    await cdp.evaluate(`
      const devSection = document.getElementById('about-developer');
      if (devSection) devSection.scrollIntoView({ behavior: 'instant', block: 'center' });
      else window.scrollTo(0, document.body.scrollHeight - 600);
    `);
    await sleep(2000);

    // Inspect Developer image rendering status
    const devImgStatus = await cdp.evaluate(`
      const img = document.querySelector('.developer-portrait-img');
      if (!img) return { found: false };
      return {
        found: true,
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayedWidth: img.clientWidth,
        displayedHeight: img.clientHeight
      };
    `);
    console.log('Developer Portrait DOM Status (Desktop):', devImgStatus);

    await cdp.captureScreenshot('ui_dev_01_developer_section_desktop.png');

    // 2. Mobile 390 x 844: About the Developer Section
    console.log('\n--- 2. Testing About the Developer on Mobile (390 x 844) ---');
    await cdp.setViewport(390, 844, true);
    await sleep(1000);

    await cdp.evaluate(`
      const devSection = document.getElementById('about-developer');
      if (devSection) devSection.scrollIntoView({ behavior: 'instant', block: 'center' });
    `);
    await sleep(1500);

    await cdp.captureScreenshot('ui_dev_02_developer_section_mobile.png');

    // 3. Mobile 390 x 844: Museum Footer with Subtle Attribution
    console.log('\n--- 3. Testing Museum Footer with Subtle Attribution ---');
    await cdp.evaluate(`
      window.scrollTo(0, document.body.scrollHeight);
    `);
    await sleep(1000);
    await cdp.captureScreenshot('ui_dev_03_museum_footer_credit.png');

    // 4. Mobile 390 x 844: My Ziyarat Hub Footer Attribution
    console.log('\n--- 4. Testing My Ziyarat Hub Footer Credit ---');
    await cdp.evaluate(`window.location.hash = 'ziyarat';`);
    await sleep(2000);
    await cdp.evaluate(`window.scrollTo(0, document.body.scrollHeight);`);
    await sleep(1200);
    await cdp.captureScreenshot('ui_dev_04_myziyarat_footer_credit.png');

    // 5. Total Image & Broken Asset DOM Audit
    console.log('\n--- 5. Performing Full-Site DOM Image Audit ---');
    const imageAudit = await cdp.evaluate(`
      const allImgs = Array.from(document.querySelectorAll('img'));
      const broken = allImgs.filter(i => !i.complete || i.naturalWidth === 0);
      return {
        totalImagesOnPage: allImgs.length,
        brokenCount: broken.length,
        brokenSources: broken.map(b => b.src)
      };
    `);
    console.log('DOM Image Health Audit Result:', imageAudit);

    console.log('\n=== FINAL MASTER REGRESSION SUITE FINISHED ===');
    console.log(`Browser Console Errors: ${cdp.consoleErrors.length}`);
    if (cdp.consoleErrors.length > 0) {
      console.log('Console Errors:', cdp.consoleErrors);
    }
  } catch (err) {
    console.error('Final Regression Test Failed:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
