# Basketball-Stats

Mit dieser App erfasst du die Statistiken eines oder mehrerer Basketballspieler Spiel für Spiel – direkt am Spielfeldrand auf dem Handy – und wertest sie über die Saison aus. Die Seite läuft in Home Assistant und ist nur darüber erreichbar.

## Erste Schritte

1. App installieren und **Starten**. „Beim Booten starten“ ist bereits aktiv.
2. Optional **In der Seitenleiste anzeigen** einschalten – dann erscheint der Eintrag **Basketball**.
3. Die Seite über die Seitenleiste oder über **Benutzeroberfläche öffnen** aufrufen.
4. Oben **Name** und **Nummer** des Spielers eintragen. Beides bleibt gespeichert.

## Mehrere Spieler

- Über **+ Spieler** oben auf der Seite legst du einen weiteren Spieler an und trägst Name und Nummer ein.
- Ein Tipp auf einen Spieler in der Leiste wechselt zu ihm. Alles darunter – laufendes Spiel, Auswertung, Diagramme, Spielliste – gehört immer zum gewählten Spieler.
- Du kannst während eines Spiels zwischen Spielern hin- und herwechseln; jeder behält sein laufendes Spiel. Hat der Spieler, zu dem du wechselst, noch nichts erfasst, werden Gegner, Datum, Heim/Auswärts und Art übernommen.
- **Spiel speichern** speichert nur das Spiel des gewählten Spielers – also für jeden Spieler einzeln speichern.
- **Diesen Spieler löschen** (unten im Reiter Auswertung, zweimal antippen) entfernt den Spieler mit allen seinen Spielen. Der letzte Spieler lässt sich nicht löschen.
- Welcher Spieler gerade gewählt ist, merkt sich jedes Gerät für sich.

Unterwegs erreichst du die Seite auf demselben Weg wie Home Assistant selbst, zum Beispiel über die Home-Assistant-App.

## Ein Spiel erfassen

Reiter **Spiel erfassen**:

1. **Gegner** und **Datum** eintragen, **Heimspiel** oder **Auswärts** wählen.
2. Die Art des Spiels wählen: **Saison**, **Playoffs** oder **Testspiel**. Die Auswahl bleibt für das nächste Spiel stehen.
3. Während des Spiels mittippen:
   - **Würfe** (Freiwurf, 2er, 3er): **Treffer** oder **Fehlwurf** antippen. Punkte und Quoten rechnet die Seite selbst aus.
   - **Spielzüge**: Offensiv- und Defensiv-Rebounds, Assists, Steals, Blocks, Ballverluste und Fouls über die Plus-Kachel hochzählen.
4. Vertippt? **Rückgängig** nimmt die letzte Eingabe zurück; mit **−** lässt sich jeder Wert einzeln korrigieren.
5. Nach dem Spiel **Spiel speichern**. Das Spiel wandert in die Auswertung, die Eingabe ist wieder leer.

**Aktuelles Spiel leeren** verwirft die laufende Eingabe. Zur Sicherheit muss die Schaltfläche zweimal angetippt werden.

Oben rechts steht der Speicherstatus: **Gespeichert** heißt, die Daten liegen in Home Assistant. Bei **Offline – nur lokal gespeichert** bleiben die Eingaben zunächst im Browser und werden mit der nächsten Eingabe bei bestehender Verbindung übertragen.

## Auswerten

Reiter **Auswertung**:

- Auswahl der Spielart – sie gilt für alle Zahlen, Diagramme, die Spielliste und den CSV-Export:
  - **Gesamt**: Saison und Playoffs zusammen, ohne Testspiele
  - **Saison**: nur Saisonspiele
  - **Playoffs**: nur Playoff-Spiele
  - **Testspiele**: eigene, getrennte Statistik für Freundschafts- und Testspiele
- **Schnitt pro Spiel** und **Trefferquoten** über die Spiele der gewählten Art.
- Filter **Alle / Heim / Auswärts**.
- **Verlauf**: Diagramme über den Zeitverlauf, ein Balken pro Spiel in zeitlicher Reihenfolge.
  - Über die Auswahl-Schaltflächen legst du fest, welche Statistiken angezeigt werden: Punkte, Wurf-, Zweier-, Dreier- und Freiwurfquote, Rebounds (gesamt, offensiv, defensiv), Assists, Steals, Blocks, Ballverluste und Fouls. Jede gewählte Statistik bekommt ein eigenes Diagramm.
  - Die gestrichelte Linie ist der Durchschnitt, der Wert steht oben rechts (Ø).
  - Einen Balken antippen (am Rechner: mit der Maus darüberfahren) zeigt Wert, Datum und Gegner dieses Spiels, bei Quoten zusätzlich Treffer/Versuche.
  - Der Filter Alle / Heim / Auswärts gilt auch für die Diagramme. Die Auswahl der Statistiken merkt sich das jeweilige Gerät.
- **Alle Spiele** als Liste: mit dem Stift ein Spiel nachträglich bearbeiten, mit dem Papierkorb löschen.

## Export und Import

| Schaltfläche | Zweck |
| --- | --- |
| **Statistik als CSV** | Tabelle für Excel/Numbers mit den Spielen des gewählten Spielers, Summe und Schnitt pro Spiel. Die gewählte Spielart und der Filter Heim/Auswärts werden berücksichtigt. |
| **Sicherung (JSON)** | Vollständige Sicherung aller Spieler und Spiele, auch der laufenden Spiele. |
| **Importieren (CSV oder JSON)** | Liest eine Export-Datei dieser Seite ein. Eine Sicherung mit mehreren Spielern wird den passenden Spielern zugeordnet, fehlende Spieler werden angelegt. CSV-Dateien und ältere Sicherungen landen beim gewählten Spieler. Bereits vorhandene Spiele werden erkannt und nicht doppelt angelegt. |

Daten aus einer älteren Installation übernimmst du so: dort **Sicherung (JSON)** exportieren, hier **Importieren** wählen.

## Datenspeicherung und Zugriff

- Die Daten liegen im App-Speicher (`/data/data.json`) und sind in jedem Home-Assistant-Backup enthalten.
- Die App öffnet keinen Port nach außen. Sie beantwortet nur Anfragen, die über Home Assistant (Ingress) kommen; wer Home Assistant nicht nutzen darf, kommt nicht auf die Seite.
- Alle Home-Assistant-Benutzer können die Seite öffnen, nicht nur Administratoren.
- Erfassen zwei Geräte gleichzeitig, gewinnt die zuletzt gespeicherte Eingabe; Änderungen des anderen Geräts aus der Zwischenzeit können verloren gehen. Am besten erfasst während eines Spiels nur ein Gerät.

## Updates

Neue Versionen erscheinen im App-Store als Update. Was sich geändert hat, steht im Reiter **Änderungsprotokoll** (Datei `CHANGELOG.md`).
