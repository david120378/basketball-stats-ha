// Minimaler Server ohne Abhängigkeiten: liefert die Seite aus und speichert die Daten als JSON-Datei.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const DATA_DIR = process.env.DATA_DIR || '/data';
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const INDEX = path.join(__dirname, 'index.html');
const MAX_BODY = 1024 * 1024; // 1 MB

fs.mkdirSync(DATA_DIR, { recursive: true });

function send(res, code, body, type) {
  res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

// Nur Anfragen vom Supervisor (Ingress, 172.30.32.2) und lokal (Healthcheck) zulassen.
const INGRESS_ONLY = process.env.INGRESS_ONLY === '1';
function allowed(req) {
  if (!INGRESS_ONLY) return true;
  const ra = req.socket.remoteAddress || '';
  return ra.endsWith('172.30.32.2') || ra === '127.0.0.1' || ra === '::1' || ra.endsWith('::ffff:127.0.0.1');
}

http.createServer((req, res) => {
  if (!allowed(req)) return send(res, 403, 'Forbidden', 'text/plain');
  const url = req.url.split('?')[0];

  if (url === '/healthz') return send(res, 200, 'ok', 'text/plain');

  if (url === '/api/data') {
    if (req.method === 'GET') {
      fs.readFile(DATA_FILE, 'utf8', (err, txt) => send(res, 200, err ? '{}' : txt));
      return;
    }
    if (req.method === 'PUT') {
      let body = '', size = 0, aborted = false;
      req.on('data', (c) => {
        size += c.length;
        if (size > MAX_BODY) { aborted = true; send(res, 413, '{"error":"too large"}'); req.destroy(); return; }
        body += c;
      });
      req.on('end', () => {
        if (aborted) return;
        try { JSON.parse(body); } catch (e) { return send(res, 400, '{"error":"invalid json"}'); }
        const tmp = DATA_FILE + '.tmp';
        fs.writeFile(tmp, body, (err) => {
          if (err) return send(res, 500, '{"error":"write failed"}');
          fs.rename(tmp, DATA_FILE, (err2) => send(res, err2 ? 500 : 200, err2 ? '{"error":"write failed"}' : '{"ok":true}'));
        });
      });
      return;
    }
    return send(res, 405, '{"error":"method not allowed"}');
  }

  var assets = { '/favicon.svg': ['favicon.svg', 'image/svg+xml'], '/apple-touch-icon.png': ['apple-touch-icon.png', 'image/png'] };
  if (assets[url]) {
    return fs.readFile(path.join(__dirname, assets[url][0]), (err, buf) => {
      if (err) return send(res, 404, 'Not found', 'text/plain');
      res.writeHead(200, { 'Content-Type': assets[url][1], 'Cache-Control': 'public, max-age=86400' });
      res.end(buf);
    });
  }

  if (url === '/' || url === '/index.html') {
    return fs.readFile(INDEX, (err, buf) => err ? send(res, 500, 'error', 'text/plain') : send(res, 200, buf, 'text/html; charset=utf-8'));
  }
  send(res, 404, 'Not found', 'text/plain');
}).listen(PORT, () => console.log('Basketball-Stats läuft auf Port ' + PORT));
