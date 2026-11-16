// Tests für den Server: Speichern je Spieler, Löschen, Saisons, Übernahme alter Daten, Auslieferung der Dateien.
// Start: npm run test:server   (braucht nur Node.js, keine weiteren Pakete)
const test = require('node:test');
const assert = require('node:assert/strict');
const { startServer, game } = require('./helpers');

const put = (url, body) => fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body) });
const get = async (s) => (await fetch(s.url + '/api/data')).json();

test('leerer Server liefert keine Spieler, aber eine Saison', async () => {
  const s = await startServer();
  try {
    const d = await get(s);
    assert.deepEqual(d.players, []);
    assert.deepEqual(d.deleted, []);
    assert.equal(d.meta.seasons.length, 1);
    assert.match(d.meta.seasons[0], /^\d{4}\/\d{2}$/);
  } finally { await s.stop(); }
});

test('Spieler werden einzeln gespeichert und überschreiben sich nicht gegenseitig', async () => {
  const s = await startServer();
  try {
    const a = await (await put(s.url + '/api/player/11', { name: 'Anna', history: [game()] })).json();
    const b = await (await put(s.url + '/api/player/22', { name: 'Ben', history: [] })).json();
    assert.equal(a.rev, 1); assert.equal(b.rev, 1);
    const a2 = await (await put(s.url + '/api/player/11', { name: 'Anna', history: [game(), game({ id: 1001 })] })).json();
    assert.equal(a2.rev, 2);
    const d = await get(s);
    assert.deepEqual(d.players.map((p) => [p.id, p.name, p.history.length, p.rev]), [[11, 'Anna', 2, 2], [22, 'Ben', 0, 1]]);
    assert.deepEqual(s.read().players.map((p) => p.name), ['Anna', 'Ben'], 'steht auch in der Datei');
  } finally { await s.stop(); }
});

test('gelöschte Spieler kommen durch ein veraltetes Gerät nicht zurück', async () => {
  const s = await startServer();
  try {
    await put(s.url + '/api/player/11', { name: 'Anna' });
    assert.equal((await fetch(s.url + '/api/player/11', { method: 'DELETE' })).status, 200);
    assert.equal((await put(s.url + '/api/player/11', { name: 'Anna' })).status, 410);
    const d = await get(s);
    assert.deepEqual(d.players, []);
    assert.deepEqual(d.deleted, [11]);
  } finally { await s.stop(); }
});

test('Saisons lassen sich setzen, ungültige Angaben werden abgelehnt', async () => {
  const s = await startServer();
  try {
    assert.equal((await put(s.url + '/api/meta', { seasons: ['2026/27', '2027/28'] })).status, 200);
    assert.deepEqual((await get(s)).meta.seasons, ['2026/27', '2027/28']);
    assert.equal((await put(s.url + '/api/meta', { seasons: [] })).status, 400);
    assert.equal((await put(s.url + '/api/meta', { seasons: 'x' })).status, 400);
    assert.deepEqual((await get(s)).meta.seasons, ['2026/27', '2027/28'], 'unverändert nach abgelehnter Anfrage');
  } finally { await s.stop(); }
});

test('alte Daten (ein Spieler, Version 1.0–1.2) werden beim Start übernommen', async () => {
  const s = await startServer({ name: 'Hugo', number: '13', history: [game()], game: {} });
  try {
    const d = await get(s);
    assert.equal(d.players.length, 1);
    assert.equal(d.players[0].id, 1);
    assert.equal(d.players[0].name, 'Hugo');
    assert.equal(d.players[0].history.length, 1);
  } finally { await s.stop(); }
});

test('Daten im Mehrspieler-Format (Version 1.3) werden beim Start übernommen', async () => {
  const s = await startServer({ v: 2, active: 5, players: [{ id: 5, name: 'A', history: [game()] }, { id: 6, name: 'B' }] });
  try {
    const d = await get(s);
    assert.deepEqual(d.players.map((p) => [p.id, p.name]), [[5, 'A'], [6, 'B']]);
    assert.equal(d.meta.seasons.length, 1);
  } finally { await s.stop(); }
});

test('fehlerhafte Anfragen werden abgewiesen', async () => {
  const s = await startServer();
  try {
    assert.equal((await put(s.url + '/api/player/11', '{kaputt')).status, 400);
    assert.equal((await put(s.url + '/api/player/11', '[1,2]')).status, 400);
    assert.equal((await put(s.url + '/api/player/abc', {})).status, 404);
    assert.equal((await put(s.url + '/api/data', {})).status, 405);
    assert.equal((await put(s.url + '/api/player/11', 'x'.repeat(1024 * 1024 + 10))).status, 413);
  } finally { await s.stop(); }
});

test('Seite, Icons und Schriften werden ausgeliefert, nichts außerhalb des App-Ordners', async () => {
  const s = await startServer();
  try {
    const page = await fetch(s.url + '/');
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.match(html, /Basketball-Stats/);
    assert.doesNotMatch(html, /https?:\/\/fonts\.(googleapis|gstatic)\.com/, 'keine Schriften von außen');
    const fonts = [...html.matchAll(/url\((fonts\/[a-z0-9-]+\.woff2)\)/g)].map((m) => m[1]);
    assert.ok(fonts.length >= 2);
    for (const f of fonts) {
      const r = await fetch(s.url + '/' + f);
      assert.equal(r.status, 200, f);
      assert.equal(r.headers.get('content-type'), 'font/woff2');
    }
    assert.equal((await fetch(s.url + '/favicon.svg')).status, 200);
    assert.equal((await fetch(s.url + '/fonts/..%2Fserver.js')).status, 404);
    assert.equal((await fetch(s.url + '/server.js')).status, 404);
  } finally { await s.stop(); }
});

test('viele gleichzeitige Speicherungen gehen nicht verloren', async () => {
  const s = await startServer();
  try {
    await Promise.all(Array.from({ length: 30 }, (_, i) => put(s.url + '/api/player/' + (100 + i), { name: 'P' + i })));
    assert.equal((await get(s)).players.length, 30);
    assert.equal(s.read().players.length, 30);
  } finally { await s.stop(); }
});
