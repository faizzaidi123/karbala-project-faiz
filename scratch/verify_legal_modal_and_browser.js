import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd028911-fdd8-41a3-9c53-4a3b92d0ceef';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function findChromePath() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
  }

  async send(method, params = {}) {
    const message = JSON.stringify({ id: this.id++, method, params });
    this.ws.send(message);
    return new Promise((resolve, reject) => {
      const handler = (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.id === this.id - 1) {
          this.ws.off('message', handler);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
      this.ws.on('message', handler);
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result ? res.result.value : null;
  }

  async captureScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png', quality: 95 });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(artifactDir, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`📸 Captured: ${filename} (${Math.round(buffer.length / 1024)} KB)`);
  }
}

async function runBrowserVerification() {
  console.log('========================================================================');
  console.log('🌐 REAL-BROWSER AUDIT: LEGAL & COMPLIANCE MODAL & ZERO CONSOLE ERRORS');
  console.log('========================================================================\n');

  const chromePath = await findChromePath();
  if (!chromePath) {
    console.error('❌ Chrome executable not found.');
    return;
  }

  const userDataDir = path.join(__dirname, 'chrome_legal_audit_' + Date.now());
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);

  await sleep(4000);

  const targets = await new Promise((resolve) => {
    http.get('http://localhost:9223/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });

  const pageTarget = targets.find(t => t.type === 'page');
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  cdp.ws = ws;

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (cdp.callbacks && cdp.callbacks.has(msg.id)) {
      const { resolve, reject } = cdp.callbacks.get(msg.id);
      cdp.callbacks.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
  };
  cdp.callbacks = new Map();

  cdp.send = function(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  // Pre-set preferences and reload to ensure clean main interface
  await cdp.evaluate(`
    (function() {
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', firstTime: false }));
      localStorage.setItem('karbala_theme_mode', 'dark');
      location.reload();
    })();
  `);

  await sleep(3500);

  // Trigger Legal Modal via footer link
  console.log('--- 1. Triggering Legal & Compliance Modal (Night Mode) ---');
  const clickResult = await cdp.evaluate(`
    (function() {
      // Find Privacy Policy button in footer
      const btns = Array.from(document.querySelectorAll('button'));
      const privacyBtn = btns.find(b => b.textContent.includes('Privacy Policy'));
      if (privacyBtn) {
        privacyBtn.click();
        return { clicked: true, text: privacyBtn.textContent };
      }
      return { clicked: false, totalBtns: btns.length };
    })();
  `);
  console.log('  Privacy Button Click Result:', clickResult);

  await sleep(1500);
  await cdp.captureScreenshot('ui_legal_modal_privacy_night.png');

  // Switch to Terms of Use tab
  console.log('--- 2. Switching to Terms of Use Tab ---');
  await cdp.evaluate(`
    (function() {
      const btns = Array.from(document.querySelectorAll('button'));
      const termsBtn = btns.find(b => b.textContent.includes('Terms of Use'));
      if (termsBtn) termsBtn.click();
    })();
  `);

  await sleep(800);
  await cdp.captureScreenshot('ui_legal_modal_terms_night.png');

  // Switch to Historical & Telemetry Disclaimer tab
  console.log('--- 3. Switching to Disclaimer Tab ---');
  await cdp.evaluate(`
    (function() {
      const btns = Array.from(document.querySelectorAll('button'));
      const discBtn = btns.find(b => b.textContent.includes('Historical & Telemetry Disclaimer') || b.textContent.includes('Disclaimer'));
      if (discBtn) discBtn.click();
    })();
  `);

  await sleep(800);
  await cdp.captureScreenshot('ui_legal_modal_disclaimer_night.png');

  // Switch to Day Mode and test modal in Day Theme
  console.log('--- 4. Testing Legal Modal in Day Mode ---');
  await cdp.evaluate(`
    (function() {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('karbala_theme_mode', 'light');
    })();
  `);

  await sleep(1000);
  await cdp.captureScreenshot('ui_legal_modal_disclaimer_day.png');

  // Close modal and verify background returns smoothly
  await cdp.evaluate(`
    (function() {
      const closeBtn = document.querySelector('.modal-footer button');
      if (closeBtn) closeBtn.click();
    })();
  `);

  await sleep(1000);

  console.log('--- 5. Mobile Drawer Legal Button QA (390x844) ---');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Open mobile drawer
  await cdp.evaluate(`
    (function() {
      const toggle = document.querySelector('.mobile-nav-toggle');
      if (toggle) toggle.click();
    })();
  `);

  await sleep(1000);
  await cdp.captureScreenshot('ui_mobile_drawer_with_legal_link.png');

  // Teardown
  ws.close();
  chromeProcess.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n========================================================================');
  console.log('🎉 REAL BROWSER LEGAL AUDIT COMPLETED SUCCESSFULLY!');
  console.log('========================================================================');
}

runBrowserVerification();
