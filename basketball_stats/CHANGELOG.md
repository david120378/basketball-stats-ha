# Änderungsprotokoll

Alle nennenswerten Änderungen an der App. Die Versionsnummern folgen [Semantic Versioning](https://semver.org/lang/de/).

## 1.11.0 – 2026-11-16

- Neu: Der Bildschirm bleibt wach, solange „Spiel erfassen“ offen ist (sofern Browser bzw. App das unterstützen)
- Neu: Getippte Tasten leuchten kurz auf, damit die Eingabe auch aus dem Augenwinkel erkennbar ist
- Schriften liegen jetzt in der App; es wird nichts mehr von außen nachgeladen
- Automatische Tests für Server und Seite im Repository (Ordner `tests`)

## 1.10.0 – 2026-11-16

- Neu: Overtime (OT) als fünfter Abschnitt neben Q1 bis Q4
- „Viertel“ heißt jetzt „Quarter“ (Q1–Q4)
- Die Einsatzzeit wird zusätzlich je Quarter gemessen; die Uhr-Schaltfläche zeigt Gesamtzeit und Zeit im laufenden Quarter
- Auswertung „Nach Quarter“ mit Minuten je Quarter; Overtime erscheint dort nur, wenn es eine gab
- CSV-Export um Punkte und Minuten je Quarter und Overtime erweitert

## 1.9.0 – 2026-11-16

- Neu: Viertel – beim Erfassen wird das laufende Viertel gewählt, alle Eingaben zählen für dieses Viertel; Auswertung „Nach Vierteln“
- Neu: Einsatzzeit – Uhr zum Ein- und Auswechseln, in den Spieldaten korrigierbar; Minuten als Kachel, im Verlauf und im Vergleich
- Neu: Schalter „Starting 5“ je Spiel; die Auswertung zeigt, wie oft der Spieler gestartet ist
- CSV-Export um Minuten, Starting 5 und Punkte je Viertel erweitert
- Ein Spiel lässt sich auch ohne Statistik speichern, wenn Einsatzzeit oder Starting 5 erfasst ist

## 1.8.0 – 2026-11-16

- Neu: Saisons – eine Saison lässt sich beenden, neue Spiele zählen danach für die nächste Saison
- Auswertung und Vergleich je Saison oder über alle Saisons; die aktuelle Saison ist voreingestellt
- Der Saisonwechsel gilt für alle Spieler und lässt sich zurücknehmen, solange in der neuen Saison noch kein Spiel gespeichert ist
- Die Spielart „Saison“ heißt jetzt „Hauptrunde“, damit sie nicht mit der Saison verwechselt wird
- CSV-Export und -Import um die Spalte „Saison“ erweitert; bereits gespeicherte Spiele gehören zur ersten Saison

## 1.7.0 – 2026-11-16

- Neu: Reiter „Vergleich“ – Spieler nebeneinander vergleichen
- Balkendiagramm für eine wählbare Statistik und Tabelle mit allen Werten, bester Wert je Zeile hervorgehoben
- Spieler für den Vergleich einzeln an- und abwählbar; Auswahl Gesamt / Saison / Playoffs / Testspiele gilt auch hier

## 1.6.0 – 2026-11-16

- Neu: Mannschaft pro Spiel – für Spieler, die in mehreren Mannschaften spielen
- Auswertung je Mannschaft oder über alle Mannschaften; gilt für Schnitte, Quoten, Diagramme, Spielliste und CSV-Export
- CSV-Export und -Import um die Spalte „Mannschaft“ erweitert; bereits gespeicherte Spiele bleiben ohne Mannschaft und lassen sich über Bearbeiten zuordnen

## 1.5.1 – 2026-11-16

- Behoben: Das Datumsfeld ragte auf dem iPhone bei aufgeklappten Spieldaten über den Rahmen hinaus und war niedriger als die anderen Felder

## 1.5.0 – 2026-11-16

- Erfassungsansicht kompakt: Würfe, Spielzüge, Rückgängig und Speichern passen ohne Scrollen auf einen Handy-Bildschirm und füllen die verfügbare Höhe
- Name, Nummer, Gegner, Datum, Heim/Auswärts und Art stecken jetzt in der aufklappbaren Zeile „Spieldaten“
- Punkte und Quoten des laufenden Spiels als schmale Zeile über den Schaltflächen

## 1.4.0 – 2026-11-16

- Neu: mehrere Erfasser gleichzeitig – jeder Spieler wird einzeln gespeichert, sodass mehrere Geräte parallel verschiedene Spieler erfassen können, ohne sich zu überschreiben
- Geräte gleichen sich alle paar Sekunden ab: neue Spieler, gespeicherte Spiele und Löschungen erscheinen automatisch auf den anderen Geräten
- Eingaben ohne Verbindung bleiben auf dem Gerät und werden automatisch nachgesendet, sobald die Verbindung wieder steht
- Vorhandene Daten werden beim Start automatisch ins neue Speicherformat übernommen

## 1.3.0 – 2026-11-16

- Neu: mehrere Spieler – jeder mit eigenen Spielen, eigener Auswertung und eigenem laufenden Spiel
- Spielerauswahl oben auf der Seite, „+ Spieler“ legt einen weiteren an, „Diesen Spieler löschen“ in der Auswertung
- Beim Wechsel während eines Spiels werden Gegner, Datum, Heim/Auswärts und Art für den nächsten Spieler übernommen
- Die JSON-Sicherung enthält alle Spieler; ältere Sicherungen und CSV-Dateien werden in den gerade gewählten Spieler importiert
- Vorhandene Daten werden automatisch übernommen. Hinweis: Nach dem Update gespeicherte Daten lassen sich mit Versionen vor 1.3.0 nicht mehr lesen

## 1.2.0 – 2026-11-16

- Neu: Art des Spiels – jedes Spiel wird als Saison, Playoffs oder Testspiel erfasst
- Auswertung getrennt nach Gesamt (Saison + Playoffs), Saison, Playoffs und Testspiele; Testspiele fließen nicht in „Gesamt“ ein
- Reiter „Saison“ heißt jetzt „Auswertung“
- CSV-Export und -Import um die Spalte „Art“ erweitert; bereits gespeicherte Spiele zählen als Saison

## 1.1.0 – 2026-11-16

- Neu: Verlauf in der Saison-Ansicht – je ausgewählter Statistik ein Diagramm mit einem Balken pro Spiel und Durchschnittslinie
- Statistiken für den Verlauf einzeln ein- und ausblendbar (Punkte, Quoten, Rebounds, Assists, Steals, Blocks, Ballverluste, Fouls)
- Antippen eines Balkens zeigt Wert, Datum und Gegner des Spiels

## 1.0.2 – 2026-11-16

- Bezeichnungen an Home Assistant 2026.2 angepasst: „Add-on“ heißt jetzt „App“ (README, Anleitung, Repository-Name)

## 1.0.1 – 2026-11-16

- Dokumentation erweitert: Anleitung zu Erfassung, Saison-Auswertung, Export/Import und Datenspeicherung
- Änderungsprotokoll eingeführt

## 1.0.0 – 2026-11-16

- Erste Version als Home-Assistant-Add-on
- Spiel erfassen: Freiwürfe, 2er, 3er, Rebounds, Assists, Steals, Blocks, Ballverluste, Fouls
- Saison-Auswertung mit Schnitt pro Spiel, Trefferquoten und Heim/Auswärts-Filter
- Export als CSV und JSON, Import mit Erkennung doppelter Spiele
- Zugriff ausschließlich über Home Assistant (Ingress)
