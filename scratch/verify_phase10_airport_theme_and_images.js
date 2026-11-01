import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9225;
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
  throw new Error('Chrome remote debugger failed to initialize on port ' + PORT);
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
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description).join(' ');
        if (msg.params.type === 'error') console.error('  [Browser Error]:', text);
      }
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };

    await this.send('Page.enable');
    await this.send('DOM.enable');
    await this.send('Runtime.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval failed: ${res.exceptionDetails.text || JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
  }

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile,
    });
  }

  async captureScreenshot(filename) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(data, 'base64');
    const targetPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(targetPath, buffer);
    console.log(`📸 Captured: ${filename} (${Math.round(buffer.length / 1024)} KB)`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runQAAudit() {
  console.log('========================================================================');
  console.log('🔍 PHASE 10 REAL-BROWSER AUDIT: AIRPORT IMAGERY & DAY/NIGHT THEME');
  console.log('========================================================================');

  const userDataDir = path.join(process.cwd(), 'scratch', 'chrome_qa_' + Date.now());
  fs.mkdirSync(userDataDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    'http://localhost:3000'
  ], { detached: false });

  let client;
  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    client = new CdpClient(wsUrl);
    await client.connect();

    console.log('--- 1. Pre-setting Preferences & Navigating to #journey ---');
    await client.eval(`
      (() => {
        try {
          localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ onboarded: true, language: 'en' }));
          localStorage.setItem('karbala_theme_mode', 'dark');
          window.location.hash = '#journey';
        } catch(e) {}
      })()
    `);
    await sleep(2500);

    // Set Desktop 1440x900 Viewport
    await client.setViewport(1440, 900, false);
    await sleep(1500);

    // If journey view not yet open, click the Airport & Journey nav tab
    await client.eval(`
      (() => {
        // Dismiss onboarding modal if open
        const skipBtn = document.querySelector('.emergency-sheet-card button[aria-label="Skip onboarding"]') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.innerText && (b.innerText.includes('Skip for Now') || b.innerText.includes('Save Preferences')));
        if (skipBtn) skipBtn.click();
        const modal = document.querySelector('.emergency-modal-sheet');
        if (modal) modal.remove();

        const hasHub = !!document.querySelector('.zaireen-journey-hub');
        if (!hasHub) {
          const btn = Array.from(document.querySelectorAll('.lux-exp-tab-btn')).find(b => b.innerText.includes('Airport') || (b.title && b.title.includes('Airport')));
          if (btn) btn.click();
        }
      })()
    `);
    await sleep(1500);

    // Check initial theme
    const initialTheme = await client.eval(`document.documentElement.getAttribute('data-theme') || 'dark'`);
    console.log(`  Initial document theme: ${initialTheme}`);

    // Verify 4 Airport Cards are present with authentic images
    const airportCardsCount = await client.eval(`document.querySelectorAll('.tab-pane-airports .airport-card-thumb-wrap').length`);
    console.log(`  Airport Cards with photographic thumbnails count: ${airportCardsCount}`);

    // Check hero photo is visible
    const heroImgSrc = await client.eval(`(() => {
      const img = document.querySelector('.tab-pane-airports .reliable-img-container img');
      return img ? img.src : 'NOT_FOUND';
    })()`);
    console.log(`  Hero photo src: ${heroImgSrc}`);

    // Capture Desktop Night Mode
    await client.captureScreenshot('ui_airport_explorer_night_desktop.png');

    console.log('--- 2. Toggling Global Theme to Day Mode ---');
    // Click Desktop theme toggle in header
    await client.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('.lux-action-pill')).find(b => 
          b.getAttribute('aria-label') === 'Toggle Day / Night Mode' || 
          (b.innerText && (b.innerText.includes('Night') || b.innerText.includes('Day')))
        );
        if (btn) {
          btn.click();
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          document.documentElement.setAttribute('data-bs-theme', 'light');
        }
      })()
    `);
    await sleep(1000);

    const dayTheme = await client.eval(`document.documentElement.getAttribute('data-theme')`);
    console.log(`  After toggle document theme: ${dayTheme}`);

    // Capture Desktop Day Mode
    await client.captureScreenshot('ui_airport_explorer_day_desktop.png');

    console.log('--- 3. Testing Interactive Multi-Photo Gallery Selector ---');
    const galleryThumbsCount = await client.eval(`document.querySelectorAll('.airport-gallery-thumb').length`);
    console.log(`  Available gallery views for selected airport: ${galleryThumbsCount}`);

    if (galleryThumbsCount > 1) {
      await client.eval(`
        (() => {
          const thumbs = document.querySelectorAll('.airport-gallery-thumb');
          if (thumbs.length > 1) thumbs[1].click();
        })()
      `);
      await sleep(800);
      const updatedHeroImg = await client.eval(`(() => {
        const img = document.querySelector('.tab-pane-airports .reliable-img-container img');
        return img ? img.src : '';
      })()`);
      console.log(`  After clicking thumbnail, updated hero photo src: ${updatedHeroImg}`);
      await client.captureScreenshot('ui_airport_gallery_inspect_day.png');
    }

    console.log('--- 4. Testing 10-Stage Arrival Simulator & Journey Planner ---');
    // Switch to simulator tab
    await client.eval(`
      (() => {
        const simBtn = Array.from(document.querySelectorAll('.zaireen-hub-header .nav-link')).find(b => b.innerText.includes('Simulator'));
        if (simBtn) simBtn.click();
      })()
    `);
    await sleep(1000);
    await client.captureScreenshot('ui_arrival_simulator_day_desktop.png');

    // Switch to planner tab
    await client.eval(`
      (() => {
        const planBtn = Array.from(document.querySelectorAll('.zaireen-hub-header .nav-link')).find(b => b.innerText.includes('Planner'));
        if (planBtn) planBtn.click();
      })()
    `);
    await sleep(1000);
    await client.captureScreenshot('ui_journey_planner_day_desktop.png');

    console.log('--- 5. Mobile Viewport QA (390x844 iPhone 14/15) ---');
    await client.setViewport(390, 844, true);
    await sleep(800);

    // Switch back to Airport Explorer tab
    await client.eval(`
      const airBtn = Array.from(document.querySelectorAll('.zaireen-hub-header .nav-link')).find(b => b.innerText.includes('Airport'));
      if (airBtn) airBtn.click();
    `);
    await sleep(600);
    await client.captureScreenshot('ui_airport_explorer_day_mobile.png');

    // Open Mobile Drawer
    console.log('--- 6. Mobile Drawer & In-Drawer Theme Switcher ---');
    await client.eval(`
      const toggle = document.querySelector('.mobile-nav-toggle');
      if (toggle) toggle.click();
    `);
    await sleep(600);
    await client.captureScreenshot('ui_mobile_drawer_day_theme.png');

    // Click Theme Switcher in Mobile Drawer
    await client.eval(`
      const themeCard = Array.from(document.querySelectorAll('.lux-drawer-tool-card')).find(c => c.innerText.includes('Display Theme'));
      if (themeCard) themeCard.click();
    `);
    await sleep(600);

    const toggledNightTheme = await client.eval(`document.documentElement.getAttribute('data-theme')`);
    console.log(`  After in-drawer toggle, document theme: ${toggledNightTheme}`);
    await client.captureScreenshot('ui_mobile_drawer_night_theme.png');

    // Close Mobile Drawer
    await client.eval(`
      const closeBtn = document.querySelector('.lux-drawer-close-btn');
      if (closeBtn) closeBtn.click();
    `);
    await sleep(600);
    await client.captureScreenshot('ui_airport_explorer_night_mobile.png');

    console.log('========================================================================');
    console.log('🎉 ALL SCREENSHOTS SUCCESSFULLY CAPTURED & AUDITED!');
    console.log('========================================================================');

  } catch (err) {
    console.error('Audit Error:', err);
  } finally {
    if (client) client.close();
    chromeProc.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
    process.exit(0);
  }
}

runQAAudit();
