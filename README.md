# Portfolio Lab – GitHub Pages

## Neue Lern- und Vergleichsansicht (08.11.2026)

Portfolios sind in drei aufklappbare Gruppen mit Mehrfachauswahl eingeordnet.
Nur die einfachen Vergleiche sind anfangs geöffnet. Geschlossene Gruppen zeigen
die Zahl gewählter Portfolios; die kompakte Gesamtauswahl erlaubt das Entfernen.

Die freiwillige Erklärungstiefe „Grundlagen“, „Verstehen“ oder „Vertiefung“ wird
lokal im Browser gespeichert. Sie ist kein Wissenstest oder Risikoprofil und
ändert keine Finanzwerte. Profilantworten und Finanzdaten bleiben weiterhin nur
in der geöffneten Sitzung. „Mehr erfahren“ hält die anderen Texte erreichbar.

World/EM, World/Tagesgeld und World/US-Anleihen sind einstellbar. URTH ist dabei
MSCI World (Industrieländer), kein All-Country-ETF. Ohne ausdrücklich importierten
ACWI wird kein ACWI ergänzt. Die vorhandenen alten festen 70/30- und 60/40-Reihen
bleiben im Import zulässig, werden in der Auswahl aber durch einstellbare
Mischungen ersetzt. Bei gleichem ursprünglichem Start stimmt die 70/30-Einstellung
mit dem alten Verlauf überein. Ein späterer Einstieg beginnt mit den neu gewählten
Zielgewichten; er übernimmt nicht unbemerkt die vorher gedrifteten Altgewichte.

Mischungen verwenden tatsächliche Monatsrenditen und driftende Gewichte, keine
Mittelwerte fertiger Endwerte. Jährliche Bandprüfung: Bei Überschreiten einer
importierten 5/25-Schwelle Rücksetzung aller Positionen. Einzahlungen werden
entsprechend dem bestehenden vereinfachten Modell behandelt, nicht als
vollständige Depotbuchhaltung. Nur ETF-Orders tragen Handelskosten; Umbuchungen
in das Tagesgeld-Szenario sind hier kostenfrei. Tagesgeld nutzt die sichtbaren
eingegebenen Zinsen ab Anlagebeginn, keine historische Bankofferte. AGG sind
US-Dollar-Anleihen ohne unterstellte Währungssicherung; Euro-Umrechnung ist keine
Absicherung. Steuern bleiben ausgeschlossen.

Minimum-Varianz hat keinen Hauptnavigationseintrag mehr. Shrinkage steht in der
Gruppe Optimierungsverfahren; alle importierten Varianten bleiben unter der
Zusatzansicht „Schätzverfahren vergleichen“ erhalten. Fama-French schätzt hier
Kovarianzen, statt ein Faktorprämienportfolio zusammenzustellen.

Alle drei Portfolio-Prompttypen enthalten aktuelle Zielgewichte, Zinsszenario,
Zeitraum, Einzahlungen, Kosten/Bänder, Datenstand und Erklärungstiefe. Ein alter
Prompt bleibt nach Eingabeänderungen sichtbar, ist aber als veraltet markiert.
Ein externer KI-Bericht kann hier nicht automatisch überprüft oder aktualisiert
werden. Es werden weiterhin keine Daten an einen KI-Dienst gesendet.

## ETF-Monatsradar: getrennte Datenversorgung

