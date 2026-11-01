import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\cd028911-fdd8-41a3-9c53-4a3b92d0ceef';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture(url, outputFile, width, height) {
  const tmpDir = path.join(process.env.TEMP, 'chrome_karbala_res_' + Math.random().toString(36).slice(2));
  fs.mkdirSync(tmpDir, { recursive: true });

  const proc = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    `--window-size=${width},${height}`,
    `--user-data-dir=${tmpDir}`,
    `--screenshot=${outputFile}`,
    url
  ]);

  await new Promise((resolve) => {
    proc.on('close', resolve);
  });

  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch (e) {}

  console.log(`Captured ${outputFile}: ${fs.existsSync(outputFile)} (${width}x${height})`);
}

async function main() {
  await capture('http://localhost:3000/', path.join(ARTIFACT_DIR, 'karbala_desktop_1440.png'), 1440, 900);
  await capture('http://localhost:3000/', path.join(ARTIFACT_DIR, 'karbala_tablet_768.png'), 768, 1024);
  await capture('http://localhost:3000/', path.join(ARTIFACT_DIR, 'karbala_mobile_390.png'), 390, 844);
  await capture('http://localhost:3000/', path.join(ARTIFACT_DIR, 'karbala_mobile_360.png'), 360, 740);
}

main().catch(console.error);
