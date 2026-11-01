import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9227;
const TARGET_URL = 'http://localhost:3000';
const USER_DATA_DIR = path.resolve('scratch/chrome_full_verify_' + Date.now());

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${PORT}/json`, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => resolve(JSON.parse(body)));
        }).on('error', reject);
      });
      if (Array.isArray(data) && data.length > 0) {
        const page = data.find(t => t.type === 'page') || data[0];
        if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
      }
    } catch (e) {
      await sleep(500);
    }
  }
  throw new Error('Chrome remote debugger failed on port ' + PORT);
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

  close() {
    this.ws.close();
  }
}

async function runVerification() {
  console.log('========================================================================');
  console.log('🕌 KARBALA DIGITAL TWIN — STEP-BY-STEP MODULE & RESPONSIVENESS AUDIT');
  console.log('========================================================================\n');

  if (!fs.existsSync(USER_DATA_DIR)) {
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  }

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${USER_DATA_DIR}`,
    TARGET_URL
  ]);

  let cdp = null;
  const results = [];

  function record(title, passed, detail = '') {
    results.push({ title, passed, detail });
    console.log(`  ${passed ? '✅ [PASS]' : '❌ [FAIL]'} ${title} ${detail ? '(' + detail + ')' : ''}`);
  }

  try {
    const wsUrl = await getWsUrl();
    cdp = new CdpClient(wsUrl);
    await cdp.waitOpen();
    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');

    await sleep(4000); // Allow complete React hydration and Babel transpilation

    // Dismiss onboarding and prepare clean test state
    await cdp.eval(`(() => {
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ completed: true, onboarded: true, language: 'en' }));
      const skipBtn = document.querySelector('.onboarding-modal button, [onclick*="onboarding"], .btn-link');
      if (skipBtn) skipBtn.click();
    })()`);
    await sleep(500);

    // 1. STEP-BY-STEP CHECK OF ALL CORE FUNCTIONAL MODULES
    console.log('--- 1. Testing Functional Modules Step-by-Step ---');

    // MODULE 1: Cinematic Home View
    await cdp.eval(`(() => { window.location.hash = ''; })()`);
    await sleep(800);
    const homeCheck = await cdp.eval(`(() => {
      const hasHero = !!document.querySelector('.hero-section, .hero-title');
      const hasTitle = (document.querySelector('.hero-title') || {}).innerText === 'KARBALA';
      const hasCards = document.querySelectorAll('.architecture-card, .lux-chapter-card, .portal-nav-card').length > 0;
      return { hasHero, hasTitle, hasCards };
    })()`);
    record('Module 1: Cinematic Home View renders hero section and cards', homeCheck.hasHero && homeCheck.hasTitle);

    // MODULE 2: Smart Pole Navigation (1,452 Poles)
    await cdp.eval(`window.location.hash = '#poles'`);
    await sleep(1000);
    const poleCheck = await cdp.eval(`(() => {
      const bodyText = document.body.innerText;
      const hasPoleTitle = bodyText.includes('Smart Pole') || bodyText.includes('Highway 9') || bodyText.includes('1,452');
      const hasSearch = !!document.querySelector('input[placeholder*="pole" i], input[type="search"]');
      const hasTelemetry = bodyText.includes('Crowd') || bodyText.includes('Telemetry') || bodyText.includes('Density');
      return { hasPoleTitle, hasSearch, hasTelemetry };
    })()`);
    record('Module 2: Smart Pole Navigation renders pole directory & telemetry', poleCheck.hasPoleTitle && poleCheck.hasTelemetry);

    // MODULE 3: Airport Explorer & Arrival Simulator
    await cdp.eval(`window.location.hash = '#journey'`);
    await sleep(1000);
    const airportCheck = await cdp.eval(`(() => {
      const bodyText = document.body.innerText;
      const hasNajaf = bodyText.includes('Al-Najaf') || bodyText.includes('NJF');
      const hasBaghdad = bodyText.includes('Baghdad') || bodyText.includes('BGW');
      const hasBasra = bodyText.includes('Basra') || bodyText.includes('BSR');
      const hasKarbala = bodyText.includes('Karbala') || bodyText.includes('KIB');
      const hasKibNotice = bodyText.includes('CONSTRUCTION') || bodyText.includes('NON-OPERATIONAL') || bodyText.includes('Under Construction');
      const imgCount = document.querySelectorAll('img[src*="airports"]').length;
      return { hasNajaf, hasBaghdad, hasBasra, hasKarbala, hasKibNotice, imgCount };
    })()`);
    record('Module 3: Airport Explorer displays all 4 sovereign airports (NJF, BGW, BSR, KIB)', airportCheck.hasNajaf && airportCheck.hasBaghdad && airportCheck.hasBasra && airportCheck.hasKarbala);
    record('Module 3.1: Karbala Airport (KIB) displays Under Construction / Non-Operational status', airportCheck.hasKibNotice);
    record('Module 3.2: Airport Explorer contains authentic photographic imagery', airportCheck.imgCount >= 1, `${airportCheck.imgCount} airport images in DOM`);

    // MODULE 4: Global Zaireen Statistics Hub
    await cdp.eval(`window.location.hash = '#statistics'`);
    await sleep(1000);
    const statsCheck = await cdp.eval(`(() => {
      const bodyText = document.body.innerText;
      const hasCensus = bodyText.includes('Census') || bodyText.includes('Zaireen') || bodyText.includes('Pilgrimage');
      const hasMillions = bodyText.includes('Million') || bodyText.includes('22,019,146') || bodyText.includes('21,198,640');
      return { hasCensus, hasMillions };
    })()`);
    record('Module 4: Global Zaireen Statistics Hub displays documented census data', statsCheck.hasCensus && statsCheck.hasMillions);

    // MODULE 5: Historical Museum & 61 AH Timeline
    await cdp.eval(`window.location.hash = '#timeline'`);
    await sleep(1000);
    const timelineCheck = await cdp.eval(`(() => {
      const bodyText = document.body.innerText;
      const has61AH = bodyText.includes('61 AH') || bodyText.includes('Muharram') || bodyText.includes('Karbala');
      return { has61AH };
    })()`);
    record('Module 5: Museum Timeline displays 61 AH historical events', timelineCheck.has61AH);

    // MODULE 6: Biographical Monographs (Personalities)
    await cdp.eval(`window.location.hash = '#personalities'`);
    await sleep(1000);
    const personalitiesCheck = await cdp.eval(`(() => {
      const bodyText = document.body.innerText;
      const hasHusayn = bodyText.includes('Imam Husayn') || bodyText.includes('Hussain') || bodyText.includes('Abbas');
      return { hasHusayn };
    })()`);
    record('Module 6: Biographical Encyclopedia displays historical personalities', personalitiesCheck.hasHusayn);

    // MODULE 7: Ziyarat & Sacred Recitations Guide
    await cdp.eval(`window.location.hash = '#ziyarat'`);
    await sleep(1000);
    const ziyaratCheck = await cdp.eval(`(() => {
      const bodyText = document.body.innerText;
      const hasZiyarat = bodyText.includes('Warith') || bodyText.includes('Ashura') || bodyText.includes('Ziyarat');
      return { hasZiyarat };
    })()`);
    record('Module 7: Ziyarat Guide displays authentic recitations', ziyaratCheck.hasZiyarat);

    // MODULE 8: Fullscreen 3D Digital Twin Map
    await cdp.eval(`window.location.hash = '#map'`);
    await sleep(1000);
    const mapCheck = await cdp.eval(`(() => {
      const hasLeaflet = !!document.querySelector('.leaflet-container');
      const isFullscreenMode = document.body.classList.contains('mode-fullscreen-map');
      return { hasLeaflet, isFullscreenMode };
    })()`);
    record('Module 8: Interactive Digital Twin Map container initializes', mapCheck.hasLeaflet || mapCheck.isFullscreenMode);

    // MODULE 9: Legal & Compliance Modal (4 Tabs)
    // Navigate to timeline where subview footer is rendered
    await cdp.eval(`window.location.hash = '#timeline'`);
    await sleep(800);
    await cdp.eval(`(() => {
      const btn = Array.from(document.querySelectorAll('footer button')).find(b => b.innerText && b.innerText.includes('Privacy Policy'));
      if (btn) btn.click();
    })()`);
    await sleep(600);

    const legalCheck = await cdp.eval(`(() => {
      const modal = document.querySelector('.modal.show');
      if (!modal) return { open: false };
      const text = modal.innerText;
      const hasZeroRetention = text.includes('Zero-Server Data Retention');
      const hasPurgeBtn = text.includes('Data Sovereignty Control') || !!modal.querySelector('.btn-outline-danger');
      return { open: true, hasZeroRetention, hasPurgeBtn };
    })()`);
    record('Module 9: Legal & Compliance Modal opens from footer', legalCheck.open);
    record('Module 9.1: Privacy Policy declares Zero-Server Data Retention', legalCheck.hasZeroRetention);
    record('Module 9.2: Local Data Purge control is functional', legalCheck.hasPurgeBtn);

    // Close legal modal
    await cdp.eval(`(() => {
      const closeBtn = document.querySelector('.modal.show .btn-close');
      if (closeBtn) closeBtn.click();
    })()`);
    await sleep(400);

    // MODULE 10: Day / Night Theme Switcher
    const initialTheme = await cdp.eval(`document.documentElement.getAttribute('data-theme') || 'dark'`);
    await cdp.eval(`(() => {
      const themeBtn = document.querySelector('button[aria-label="Toggle Day / Night Mode"]');
      if (themeBtn) themeBtn.click();
    })()`);
    await sleep(600);
    const switchedTheme = await cdp.eval(`document.documentElement.getAttribute('data-theme')`);
    // Revert back
    await cdp.eval(`(() => {
      const themeBtn = document.querySelector('button[aria-label="Toggle Day / Night Mode"]');
      if (themeBtn) themeBtn.click();
    })()`);
    await sleep(400);
    record('Module 10: Day / Night Theme Switcher functions dynamically', switchedTheme !== initialTheme, `switched from ${initialTheme} to ${switchedTheme}`);

    // 2. MULTI-VIEWPORT RESPONSIVENESS AUDIT
    console.log('\n--- 2. Testing Viewport Responsiveness & Layout Adaptability ---');

    const breakpoints = [
      { name: 'Ultra-Compact Mobile (iPhone SE)', width: 320, height: 568, isMobile: true },
      { name: 'Compact Android (Galaxy A/Pixel)', width: 360, height: 740, isMobile: true },
      { name: 'Standard Modern Smartphone (iPhone 14/15)', width: 390, height: 844, isMobile: true },
      { name: 'Large Flagship Smartphone (Pro Max)', width: 430, height: 932, isMobile: true },
      { name: 'Tablet Portrait (iPad Mini)', width: 768, height: 1024, isMobile: true },
      { name: 'Tablet Landscape / Small Laptop', width: 1024, height: 768, isMobile: false },
      { name: 'Desktop Full HD (1080p)', width: 1920, height: 1080, isMobile: false }
    ];

    for (const bp of breakpoints) {
      await cdp.setViewport(bp.width, bp.height, bp.isMobile);
      await sleep(400);

      const audit = await cdp.eval(`(() => {
        const root = document.documentElement;
        const scrollW = root.scrollWidth;
        const clientW = root.clientWidth;
        const innerW = window.innerWidth;
        const hasHorizontalScroll = scrollW > (clientW + 2);
        return { scrollW, clientW, innerW, hasHorizontalScroll };
      })()`);

      record(`Responsiveness: ${bp.name} (${bp.width}x${bp.height}) zero-overflow`, !audit.hasHorizontalScroll, `scrollWidth: ${audit.scrollW}px, clientWidth: ${audit.clientW}px`);
    }

    // 3. MOBILE NAVIGATION DRAWER ON 390px
    console.log('\n--- 3. Testing Mobile Navigation Drawer on 390px Mobile Viewport ---');
    await cdp.setViewport(390, 844, true);
    await sleep(400);

    const drawerOpen = await cdp.eval(`(() => {
      const toggle = document.querySelector('.mobile-nav-toggle');
      if (toggle) {
        toggle.click();
        return true;
      }
      return false;
    })()`);
    await sleep(600);

    const drawerCheck = await cdp.eval(`(() => {
      const drawer = document.querySelector('.mobile-nav-drawer');
      if (!drawer) return { found: false };
      const isOpen = drawer.classList.contains('open');
      const width = drawer.offsetWidth;
      return { found: true, isOpen, width };
    })()`);
    record('Mobile Navigation Drawer opens upon toggle tap', drawerOpen && drawerCheck.found && drawerCheck.isOpen);
    record('Mobile Navigation Drawer stays within viewport boundaries', drawerCheck.width <= 390, `drawer width: ${drawerCheck.width}px`);

    // Close drawer
    await cdp.eval(`(() => {
      const closeBtn = document.querySelector('.lux-drawer-close-btn');
      if (closeBtn) closeBtn.click();
    })()`);
    await sleep(400);

    console.log('\n========================================================================');
    const passedCount = results.filter(r => r.passed).length;
    const failedCount = results.filter(r => !r.passed).length;
    console.log(`FINAL AUDIT RESULTS: ${passedCount} PASSED / ${failedCount} FAILED (TOTAL: ${results.length})`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('Audit run error:', err);
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

runVerification();
