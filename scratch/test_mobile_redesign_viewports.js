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

async function main() {
  console.log('=== MULTI-VIEWPORT VERIFICATION FOR REDESIGNED MOBILE HOMEPAGE ===');
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_mobile_redesign'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

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
      { name: '320_iPhoneSE', width: 320, height: 568, isMobile: true },
      { name: '360_Android', width: 360, height: 800, isMobile: true },
      { name: '375_iPhoneMini', width: 375, height: 812, isMobile: true },
      { name: '390_iPhone14', width: 390, height: 844, isMobile: true },
      { name: '412_Pixel7', width: 412, height: 915, isMobile: true },
      { name: '768_iPadPortrait', width: 768, height: 1024, isMobile: true },
      { name: '1440_Desktop', width: 1440, height: 900, isMobile: false }
    ];

    for (const vp of viewports) {
      await cdp.setViewport(vp.width, vp.height, vp.isMobile);
      await sleep(600);

      const audit = await cdp.evaluate(`
        ({
          bodyScrollWidth: document.body.scrollWidth,
          bodyClientWidth: document.body.clientWidth,
          hasOverflow: document.body.scrollWidth > document.body.clientWidth + 1,
          heroTitle: document.querySelector('.hero-title')?.textContent,
          heroCalligraphy: document.querySelector('.hero-calligraphy')?.textContent,
          primaryBtnText: document.querySelector('.hero-btn-primary')?.textContent?.trim(),
          secondaryBtnText: document.querySelector('.hero-btn-secondary')?.textContent?.trim(),
          domeImgSrc: document.querySelector('.hero-bg-media')?.currentSrc || document.querySelector('.hero-bg-media')?.src
        })
      `);

      const screenshotFile = path.join(ARTIFACT_DIR, `ui_mobile_redesign_${vp.width}.png`);
      await cdp.screenshot(screenshotFile);

      console.log(`[Viewport: ${vp.name} (${vp.width}x${vp.height})] -> Overflow: ${audit.hasOverflow ? 'FAIL' : 'PASS'}, Title: "${audit.heroTitle}", Primary CTA: "${audit.primaryBtnText}", Secondary CTA: "${audit.secondaryBtnText}"`);
      console.log(`   Image active src: ${audit.domeImgSrc}`);
      console.log(`   Saved screenshot: ${screenshotFile}`);
    }

    // Now test opening the navigation drawer at 390x844
    await cdp.setViewport(390, 844, true);
    await sleep(400);
    await cdp.evaluate(`
      const toggle = document.querySelector('.mobile-nav-toggle');
      if (toggle) toggle.click();
    `);
    await sleep(600);
    const drawerScreenshot = path.join(ARTIFACT_DIR, 'ui_mobile_redesign_drawer_open.png');
    await cdp.screenshot(drawerScreenshot);
    console.log(`[Mobile Drawer Test] Drawer opened and captured: ${drawerScreenshot}`);

    console.log('\nTotal Console Errors across all tests:', cdp.consoleErrors.length);
    if (cdp.consoleErrors.length > 0) {
      console.log('Errors:', cdp.consoleErrors);
    }
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
