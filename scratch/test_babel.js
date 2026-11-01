import fs from 'fs';

const babelCode = fs.readFileSync('client/vendor/babel.min.js', 'utf8');
const fn = new Function(babelCode + '; return Babel;');
const Babel = fn();
console.log('Babel available:', typeof Babel.transform);
const res = Babel.transform('const el = <div className="test">Hello World</div>;', {
  presets: ['react']
});
console.log('Transpiled code:', res.code);
