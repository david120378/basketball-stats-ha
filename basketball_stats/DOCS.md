# Basketball-Stats

Mit dieser App erfasst du die Statistiken eines Basketballspielers Spiel für Spiel – direkt am Spielfeldrand auf dem Handy – und wertest sie über die Saison aus. Die Seite läuft in Home Assistant und ist nur darüber erreichbar.

## Erste Schritte

1. App installieren und **Starten**. „Beim Booten starten“ ist bereits aktiv.
2. Optional **In der Seitenleiste anzeigen** einschalten – dann erscheint der Eintrag **Basketball**.
3. Die Seite über die Seitenleiste oder über **Benutzeroberfläche öffnen** aufrufen.
4. Oben **Spieler** und **Nummer** eintragen. Beides bleibt gespeichert.

Unterwegs erreichst du die Seite auf demselben Weg wie Home Assistant selbst, zum Beispiel über die Home-Assistant-App.

## Ein Spiel erfassen

Reiter **Spiel erfassen**:

1. **Gegner** und **Datum** eintragen, **Heimspiel** oder **Auswärts** wählen.
2. Während des Spiels mittippen:
   - **Würfe** (Freiwurf, 2er, 3er): **Treffer** oder **Fehlwurf** antippen. Punkte und Quoten rechnet die Seite selbst aus.
   - **Spielzüge**: Offensiv- und Defensiv-Rebounds, Assists, Steals, Blocks, Ballverluste und Fouls über die Plus-Kachel hochzählen.
3. Vertippt? **Rückgängig** nimmt die letzte Eingabe zurück; mit **−** lässt sich jeder Wert einzeln korrigieren.
4. Nach dem Spiel **Spiel speichern**. Das Spiel wandert in die Saison, die Eingabe ist wieder leer.

**Aktuelles Spiel leeren** verwirft die laufende Eingabe. Zur Sicherheit muss die Schaltfläche zweimal angetippt werden.

Oben rechts steht der Speicherstatus: **Gespeichert** heißt, die Daten liegen in Home Assistant. Bei **Offline – nur lokal gespeichert** bleiben die Eingaben zunächst im Browser und werden mit der nächsten Eingabe bei bestehender Verbindung übertragen.

## Saison auswerten

Reiter **Saison**:

- **Schnitt pro Spiel** und **Trefferquoten** über alle gespeicherten Spiele.
- Filter **Alle / Heim / Auswärts**.
- **Verlauf**: Diagramme über die Saison, ein Balken pro Spiel in zeitlicher Reihenfolge.
  - Über die Auswahl-Schaltflächen legst du fest, welche Statistiken angezeigt werden: Punkte, Wurf-, Zweier-, Dreier- und Freiwurfquote, Rebounds (gesamt, offensiv, defensiv), Assists, Steals, Blocks, Ballverluste und Fouls. Jede gewählte Statistik bekommt ein eigenes Diagramm.
  - Die gestrichelte Linie ist der Durchschnitt, der Wert steht oben rechts (Ø).
  - Einen Balken antippen (am Rechner: mit der Maus darüberfahren) zeigt Wert, Datum und Gegner dieses Spiels, bei Quoten zusätzlich Treffer/Versuche.
  - Der Filter Alle / Heim / Auswärts gilt auch für die Diagramme. Die Auswahl der Statistiken merkt sich das jeweilige Gerät.
- **Alle Spiele** als Liste: mit dem Stift ein Spiel nachträglich bearbeiten, mit dem Papierkorb löschen.

## Export und Import

| Schaltfläche | Zweck |
| --- | --- |
| **Statistik als CSV** | Tabelle für Excel/Numbers mit allen Spielen, Summe und Schnitt pro Spiel. Der aktive Filter (Heim/Auswärts) wird berücksichtigt. |
| **Sicherung (JSON)** | Vollständige Sicherung aller Daten, auch des laufenden Spiels. |
| **Importieren (CSV oder JSON)** | Liest eine Export-Datei dieser Seite ein. Bereits vorhandene Spiele werden erkannt und nicht doppelt angelegt. |

Daten aus einer älteren Installation übernimmst du so: dort **Sicherung (JSON)** exportieren, hier **Importieren** wählen.

## Datenspeicherung und Zugriff

- Die Daten liegen im App-Speicher (`/data/data.json`) und sind in jedem Home-Assistant-Backup enthalten.
- Die App öffnet keinen Port nach außen. Sie beantwortet nur Anfragen, die über Home Assistant (Ingress) kommen; wer Home Assistant nicht nutzen darf, kommt nicht auf die Seite.
- Alle Home-Assistant-Benutzer können die Seite öffnen, nicht nur Administratoren.

## Updates

Neue Versionen erscheinen im App-Store als Update. Was sich geändert hat, steht im Reiter **Änderungsprotokoll** (Datei `CHANGELOG.md`).
