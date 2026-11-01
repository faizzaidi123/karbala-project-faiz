import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9244;
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd028911-fdd8-41a3-9c53-4a3b92d0ceef';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://localhost:${PORT}/json`, (res) => {
          let b = '';
          res.on('data', (c) => (b += c));
          res.on('end', () => resolve(JSON.parse(b)));
        }).on('error', reject);
      });
      if (Array.isArray(data) && data.length > 0) {
        const target = data.find((t) => t.type === 'page') || data[0];
        if (target && target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
      }
    } catch (e) {
      await sleep(300);
    }
  }
  throw new Error('Debugger failed');
}

class CDP {
  constructor(url) {
    this.url = url;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    const WS = globalThis.WebSocket;
    this.ws = new WS(this.url);
    await new Promise((res, rej) => {
      this.ws.onopen = res;
      this.ws.onerror = rej;
    });
    this.ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const cb = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) cb.rej(new Error(msg.error.message));
        else cb.res(msg.result);
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        const args = msg.params.args.map((a) => a.value || a.description || '').join(' ');
        console.log(`[Browser Console ${msg.params.type}]`, args);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[Browser Exception]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = this.id++;
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function run() {
  const tmpDir = path.join(process.env.TEMP, 'chrome_karbala_cdp_' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  const proc = spawn(CHROME, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    `--user-data-dir=${tmpDir}`,
    'http://localhost:3000/'
  ]);

  try {
    const wsUrl = await getWsUrl();
    const cdp = new CDP(wsUrl);
    await cdp.connect();

    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    console.log('Connected to Chrome CDP, waiting for page load...');
    await sleep(3500);

    // Check root content
    const evalRes = await cdp.send('Runtime.evaluate', {
      expression: `({
        title: document.title,
        rootChildren: document.getElementById('root')?.childElementCount,
        rootHTML: document.getElementById('root')?.innerHTML.slice(0, 300),
        bodyClasses: document.body.className,
        innerWidth: window.innerWidth
      })`,
      returnByValue: true
    });
    console.log('Page State:', evalRes.result?.value);

    // 1. Desktop Screenshot (1440x900)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(1000);
    const ssDesktop = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'karbala_desktop_1440.png'), Buffer.from(ssDesktop.data, 'base64'));
    console.log('Captured karbala_desktop_1440.png');

    // 2. Tablet Screenshot (768x1024)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: true
    });
    await sleep(1000);
    const ssTablet = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'karbala_tablet_768.png'), Buffer.from(ssTablet.data, 'base64'));
    console.log('Captured karbala_tablet_768.png');

    // 3. Mobile Screenshot (390x844)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true
    });
    await sleep(1000);
    const ssMobile = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'karbala_mobile_390.png'), Buffer.from(ssMobile.data, 'base64'));
    console.log('Captured karbala_mobile_390.png');

    // 4. Small Mobile (360x740)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 740,
      deviceScaleFactor: 1,
      mobile: true
    });
    await sleep(1000);
    const ssSmall = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'karbala_mobile_360.png'), Buffer.from(ssSmall.data, 'base64'));
    console.log('Captured karbala_mobile_360.png');

  } finally {
    proc.kill();
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

run().catch(console.error);
