# Basketball-Stats

Mit dieser App erfasst du die Statistiken eines oder mehrerer Basketballspieler Spiel für Spiel – direkt am Spielfeldrand auf dem Handy – und wertest sie über die Saison aus. Die Seite läuft in Home Assistant und ist nur darüber erreichbar.

## Erste Schritte

1. App installieren und **Starten**. „Beim Booten starten“ ist bereits aktiv.
2. Optional **In der Seitenleiste anzeigen** einschalten – dann erscheint der Eintrag **Basketball**.
3. Die Seite über die Seitenleiste oder über **Benutzeroberfläche öffnen** aufrufen.
4. Im Reiter **Spiel erfassen** die Zeile **Spieldaten** aufklappen und **Name** und **Nummer** des Spielers eintragen. Beides bleibt gespeichert.

## Mehrere Spieler

- Über **+ Spieler** oben auf der Seite legst du einen weiteren Spieler an und trägst Name und Nummer ein (die Spieldaten klappen dafür automatisch auf).
- Ein Tipp auf einen Spieler in der Leiste wechselt zu ihm. Alles darunter – laufendes Spiel, Auswertung, Diagramme, Spielliste – gehört immer zum gewählten Spieler.
- Du kannst während eines Spiels zwischen Spielern hin- und herwechseln; jeder behält sein laufendes Spiel. Hat der Spieler, zu dem du wechselst, noch nichts erfasst, werden Gegner, Datum, Heim/Auswärts und Art übernommen.
- **Spiel speichern** speichert nur das Spiel des gewählten Spielers – also für jeden Spieler einzeln speichern.
- **Diesen Spieler löschen** (unten im Reiter Auswertung, zweimal antippen) entfernt den Spieler mit allen seinen Spielen. Der letzte Spieler lässt sich nicht löschen.
- Welcher Spieler gerade gewählt ist, merkt sich jedes Gerät für sich.

## Mit mehreren Erfassern gleichzeitig arbeiten

Mehrere Personen können zur selben Zeit erfassen – jede auf ihrem eigenen Gerät und angemeldet in Home Assistant.

1. Alle öffnen die Seite. Die Spieler legt eine Person an; sie erscheinen nach wenigen Sekunden auf allen Geräten.
2. Jede Person wählt in der Leiste oben **ihren** Spieler und erfasst nur diesen.
3. Nach dem Spiel speichert jede Person das Spiel ihres Spielers.

Gut zu wissen:

- Jeder Spieler wird einzeln gespeichert. Eingaben für verschiedene Spieler kommen sich deshalb nicht in die Quere.
- Die Geräte gleichen sich etwa alle vier Sekunden ab. Gespeicherte Spiele und neue Spieler der anderen siehst du ohne Neuladen.
- Erfassen zwei Geräte gleichzeitig **denselben** Spieler, gilt die zuletzt gespeicherte Eingabe – die des anderen Geräts kann verloren gehen. Pro Spieler also nur ein Erfasser.
- Ohne Verbindung steht oben „Offline – nur lokal gespeichert“. Die Eingaben bleiben auf dem Gerät und werden automatisch nachgesendet, sobald die Verbindung wieder da ist. Die Seite so lange geöffnet lassen.

Unterwegs erreichst du die Seite auf demselben Weg wie Home Assistant selbst, zum Beispiel über die Home-Assistant-App.

## Ein Spiel erfassen

Reiter **Spiel erfassen**. Die Ansicht ist so gebaut, dass alle Schaltflächen ohne Scrollen auf einen Handy-Bildschirm passen.

