import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9248;

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
  const proc = spawn(CHROME, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    'http://localhost:3000/'
  ]);

  try {
    const wsUrl = await getWsUrl();
    const cdp = new CDP(wsUrl);
    await cdp.connect();

    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');

    await cdp.send('Runtime.evaluate', {
      expression: `localStorage.setItem('karbala_pilgrim_prefs', JSON.stringify({ language: 'en', stepFree: false, gpsAssist: true, onboarded: true }));`
    });
    await cdp.send('Page.navigate', { url: 'http://localhost:3000/' });
    await sleep(4000);

    const testViewports = [
      { name: 'Mobile 360', width: 360, height: 740 },
      { name: 'Mobile 390', width: 390, height: 844 },
      { name: 'Tablet 768', width: 768, height: 1024 },
      { name: 'Desktop 1440', width: 1440, height: 900 }
    ];

    for (const vp of testViewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 992
      });
      await sleep(1000);

      const overflowRes = await cdp.send('Runtime.evaluate', {
        expression: `(function() {
          var docWidth = document.documentElement.clientWidth;
          var bodyScrollWidth = document.body.scrollWidth;
          var docScrollWidth = document.documentElement.scrollWidth;
          var overflowingElements = [];

          var all = document.querySelectorAll('*');
          for (var i = 0; i < all.length; i++) {
            var el = all[i];
            var rect = el.getBoundingClientRect();
            if (rect.right > docWidth + 2) {
              overflowingElements.push({
                tag: el.tagName,
                className: (el.className || '').toString().slice(0, 50),
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                overflowAmount: Math.round(rect.right - docWidth)
              });
            }
          }
          return {
            docWidth: docWidth,
            bodyScrollWidth: bodyScrollWidth,
            docScrollWidth: docScrollWidth,
            hasHorizontalScroll: docScrollWidth > docWidth,
            overflowCount: overflowingElements.length,
            topOverflows: overflowingElements.slice(0, 8)
          };
        })()`,
        returnByValue: true
      });

      console.log(`\n=== Overflow Audit for ${vp.name} (${vp.width}x${vp.height}) ===`);
      console.log(JSON.stringify(overflowRes.result?.value, null, 2));
    }

  } finally {
    proc.kill();
  }
}

run().catch(console.error);
