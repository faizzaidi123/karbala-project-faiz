import { spawn } from 'child_process';
import http from 'http';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9224;

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
  const tempProfile = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_debug_' + Date.now();
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
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('[CONSOLE]', msg.params.args.map(a => a.value || a.description).join(' '));
      }
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

    await send('Runtime.enable');
    await send('Page.enable');

    console.log('Navigating...');
    await send('Page.navigate', { url: 'http://localhost:3000' });

    for (let i = 0; i < 20; i++) {
      const res = await send('Runtime.evaluate', {
        expression: `Boolean(document.getElementById('root')?.children.length > 0)`,
        returnByValue: true
      });
      if (res.result?.value) break;
      await sleep(500);
    }

    const debugInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const headerBtns = Array.from(document.querySelectorAll('.lux-exp-tab-btn')).map((b, i) => ({
          idx: i,
          text: b.textContent.trim(),
          classes: b.className
        }));
        return headerBtns;
      })()`,
      returnByValue: true
    });
    console.log('Header buttons found:', debugInfo.result?.value);

    // Test clicking Airport & Journey
    console.log('Testing click on Airport & Journey...');
    const clickRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('.lux-exp-tab-btn'));
        const j = btns.find(b => b.textContent.includes('Airport'));
        if (j) {
          j.click();
          return 'Clicked: ' + j.textContent.trim();
        }
        return 'Not found';
      })()`,
      returnByValue: true
    });
    console.log('Click result:', clickRes.result?.value);
    await sleep(2000);

    const postClick = await send('Runtime.evaluate', {
      expression: `({
        currentDOMClasses: Array.from(document.querySelectorAll('.lux-exp-tab-btn')).map(b => b.className),
        hasAirportHub: Boolean(document.querySelector('.airport-journey-hub, .airport-explorer-section')),
        mainHTMLSnippet: document.getElementById('root')?.innerHTML.substring(100, 300)
      })`,
      returnByValue: true
    });
    console.log('Post-click state:', postClick.result?.value);

  } finally {
    chromeProc.kill('SIGKILL');
  }
}

main().catch(console.error);
