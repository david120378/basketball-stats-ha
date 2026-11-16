# Basketball-Stats – Home-Assistant-App

Eine App für Home Assistant (früher „Add-on“), mit der du die Statistiken eines oder mehrerer Basketballspieler Spiel für Spiel erfasst und über die Saison auswertest. Gedacht für das Mittippen am Spielfeldrand auf dem Handy; die Auswertung funktioniert genauso am Rechner.

**Was es kann**

- Mehrere Spieler führen, jeder mit eigenen Spielen und eigener Auswertung
- Würfe erfassen (Freiwurf, 2er, 3er – Treffer und Fehlwürfe), dazu Rebounds, Assists, Steals, Blocks, Ballverluste und Fouls
- Punkte und Trefferquoten automatisch berechnen
- Jedes Spiel mit Datum, Gegner, Heim/Auswärts und Art (Saison, Playoffs, Testspiel) speichern
- Auswertung: Schnitt pro Spiel und Trefferquoten, getrennt nach Saison, Playoffs und Testspielen sowie Heim und Auswärts
- Verlaufsdiagramme – die angezeigten Statistiken sind frei wählbar
- Export als CSV (für Excel/Numbers) und als JSON-Sicherung, Import beider Formate
- Nur über Home Assistant erreichbar – kein offener Port, Daten im Home-Assistant-Backup

## Installation

Voraussetzung: Home Assistant OS oder Supervised (Apps werden unterstützt), Architektur `amd64` oder `aarch64`.

1. In Home Assistant **Einstellungen → Apps** öffnen und dort den App-Store aufrufen (vor Version 2026.2: **Add-ons → Add-on-Store**).
2. Oben rechts im Menü **⋮ → Repositories** wählen und diese URL hinzufügen:

   ```
   https://github.com/david120378/basketball-stats-ha
   ```

3. Im Store nach **Basketball-Stats** suchen, **Installieren** und danach **Starten**.
4. Optional **In der Seitenleiste anzeigen** aktivieren – der Eintrag heißt **Basketball**.

## Benutzung in Kürze

1. Seite über die Seitenleiste öffnen, **Name** und **Nummer** eintragen. Weitere Spieler legst du mit **+ Spieler** an und wechselst über die Leiste oben.
2. Im Reiter **Spiel erfassen** Gegner, Datum, Heim/Auswärts und die Art des Spiels setzen und während des Spiels Würfe und Spielzüge antippen. **Rückgängig** korrigiert die letzte Eingabe.
3. Nach dem Spiel **Spiel speichern**.
4. Im Reiter **Auswertung** die Spielart wählen und Schnitt, Quoten, Verlaufsdiagramme und alle Spiele ansehen, Spiele bearbeiten oder löschen, exportieren und importieren.

Die ausführliche Anleitung steht in [basketball_stats/DOCS.md](basketball_stats/DOCS.md) und in Home Assistant im Reiter **Dokumentation** der App.

## Versionierung

Die App folgt [Semantic Versioning](https://semver.org/lang/de/) (`MAJOR.MINOR.PATCH`):

| Stelle | Wann erhöhen | Beispiel |
| --- | --- | --- |
| PATCH | Fehlerbehebung, Doku, Kleinigkeiten | 1.0.0 → 1.0.1 |
| MINOR | Neue Funktion, bestehende Daten bleiben nutzbar | 1.0.1 → 1.1.0 |
| MAJOR | Änderung, die bestehende Daten oder die Bedienung bricht | 1.1.0 → 2.0.0 |

Home Assistant bietet ein Update nur an, wenn sich die Versionsnummer ändert. Für jede Veröffentlichung deshalb:

1. `version` in [basketball_stats/config.yaml](basketball_stats/config.yaml) erhöhen.
2. Einen Eintrag in [basketball_stats/CHANGELOG.md](basketball_stats/CHANGELOG.md) ergänzen – er erscheint in Home Assistant als Änderungsprotokoll.
3. Committen, auf `main` pushen und den Commit mit `v<Version>` taggen, z. B. `v1.0.1`.

Aktuelle Version: siehe [config.yaml](basketball_stats/config.yaml), Verlauf im [Änderungsprotokoll](basketball_stats/CHANGELOG.md).

## Aufbau des Repositories

| Pfad | Inhalt |
| --- | --- |
| `repository.yaml` | Kennzeichnet das Repository als App-Repository |
| `basketball_stats/config.yaml` | App-Konfiguration inkl. Version |
| `basketball_stats/Dockerfile` | Container-Image (Node 20) |
| `basketball_stats/server.js` | Kleiner Server ohne Abhängigkeiten: liefert die Seite aus und speichert die Daten |
| `basketball_stats/index.html` | Die Seite selbst |
| `basketball_stats/DOCS.md` | Anleitung, in Home Assistant sichtbar |
| `basketball_stats/CHANGELOG.md` | Änderungsprotokoll, in Home Assistant sichtbar |
