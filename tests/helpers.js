// Gemeinsame Hilfen für die Tests: startet den Server der App mit einem eigenen, leeren Datenordner.
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');

const SERVER = path.join(__dirname, '..', 'basketball_stats', 'server.js');

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => { const port = srv.address().port; srv.close(() => resolve(port)); });
  });
}

// seed: Inhalt von data.json vor dem Start (oder nichts für einen leeren Server)
async function startServer(seed) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bbstats-'));
  const dataFile = path.join(dir, 'data.json');
  if (seed !== undefined) fs.writeFileSync(dataFile, JSON.stringify(seed));
  const port = await freePort();
  const proc = spawn(process.execPath, [SERVER], { env: Object.assign({}, process.env, { PORT: String(port), DATA_DIR: dir, INGRESS_ONLY: '' }), stdio: 'ignore' });
  const url = 'http://127.0.0.1:' + port;
  for (let i = 0; i < 100; i++) {
    try { const r = await fetch(url + '/healthz'); if (r.ok) break; } catch (e) { /* noch nicht bereit */ }
    await new Promise((r) => setTimeout(r, 50));
    if (i === 99) { proc.kill(); throw new Error('Server startet nicht'); }
  }
  return {
    url, dir, dataFile,
    read: () => JSON.parse(fs.readFileSync(dataFile, 'utf8')),
    stop: () => new Promise((resolve) => { proc.once('exit', () => { fs.rmSync(dir, { recursive: true, force: true }); resolve(); }); proc.kill(); })
  };
}

// Ein gespeichertes Spiel mit sinnvollen Standardwerten
function game(over) {
  return Object.assign({ id: 1000, date: '2026-10-03', venue: 'home', type: 'season', team: '', opp: 'Gegner', sn: 0,
    ftm: 1, fta: 2, p2m: 3, p2a: 6, p3m: 1, p3a: 3, oreb: 1, dreb: 3, ast: 2, stl: 1, blk: 0, tov: 2, pf: 1 }, over || {});
}

module.exports = { startServer, game };
