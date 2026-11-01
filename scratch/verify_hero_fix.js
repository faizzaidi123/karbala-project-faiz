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

async function run() {
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_fix_qa'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await sleep(2500);

    // Dismiss onboarding modal if open
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', stepFree: false, gpsAssist: true, onboarded: true }));
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip') || b.textContent.includes('Save Preferences'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1000);

    const testViewports = [
      { name: '390x844', width: 390, height: 844, isMobile: true, out: 'ui_hero_AFTER_390.png' },
      { name: '360x800', width: 360, height: 800, isMobile: true, out: 'ui_hero_AFTER_360.png' },
      { name: '430x932', width: 430, height: 932, isMobile: true, out: 'ui_hero_AFTER_430.png' },
      { name: '1440x900', width: 1440, height: 900, isMobile: false, out: 'ui_hero_AFTER_1440.png' }
    ];

    const results = {};

    for (const vp of testViewports) {
      await cdp.setViewport(vp.width, vp.height, vp.isMobile);
      await sleep(600);

      const audit = await cdp.evaluate(`
        (() => {
          const hero = document.querySelector('.hero-section');
          const content = document.querySelector('.hero-content');
          const title = document.querySelector('.hero-title');
          const ar = document.querySelector('.hero-calligraphy');
          const sub = document.querySelector('.hero-subtitle');
          const btn1 = document.querySelector('.hero-btn-primary');
          const btn2 = document.querySelector('.hero-btn-secondary');
          const bnav = document.querySelector('.mobile-bottom-app-bar');

          const heroRect = hero ? hero.getBoundingClientRect() : null;
          const contentRect = content ? content.getBoundingClientRect() : null;
          const bnavRect = bnav ? bnav.getBoundingClientRect() : null;
          const heroCS = hero ? window.getComputedStyle(hero) : null;
          const subCS = sub ? window.getComputedStyle(sub) : null;
          const titleCS = title ? window.getComputedStyle(title) : null;
          const arCS = ar ? window.getComputedStyle(ar) : null;
          const btn1CS = btn1 ? window.getComputedStyle(btn1) : null;

          const contentTopInsideHero = (heroRect && contentRect) ? Math.round(contentRect.top - heroRect.top) : null;
          const contentTopRatio = (heroRect && contentRect) ? Number(((contentRect.top - heroRect.top) / heroRect.height).toFixed(3)) : null;

          return {
            hero: {
              height: heroRect ? Math.round(heroRect.height) : null,
              justifyContent: heroCS?.justifyContent,
              alignItems: heroCS?.alignItems,
              paddingTop: heroCS?.paddingTop,
              paddingBottom: heroCS?.paddingBottom
            },
            content: {
              top: contentRect ? Math.round(contentRect.top) : null,
              bottom: contentRect ? Math.round(contentRect.bottom) : null,
              height: contentRect ? Math.round(contentRect.height) : null,
              contentTopInsideHero,
              contentTopRatio,
              inTargetRange_25_35: contentTopRatio >= 0.23 && contentTopRatio <= 0.37
            },
            typography: {
              titleFontSize: titleCS?.fontSize,
              calligraphyFontSize: arCS?.fontSize,
              subtitleFontSize: subCS?.fontSize,
              subtitleFontStyle: subCS?.fontStyle,
              btn1Height: btn1?.getBoundingClientRect().height ? Math.round(btn1.getBoundingClientRect().height) : null,
              btn1TouchPass: (btn1?.getBoundingClientRect().height || 0) >= 44
            },
            spaceAboveBottomNav: (bnavRect && contentRect) ? Math.round(bnavRect.top - contentRect.bottom) : null
          };
        })()
      `);

      const screenshotFile = path.join(ARTIFACT_DIR, vp.out);
      await cdp.screenshot(screenshotFile);
      results[vp.name] = audit;
      console.log(`=== VIEWPORT ${vp.name} ===`);
      console.log(JSON.stringify(audit, null, 2));
      console.log(`Saved screenshot: ${screenshotFile}\n`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    chromeProc.kill();
  }
}

run();
