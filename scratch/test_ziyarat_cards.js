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
      mobile: false
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
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_cards_qa'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    // Navigate to ziyarat view
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#ziyarat' });
    await sleep(3000);

    // Dismiss onboarding modal
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', stepFree: false, gpsAssist: true, onboarded: true }));
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip') || b.textContent.includes('Save Preferences'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1500);

    await cdp.setViewport(1280, 900);
    await sleep(500);

    // Scroll down to the shrine cards
    await cdp.evaluate(`
      const card = Array.from(document.querySelectorAll('.shrine-dest-card-v2')).find(c => c.textContent.includes('Tall al-Zaynabiyya'));
      if (card) {
        card.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    `);
    await sleep(1500);

    const cardInfo = await cdp.evaluate(`
      Array.from(document.querySelectorAll('.shrine-dest-card-v2')).map(c => {
        const title = c.querySelector('.shrine-card-title')?.textContent?.trim();
        const img = c.querySelector('.shrine-card-media img');
        const placeholder = c.querySelector('.neutral-photo-placeholder');
        const badge = c.querySelector('.dest-historical-illustration-pill')?.textContent?.trim();
        return {
          title,
          imgSrc: img ? img.src : null,
          imgComplete: img ? img.complete : null,
          naturalWidth: img ? img.naturalWidth : null,
          hasPlaceholder: !!placeholder,
          badge
        };
      })
    `);

    console.log('=== CARD AUDIT RESULT ===');
    console.log(JSON.stringify(cardInfo, null, 2));

    const outPath = path.join(ARTIFACT_DIR, 'ui_ziyarat_dest_cards_fixed.png');
    await cdp.screenshot(outPath);
    console.log('Saved screenshot:', outPath);

  } catch (e) {
    console.error(e);
  } finally {
    chromeProc.kill();
  }
}

run();
