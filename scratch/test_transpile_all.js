import fs from 'fs';
import path from 'path';

const babelCode = fs.readFileSync('client/vendor/babel.min.js', 'utf8');
const fn = new Function(babelCode + '; return Babel;');
const Babel = fn();

const components = [
  'client/js/components/GlobalZaireenStatisticsHub.js',
  'client/js/components/SmartPoleNavigationHub.js',
  'client/js/components/AirportArrivalSimulatorHub.js',
  'client/js/components/CinematicHomeView.js',
  'client/js/components/GlobalCinemaNav.js',
  'client/js/components/DedicatedViews.js'
];

for (const comp of components) {
  try {
    const code = fs.readFileSync(comp, 'utf8');
    const start = Date.now();
    const res = Babel.transform(code, {
      presets: [
        ['react', { runtime: 'classic' }]
      ]
    });
    console.log(`Transpiled ${comp} in ${Date.now() - start}ms (${res.code.length} bytes)`);
  } catch (err) {
    console.error(`Error in ${comp}:`, err.message);
  }
}
