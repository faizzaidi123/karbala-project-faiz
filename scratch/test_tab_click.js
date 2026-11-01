import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9226;
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd028911-fdd8-41a3-9c53-4a3b92d0ceef';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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
  throw new Error('Chrome remote debugger failed');
}

async function main() {
  const tempProfile = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_tab_' + Date.now();
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
    const WS = globalThis.WebSocket;
    const ws = new WS(wsUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    let id = 1;
    const callbacks = new Map();
    ws.onmessage = event => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = id++;
        callbacks.set(curId, { resolve, reject });
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    async function screenshot(filePath) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    }

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 920,
      deviceScaleFactor: 2,
      mobile: false
    });

    console.log('Navigating to #poles...');
    await send('Page.navigate', { url: 'http://localhost:3000/#poles' });
    await sleep(4000);

    // Dismiss onboarding modal
    console.log('Dismissing onboarding modal...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', stepFree: false, gpsAssist: true, onboarded: true, timestamp: new Date().toISOString() }));
        const btns = Array.from(document.querySelectorAll('button, span'));
        const skip = btns.find(b => b.textContent && b.textContent.includes('Skip for Now'));
        if (skip) skip.click();
        const closeX = document.querySelector('.modal button.btn-close, .modal .btn-close, [aria-label="Close"]');
        if (closeX) closeX.click();
        // Remove backdrop and modal overlay if present
        document.querySelectorAll('.modal, .modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style = '';
      })()`
    });
    await sleep(1500);

    // 1. Click Milestone Poles Directory (Image 2)
    console.log('Clicking Milestone Poles Directory...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const dir = btns.find(b => b.textContent.includes('Milestone Poles Directory'));
        if (dir) dir.click();
      })()`
    });
    await sleep(2500);

    const dirPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_directory.png');
    await screenshot(dirPic);
    console.log('✅ Captured Milestone Poles Directory screenshot:', dirPic);

    // 2. Click Smart Distance Calculator
    console.log('Clicking Smart Distance Calculator...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const calc = btns.find(b => b.textContent.includes('Smart Distance Calculator'));
        if (calc) calc.click();
      })()`
    });
    await sleep(2500);

    const calcPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_calculator.png');
    await screenshot(calcPic);
    console.log('✅ Captured Smart Distance Calculator screenshot:', calcPic);

    // 3. Click Map tab (Images 1 & 4)
    console.log('Clicking Interactive Pole Map (Images 1 & 4)...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const map = btns.find(b => b.textContent.includes('Interactive Pole Map'));
        if (map) map.click();
      })()`
    });
    await sleep(2500);
    const mapPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_map.png');
    await screenshot(mapPic);
    console.log('✅ Recaptured Map screenshot:', mapPic);

    // 4. Click Crowd tab (Image 3)
    console.log('Clicking Live Crowd Intelligence (Image 3)...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const crowd = btns.find(b => b.textContent.includes('Live Crowd Intelligence'));
        if (crowd) crowd.click();
      })()`
    });
    await sleep(2500);
    const crowdPic = path.join(ARTIFACT_DIR, 'ui_live_pole_navigation_crowd.png');
    await screenshot(crowdPic);
    console.log('✅ Recaptured Crowd screenshot:', crowdPic);

  } finally {
    chromeProc.kill('SIGKILL');
  }
}

main().catch(console.error);
