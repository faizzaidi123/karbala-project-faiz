import fs from 'fs';

const babelCode = fs.readFileSync('client/vendor/babel.min.js', 'utf8');
const fn = new Function(babelCode + '; return Babel;');
const Babel = fn();
const res = Babel.transform('const el = <div className="test">Hello World</div>;', {
  presets: [
    ['react', { runtime: 'classic' }]
  ]
});
console.log('Classic Transpiled code:\n', res.code);
