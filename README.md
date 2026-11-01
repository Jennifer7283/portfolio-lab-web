# Portfolio Lab – GitHub Pages

## Optionales Profil

„Mein Profil“ enthält eine deutsche Arbeitsübersetzung der vollständigen
13-Item-Skala von Grable und Lytton aus Kuzniak et al. (2015), Appendix A.
Punkteschlüssel und Einordnung: [Rutgers-Auswertung](https://njaes.rutgers.edu/money/assessment-tools/investment-risk-tolerance-quiz.pdf).
Die Übersetzung ist nicht gesondert validiert. Risikobereitschaft ist weder
finanzielle Verlusttragfähigkeit noch eine offizielle Portfolio-Risikoklasse.

Zusätzliche Rahmenbedingungen steuern eine ausdrücklich eigene Anzeigeregel:
historisch ruhigere Verläufe oder feste Vergleichsmischungen zuerst. Keine
wissenschaftlich validierte Eignungszuordnung, keine Kaufempfehlungen, keine
Optimierung nach rückblickender Rendite. Alle Portfolios bleiben auswählbar.
Teilweise beantwortete Rahmenbedingungen werden einzeln genutzt. „Unsicher“ ist
eine gültige Angabe und führt gegebenenfalls zu einer vorsichtigeren Sortierung,
nicht zum Ausschluss des Profils oder der Startauswahl. Nur wenn kein Punkt
beantwortet wurde, wird der übersprungene Abschnitt als solcher benannt.
Profil und Antworten existieren nur im Arbeitsspeicher, nicht in Browser-Speichern,
Analyseexporten oder KI-Prompts. Neuladen verwirft sie.

Statische öffentliche Testversion, unabhängig von der lokalen Streamlit-App.
Keine Installation, kein Backend, keine API-Schlüssel und kein KI-Verbindungsaufbau.
GitHub Pages: Branch `main`, Ordner `/ (root)`.

## Daten

Dieses Repository enthält bewusst keine historischen Yahoo-Kursdaten. Importdateien
werden nur im Arbeitsspeicher des Browsers verarbeitet. Beim Neuladen sind sie weg.
Es gibt keinen Daten-Upload zu einem Server. Die private Datenexportdatei und die
DuckDB-Datenbank dürfen nicht in dieses Repository übernommen werden.

Historische Optimierungsgewichte werden aus einer lokal berechneten Analyse
importiert. Die Website optimiert keine Gewichte neu. Eigene Mischungen werden
mit jährlicher Bandprüfung simuliert. Kosten sind vereinfacht; Steuern fehlen.

## Prompts

Berichte werden nicht automatisch erzeugt. Erst der Klick auf „Prompt erzeugen“
stellt Text zum Kopieren bereit. Es werden dabei keine Daten an eine KI gesendet.
Wer den Text in einen anderen Dienst einfügt, entscheidet selbst über die Weitergabe.
Nachrichtenlinks sind Recherchehinweise, keine bereits gelesenen Nachrichtenbelege.

## Diagramme und Ansichten

Alle enthaltenen Verlaufsgrafiken, Rendite-/Schwankungspunkte und Säulensegmente
zeigen konkrete Werte per Maus oder Antippen. Linien lassen sich nach dem
Fokussieren auch mit den Pfeiltasten, Home und End durchgehen. Punkte und
Säulensegmente sind per Tab und Enter erreichbar; Escape schließt die Anzeige.
Die Skalen werden dabei nicht gezoomt oder verschoben.

Zusatzbereiche und die drei Bericht-Prompts werden einzeln in der Navigation
gewählt und in fester Reihenfolge angezeigt. Schwankungsklassen verwenden die
Grün-bis-Rot-Skala der lokalen Anwendung. Beim eigenen Portfolio wird dafür eine
separate Referenzhistorie ab Beginn des importierten Testverlaufs verwendet,
unabhängig vom gewählten Investitionsbeginn. Das bleibt eine historische
Einordnung anhand der SRRI-Grenzen, keine offizielle Produkteinstufung.

Nicht alle lokalen Funktionen sind bereits übertragen: insbesondere die
modellbasierte Effizienzgrenze mit Kapitalmarktlinie/CAPM und der Bausparvertrag.

## Sicherheit und Datenschutz

Keine Tracker, externen Schriftarten, Diagramm-CDNs oder Werbedienste. Externe
Quellen werden erst nach einem Klick geöffnet. GitHub kann wie bei anderen
gehosteten Webseiten Verbindungsdaten verarbeiten. Keine Anlageberatung.
