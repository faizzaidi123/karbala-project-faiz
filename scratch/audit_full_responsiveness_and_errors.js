import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ef791325-9f6b-447f-bad1-925f18236ef8';

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
    this.failedRequests = [];
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
        }
      } else if (msg.method === 'Network.responseReceived') {
        const { status, url } = msg.params.response;
        if (status >= 400 && !url.includes('favicon.ico')) {
          this.failedRequests.push({ url, status });
        }
      }
    };

    await this.send('Page.enable');
    await this.send('DOM.enable');
    await this.send('Console.enable');
    await this.send('Network.enable');
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

  async setViewport(width, height, isMobile = true) {
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

async function run() {
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_audit'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    console.log('--- 1. LOADING HOMEPAGE ---');
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await sleep(2500);

    // Dismiss onboarding modal
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', stepFree: false, gpsAssist: true, onboarded: true }));
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip') || b.textContent.includes('Save Preferences'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1000);

    const viewports = [
      { name: 'Mobile_320_SE', width: 320, height: 568, isMobile: true },
      { name: 'Mobile_360_Android', width: 360, height: 800, isMobile: true },
      { name: 'Mobile_375_iPhoneMini', width: 375, height: 812, isMobile: true },
      { name: 'Mobile_390_iPhone14', width: 390, height: 844, isMobile: true },
      { name: 'Mobile_412_Pixel7', width: 412, height: 915, isMobile: true },
      { name: 'Mobile_430_ProMax', width: 430, height: 932, isMobile: true },
      { name: 'Tablet_768_Portrait', width: 768, height: 1024, isMobile: true },
      { name: 'Tablet_1024_Landscape', width: 1024, height: 768, isMobile: false },
      { name: 'Laptop_1280', width: 1280, height: 800, isMobile: false },
      { name: 'Desktop_1440', width: 1440, height: 900, isMobile: false },
      { name: 'Desktop_1920', width: 1920, height: 1080, isMobile: false }
    ];

    console.log('--- 2. RESPONSIVE AUDIT ACROSS ALL VIEWPORTS (HOME VIEW) ---');
    for (const vp of viewports) {
      await cdp.setViewport(vp.width, vp.height, vp.isMobile);
      await sleep(400);

      const audit = await cdp.evaluate(`
        (() => {
          const docW = document.documentElement.scrollWidth;
          const winW = window.innerWidth;
          const bodyW = document.body.scrollWidth;
          const hasOverflow = docW > winW + 1 || bodyW > winW + 1;
          
          // Check broken images
          const imgs = Array.from(document.querySelectorAll('img'));
          const broken = imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src);

          const heroTitle = document.querySelector('.hero-title')?.textContent?.trim();
          const primaryBtn = document.querySelector('.hero-btn-primary')?.textContent?.trim();

          return {
            winW,
            docW,
            hasOverflow,
            brokenImagesCount: broken.length,
            brokenImages: broken.slice(0, 3),
            heroTitle,
            primaryBtn
          };
        })()
      `);

      const passStr = !audit.hasOverflow && audit.brokenImagesCount === 0 ? 'PASS [OK]' : 'WARN [CHECK]';
      console.log(`[${vp.name} (${vp.width}x${vp.height})] -> ${passStr} | Overflow: ${audit.hasOverflow} (doc: ${audit.docW}px, win: ${audit.winW}px) | Broken Imgs: ${audit.brokenImagesCount}`);
    }

    console.log('\n--- 3. TESTING CORE SUBVIEWS FOR ERRORS & OVERFLOW ---');
    const subviews = [
      { name: 'Ziyarat_Companion', hash: '#ziyarat' },
      { name: 'AI_Companion', hash: '#ai' },
      { name: 'Emergency_Safety', hash: '#emergency' }
    ];

    for (const sv of subviews) {
      await cdp.send('Page.navigate', { url: `http://localhost:3000/${sv.hash}` });
      await sleep(1500);

      for (const vp of [{ name: 'Mobile_390', width: 390, height: 844, isMobile: true }, { name: 'Desktop_1440', width: 1440, height: 900, isMobile: false }]) {
        await cdp.setViewport(vp.width, vp.height, vp.isMobile);
        await sleep(400);

        const svAudit = await cdp.evaluate(`
          (() => {
            const docW = document.documentElement.scrollWidth;
            const winW = window.innerWidth;
            const hasOverflow = docW > winW + 1;
            const broken = Array.from(document.querySelectorAll('img')).filter(i => i.complete && i.naturalWidth === 0).map(i => i.src);
            return { hasOverflow, docW, winW, brokenCount: broken.length };
          })()
        `);

        console.log(`[View: ${sv.name} @ ${vp.name}] -> Overflow: ${svAudit.hasOverflow ? 'FAIL' : 'PASS'} | Broken Imgs: ${svAudit.brokenCount}`);
      }
    }

    console.log('\n--- 4. TOTAL CONSOLE & NETWORK ERROR SUMMARY ---');
    console.log('Console Errors count:', cdp.consoleErrors.length);
    if (cdp.consoleErrors.length > 0) {
      console.log('Console Errors:', cdp.consoleErrors);
    }
    console.log('HTTP 4xx/5xx Failed Requests count:', cdp.failedRequests.length);
    if (cdp.failedRequests.length > 0) {
      console.log('Failed requests:', cdp.failedRequests);
    }

  } catch (e) {
    console.error('Audit script error:', e);
  } finally {
    chromeProc.kill();
  }
}

run();
