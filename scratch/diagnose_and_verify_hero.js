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
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_diag'
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

    await cdp.setViewport(390, 844);
    await sleep(500);

    // Step 1: Diagnose computed styles and ancestor chain
    const diagnosis = await cdp.evaluate(`
      (() => {
        const content = document.querySelector('.hero-content');
        if (!content) return { error: 'hero-content not found' };

        const ancestors = [];
        let cur = content;
        while (cur && cur !== document.documentElement) {
          const cs = window.getComputedStyle(cur);
          const r = cur.getBoundingClientRect();
          ancestors.push({
            tag: cur.tagName.toLowerCase(),
            id: cur.id || null,
            className: cur.className || null,
            box: {
              top: Math.round(r.top),
              bottom: Math.round(r.bottom),
              left: Math.round(r.left),
              width: Math.round(r.width),
              height: Math.round(r.height)
            },
            styles: {
              display: cs.display,
              flexDirection: cs.flexDirection,
              justifyContent: cs.justifyContent,
              alignItems: cs.alignItems,
              position: cs.position,
              top: cs.top,
              bottom: cs.bottom,
              height: cs.height,
              minHeight: cs.minHeight,
              padding: cs.padding,
              margin: cs.margin,
              transform: cs.transform
            }
          });
          cur = cur.parentElement;
        }

        const hero = document.querySelector('.hero-section');
        const heroBox = hero?.getBoundingClientRect();
        const contentBox = content?.getBoundingClientRect();

        return {
          ancestors,
          heroAvailableHeight: heroBox ? Math.round(heroBox.height) : null,
          contentTopInsideHero: (heroBox && contentBox) ? Math.round(contentBox.top - heroBox.top) : null,
          contentTopRatio: (heroBox && contentBox) ? ((contentBox.top - heroBox.top) / heroBox.height).toFixed(3) : null
        };
      })()
    `);

    console.log('=== CSS & DOM ANCESTOR DIAGNOSIS (390x844) ===');
    console.log(JSON.stringify(diagnosis, null, 2));

    // Capture initial before screenshot
    const beforeFile = path.join(ARTIFACT_DIR, 'ui_hero_position_BEFORE_390.png');
    await cdp.screenshot(beforeFile);
    console.log('Saved BEFORE screenshot:', beforeFile);

  } catch (e) {
    console.error(e);
  } finally {
    chromeProc.kill();
  }
}

run();