Der Radar startet ohne Ranglisten, bis ein belegter Monatsimport vorliegt.
Es werden keine Beispiel-Rankings oder aus Portfolio-Renditen abgeleiteten
Kaufempfehlungen veröffentlicht. Kandidat für Umsatzdaten:
[Deutsche Börse, ETF-/ETP-Monatsstatistiken](https://www.cashmarket.deutsche-boerse.com/cash-de/Daten-Tech/statistiken/etf-etp-statistiken).
Getrennte Kauf-/Verkaufsstatistiken brauchen eine klar benannte Brokerpopulation.
Ein freigegebener Medienkorpus zur ETF-Erwähnungszählung liegt noch nicht vor.
Quellenzugänglichkeit ersetzt keine Prüfung der Weiterverwendungsrechte.

Dateikopf: `schema: "portfolio-lab-radar-v1"`, `month: "YYYY-MM"`, `asOf:
"YYYY-MM-DD"`, `products: []`, `categories: []`. Der Monat muss abgeschlossen
sein; der Datenstand muss nach seinem Abschluss liegen. Die Schaltfläche in der
Anwendung lädt einen leeren Container herunter.

Produkte: `isin` (mit korrekter Prüfziffer), `name`, `focus`, `type: "ETF"`.
ETCs und ETNs werden nicht untergeschoben. Jede Anteilsklasse besitzt eine ISIN;
mehrere Börsennotierungen ergeben keine mehrfachen Produktplätze.

Kategorien: `id`, `kind`, `unit`, `scope`, `coverage`, `method`, `rights`,
`complete` (Boolean), `from` und `to` (ganzer Monat), `observations` (Liste).
Zulässige Paare: buys/Orders, sells/Orders, turnover/EUR, mentions/Beiträge,
flows/EUR. Getrennte Populationen und Messlogiken benötigen getrennte Kategorien.

Jeder Beleg: `id`, `isin`, `value`, `source`, `url` (HTTPS). Zahlenbelege brauchen
zusätzlich `basis: "monthly-total"`, `from`, `to`. Keine Tagesmomentaufnahme.
Mehrere Zahlenbelege je ISIN müssen nach dokumentierter Vorprüfung nicht
überlappende Mengen darstellen. Derselbe Gesamtwert aus zwei Quellen darf nicht
doppelt gezählt werden; dies kann ein Formvalidator nicht inhaltlich beweisen.

Medienbelege: `value: 1`, `date`, `canonicalId`, `match: "exact-etf-isin"`.
Nur konkrete ETF-Zuordnungen zählen, keine reinen Indexnennungen. Ein Beitrag
zählt je ISIN höchstens einmal; wiederholte Nennungen und alternative URLs mit
derselben kanonischen ID werden bereinigt.

Summiert wird je Kategorie und ISIN, absteigend sortiert. Gleichstand = gleicher
Rang; bei der Anzeige entscheidet zusätzlich die ISIN. Maximal drei Produkte,
keine aufgefüllten Plätze. Unvollständige Kategorien erhalten keine Top 3.
ETF- und zusammenfassende Radar-Prompts übernehmen nur diese Quelldaten.
Der Import prüft Struktur, nicht Lizenz, Tatsachen oder behauptete Abdeckung.

## Eigene Auswahl und Standardansicht

Eigene Portfolios beginnen ohne vorausgewählte Anlage und ohne vorgegebenen Anteil.
Auch neu hinzugefügte Zeilen beginnen mit „Bitte einen ETF auswählen“. Ein
einzelner selbst ausgewählter ETF mit 100 Prozent ist weiterhin möglich.
Unter jedem ausgewählten Baustein kann dessen vorhandene Beschreibung aus der
Importdatei aufgeklappt werden. Für unvollständige Auswahlen wird keine Simulation
oder Bericht-Prompt für ein eigenes Portfolio berechnet.

Portfoliozusammensetzung sowie die drei Bericht-Bereiche gehören in der
Vermögenssimulation zur Standardansicht. Bericht-Prompts werden weiterhin nur
nach einem ausdrücklichen Klick erzeugt und stehen am Ende der Analyse.
Auch beim eigenen Portfolio gehören alle drei Bericht-Bereiche fest dazu.
Andere zusätzliche Darstellungen bleiben dort optional. ETF-Auswahl und
Prozentfeld sind einheitlich hoch; die Auswahl erhält mehr Platz als der Anteil.
Die Nasdaq-/QQQ-Erklärung wird zentral aktualisiert, auch für ältere Importdateien.

## Optionales Profil (Auswertung)

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

Zusatzbereiche werden einzeln in der Navigation gewählt und in fester Reihenfolge
angezeigt. Die drei Bericht-Bereiche sind in Vermögenssimulation und eigenem
Portfolio fest sichtbar; Prompts entstehen erst auf Knopfdruck. Schwankungsklassen verwenden die
Grün-bis-Rot-Skala der lokalen Anwendung. Beim eigenen Portfolio wird dafür eine
separate Referenzhistorie ab Beginn des importierten Testverlaufs verwendet,
unabhängig vom gewählten Investitionsbeginn. Das bleibt eine historische
Einordnung anhand der SRRI-Grenzen, keine offizielle Produkteinstufung.

Nicht alle lokalen Funktionen sind bereits übertragen: insbesondere die
modellbasierte Effizienzgrenze mit Kapitalmarktlinie/CAPM.

Der Bausparvertrag ist optional im Sparformen- und Inflationsvergleich verfügbar.
Berechnet wird dieselbe vereinfachte Sparphase wie lokal: Abschlussgebühr bei
Beginn, Jahresentgelt nach zwölf Monaten vor der Verzinsung, Guthabenzins nur
auf positives Guthaben. Förderungen, Steuern, Darlehen und Zuteilung fehlen.
Die Beispielwerte sind kein historisches Angebot oder zugesicherter Auszahlungswert.

## Sicherheit und Datenschutz

Keine Tracker, externen Schriftarten, Diagramm-CDNs oder Werbedienste. Externe
Quellen werden erst nach einem Klick geöffnet. GitHub kann wie bei anderen
gehosteten Webseiten Verbindungsdaten verarbeiten. Keine Anlageberatung.
