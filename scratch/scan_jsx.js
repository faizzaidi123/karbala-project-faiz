import fs from 'fs';
import path from 'path';

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.js') && file !== 'react-app.js') {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (/<[A-Za-z][A-Za-z0-9]*(\s+[^>]*)?(\/?>|>)/.test(content)) {
        console.log('Contains JSX:', fullPath);
      }
    }
  }
}

scanDir('client/js');
