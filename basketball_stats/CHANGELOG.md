# Änderungsprotokoll

Alle nennenswerten Änderungen an der App. Die Versionsnummern folgen [Semantic Versioning](https://semver.org/lang/de/).

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
