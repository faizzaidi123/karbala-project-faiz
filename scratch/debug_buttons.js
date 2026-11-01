import http from 'http';
import { spawn } from 'child_process';

const p = spawn('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9226',
  '--no-first-run',
  '--no-default-browser-check',
  '--user-data-dir=scratch/chrome_btn_list',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const targets = await new Promise(r => http.get('http://localhost:9226/json', res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => r(JSON.parse(d)));
  }));
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        expression: `
          (function() {
            return Array.from(document.querySelectorAll('button')).map(b => b.innerText || b.textContent);
          })()
        `,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.id === 1) {
      const texts = msg.result.result.value || [];
      console.log('TOTAL BUTTONS:', texts.length);
      const matches = texts.filter(t => /privacy|terms|legal|disclaimer/i.test(t));
      console.log('MATCHES:', matches);
      if (matches.length === 0) {
        console.log('SAMPLE FIRST 20 BUTTONS:', texts.slice(0, 20));
      }
      ws.close();
      p.kill();
      process.exit(0);
    }
  };
}, 4500);
