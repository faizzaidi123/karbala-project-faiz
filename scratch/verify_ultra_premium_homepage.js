import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd028911-fdd8-41a3-9c53-4a3b92d0ceef';

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

  async setViewport(width, height, isMobile = false) {
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

async function waitForRoot(cdp) {
  for (let i = 0; i < 30; i++) {
    const ready = await cdp.evaluate(`Boolean(document.getElementById('root')?.children.length > 0)`);
    if (ready) return true;
    await sleep(400);
  }
  return false;
}

const BREAKPOINTS = [
  { name: '1_desktop_1920_large', width: 1920, height: 1080, isMobile: false },
  { name: '2_desktop_1440_standard', width: 1440, height: 900, isMobile: false },
  { name: '3_laptop_1024', width: 1024, height: 768, isMobile: false },
  { name: '4_tablet_768', width: 768, height: 1024, isMobile: true },
  { name: '5_mobile_430_promax', width: 430, height: 932, isMobile: true },
  { name: '6_mobile_390_iphone', width: 390, height: 844, isMobile: true },
  { name: '7_mobile_360_small', width: 360, height: 640, isMobile: true }
];

async function main() {
  console.log('Launching headless Chrome for multi-breakpoint visual audit...');
  const tempProfile = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_audit_' + Date.now();
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempProfile}`
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    // Configure localStorage
    await cdp.setViewport(1440, 900, false);
    await cdp.send('Page.navigate', { url: 'http://localhost:3000' });
    await sleep(1500);
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', stepFree: false, gpsAssist: true, onboarded: true, timestamp: new Date().toISOString() }));
    `);

    // Capture each breakpoint
    for (const bp of BREAKPOINTS) {
      console.log(`\nCapturing breakpoint: ${bp.name} (${bp.width}x${bp.height})...`);
      await cdp.setViewport(bp.width, bp.height, bp.isMobile);
      await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
      await waitForRoot(cdp);
      await sleep(2500); // Allow image and font rendering

      const outPath = path.join(ARTIFACT_DIR, `ui_homepage_${bp.name}.png`);
      await cdp.screenshot(outPath);
      console.log(`✅ Saved: ui_homepage_${bp.name}.png`);
    }

    // Capture Discover Karbala Dropdown Menu on Desktop
    console.log('\nCapturing Discover Karbala Dropdown Menu...');
    await cdp.setViewport(1440, 900, false);
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await waitForRoot(cdp);
    await sleep(2000);
    await cdp.evaluate(`
      const chevron = document.querySelector('.lux-chevron-click-target') || document.querySelector('.lux-nav-dropdown-wrapper button');
      if (chevron) chevron.click();
    `);
    await sleep(800);
    const dropdownPic = path.join(ARTIFACT_DIR, 'ui_homepage_dropdown_menu.png');
    await cdp.screenshot(dropdownPic);
    console.log(`✅ Saved: ui_homepage_dropdown_menu.png`);

    // Capture Mobile Drawer Navigation Open
    console.log('\nCapturing Mobile Drawer Open (390x844)...');
    await cdp.setViewport(390, 844, true);
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await waitForRoot(cdp);
    await sleep(2000);
    await cdp.evaluate(`
      const toggle = document.querySelector('.mobile-nav-toggle');
      if (toggle) toggle.click();
    `);
    await sleep(1000);
    const drawerPic = path.join(ARTIFACT_DIR, 'ui_homepage_mobile_drawer.png');
    await cdp.screenshot(drawerPic);
    console.log(`✅ Saved: ui_homepage_mobile_drawer.png`);

    console.log('\n🏆 ALL BREAKPOINT & INTERACTION SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

main().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
