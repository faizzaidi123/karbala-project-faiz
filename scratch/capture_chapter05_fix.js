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

async function main() {
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_ch05_cards'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await sleep(2500);

    // Dismiss onboarding
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', onboarded: true }));
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip') || b.textContent.includes('Save'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(800);

    // Viewport 1: 390x844 (Mobile)
    await cdp.setViewport(390, 844, true);
    await sleep(400);
    // Scroll specifically to the cards list
    await cdp.evaluate(`
      const target = document.querySelector('#chapter-05 .col-lg-5');
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'center' });
    `);
    await sleep(800);
    const mobilePic = path.join(ARTIFACT_DIR, 'ui_chapter05_cards_mobile_390.png');
    await cdp.screenshot(mobilePic);
    console.log('Saved mobile screenshot:', mobilePic);

    // Viewport 2: 1280x900 (Desktop)
    await cdp.setViewport(1280, 900, false);
    await sleep(400);
    await cdp.evaluate(`
      const target = document.querySelector('#chapter-05 .col-lg-5');
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'center' });
    `);
    await sleep(800);
    const desktopPic = path.join(ARTIFACT_DIR, 'ui_chapter05_cards_desktop_1280.png');
    await cdp.screenshot(desktopPic);
    console.log('Saved desktop screenshot:', desktopPic);

    console.log('Capture completed successfully.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
