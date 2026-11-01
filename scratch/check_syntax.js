import fs from 'fs';
import { transformSync } from '@babel/core';

try {
  const code = fs.readFileSync('client/js/react-app.js', 'utf8');
  transformSync(code, { presets: ['@babel/preset-react'] });
  console.log('REACT-APP.JS BABEL COMPILATION: 100% SUCCESS (0 SYNTAX ERRORS)!');
} catch (e) {
  console.error('SYNTAX ERROR:', e.message);
  process.exit(1);
}