1. Die Zeile **Spieldaten** aufklappen, **Gegner** und **Datum** eintragen, **Heimspiel** oder **Auswärts** wählen. Zugeklappt zeigt die Zeile die Angaben als Zusammenfassung.
2. Spielt der Spieler in mehreren Mannschaften: unter **Mannschaft** den Namen eintragen (z. B. „U14“) oder eine bereits verwendete Mannschaft antippen. Die Auswahl bleibt für das nächste Spiel stehen.
3. Die Art des Spiels wählen: **Hauptrunde**, **Playoffs** oder **Testspiel**. Die Auswahl bleibt für das nächste Spiel stehen.
4. Vor dem Anpfiff **Starting 5** antippen, wenn der Spieler in der Startformation steht.
5. Während des Spiels mittippen:
   - **Quarter**: Mit **Q1** bis **Q4** das laufende Quarter wählen, bei einer Verlängerung **OT**. Alle Eingaben zählen für den gewählten Abschnitt; darunter stehen jeweils dessen Punkte.
   - **Einsatzzeit**: Die Uhr-Schaltfläche antippen, wenn der Spieler aufs Feld kommt, und wieder antippen, wenn er ausgewechselt wird. Sie zeigt oben die Gesamtzeit und darunter die Zeit im laufenden Quarter; beim Wechsel des Quarters zählt die Zeit dort weiter. Die Uhr zählt die tatsächlich vergangene Zeit – bei längeren Unterbrechungen also anhalten. Unter **Spieldaten** stehen die Zeiten aller Quarter; die Gesamtminuten lassen sich dort von Hand korrigieren, die Aufteilung auf die Quarter bleibt dabei im Verhältnis erhalten.
   - **Würfe** (Freiwurf, 2er, 3er): **Treffer** oder **Fehlwurf** antippen. Punkte und Quoten rechnet die Seite selbst aus.
   - **Spielzüge**: Offensiv- und Defensiv-Rebounds, Assists, Steals, Blocks, Ballverluste und Fouls durch Antippen der Kachel hochzählen.
   - Jede getippte Taste leuchtet kurz auf – so siehst du auch aus dem Augenwinkel, dass die Eingabe angekommen ist.
   - Solange **Spiel erfassen** offen ist, hält die Seite den Bildschirm wach, sofern Browser bzw. App das unterstützen. Geht der Bildschirm trotzdem aus, läuft die Einsatzzeit richtig weiter.
6. Vertippt? **Rückgängig** nimmt die letzte Eingabe zurück; mit **−** lässt sich jeder Wert einzeln korrigieren.
7. Nach dem Spiel **Spiel speichern**. Läuft die Uhr noch, wird sie dabei angehalten. Das Spiel wandert in die Auswertung, die Eingabe ist wieder leer.

**Leeren** verwirft die laufende Eingabe. Zur Sicherheit muss die Schaltfläche zweimal angetippt werden.

Oben rechts steht der Speicherstatus: **Gespeichert** heißt, die Daten liegen in Home Assistant. Bei **Offline – nur lokal gespeichert** bleiben die Eingaben zunächst im Browser und werden automatisch übertragen, sobald die Verbindung wieder steht.

## Auswerten

Reiter **Auswertung**:

- Auswahl der Saison (erscheint ab der zweiten Saison): die aktuelle Saison ist voreingestellt, ältere Saisons und **Alle Saisons** sind wählbar.
- Auswahl der Mannschaft (erscheint, sobald ein Spiel einer Mannschaft zugeordnet ist): **Alle Mannschaften**, jede einzelne Mannschaft oder **Ohne Mannschaft** für Spiele ohne Zuordnung. Ältere Spiele ordnest du über den Stift in der Spielliste nachträglich zu.
- Auswahl der Spielart – sie gilt zusammen mit der Mannschaft für alle Zahlen, Diagramme, die Spielliste und den CSV-Export:
  - **Gesamt**: Hauptrunde und Playoffs zusammen, ohne Testspiele
  - **Hauptrunde**: nur Spiele der Hauptrunde
  - **Playoffs**: nur Playoff-Spiele
  - **Testspiele**: eigene, getrennte Statistik für Freundschafts- und Testspiele
- **Schnitt pro Spiel** und **Trefferquoten** über die Spiele der gewählten Art.
- Filter **Alle / Heim / Auswärts**.
- **Minuten** und **Starting 5** stehen bei den Schnitten: durchschnittliche Einsatzzeit der Spiele mit erfasster Zeit und die Zahl der Starts.
- **Nach Quarter**: Punkte, Wurfquote, Rebounds, Assists und Minuten je Quarter als Schnitt pro Spiel; eine Zeile **OT**, wenn es eine Overtime gab. Erscheint, sobald ein Spiel mit Quartern erfasst wurde; ältere Spiele ohne Quarter zählen hier nicht mit.
- **Verlauf**: Diagramme über den Zeitverlauf, ein Balken pro Spiel in zeitlicher Reihenfolge.
  - Über die Auswahl-Schaltflächen legst du fest, welche Statistiken angezeigt werden: Punkte, Wurf-, Zweier-, Dreier- und Freiwurfquote, Rebounds (gesamt, offensiv, defensiv), Assists, Steals, Blocks, Ballverluste, Fouls und Einsatzzeit. Jede gewählte Statistik bekommt ein eigenes Diagramm.
  - Die gestrichelte Linie ist der Durchschnitt, der Wert steht oben rechts (Ø).
  - Einen Balken antippen (am Rechner: mit der Maus darüberfahren) zeigt Wert, Datum und Gegner dieses Spiels, bei Quoten zusätzlich Treffer/Versuche.
  - Der Filter Alle / Heim / Auswärts gilt auch für die Diagramme. Die Auswahl der Statistiken merkt sich das jeweilige Gerät.
