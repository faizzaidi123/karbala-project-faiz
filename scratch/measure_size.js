import fs from 'fs';
import path from 'path';

function getDirSize(d) {
  let total = 0;
  const items = fs.readdirSync(d);
  for (const item of items) {
    if (item === 'node_modules' || item.endsWith('.zip') || item === '.git') continue;
    const p = path.join(d, item);
    const st = fs.statSync(p);
    if (st.isDirectory()) total += getDirSize(p);
    else total += st.size;
  }
  return total;
}

const clientSize = getDirSize('client');
const serverSize = getDirSize('server');
const totalSize = getDirSize('.');

console.log('Client Size:', (clientSize / (1024*1024)).toFixed(2), 'MB');
console.log('Server Size:', (serverSize / (1024*1024)).toFixed(2), 'MB');
console.log('Total Project Footprint (excluding node_modules/zips):', (totalSize / (1024*1024)).toFixed(2), 'MB');
