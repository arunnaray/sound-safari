/**
 * Sound Safari — Local Dev Server
 * Run: node server.js
 * Then open: http://localhost:3000
 *
 * No npm install needed — uses only Node.js built-ins.
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.mp3':  'audio/mpeg',
  '.wav':  'audio/wav',
  '.ogg':  'audio/ogg',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

const server = http.createServer((req, res) => {
  // Normalise URL — strip query strings
  let urlPath = req.url.split('?')[0];

  // Default route → game
  if (urlPath === '/' || urlPath === '') urlPath = '/speech-therapy-game.html';

  const filePath = path.join(ROOT, urlPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 — Not found: ${urlPath}`);
      } else {
        res.writeHead(500); res.end('Server error');
      }
      return;
    }

    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'no-cache',
      // Allow localStorage to work from file:// origins too
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('\n🚦 Sound Safari is running!\n');
  console.log(`   Game  →  http://localhost:${PORT}/speech-therapy-game.html`);
  console.log(`   Admin →  http://localhost:${PORT}/soundsafari-admin.html`);
  console.log('\n   Press Ctrl+C to stop.\n');
});
