import { spawn } from 'child_process';
import http from 'http';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9223;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
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

async function main() {
  const tempProfile = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_dev_diag_' + Date.now();
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
        console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('[BROWSER EXCEPTION]', JSON.stringify(msg.params.exceptionDetails));
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
    await send('DOM.enable');

    console.log('Navigating to http://localhost:3000...');
    await send('Page.navigate', { url: 'http://localhost:3000' });

    for (let i = 0; i < 10; i++) {
      await sleep(1000);
      const evalRes = await send('Runtime.evaluate', {
        expression: `({
          title: document.title,
          rootChildren: document.getElementById('root') ? document.getElementById('root').children.length : null,
          rootHTML: document.getElementById('root') ? document.getElementById('root').innerHTML.substring(0, 150) : null,
          bodyHTML: document.body.innerHTML.substring(0, 150)
        })`,
        returnByValue: true
      });
      console.log(`[Status ${i+1}s]`, evalRes.result?.value);
      if (evalRes.result?.value?.rootChildren > 0) {
        console.log('Root populated!');
        break;
      }
    }

  } finally {
    chromeProc.kill('SIGKILL');
  }
}

main().catch(err => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
