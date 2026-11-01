import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';

const chromeProcess = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9225',
  '--no-first-run',
  '--no-default-browser-check',
  '--user-data-dir=scratch/chrome_dom_check',
  'http://localhost:3000'
]);

setTimeout(async () => {
  const targets = await new Promise(r => http.get('http://localhost:9225/json', res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => r(JSON.parse(d)));
  }));
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
    ws.send(JSON.stringify({ id: 2, method: 'Console.enable' }));
    ws.send(JSON.stringify({
      id: 3,
      method: 'Runtime.evaluate',
      params: {
        expression: `
          (function() {
            // Dismiss onboarding if present
            const dismissBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Enter') || b.textContent.includes('Save') || b.textContent.includes('Confirm'));
            if (dismissBtn) dismissBtn.click();
            
            const privacyBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Privacy'));
            return {
              privacyBtnCount: privacyBtns.length,
              texts: privacyBtns.map(b => b.textContent.trim())
            };
          })()
        `,
        returnByValue: true
      }
    }));
  };

  ws.onmessage = e => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled') console.log('BROWSER LOG:', msg.params.args.map(a => a.value).join(' '));
    if (msg.method === 'Runtime.exceptionThrown') console.error('BROWSER EXCEPTION:', msg.params.exceptionDetails.text);
    if (msg.id === 3) {
      console.log('RESULT:', msg.result.result.value);
      ws.close();
      chromeProcess.kill();
      process.exit(0);
    }
  };
}, 4000);
