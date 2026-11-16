// Tests für die Seite im Browser: erfassen, auswerten, mehrere Spieler und Geräte, Saisons, Export/Import.
// Start: npm run test:ui   (braucht einmalig: npm install && npx playwright install chromium)
// Mit CHROME_PATH=/pfad/zu/chrome lässt sich ein bereits installierter Browser verwenden.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { startServer, game } = require('./helpers');

let browser;
test.before(async () => { browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--no-sandbox'] }); });
test.after(async () => { await browser.close(); });

// Ein „Gerät“: eigener Browser-Kontext in Handygröße
async function device(s, size) {
  const ctx = await browser.newContext({ viewport: size || { width: 402, height: 738 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(s.url + '/');
  await page.waitForFunction(() => /Gespeichert|Bereit/.test(document.getElementById('sync').textContent));
  return { page, errors, close: () => ctx.close() };
}
const add = (page, k) => page.click(`#viewGame [data-act="add"][data-k="${k}"]`);
const texts = (page, sel) => page.locator(sel).allInnerTexts();
const saved = (page) => page.waitForFunction(() => document.getElementById('sync').textContent === 'Gespeichert');
const openMeta = (page) => page.evaluate(() => { document.getElementById('meta').open = true; });
const players = (n) => Array.from({ length: n }, (_, i) => ({ id: i + 1, rev: 1, name: 'Spieler' + (i + 1), number: String(i + 4), history: [game({ id: 1000 + i, p2m: 3 + i })] }));

test('Spiel erfassen: Punkte, Quoten, Rückgängig, Korrektur und Speichern', async () => {
  const s = await startServer(); const d = await device(s);
  try {
    const p = d.page;
    await add(p, 'p2m,p2a'); await add(p, 'p3m,p3a'); await add(p, 'p3a'); await add(p, 'ftm,fta'); await add(p, 'oreb'); await add(p, 'dreb');
    assert.equal(await p.innerText('#pts'), '6');
    assert.equal(await p.innerText('#fgPct'), '67 %');
    assert.equal(await p.innerText('#reb'), '2');
    await p.click('#undo');                                            // letzter Rebound zurück
    assert.equal(await p.innerText('#reb'), '1');
    await p.click('#viewGame [data-act="rem"][data-k="p3a"]');         // Fehlwurf Dreier entfernen
    assert.equal(await p.innerText('#fgPct'), '100 %');
    await p.click('#save');
    assert.match(await p.innerText('#gamesLabel'), /1 Spiel/);
    await saved(p);
    const h = s.read().players[0].history;
    assert.equal(h.length, 1);
    assert.deepEqual([h[0].p2m, h[0].p3m, h[0].p3a, h[0].ftm, h[0].oreb, h[0].dreb], [1, 1, 1, 1, 1, 0]);
    assert.deepEqual(d.errors, []);
  } finally { await d.close(); await s.stop(); }
});

test('Erfassung passt ohne Scrollen auf einen Handy-Bildschirm', async () => {
  const s = await startServer({ v: 3, players: players(3), deleted: [] });
  try {
    for (const size of [{ width: 402, height: 738 }, { width: 402, height: 874 }, { width: 440, height: 956 }]) {
      const d = await device(s, size);
      const m = await d.page.evaluate(() => ({ h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth, ih: innerHeight, iw: innerWidth,
        foot: document.querySelector('.foot').getBoundingClientRect().bottom }));
      assert.ok(m.h <= m.ih, `Höhe ${m.h} > ${m.ih} bei ${size.width}×${size.height}`);
      assert.ok(m.w <= m.iw, `Breite ${m.w} > ${m.iw} bei ${size.width}×${size.height}`);
      assert.ok(m.foot <= m.ih, 'Speichern-Zeile sichtbar');
      await d.close();
    }
  } finally { await s.stop(); }
});

test('Quarter, Overtime, Einsatzzeit und Starting 5', async () => {
  const s = await startServer(); const d = await device(s);
  try {
    const p = d.page, q = (i) => p.locator('#qSeg button').nth(i).click();
    await p.click('#stBtn'); await p.click('#tBtn');
    await add(p, 'p2m,p2a'); await p.waitForTimeout(1200);
    await q(1); await add(p, 'p3m,p3a'); await p.waitForTimeout(1200);
    await q(4); await add(p, 'ftm,fta');
    assert.deepEqual((await texts(p, '#qSeg button')).map((t) => t.replace(/\s+/g, ' ')), ['Q1 2', 'Q2 3', 'Q3 0', 'Q4 0', 'OT 1']);
    await p.click('#tBtn');                                            // auswechseln
    await openMeta(p); await p.fill('#mins', '20');                    // Gesamtzeit korrigieren
    await p.click('#save'); await saved(p);
    const r = s.read().players[0].history[0];
    assert.equal(r.st, true);
    assert.equal(r.sec, 1200);
    assert.equal(r.qs.length, 5);
    assert.ok(Math.abs(r.qs.reduce((a, b) => a + b, 0) - 1200) <= 3, 'Zeiten der Quarter ergeben die Gesamtzeit');
    assert.ok(r.qs[0] > 0 && r.qs[1] > 0 && r.qs[2] === 0, 'Zeit liegt in den gespielten Quartern');
    assert.deepEqual(r.q.map((x) => x.ftm + 2 * x.p2m + 3 * x.p3m), [2, 3, 0, 0, 1]);
    assert.deepEqual((await texts(p, '#qTable tbody tr td:first-child')), ['Q1', 'Q2', 'Q3', 'Q4', 'OT']);
    assert.ok((await texts(p, '#avgTiles .stat')).some((t) => /Starting 5\s*1\/1/.test(t)));
    assert.ok((await texts(p, '#avgTiles .stat')).some((t) => /Minuten\s*20,0/.test(t)));
    assert.deepEqual(d.errors, []);
  } finally { await d.close(); await s.stop(); }
});

test('zwei Geräte erfassen gleichzeitig verschiedene Spieler', async () => {
  const s = await startServer(); const a = await device(s); const b = await device(s);
  try {
    await openMeta(a.page); await a.page.fill('#pname', 'Ben'); await saved(a.page);
    await a.page.click('[data-act="addplayer"]'); await a.page.fill('#pname', 'Anna'); await saved(a.page);
    await b.page.waitForFunction(() => document.querySelectorAll('#players [data-act="player"]').length === 2, null, { timeout: 15000 });
    await a.page.locator('#players [data-act="player"]').first().click();
    await b.page.locator('#players [data-act="player"]').nth(1).click();
    for (let i = 0; i < 8; i++) { await add(a.page, 'p2m,p2a'); await add(b.page, 'p3m,p3a'); }
    await saved(a.page); await saved(b.page);
    await a.page.waitForTimeout(600);
    const g = s.read().players.map((x) => [x.name, x.game.p2m, x.game.p3m]);
    assert.deepEqual(g, [['Ben', 8, 0], ['Anna', 0, 8]]);
    await b.page.click('#tabSeason'); await b.page.click('#delPlayer'); await b.page.click('#delPlayer');   // B löscht Anna
    await a.page.waitForFunction(() => document.querySelectorAll('#players [data-act="player"]').length === 1, null, { timeout: 15000 });
    assert.equal(await a.page.innerText('#pts'), '16', 'Eingaben von A bleiben erhalten');
    assert.deepEqual(a.errors.concat(b.errors), []);
  } finally { await a.close(); await b.close(); await s.stop(); }
});

test('Auswertung trennt Hauptrunde, Playoffs, Testspiele, Heim/Auswärts und Mannschaften', async () => {
  const hist = [game({ id: 1, type: 'season', team: 'U14', venue: 'home' }), game({ id: 2, type: 'season', team: 'U16', venue: 'away', date: '2026-10-10' }),
    game({ id: 3, type: 'playoff', team: 'U14', venue: 'away', date: '2026-10-17' }), game({ id: 4, type: 'friendly', team: 'U14', date: '2026-10-24' })];
  const s = await startServer({ v: 3, players: [{ id: 1, rev: 1, name: 'Hugo', history: hist }], deleted: [] }); const d = await device(s);
  try {
    const p = d.page; await p.click('#tabSeason');
    const label = () => p.innerText('#gamesLabel');
    assert.match(await label(), /3 Spiele · Hauptrunde \+ Playoffs/);                 // Testspiel zählt nicht mit
    await p.click('#sFriendly'); assert.match(await label(), /1 Spiel · Testspiele/);
    await p.click('#sPlayoff'); assert.match(await label(), /1 Spiel · Playoffs/);
    await p.click('#sComp'); await p.click('#fAway'); assert.match(await label(), /2 Spiele/);
    await p.click('#fAll');
    assert.deepEqual(await texts(p, '#teamFilter button'), ['Alle Mannschaften (4)', 'U14 (3)', 'U16 (1)']);
    await p.locator('#teamFilter button').nth(2).click(); assert.match(await label(), /1 Spiel · .*U16/);
    assert.equal(await p.locator('.chart[data-chart="pts"] .hit').count(), 1, 'Diagramm folgt dem Filter');
    assert.deepEqual(d.errors, []);
  } finally { await d.close(); await s.stop(); }
});

test('Saison beenden: neue Spiele zählen für die neue Saison, der Wechsel lässt sich zurücknehmen', async () => {
  const s = await startServer({ v: 3, players: [{ id: 1, rev: 1, name: 'Hugo', history: [game()] }], deleted: [], meta: { seasons: ['2026/27'], rev: 1 } });
  const d = await device(s);
  try {
    const p = d.page; await p.click('#tabSeason');
    assert.equal(await p.locator('#snFilter').isVisible(), false);
    await p.click('#snEnd'); await p.click('#snEnd'); await saved(p);
    assert.deepEqual(s.read().meta.seasons, ['2026/27', '2027/28']);
    assert.match(await p.innerText('#gamesLabel'), /Saison 2027\/28 · 0 Spiele/);
    await p.click('#snUndo'); await saved(p);
    assert.deepEqual(s.read().meta.seasons, ['2026/27']);
    await p.click('#snEnd'); await p.click('#snEnd');
    await p.click('#tabGame'); await add(p, 'p2m,p2a'); await p.click('#save'); await saved(p);
    assert.deepEqual(s.read().players[0].history.map((x) => x.sn || 0).sort(), [0, 1]);
    assert.equal(await p.locator('#snUndo').isVisible(), false, 'nach dem ersten Spiel nicht mehr zurücknehmbar');
    await p.locator('#snFilter button', { hasText: '2026/27' }).click();
    assert.match(await p.innerText('#gamesLabel'), /Saison 2026\/27 · 1 Spiel/);
    await p.locator('#snFilter button', { hasText: 'Alle Saisons' }).click();
    assert.match(await p.innerText('#gamesLabel'), /Alle Saisons · 2 Spiele/);
    assert.deepEqual(d.errors, []);
  } finally { await d.close(); await s.stop(); }
});

test('Vergleich zeigt alle Spieler und hebt den besten Wert hervor', async () => {
  const s = await startServer({ v: 3, players: players(3), deleted: [] }); const d = await device(s);
  try {
    const p = d.page; await p.click('#tabCompare');
    assert.deepEqual(await texts(p, '#cmpTable thead th'), ['Statistik', 'Spieler1 #4', 'Spieler2 #5', 'Spieler3 #6']);
    const row = p.locator('#cmpTable tbody tr', { hasText: 'Punkte' });
    assert.deepEqual(await row.locator('td').allInnerTexts(), ['Punkte', '10,0', '12,0', '14,0']);
    assert.deepEqual(await row.locator('td.best').allInnerTexts(), ['14,0']);
    assert.equal(await p.locator('#cmpChart .hb').count(), 3);
    await p.locator('#cmpPlayers button').nth(2).click();
    assert.equal(await p.locator('#cmpTable thead th').count(), 3);
    assert.deepEqual(d.errors, []);
  } finally { await d.close(); await s.stop(); }
});

test('Export und Import: CSV und Sicherung stellen gelöschte Daten wieder her', async () => {
  const hist = [game({ id: 1, team: 'U14', sec: 600, st: true }), game({ id: 2, date: '2026-10-10', type: 'playoff' })];
  const s = await startServer({ v: 3, players: [{ id: 1, rev: 1, name: 'Hugo', number: '13', history: hist }, { id: 2, rev: 1, name: 'Anna', history: [game({ id: 9 })] }], deleted: [] });
  const d = await device(s);
  try {
    const p = d.page; await p.click('#tabSeason');
    const grab = async (sel, name) => {
      const [dl] = await Promise.all([p.waitForEvent('download'), p.click(sel)]);
      const file = path.join(s.dir, name); await dl.saveAs(file); return file;
    };
    const csv = await grab('#bCsv', 'export.csv');
    const lines = fs.readFileSync(csv, 'utf8').replace(/^﻿/, '').split('\r\n');
    assert.match(lines[0], /^Datum;Saison;Mannschaft;Heim\/Auswärts;Art;Gegner;Punkte;/);
    assert.match(lines[0], /Minuten;Starting 5;Punkte Q1;.*;Minuten OT$/);
    assert.equal(lines.filter((l) => /^\d{2}\.\d{2}\.\d{4};/.test(l)).length, 2);
    const json = await grab('#bJson', 'sicherung.json');
    assert.equal(JSON.parse(fs.readFileSync(json, 'utf8')).players.length, 2, 'Sicherung enthält alle Spieler');
    await p.locator('.game .del').first().click(); await p.locator('.game .del').first().click();
    assert.match(await p.innerText('#gamesLabel'), /0 Spiele/);
    await p.setInputFiles('#file', csv);
    await p.waitForFunction(() => /importiert/.test(document.getElementById('importMsg').textContent));
    assert.match(await p.innerText('#importMsg'), /^2 Spiele importiert/);
    await p.setInputFiles('#file', json);
    await p.waitForFunction(() => /übersprungen/.test(document.getElementById('importMsg').textContent));
    assert.match(await p.innerText('#importMsg'), /^0 Spiele importiert/, 'nichts doppelt');
    await saved(p);
    const h = s.read().players[0].history;
    assert.equal(h.length, 2);
    assert.deepEqual(h.map((x) => [x.team || '', x.type, x.st, x.sec]).sort(), [['', 'playoff', false, 0], ['U14', 'season', true, 600]]);
    assert.deepEqual(d.errors, []);
  } finally { await d.close(); await s.stop(); }
});

test('ohne Verbindung bleiben Eingaben erhalten und werden nachgesendet', async () => {
  const s = await startServer(); const d = await device(s);
  try {
    const p = d.page;
    await p.route('**/api/**', (r) => r.abort());                      // Verbindung weg
    await add(p, 'ast'); await add(p, 'ast');
    await p.waitForFunction(() => /Offline/.test(document.getElementById('sync').textContent));
    await p.unroute('**/api/**');                                      // Verbindung wieder da
    await p.waitForFunction(() => document.getElementById('sync').textContent === 'Gespeichert', null, { timeout: 15000 });
    assert.equal(s.read().players[0].game.ast, 2);
  } finally { await d.close(); await s.stop(); }
});

test('Tipp-Rückmeldung, lokale Schriften und Wachhalten des Bildschirms', async () => {
  const s = await startServer();
  const ctx = await browser.newContext({ viewport: { width: 402, height: 738 } });
  const p = await ctx.newPage();
  const outside = [];
  p.on('request', (r) => { if (!r.url().startsWith(s.url)) outside.push(r.url()); });
  // Wachhalten des Bildschirms mitschreiben, statt es wirklich anzufordern
  await p.addInitScript(() => {
    window.__wake = [];
    Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: (t) => {
      window.__wake.push('an');
      return Promise.resolve({ addEventListener() {}, release: () => { window.__wake.push('aus'); return Promise.resolve(); } });
    } } });
  });
  try {
    await p.goto(s.url + '/');
    await p.waitForFunction(() => /Gespeichert|Bereit/.test(document.getElementById('sync').textContent));
    await add(p, 'p2m,p2a');
    assert.equal(await p.locator('#viewGame [data-act="add"][data-k="p2m,p2a"]').evaluate((e) => e.classList.contains('flash')), true, 'Treffer-Taste leuchtet auf');
    await add(p, 'ast');
    assert.equal(await p.locator('#viewGame .tile.flash').count(), 1, 'Zähler-Kachel leuchtet auf');
    await p.evaluate(() => document.fonts.ready);
    assert.equal(await p.evaluate(() => document.fonts.check("16px 'Public Sans'") && document.fonts.check("16px 'Instrument Serif'")), true, 'Schriften geladen');
    assert.deepEqual(outside, [], 'keine Anfragen nach außen');
    assert.deepEqual(await p.evaluate(() => window.__wake), ['an'], 'in der Erfassung wach');
    await p.click('#tabSeason');
    await p.waitForFunction(() => window.__wake.length === 2);
    assert.deepEqual(await p.evaluate(() => window.__wake), ['an', 'aus'], 'in der Auswertung nicht');
    await p.click('#tabGame');
    await p.waitForFunction(() => window.__wake.length === 3);
  } finally { await ctx.close(); await s.stop(); }
});
