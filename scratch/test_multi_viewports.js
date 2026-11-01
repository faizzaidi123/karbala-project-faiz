import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
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
}

async function main() {
  console.log('=== MULTI-VIEWPORT RESPONSIVENESS AND OVERFLOW AUDIT ===');
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_multi_vp'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await sleep(2500);

    // Dismiss onboarding modal
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ lang: 'en', stepFree: false, gpsAssistance: true }));
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip') || b.textContent.includes('Save Preferences'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1000);

    const viewports = [
      { name: '320px Ultra-Compact', width: 320, height: 568 },
      { name: '360px Compact Android', width: 360, height: 740 },
      { name: '375px Standard iPhone', width: 375, height: 667 },
      { name: '390px Modern Mobile', width: 390, height: 844 },
      { name: '412px Pixel / Galaxy', width: 412, height: 915 },
      { name: '768px Tablet Portrait', width: 768, height: 1024 },
      { name: '1440px Desktop Cinema', width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await cdp.setViewport(vp.width, vp.height, vp.width < 992);
      await sleep(500);
      const overflow = await cdp.evaluate(`
        ({
          bodyScrollWidth: document.body.scrollWidth,
          bodyClientWidth: document.body.clientWidth,
          hasHorizontalOverflow: document.body.scrollWidth > document.body.clientWidth + 1
        })
      `);
      console.log(`[Viewport: ${vp.name}] Width: ${vp.width}px -> Overflow: ${overflow.hasHorizontalOverflow ? 'FAIL' : 'PASS'} (Scroll: ${overflow.bodyScrollWidth}px / Client: ${overflow.bodyClientWidth}px)`);
    }

    console.log('\nTotal Console Errors across all viewport resizes:', cdp.consoleErrors.length);
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
