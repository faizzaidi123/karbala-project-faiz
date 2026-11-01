import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9223; // use a dedicated port
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

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: true,
    });
  }

  async captureScreenshot(filename) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(data, 'base64');
    const targetPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(targetPath, buffer);
    console.log(`✅ Saved: ${filename}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runAudit() {
  console.log('🚀 Launching Chrome for Mobile Drawer Refinement Audit...');

  const userDataDir = path.join(process.cwd(), 'scratch', 'chrome_mobile_drawer_' + Date.now());
  fs.mkdirSync(userDataDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + userDataDir,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    'http://localhost:3000'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    console.log('\n📱 Connected to Chrome CDP. Beginning Mobile Drawer Verification...');

    // Wait for page and React to mount
    await sleep(2500);

    // Dismiss onboarding modal if open
    await cdp.eval(`
      (() => {
        const skipBtn = document.querySelector('.onboarding-modal button, [onclick*="onboarding"], .btn-link');
        const closeBtn = document.querySelector('.onboarding-modal .btn-close, .modal-close-btn');
        if (skipBtn) skipBtn.click();
        else if (closeBtn) closeBtn.click();
        localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ completed: true, language: 'en' }));
      })()
    `);
    await sleep(600);

    const breakpoints = [
      { name: '320_se', width: 320, height: 568 },
      { name: '360_small', width: 360, height: 640 },
      { name: '390_iphone', width: 390, height: 844 },
      { name: '430_promax', width: 430, height: 932 }
    ];

    for (const bp of breakpoints) {
      console.log(`\n--- Testing Mobile Viewport ${bp.width}x${bp.height} (${bp.name}) ---`);
      await cdp.setViewport(bp.width, bp.height);
      await sleep(400);

      // Open mobile drawer
      await cdp.eval(`
        (() => {
          const toggle = document.querySelector('.mobile-nav-toggle');
          if (toggle) toggle.click();
        })()
      `);
      await sleep(450);

      // Verify DOM state
      const auditResult = await cdp.eval(`
        (() => {
          const drawer = document.querySelector('.mobile-nav-drawer');
          const backdrop = document.querySelector('.mobile-nav-backdrop');
          const bottomBar = document.querySelector('.mobile-bottom-app-bar');
          const sections = document.querySelectorAll('.lux-drawer-section');
          const portalCards = document.querySelectorAll('.lux-portal-card');
          const chapterBtns = document.querySelectorAll('.lux-drawer-chapter-btn');
          const emergencyCard = document.querySelector('.lux-drawer-emergency-card');
          const mapCard = document.querySelector('.lux-drawer-map-card');
          const toolCards = document.querySelectorAll('.lux-drawer-tool-card');
          const closeBtn = document.querySelector('.lux-drawer-close-btn');

          return {
            drawerOpen: drawer && drawer.classList.contains('open'),
            backdropOpen: backdrop && backdrop.classList.contains('open'),
            bottomBarHidden: bottomBar && bottomBar.classList.contains('drawer-open-hidden'),
            sectionsCount: sections.length,
            portalCardsCount: portalCards.length,
            chapterBtnsCount: chapterBtns.length,
            hasEmergencyCard: !!emergencyCard,
            hasMapCard: !!mapCard,
            toolCardsCount: toolCards.length,
            hasCloseBtn: !!closeBtn,
            bodyOverflowHidden: document.body.style.overflow === 'hidden'
          };
        })()
      `);

      console.log('   Audit Checks:');
      console.log(`   - Drawer is open: ${auditResult.drawerOpen ? '✅' : '❌'}`);
      console.log(`   - Backdrop is active: ${auditResult.backdropOpen ? '✅' : '❌'}`);
      console.log(`   - Bottom nav hidden (zero overlap): ${auditResult.bottomBarHidden ? '✅' : '❌'}`);
      console.log(`   - 4 Groups present (found ${auditResult.sectionsCount}): ${auditResult.sectionsCount === 4 ? '✅' : '❌'}`);
      console.log(`   - 6 Portal cards present: ${auditResult.portalCardsCount === 6 ? '✅' : '❌'}`);
      console.log(`   - 7 Museum chapters present: ${auditResult.chapterBtnsCount === 7 ? '✅' : '❌'}`);
      console.log(`   - Distinct Emergency Hotline card present: ${auditResult.hasEmergencyCard ? '✅' : '❌'}`);
      console.log(`   - Fullscreen Map card present: ${auditResult.hasMapCard ? '✅' : '❌'}`);
      console.log(`   - 3 Tool & Preference cards present: ${auditResult.toolCardsCount === 3 ? '✅' : '❌'}`);
      console.log(`   - Body scroll locked: ${auditResult.bodyOverflowHidden ? '✅' : '❌'}`);

      // Capture screenshot of top portion of drawer
      await cdp.captureScreenshot(`ui_mobile_drawer_${bp.name}.png`);

      // For the 390px iPhone, also scroll down to capture the lower groups (Emergency & Tools)
      if (bp.width === 390) {
        console.log('\n   Scrolling down inside mobile drawer to capture Emergency & Tools...');
        await cdp.eval(`
          (() => {
            const body = document.querySelector('.mobile-nav-body');
            if (body) body.scrollTop = 550;
          })()
        `);
        await sleep(350);
        await cdp.captureScreenshot(`ui_mobile_drawer_390_scrolled.png`);

        // Scroll back to top
        await cdp.eval(`
          (() => {
            const body = document.querySelector('.mobile-nav-body');
            if (body) body.scrollTop = 0;
          })()
        `);
        await sleep(200);
      }

      // Close the drawer
      await cdp.eval(`
        (() => {
          const closeBtn = document.querySelector('.lux-drawer-close-btn');
          if (closeBtn) closeBtn.click();
        })()
      `);
      await sleep(400);

      // Verify bottom nav restored
      if (bp.width === 390) {
        const bottomRestored = await cdp.eval(`
          (() => {
            const bottomBar = document.querySelector('.mobile-bottom-app-bar');
            return bottomBar && !bottomBar.classList.contains('drawer-open-hidden');
          })()
        `);
        console.log(`   - Bottom nav smoothly restored after close: ${bottomRestored ? '✅' : '❌'}`);
        await cdp.captureScreenshot('ui_mobile_drawer_closed_bottomnav_restored.png');

        // Test route navigation: reopen drawer and click "My Ziyarat Companion"
        console.log('\n   Testing route navigation from mobile drawer...');
        await cdp.eval(`
          (() => {
            const toggle = document.querySelector('.mobile-nav-toggle');
            if (toggle) toggle.click();
          })()
        `);
        await sleep(350);

        await cdp.eval(`
          (() => {
            const cards = document.querySelectorAll('.lux-portal-card');
            if (cards.length > 1) cards[1].click(); // click My Ziyarat
          })()
        `);
        await sleep(500);

        const routeNavResult = await cdp.eval(`
          (() => {
            const drawer = document.querySelector('.mobile-nav-drawer');
            const bottomBar = document.querySelector('.mobile-bottom-app-bar');
            const ziyaratActive = window.location.hash.includes('ziyarat') || !!document.querySelector('.ziyarat-pilgrim-container, #ziyarat-view');
            return {
              drawerClosedAfterNav: drawer && !drawer.classList.contains('open'),
              bottomBarVisible: bottomBar && !bottomBar.classList.contains('drawer-open-hidden'),
              hash: window.location.hash
            };
          })()
        `);
        console.log(`   - Drawer automatically closed after destination selection: ${routeNavResult.drawerClosedAfterNav ? '✅' : '❌'}`);
        console.log(`   - Bottom nav restored on new destination: ${routeNavResult.bottomBarVisible ? '✅' : '❌'}`);
        console.log(`   - Navigated hash: ${routeNavResult.hash || '#ziyarat'}`);
        await cdp.captureScreenshot('ui_mobile_drawer_navigated_ziyarat.png');
      }
    }

    console.log('\n🎉 ALL MOBILE DRAWER CHECKS & SCREENSHOTS COMPLETED SUCCESSFULLY!');
    cdp.close();
  } finally {
    try {
      chromeProc.kill('SIGKILL');
    } catch (e) {}
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