- **Alle Spiele** als Liste: mit dem Stift ein Spiel nachträglich bearbeiten, mit dem Papierkorb löschen.

## Saison beenden

Jedes Spiel gehört zu einer Saison. Neue Spiele zählen immer für die aktuelle Saison; die erste heißt nach dem laufenden Spieljahr, z. B. „2026/27“.

1. Im Reiter **Auswertung** nach unten zum Abschnitt **Saison** gehen.
2. Bei Bedarf den vorgeschlagenen Namen der neuen Saison ändern.
3. **Saison … beenden und neue beginnen** zweimal antippen.

Gut zu wissen:

- Der Wechsel gilt für alle Spieler und alle Geräte.
- Die Spiele der beendeten Saison bleiben erhalten. Du siehst sie über die Saison-Auswahl oben in der Auswertung und im Vergleich.
- Ein laufendes, noch nicht gespeichertes Spiel zählt beim Speichern für die neue Saison. Also erst speichern, dann die Saison beenden.
- Wird ein altes Spiel bearbeitet, bleibt es in seiner Saison.
- **Saisonwechsel zurücknehmen** erscheint, solange in der neuen Saison noch kein Spiel gespeichert ist.

## Spieler vergleichen

Reiter **Vergleich** (ab zwei Spielern):

- Oben wählst du, welche Spieler in den Vergleich eingehen, und ob **Gesamt**, **Hauptrunde**, **Playoffs** oder **Testspiele** verglichen werden. Gibt es mehrere Saisons, wählst du auch hier die Saison.
- **Im Diagramm**: eine Statistik auswählen, die Balken zeigen den Wert je Spieler.
- **Alle Werte**: Tabelle mit allen Statistiken, eine Spalte pro Spieler. Der beste Wert je Zeile ist hervorgehoben – bei Ballverlusten und Fouls der niedrigste. Bei vielen Spielern lässt sich die Tabelle seitlich schieben.
- Zählwerte sind Schnitte pro Spiel, Quoten rechnen über alle Würfe. Verglichen werden die Spiele aller Mannschaften eines Spielers.

## Export und Import

| Schaltfläche | Zweck |
| --- | --- |
| **Statistik als CSV** | Tabelle für Excel/Numbers mit den Spielen des gewählten Spielers, Summe und Schnitt pro Spiel. Die gewählte Mannschaft, die Spielart und der Filter Heim/Auswärts werden berücksichtigt. |
| **Sicherung (JSON)** | Vollständige Sicherung aller Spieler und Spiele, auch der laufenden Spiele. |
| **Importieren (CSV oder JSON)** | Liest eine Export-Datei dieser Seite ein. Eine Sicherung mit mehreren Spielern wird den passenden Spielern zugeordnet, fehlende Spieler werden angelegt. CSV-Dateien und ältere Sicherungen landen beim gewählten Spieler. Bereits vorhandene Spiele werden erkannt und nicht doppelt angelegt. |

Daten aus einer älteren Installation übernimmst du so: dort **Sicherung (JSON)** exportieren, hier **Importieren** wählen.

## Datenspeicherung und Zugriff

- Die Daten liegen im App-Speicher (`/data/data.json`) und sind in jedem Home-Assistant-Backup enthalten.
- Die App lädt nichts aus dem Internet nach; auch die Schriften liegen in der App.
- Die App öffnet keinen Port nach außen. Sie beantwortet nur Anfragen, die über Home Assistant (Ingress) kommen; wer Home Assistant nicht nutzen darf, kommt nicht auf die Seite.
- Alle Home-Assistant-Benutzer können die Seite öffnen, nicht nur Administratoren.

## Updates

Neue Versionen erscheinen im App-Store als Update. Was sich geändert hat, steht im Reiter **Änderungsprotokoll** (Datei `CHANGELOG.md`).
