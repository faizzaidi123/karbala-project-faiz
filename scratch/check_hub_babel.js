import fs from 'fs';
import vm from 'vm';

try {
  const babelCode = fs.readFileSync('client/vendor/babel.min.js', 'utf8');
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(babelCode, context);
  const Babel = context.Babel || context.window.Babel;

  const hubCode = fs.readFileSync('client/js/components/GlobalZaireenStatisticsHub.js', 'utf8');
  const result = Babel.transform(hubCode, {
    presets: ['react']
  });

  console.log('GlobalZaireenStatisticsHub.js BABEL COMPILATION: 100% SUCCESSFUL! Result size:', (result.code.length / 1024).toFixed(1), 'KB');
} catch (e) {
  console.error('SYNTAX ERROR DETECTED IN GlobalZaireenStatisticsHub.js:', e.message);
  process.exit(1);
}
