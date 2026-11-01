import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const CD_PORT = 9223;
const TARGET_URL = 'http://localhost:3000';
const USER_DATA_DIR = path.resolve('scratch/chrome_resp_qa_' + Date.now());

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${CD_PORT}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const list = JSON.parse(data);
          const page = list.find(t => t.type === 'page');
          if (page && page.webSocketDebuggerUrl) {
            resolve(page.webSocketDebuggerUrl);
          } else if (list.length > 0) {
            resolve(list[0].webSocketDebuggerUrl);
          } else {
            reject(new Error('No page target found'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new globalThis.WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  async waitOpen() {
    if (this.ws.readyState === globalThis.WebSocket.OPEN) return;
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile
    });
  }

  async screenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outputPath, Buffer.from(res.data, 'base64'));
  }

  close() {
    this.ws.close();
  }
}

async function main() {
  console.log('========================================================================');
  console.log('📱 KARBALA DIGITAL TWIN — FULL FUNCTIONAL & MULTI-VIEWPORT AUDIT');
  console.log('========================================================================\n');

  if (!fs.existsSync(USER_DATA_DIR)) {
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  }

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CD_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${USER_DATA_DIR}`,
    TARGET_URL
  ]);

  let cdp = null;
  const testResults = [];

  function record(title, passed, detail = '') {
    testResults.push({ title, passed, detail });
    console.log(`  ${passed ? '✅ [PASS]' : '❌ [FAIL]'} ${title} ${detail ? '(' + detail + ')' : ''}`);
  }

  try {
    let wsUrl = null;
    for (let i = 0; i < 20; i++) {
      await sleep(500);
      try {
        wsUrl = await getWsUrl();
        if (wsUrl) break;
      } catch (e) {}
    }

    if (!wsUrl) throw new Error('Could not connect to Chrome DevTools Protocol');

    cdp = new CdpClient(wsUrl);
    await cdp.waitOpen();
    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');

    await sleep(2500); // Allow initial React hydration

    console.log('--- 1. Testing Multi-Viewport Responsiveness & Zero-Overflow ---');

    const viewports = [
      { name: 'iPhone SE (Ultra-Compact)', width: 320, height: 640, isMobile: true },
      { name: 'Standard Android Compact', width: 360, height: 780, isMobile: true },
      { name: 'iPhone 13/14/15 Standard', width: 390, height: 844, isMobile: true },
      { name: 'iPhone Pro Max (Wide Mobile)', width: 430, height: 932, isMobile: true },
      { name: 'iPad Mini / Tablet Portrait', width: 768, height: 1024, isMobile: true },
      { name: 'iPad Pro / Small Laptop', width: 1024, height: 768, isMobile: false },
      { name: 'Full HD Desktop Display', width: 1920, height: 1080, isMobile: false }
    ];

    for (const vp of viewports) {
      await cdp.setViewport(vp.width, vp.height, vp.isMobile);
      await sleep(400);

      const check = await cdp.eval(`(() => {
        const root = document.documentElement;
        const body = document.body;
        const scrollWidth = root.scrollWidth;
        const clientWidth = root.clientWidth;
        const innerWidth = window.innerWidth;
        const overflowX = scrollWidth > (clientWidth + 2); // allowance for rounding
        return { scrollWidth, clientWidth, innerWidth, overflowX };
      })()`);

      record(`Viewport ${vp.name} (${vp.width}x${vp.height}) has zero horizontal overflow`, !check.overflowX, `scrollWidth: ${check.scrollWidth}, clientWidth: ${check.clientWidth}`);
    }

    console.log('\n--- 2. Testing Mobile Navigation Drawer on 390px Viewport ---');
    await cdp.setViewport(390, 844, true);
    await sleep(300);

    // Check hamburger button exists and click it
    const drawerOpenSuccess = await cdp.eval(`(() => {
      const toggle = document.querySelector('.lux-mobile-menu-btn, .mobile-menu-toggle, [aria-label="Toggle navigation"]');
      if (toggle) {
        toggle.click();
        return true;
      }
      return false;
    })()`);
    record('Mobile drawer hamburger button triggers open', drawerOpenSuccess);
    await sleep(600);

    const drawerState = await cdp.eval(`(() => {
      const drawer = document.querySelector('.lux-mobile-drawer, .mobile-nav-drawer');
      if (!drawer) return { found: false };
      const isVisible = drawer.classList.contains('active') || drawer.classList.contains('show') || window.getComputedStyle(drawer).display !== 'none';
      const width = drawer.offsetWidth;
      return { found: true, isVisible, width };
    })()`);
    record('Mobile navigation drawer expands within viewport bounds', drawerState.found && drawerState.isVisible && drawerState.width <= 390, `drawer width: ${drawerState.width}px`);

    // Close drawer
    await cdp.eval(`(() => {
      const closeBtn = document.querySelector('.lux-drawer-close, .lux-drawer-backdrop');
      if (closeBtn) closeBtn.click();
    })()`);
    await sleep(400);

    console.log('\n--- 3. Testing Core Route Transitions & View Rendering ---');

    // Return to desktop for subview inspection
    await cdp.setViewport(1440, 900, false);
    await sleep(400);

    // Test Navigation to Smart Pole Hub
    await cdp.eval(`window.__NAVIGATE && window.__NAVIGATE('smart-poles') || (window.location.hash = '#smart-poles')`);
    await sleep(800);
    const poleCheck = await cdp.eval(`(() => {
      const el = document.querySelector('.smart-pole-hub-root, .pole-nav-card, input[placeholder*="pole"]');
      return !!el || document.body.innerText.includes('Smart Pole') || document.body.innerText.includes('Highway 9');
    })()`);
    record('Smart Pole Navigation view mounts successfully', poleCheck);

    // Test Navigation to Airport Explorer
    await cdp.eval(`window.__NAVIGATE && window.__NAVIGATE('airports') || (window.location.hash = '#airports')`);
    await sleep(800);
    const airportCheck = await cdp.eval(`(() => {
      const title = document.body.innerText.includes('Al-Najaf') || document.body.innerText.includes('Baghdad') || document.querySelector('.airport-explorer-container');
      const njfImg = document.querySelector('img[src*="najaf"]');
      return { title: !!title, hasImg: !!njfImg };
    })()`);
    record('Airport Explorer & Journey view mounts successfully', airportCheck.title);
    record('Al-Najaf Airport exterior photograph rendered in DOM', airportCheck.hasImg);

    // Test Navigation to Zaireen Statistics Hub
    await cdp.eval(`window.__NAVIGATE && window.__NAVIGATE('stats') || (window.location.hash = '#stats')`);
    await sleep(800);
    const statsCheck = await cdp.eval(`(() => {
      return document.body.innerText.includes('Zaireen') || document.body.innerText.includes('Pilgrimage') || document.body.innerText.includes('Census');
    })()`);
    record('Global Zaireen Statistics Hub mounts successfully', statsCheck);

    // Test Navigation to Historiographical Timeline
    await cdp.eval(`window.__NAVIGATE && window.__NAVIGATE('timeline') || (window.location.hash = '#timeline')`);
    await sleep(800);
    const timelineCheck = await cdp.eval(`(() => {
      return document.body.innerText.includes('61 AH') || document.body.innerText.includes('Muharram') || document.body.innerText.includes('Ashura');
    })()`);
    record('Historical Museum & 61 AH Timeline mounts successfully', timelineCheck);

    // Return to Home
    await cdp.eval(`window.__NAVIGATE && window.__NAVIGATE('home') || (window.location.hash = '#home')`);
    await sleep(800);

    console.log('\n--- 4. Testing Legal & Compliance Modal Across Tabs ---');
    const openLegal = await cdp.eval(`(() => {
      const btn = document.querySelector('[data-legal-tab="privacy"], .footer-legal-link, .lux-drawer-tool-card');
      if (btn) { btn.click(); return true; }
      return false;
    })()`);
    await sleep(500);

    const legalModalCheck = await cdp.eval(`(() => {
      const modal = document.querySelector('.legal-compliance-overlay, .legal-modal-card');
      if (!modal) return { open: false };
      const hasPrivacy = modal.innerText.includes('Zero-Server Data Retention');
      const hasPurgeBtn = !!modal.querySelector('.purge-btn, [data-purge="true"]');
      return { open: true, hasPrivacy, hasPurgeBtn };
    })()`);
    record('Legal & Compliance Modal opens cleanly', legalModalCheck.open);
    record('Privacy Policy tab displays Zero-Retention policy', legalModalCheck.hasPrivacy);
    record('Local Data Purge control is present in Privacy tab', legalModalCheck.hasPurgeBtn);

    // Close legal modal
    await cdp.eval(`(() => {
      const closeBtn = document.querySelector('.legal-close-btn, .legal-compliance-overlay');
      if (closeBtn) closeBtn.click();
    })()`);
    await sleep(400);

    console.log('\n--- 5. Testing Day / Night Theme Switcher ---');
    const themeTest = await cdp.eval(`(() => {
      const initialTheme = document.documentElement.getAttribute('data-theme') || 'night';
      const toggle = document.querySelector('.theme-switch-btn, [aria-label*="theme"], [title*="Theme"], .lux-theme-toggle');
      if (toggle) {
        toggle.click();
        const switchedTheme = document.documentElement.getAttribute('data-theme');
        toggle.click(); // revert back
        const finalTheme = document.documentElement.getAttribute('data-theme');
        return { success: true, initialTheme, switchedTheme, finalTheme };
      }
      return { success: false };
    })()`);
    record('Day/Night theme toggle switches theme dynamically', themeTest.success && themeTest.switchedTheme !== themeTest.initialTheme, `from ${themeTest.initialTheme} to ${themeTest.switchedTheme}`);

    console.log('\n========================================================================');
    const totalPassed = testResults.filter(t => t.passed).length;
    const totalFailed = testResults.filter(t => !t.passed).length;
    console.log(`VERIFICATION SUMMARY: ${totalPassed} PASSED / ${totalFailed} FAILED (TOTAL: ${testResults.length})`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    if (cdp) cdp.close();
    chromeProc.kill('SIGTERM');
    await sleep(1000);
    try {
      if (fs.existsSync(USER_DATA_DIR)) {
        fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
      }
    } catch (e) {}
  }
}

main();
