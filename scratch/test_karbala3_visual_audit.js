import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ef791325-9f6b-447f-bad1-925f18236ef8';
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
          console.error('[Browser Error]', txt);
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

  async captureScreenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`[Screenshot Saved] -> ${filename} (${buffer.length} bytes)`);
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
}

async function main() {
  console.log('=== STARTING KARBALA 3.0 ACCURATE TARGETED VISUAL AUDIT ===');

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_test_k3_v3'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    console.log('CDP WebSocket URL obtained:', wsUrl);

    const cdp = new CdpClient(wsUrl);
    await cdp.connect();

    // Set mobile viewport (390 x 844, iPhone / Android standard mobile)
    await cdp.setViewport(390, 844, true);

    // Initial page load
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/#home' });
    await sleep(2500);

    // Pre-set localStorage to dismiss onboarding modal cleanly
    await cdp.evaluate(`
      localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ lang: 'en', stepFree: false, gpsAssistance: true }));
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip for Now') || b.textContent.includes('Save Preferences'));
      if (skipBtn) skipBtn.click();
    `);
    await sleep(1000);

    // -------------------------------------------------------------
    // Test 1: Then & Now Archival Comparison (Chapter 04 in Home)
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Chapter 04: Then & Now Archival Comparison ---');
    await cdp.evaluate(`
      window.location.hash = 'home';
    `);
    await sleep(1500);

    await cdp.evaluate(`
      const thenNow = document.querySelector('.then-now-container') || Array.from(document.querySelectorAll('h2, h3, h4, section')).find(el => el.textContent.includes('Then & Now'));
      if (thenNow) {
        thenNow.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        window.scrollTo(0, 2600);
      }
    `);
    await sleep(2000);
    await cdp.captureScreenshot('ui_k3_03_then_now_archival_slider.png');

    // -------------------------------------------------------------
    // Test 2: AR Sacred Beacon Modal Guidance Prototype
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing AR Sacred Beacon Guidance Prototype ---');
    await cdp.evaluate(`
      window.location.hash = 'ziyarat';
    `);
    await sleep(2000);

    // Click AR Guidance button in Pillar 3
    await cdp.evaluate(`
      const arBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.textContent.includes('AR Beacon View') || b.textContent.includes('AR Guidance')
      );
      if (arBtn) arBtn.click();
    `);
    await sleep(2000);

    const isArOpen = await cdp.evaluate(`!!document.querySelector('.ar-beacon-modal-sheet')`);
    console.log('Is AR Beacon Modal open in DOM:', isArOpen);
    await cdp.captureScreenshot('ui_k3_01_ar_beacon_view.png');

    // Close AR Modal reliably
    await cdp.evaluate(`
      const closeBtn = document.querySelector('button[aria-label="Close AR view"]') || document.querySelector('.ar-beacon-modal-sheet');
      if (closeBtn) closeBtn.click();
    `);
    await sleep(1500);
    const isArStillOpen = await cdp.evaluate(`!!document.querySelector('.ar-beacon-modal-sheet')`);
    console.log('Is AR Modal closed:', !isArStillOpen);

    // -------------------------------------------------------------
    // Test 3: Advanced Pilgrimage Planner Reordering in My Ziyarat
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Advanced Pilgrimage Planner Reordering ---');
    // Open amenities drawer
    await cdp.evaluate(`
      const drawerTrigger = document.querySelector('.amenities-drawer-trigger');
      if (drawerTrigger) drawerTrigger.click();
    `);
    await sleep(1500);

    // Click "Ziyarat Planner Tracks" tab
    await cdp.evaluate(`
      const plannerTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Ziyarat Planner Tracks'));
      if (plannerTab) plannerTab.click();
    `);
    await sleep(1500);

    // Scroll down to editable sequence
    await cdp.evaluate(`
      const seq = Array.from(document.querySelectorAll('h4, div, span')).find(d => 
        d.textContent.includes('Editable Pilgrimage Sequence') || d.textContent.includes('Move Up')
      );
      if (seq) {
        seq.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo(0, 800);
      }
    `);
    await sleep(1200);
    await cdp.captureScreenshot('ui_k3_02_itinerary_planner_reorder.png');

    // -------------------------------------------------------------
    // Test 4: Ask Karbala AI with Contextual Action Pills
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Ask Karbala AI Hub & Contextual Action Pills ---');
    await cdp.evaluate(`
      window.location.hash = 'ai';
    `);
    await sleep(2000);

    // Submit a query
    await cdp.evaluate(`
      const input = document.querySelector('.chat-input-field') || document.querySelector('input[type="text"]');
      if (input) {
        input.value = "How do I reach Hazrat Abbas shrine?";
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const sendBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.textContent.includes('Send') || b.querySelector('i.bi-send-fill') || b.innerHTML.includes('bi-send')
      );
      if (sendBtn) sendBtn.click();
    `);
    console.log('Sent query to Ask Karbala AI. Waiting for response...');
    await sleep(4000);

    // Scroll chat to bring assistant message and contextual pills into focus
    await cdp.evaluate(`
      const actions = document.querySelector('.chat-contextual-actions');
      if (actions) {
        actions.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        const msgContainer = document.querySelector('.chat-messages-container, .card-body');
        if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);
      }
    `);
    await sleep(1500);
    await cdp.captureScreenshot('ui_k3_04_ai_assistant_contextual_actions.png');

    // -------------------------------------------------------------
    // Test 5: Emergency Pilgrim Modal (Hotlines, Column 18 Protocol, Peer Sharing)
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Emergency Modal & Column 18 Safety Protocol ---');
    await cdp.evaluate(`
      const emergBtn = document.querySelector('button.mobile-nav-item.emergency-item') || 
                       document.querySelector('button.lux-action-pill.emergency') || 
                       document.querySelector('.emergency-persistent-pill');
      if (emergBtn) emergBtn.click();
    `);
    await sleep(2000);

    const isEmergOpen = await cdp.evaluate(`!!document.querySelector('.column-18-protocol-card') || !!document.querySelector('.emergency-hotline-card')`);
    console.log('Is Emergency Modal open in DOM:', isEmergOpen);

    // Scroll modal down slightly to center Column 18 Protocol card
    await cdp.evaluate(`
      const card = document.querySelector('.column-18-protocol-card');
      if (card) {
        card.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) modalBody.scrollTop = 180;
      }
    `);
    await sleep(1200);
    await cdp.captureScreenshot('ui_k3_05_column18_emergency_safety.png');

    console.log('\n=== KARBALA 3.0 ACCURATE TARGETED AUDIT FINISHED ===');
    console.log(`Browser Console Errors: ${cdp.consoleErrors.length}`);
    if (cdp.consoleErrors.length > 0) {
      console.log('Console Errors:', cdp.consoleErrors);
    }
  } catch (err) {
    console.error('Visual Audit Failed:', err);
  } finally {
    chromeProc.kill();
  }
}

main();
