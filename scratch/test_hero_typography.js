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

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: true
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
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_hero_qa'
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

    const testViewports = [
      { name: '375x812', width: 375, height: 812, outName: 'ui_mobile_hero_375.png' },
      { name: '390x844', width: 390, height: 844, outName: 'ui_mobile_hero_390.png' }
    ];

    for (const vp of testViewports) {
      await cdp.setViewport(vp.width, vp.height);
      await sleep(600);

      const metrics = await cdp.evaluate(`
        (() => {
          const title = document.querySelector('.hero-title');
          const ar = document.querySelector('.hero-calligraphy');
          const sub = document.querySelector('.hero-subtitle');
          const acts = document.querySelector('.hero-actions');
          const bnav = document.querySelector('.mobile-bottom-app-bar');
          const getBox = el => el ? {
            top: Math.round(el.getBoundingClientRect().top),
            bottom: Math.round(el.getBoundingClientRect().bottom),
            height: Math.round(el.getBoundingClientRect().height)
          } : null;
          const getComp = (el, prop) => el ? window.getComputedStyle(el).getPropertyValue(prop) : null;

          return {
            title: {
              box: getBox(title),
              fontSize: getComp(title, 'font-size'),
              fontFamily: getComp(title, 'font-family'),
              color: getComp(title, 'color')
            },
            calligraphy: {
              box: getBox(ar),
              fontSize: getComp(ar, 'font-size'),
              fontFamily: getComp(ar, 'font-family'),
              color: getComp(ar, 'color')
            },
            subtitle: {
              box: getBox(sub),
              fontSize: getComp(sub, 'font-size'),
              fontStyle: getComp(sub, 'font-style'),
              fontFamily: getComp(sub, 'font-family'),
              lineHeight: getComp(sub, 'line-height')
            },
            actions: {
              box: getBox(acts),
              btnCount: acts?.querySelectorAll('button')?.length
            },
            bottomNav: {
              box: getBox(bnav)
            },
            spaceAboveBottomNav: bnav && acts ? Math.round(bnav.getBoundingClientRect().top - acts.getBoundingClientRect().bottom) : null
          };
        })()
      `);

      const screenshotFile = path.join(ARTIFACT_DIR, vp.outName);
      await cdp.screenshot(screenshotFile);
      console.log(`=== METRICS [${vp.name}] ===`);
      console.log(JSON.stringify(metrics, null, 2));
      console.log(`Saved screenshot: ${screenshotFile}`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    chromeProc.kill();
  }
}

run();
