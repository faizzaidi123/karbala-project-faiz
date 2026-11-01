import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ef791325-9f6b-447f-bad1-925f18236ef8\\scratch\\chrome_m5_perfect';
const port = 9350;
const outDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ef791325-9f6b-447f-bad1-925f18236ef8';

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1920,1080',
  'about:blank'
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await res.json();
      return data.webSocketDebuggerUrl;
    } catch (e) {
      await sleep(250);
    }
  }
  throw new Error('Chrome debug endpoint timeout');
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    let id = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise((res) => { ws.onopen = res; });

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        pending.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    console.log('Creating browser target for http://localhost:3000/#ai ...');
    const target = await send('Target.createTarget', { url: 'http://localhost:3000/#ai' });
    const targetId = target.targetId;

    const wsTargetUrl = `ws://127.0.0.1:${port}/devtools/page/${targetId}`;
    const pageWs = new WebSocket(wsTargetUrl);
    let pageId = 1;
    const pagePending = new Map();
    const consoleErrors = [];

    pageWs.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
          consoleErrors.push(text);
          console.error('[BROWSER ERROR]', text);
        }
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text;
        consoleErrors.push(desc);
        console.error('[BROWSER EXCEPTION]', desc);
      }
      if (pagePending.has(msg.id)) {
        const { resolve, reject } = pagePending.get(msg.id);
        pagePending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise((res) => { pageWs.onopen = res; });

    function pageSend(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = pageId++;
        pagePending.set(msgId, { resolve, reject });
        pageWs.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await pageSend('Runtime.enable');
    await pageSend('Page.enable');

    async function capture(filename) {
      const { data } = await pageSend('Page.captureScreenshot', { format: 'png' });
      const dest = path.join(outDir, filename);
      fs.writeFileSync(dest, Buffer.from(data, 'base64'));
      console.log(`Saved screenshot: ${filename} (${(data.length * 0.75 / 1024).toFixed(1)} KB)`);
    }

    async function evaluate(expression) {
      const res = await pageSend('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      return res.result?.value;
    }

    async function setViewport(width, height, isMobile = false) {
      await pageSend('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: isMobile
      });
      await sleep(400);
    }

    console.log('Waiting for Babel and React to mount...');
    await sleep(4500);

    // Switch to Scan & Discover / Identify Landmark
    await evaluate(`
      const cards = document.querySelectorAll('.scan-action-card');
      for (const card of cards) {
        if (card.textContent.includes('Identify Shrine') || card.textContent.includes('Landmark')) {
          card.click();
          break;
        }
      }
    `);
    await sleep(1500);

    // Trigger recognition for Imam Hussain Shrine
    await evaluate(`window.__triggerLandmarkRecognition('shrine_hussain_dome_day');`);
    await sleep(1200);

    // 1. Scan & Discover Hero
    console.log('Capturing ui_m5_01_scan_discover_hero.png...');
    await setViewport(1920, 1080);
    await evaluate('window.scrollTo(0, 0)');
    await sleep(500);
    await capture('ui_m5_01_scan_discover_hero.png');

    // 2. Viewfinder & Specimen Selector
    console.log('Capturing ui_m5_02_landmark_scanning_viewfinder.png...');
    await evaluate(`
      const target = document.querySelector('.landmark-recognition-section');
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    `);
    await sleep(600);
    await capture('ui_m5_02_landmark_scanning_viewfinder.png');

    // 3. Candidates Ranking & Match Result (Run benchmark report)
    console.log('Capturing ui_m5_03_landmark_candidates_ranking.png...');
    await evaluate(`
      const benchBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Benchmark'));
      if (benchBtn) benchBtn.click();
    `);
    await sleep(1500);
    await capture('ui_m5_03_landmark_candidates_ranking.png');

    // 4. Museum Landmark Profile Modal: Imam Hussain Shrine
    console.log('Capturing ui_m5_04_landmark_profile_hussain.png...');
    await evaluate(`window.__openLandmarkProfile('landmark_hussain');`);
    await sleep(1200);
    await capture('ui_m5_04_landmark_profile_hussain.png');

    // 5. Museum Landmark Profile Modal: Al-Abbas Shrine
    console.log('Capturing ui_m5_05_landmark_profile_abbas.png...');
    await evaluate(`window.__openLandmarkProfile('landmark_abbas');`);
    await sleep(1200);
    await capture('ui_m5_05_landmark_profile_abbas.png');

    // 6. Museum Landmark Profile Modal: Najaf Imam Ali Holy Shrine
    console.log('Capturing ui_m5_06_landmark_profile_najaf_ali.png...');
    await evaluate(`window.__openLandmarkProfile('landmark_imam_ali');`);
    await sleep(1200);
    await capture('ui_m5_06_landmark_profile_najaf_ali.png');

    // 7. Landmark Connected Personality (Sayyida Zaynab / Imam Hussain)
    console.log('Capturing ui_m5_07_landmark_connected_personality.png...');
    await evaluate(`window.__openLandmarkProfile('landmark_tal_zaynabiyya');`);
    await sleep(1000);
    await evaluate(`
      const modalBody = document.querySelector('.landmark-modal-body');
      if (modalBody) modalBody.scrollTop = 420;
    `);
    await sleep(600);
    await capture('ui_m5_07_landmark_connected_personality.png');

    // Close modal
    await evaluate(`
      const closeBtn = document.querySelector('.landmark-modal-dialog .btn-close');
      if (closeBtn) closeBtn.click();
    `);
    await sleep(600);

    // 8. Unknown Landmark Neutral Rejection (Negative Control Test)
    console.log('Capturing ui_m5_08_unknown_landmark_rejection.png...');
    await evaluate(`window.__triggerLandmarkRecognition('unknown_coffee_cup');`);
    await sleep(1500);
    await capture('ui_m5_08_unknown_landmark_rejection.png');

    // 9. Mobile Viewport Landmark Recognition (390 x 844 iPhone 14)
    console.log('Capturing ui_m5_09_mobile_landmark_recognition_390.png...');
    await setViewport(390, 844, true);
    await evaluate(`window.__triggerLandmarkRecognition('shrine_hussain_dome_day');`);
    await sleep(1200);
    await evaluate('window.scrollTo(0, 320)');
    await sleep(600);
    await capture('ui_m5_09_mobile_landmark_recognition_390.png');

    // 10. Mobile Viewport Landmark Profile (390 x 844)
    console.log('Capturing ui_m5_10_mobile_landmark_profile_390.png...');
    await evaluate(`window.__openLandmarkProfile('landmark_hussain');`);
    await sleep(1200);
    await capture('ui_m5_10_mobile_landmark_profile_390.png');

    console.log('\n=== VERIFICATION SUMMARY ===');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    } else {
      console.log('SUCCESS: ZERO console errors detected during full test execution!');
    }

    pageWs.close();
    ws.close();
    chrome.kill();
    process.exit(0);
  } catch (err) {
    console.error('Fatal execution error:', err);
    chrome.kill();
    process.exit(1);
  }
}

run();
