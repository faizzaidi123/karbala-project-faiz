import fs from 'fs';

const reactApp = fs.readFileSync('c:/Users/Admin/Downloads/f/client/js/react-app.js', 'utf8');

// Match any assets/images/...
const matches = reactApp.match(/assets\/images\/[a-zA-Z0-9_\-\.]+/g) || [];
const unique = [...new Set(matches)];

console.log(`Found ${unique.length} unique image references in react-app.js:`);
const missing = [];
const existing = [];

for (const imgPath of unique) {
  const fullPath = `c:/Users/Admin/Downloads/f/client/${imgPath}`;
  if (fs.existsSync(fullPath)) {
    existing.push(imgPath);
  } else {
    missing.push(imgPath);
  }
}

console.log(`\n--- EXISTING (${existing.length}) ---`);
existing.forEach(e => console.log('  OK:', e));

console.log(`\n--- MISSING (${missing.length}) ---`);
missing.forEach(m => console.log('  MISSING:', m));
