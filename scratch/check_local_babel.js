import fs from 'fs';
import vm from 'vm';

try {
  const babelCode = fs.readFileSync('client/vendor/babel.min.js', 'utf8');
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(babelCode, context);
  const Babel = context.Babel || context.window.Babel;

  const appCode = fs.readFileSync('client/js/react-app.js', 'utf8');
  const result = Babel.transform(appCode, {
    presets: ['react']
  });

  console.log('REACT-APP.JS BABEL COMPILATION: 100% SUCCESSFUL! Result size:', (result.code.length / 1024).toFixed(1), 'KB');
} catch (e) {
  console.error('SYNTAX ERROR DETECTED:', e.message);
  process.exit(1);
}
