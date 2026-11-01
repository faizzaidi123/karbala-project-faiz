import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './server/config/db.js';
import apiRoutes from './server/routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Global Path Traversal Defense Middleware
app.use((req, res, next) => {
  const decodedUrl = decodeURIComponent(req.url);
  if (req.url.includes('..') || req.url.includes('%2e%2e') || req.url.includes('%2E%2E') || decodedUrl.includes('..')) {
    return res.status(403).send('Forbidden: Path Traversal Denied');
  }
  next();
});

// Production Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'geolocation=(self), camera=(self), microphone=()');
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// In-Memory Rate Limiter for API endpoints
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_GENERAL_REQUESTS = 180;
const MAX_AI_REQUESTS = 40;

app.use('/api', (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const isAi = req.path.startsWith('/ai');
  const key = `${ip}:${isAi ? 'ai' : 'gen'}`;
  const maxLimit = isAi ? MAX_AI_REQUESTS : MAX_GENERAL_REQUESTS;

  let record = rateLimitMap.get(key);
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    record = { startTime: now, count: 1 };
  } else {
    record.count++;
  }
  rateLimitMap.set(key, record);

  if (record.count > maxLimit) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({
      status: 'error',
      message: 'Too many requests. Please wait a moment before sending additional queries to the sacred heritage server.'
    });
  }

  // Periodic rate limit map cleanup (every 1000 requests)
  if (rateLimitMap.size > 2000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now - v.startTime > RATE_LIMIT_WINDOW_MS) rateLimitMap.delete(k);
    }
  }

  next();
});

// Initialize Babel from vendor for on-the-fly JSX transpilation of client modules
let Babel = null;
try {
  const babelVendorPath = path.join(__dirname, 'client', 'vendor', 'babel.min.js');
  if (fs.existsSync(babelVendorPath)) {
    const babelCode = fs.readFileSync(babelVendorPath, 'utf8');
    const fn = new Function(babelCode + '; return Babel;');
    Babel = fn();
  }
} catch (err) {
  console.warn('⚠️ Babel vendor initialization note:', err.message);
}

const jsxTranspileCache = new Map();
const clientRoot = path.resolve(__dirname, 'client');

// Serve transpiled JSX for client modules (components) with memory cache & strict path confinement
app.use((req, res, next) => {
  if (req.path.endsWith('.js') && !req.path.includes('vendor/') && !req.path.includes('react-app.js') && Babel) {
    const localPath = path.resolve(clientRoot, req.path.replace(/^\//, ''));
    
    // Strict path traversal defense: ensure resolved path remains strictly within client/ directory
    if (!localPath.startsWith(clientRoot)) {
      return res.status(403).send('Forbidden: Path Traversal Denied');
    }

    if (fs.existsSync(localPath)) {
      try {
        const stats = fs.statSync(localPath);
        const cached = jsxTranspileCache.get(localPath);
        if (cached && cached.mtime === stats.mtimeMs) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          return res.send(cached.code);
        }

        const source = fs.readFileSync(localPath, 'utf8');
        // If file contains JSX syntax, compile with React classic runtime
        if (/<[A-Za-z][A-Za-z0-9]*(\s+[^>]*)?(\/?>|>)/.test(source)) {
          const transpiled = Babel.transform(source, {
            presets: [['react', { runtime: 'classic' }]]
          }).code;
          jsxTranspileCache.set(localPath, { mtime: stats.mtimeMs, code: transpiled });
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          return res.send(transpiled);
        }
      } catch (err) {
        console.error(`Babel transpile error on ${req.path}:`, err.message);
      }
    }
  }
  next();
});

// Serve static frontend assets from client/
app.use(express.static(path.join(__dirname, 'client')));

// Connect to Database (with automatic fallback to in-memory mode)
connectDB().catch((err) => {
  console.warn('⚠️ DB init notice (using in-memory fallback):', err.message);
});

// API Routes
app.use('/api', apiRoutes);

// Catch-all route to serve the React SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start Server when running locally or on traditional Node hosts (Render/Railway)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🕌 Karbala Digital Twin — 61 AH & Present Day`);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📂 Client Root: ${path.join(__dirname, 'client')}`);
    console.log(`====================================================`);
  });
}

export default app;

