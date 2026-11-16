// Minimaler Server ohne Abhängigkeiten: liefert die Seite aus und speichert die Daten als JSON-Datei.
// Jeder Spieler wird einzeln gespeichert, damit mehrere Geräte gleichzeitig verschiedene Spieler erfassen können.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const DATA_DIR = process.env.DATA_DIR || '/data';
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const INDEX = path.join(__dirname, 'index.html');
const MAX_BODY = 1024 * 1024; // 1 MB je Spieler

fs.mkdirSync(DATA_DIR, { recursive: true });

// ---- Datenhaltung: Stand im Speicher, Schreiben nacheinander und atomar (tmp + rename) ----
// Format der Datei: { v: 3, players: [{ id, rev, name, number, history, ... }], deleted: [id, ...] }
function load() {
  let d = {};
  try { d = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) || {}; } catch (e) { d = {}; }
  if (Array.isArray(d.players)) {
    return {
      v: 3,
      players: d.players.filter((p) => p && typeof p === 'object').map((p, i) => Object.assign({}, p, { id: Number(p.id) || i + 1, rev: Number(p.rev) || 1 })),
      deleted: Array.isArray(d.deleted) ? d.deleted.map(Number).filter(Boolean) : []
    };
  }
  // Altes Format (ein Spieler, Felder direkt in der Datei) übernehmen
  const has = d.name || d.number || (Array.isArray(d.history) && d.history.length) || d.game;
  return { v: 3, players: has ? [Object.assign({}, d, { id: 1, rev: 1 })] : [], deleted: [] };
}
const state = load();

let writing = false, again = false, waiters = [];
function flush(cb) {
  if (cb) waiters.push(cb);
  if (writing) { again = true; return; }
  writing = true;
  const mine = waiters; waiters = [];
  const tmp = DATA_FILE + '.tmp';
  fs.writeFile(tmp, JSON.stringify(state), (err) => {
    const done = (e) => {
      writing = false;
      mine.forEach((f) => f(e));
      if (again || waiters.length) { again = false; flush(); }
    };
    if (err) return done(err);
    fs.rename(tmp, DATA_FILE, done);
  });
}

function send(res, code, body, type) {
  res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

function readJson(req, res, cb) {
  let body = '', size = 0, aborted = false;
  req.on('data', (c) => {
    size += c.length;
    if (size > MAX_BODY) { aborted = true; send(res, 413, '{"error":"too large"}'); req.destroy(); return; }
    body += c;
  });
  req.on('end', () => {
    if (aborted) return;
    let obj;
    try { obj = JSON.parse(body); } catch (e) { return send(res, 400, '{"error":"invalid json"}'); }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return send(res, 400, '{"error":"invalid json"}');
    cb(obj);
  });
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

  // Gesamter Stand (alle Spieler) zum Lesen
  if (url === '/api/data') {
    if (req.method === 'GET') return send(res, 200, JSON.stringify(state));
    return send(res, 405, '{"error":"method not allowed"}');
  }

  // Einzelner Spieler: speichern oder löschen
  const m = /^\/api\/player\/(\d{1,16})$/.exec(url);
  if (m) {
    const id = Number(m[1]);
    if (req.method === 'PUT') {
      return readJson(req, res, (obj) => {
        if (state.deleted.indexOf(id) >= 0) return send(res, 410, '{"error":"deleted"}');
        const i = state.players.findIndex((p) => p.id === id);
        const rev = (i >= 0 ? state.players[i].rev || 0 : 0) + 1;
        const rec = Object.assign({}, obj, { id: id, rev: rev });
        if (i >= 0) state.players[i] = rec; else state.players.push(rec);
        flush((err) => send(res, err ? 500 : 200, err ? '{"error":"write failed"}' : JSON.stringify({ ok: true, rev: rev })));
      });
    }
    if (req.method === 'DELETE') {
      state.players = state.players.filter((p) => p.id !== id);
      if (state.deleted.indexOf(id) < 0) state.deleted.push(id);
      return flush((err) => send(res, err ? 500 : 200, err ? '{"error":"write failed"}' : '{"ok":true}'));
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
