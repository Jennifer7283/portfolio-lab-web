// Rechenfunktionen ohne DOM, Netzwerk oder versteckte globalen Einstellungen.
export const sum = a => a.reduce((x,y)=>x+y,0);
export const mean = a => a.length ? sum(a)/a.length : null;
export const stdev = a => a.length>1 ? Math.sqrt(sum(a.map(x=>(x-mean(a))**2))/(a.length-1)) : null;
export const endOfPreviousMonth = d => {const x=new Date(d+'T00:00:00Z');x.setUTCDate(0);return x.toISOString().slice(0,10);};
export const finite = x=>typeof x==='number' && Number.isFinite(x);
export const pretty = n=>n.replaceAll('_',' ').replace('Nasdaq 100','Nasdaq-100').replace('SP 500','S&P 500');

// Zentraler Erklärungstext: auch ältere Importdateien erhalten dieselbe Fassung.
// Quellen: Nasdaq NDX Overview und Invesco QQQ Produktinformation (05.11.2026).
export const NASDAQ_DESCRIPTION = 'Der ETF QQQ bildet den Nasdaq-100 nach. Nasdaq ist eine US-Börse, also ein Handelsplatz für Aktien. Der Nasdaq-100 bündelt 100 der größten dort gelisteten Unternehmen außerhalb des Finanzsektors. Dazu können Unternehmen aus den USA und anderen Ländern gehören.\n\nTechnologieunternehmen haben einen großen Einfluss, etwa Anbieter von Software und Computerchips. Es sind aber auch andere Branchen vertreten, beispielsweise Handel und Gesundheit. Banken und Versicherungen gehören nicht dazu. Der ETF ist deshalb weder ein reiner Technologie-ETF noch ein Querschnitt durch den gesamten US-Aktienmarkt oder die Weltwirtschaft.\n\nDas Geld wird nicht gleichmäßig auf die Unternehmen verteilt. Große Positionen beeinflussen den Verlauf stärker. Wenn diese Unternehmen gleichzeitig an Wert verlieren, kann der ETF deutlich fallen. Viele enthaltene Aktien bedeuten also nicht automatisch eine gleichmäßige Streuung über alle Branchen.';
export const NASDAQ_SHORT = 'Nasdaq ist eine US-Börse, also ein Handelsplatz für Aktien. Der Nasdaq-100 bündelt 100 der größten dort gelisteten Unternehmen außerhalb des Finanzsektors. Dazu können Unternehmen aus den USA und anderen Ländern gehören.\n\nTechnologieunternehmen haben einen großen Einfluss, etwa Anbieter von Software und Computerchips. Es sind aber auch andere Branchen vertreten, beispielsweise Handel und Gesundheit. Banken und Versicherungen gehören nicht dazu.';
export const SP500_DESCRIPTION = 'Der S&P 500 ist ein Aktienindex: eine festgelegte Zusammenstellung von 500 großen US-Unternehmen aus verschiedenen Branchen, zum Beispiel Technologie, Gesundheit, Handel und Finanzen. Der ETF SPY bildet diesen Index nach.\n\nUnternehmen mit einem größeren Börsenwert haben mehr Einfluss auf den Verlauf. Der ETF deckt daher viele große US-Unternehmen ab, aber nicht den gesamten Weltaktienmarkt. Auch ein solcher breit gestreuter Aktien-ETF kann deutlich an Wert verlieren.';
export const assetDescription = asset => asset?.symbol==='QQQ'?NASDAQ_DESCRIPTION:asset?.symbol==='SPY'?SP500_DESCRIPTION:(asset?.description||asset?.label||'Für diese Anlage ist noch keine Beschreibung hinterlegt.');

// Keine implizite Auswahl aus der Reihenfolge der importierten Anlagen.
export function ownPortfolioWeights(data,rows) {
 const weights={};
 for(const row of rows){
  if(!row.name)throw Error('Bitte einen ETF auswählen. Für jede hinzugefügte Zeile ist eine Auswahl erforderlich.');
  if(!Object.hasOwn(data.assets,row.name)||data.assets[row.name].role==='MARKTINDEX')throw Error('Bitte eine verfügbare Anlage auswählen.');
  if(Object.hasOwn(weights,row.name))throw Error('Bitte wähle jeden ETF nur einmal aus.');
  if(!finite(row.weight)||row.weight<0||row.weight>100)throw Error('Bitte gültige Anteile zwischen 0 und 100 Prozent eingeben.');
  weights[row.name]=row.weight/100;
 }
 if(!rows.length||Math.abs(sum(Object.values(weights))-1)>1e-8)throw Error('Die Anteile müssen zusammen 100 Prozent ergeben.');
 return weights;
}

// Deutsche Arbeitsübersetzung des vom Nutzer bereitgestellten Appendix A,
// Kuzniak et al. (2015), S. 189–191; Grable & Lytton (1999).
// Dollarbeträge und Antwortoptionen bleiben unverändert. Keine Kurzskala.
export const profileQuestions = [
 ['Wie würde dein bester Freund oder deine beste Freundin deine Risikobereitschaft beschreiben?', ['Ausgesprochen risikofreudig','Nach gründlicher Recherche bereit, Risiken einzugehen','Vorsichtig','Sehr darauf bedacht, Risiken zu vermeiden'],[4,3,2,1]],
 ['Du darfst in einer Fernsehshow wählen. Was nimmst du?', ['Sicher 1.000 US-Dollar','Eine Chance von 50 % auf 5.000 US-Dollar','Eine Chance von 25 % auf 10.000 US-Dollar','Eine Chance von 5 % auf 100.000 US-Dollar'],[1,2,3,4]],
 ['Du hast für eine einmalige Traumreise gespart. Drei Wochen vor der Abreise verlierst du deinen Arbeitsplatz. Was würdest du tun?', ['Die Reise absagen','Eine deutlich günstigere Reise machen','Wie geplant reisen, um mich auf die Arbeitssuche vorzubereiten','Die Reise verlängern, weil es die letzte Gelegenheit für eine luxuriöse Reise sein könnte'],[1,2,3,4]],
 ['Du erhältst unerwartet 20.000 US-Dollar zum Anlegen. Was würdest du tun?', ['Auf ein Bankkonto, Geldmarktkonto oder in eine versicherte Termineinlage einzahlen','In als sicher geltende Anleihen guter Schuldner oder entsprechende Anleihenfonds investieren','In Aktien oder Aktienfonds investieren'],[1,2,3]],
 ['Wie wohl fühlst du dich aufgrund deiner bisherigen Erfahrung beim Investieren in Aktien oder Aktienfonds?', ['Überhaupt nicht wohl','Einigermaßen wohl','Sehr wohl'],[1,2,3]],
 ['Welches Wort kommt dir beim Begriff Risiko zuerst in den Sinn?', ['Verlust','Unsicherheit','Chance','Nervenkitzel'],[1,2,3,4]],
 ['Angenommen, Fachleute erwarten steigende Preise für Sachwerte wie Gold und Immobilien sowie fallende Anleihenkurse. Dein Anlagevermögen liegt überwiegend in hoch verzinsten Staatsanleihen, die als relativ sicher gelten. Was würdest du tun?', ['Die Anleihen behalten','Verkaufen und je die Hälfte auf Geldmarktkonten sowie in Sachwerte anlegen','Verkaufen und den gesamten Erlös in Sachwerte anlegen','Verkaufen, alles in Sachwerte anlegen und dafür zusätzlich Geld leihen'],[1,2,3,4]],
 ['Welche Anlage würdest du anhand ihres besten und schlechtesten möglichen Ergebnisses wählen?', ['Bestenfalls 200 US-Dollar Gewinn, schlimmstenfalls kein Gewinn oder Verlust','Bestenfalls 800 US-Dollar Gewinn, schlimmstenfalls 200 US-Dollar Verlust','Bestenfalls 2.600 US-Dollar Gewinn, schlimmstenfalls 800 US-Dollar Verlust','Bestenfalls 4.800 US-Dollar Gewinn, schlimmstenfalls 2.400 US-Dollar Verlust'],[1,2,3,4]],
 ['Zusätzlich zu deinem bisherigen Vermögen erhältst du 1.000 US-Dollar. Welche weitere Möglichkeit wählst du?', ['Sicher 500 US-Dollar zusätzlich gewinnen','Mit je 50 % Wahrscheinlichkeit zusätzlich 1.000 US-Dollar oder nichts gewinnen'],[1,3]],
 ['Zusätzlich zu deinem bisherigen Vermögen erhältst du 2.000 US-Dollar. Welche Möglichkeit wählst du?', ['Sicher 500 US-Dollar verlieren','Mit je 50 % Wahrscheinlichkeit 1.000 US-Dollar oder nichts verlieren'],[1,3]],
 ['Du erbst 100.000 US-Dollar und musst den gesamten Betrag in genau eine der folgenden Möglichkeiten investieren. Welche wählst du?', ['Ein Sparkonto oder einen Geldmarktfonds','Einen Fonds mit Aktien und Anleihen','Ein Portfolio aus 15 einzelnen Aktien','Rohstoffe wie Gold, Silber und Öl'],[1,2,3,4]],
 ['Welche Aufteilung für 20.000 US-Dollar spricht dich am ehesten an?', ['60 % in Anlagen mit niedrigem, 30 % mit mittlerem und 10 % mit hohem Risiko','30 % in Anlagen mit niedrigem, 40 % mit mittlerem und 30 % mit hohem Risiko','10 % in Anlagen mit niedrigem, 40 % mit mittlerem und 50 % mit hohem Risiko'],[1,2,3]],
 ['Ein vertrauter Freund mit Erfahrung in Geologie sucht Geld für eine Goldmine. Bei Erfolg könnte der Einsatz auf das 50- bis 100-Fache steigen; bei Misserfolg ist alles verloren. Die Erfolgschance wird auf 20 % geschätzt. Wie viel würdest du investieren, falls das Geld verfügbar wäre?', ['Nichts','Ein Monatsgehalt','Drei Monatsgehälter','Sechs Monatsgehälter'],[1,2,3,4]]
];

export function scoreRiskAnswers(answers) {
 if(!Array.isArray(answers)||answers.length!==13||answers.some((a,i)=>!Number.isInteger(a)||a<0||a>=profileQuestions[i][2].length))return null;
 // Alle 13 Items addieren, keine optionale Mittelung der Fragen 9 und 10.
 const score=sum(answers.map((a,i)=>profileQuestions[i][2][a]));
 const band=score<=18?0:score<=22?1:score<=28?2:score<=32?3:4;
 return {score,band,label:['Geringe Risikobereitschaft','Eher geringe Risikobereitschaft','Mittlere Risikobereitschaft','Eher hohe Risikobereitschaft','Hohe Risikobereitschaft'][band]};
}

export const profileFields = [
 ['goal','Wofür möchtest du anlegen?',[['reserve','Geld für einen festen Zweck erhalten'],['save','Regelmäßig Vermögen aufbauen'],['learn','Anlagen erst einmal kennenlernen']]],
 ['horizon','Wann könntest du das Geld benötigen?',[['short','In weniger als fünf Jahren'],['medium','In fünf bis zehn Jahren'],['long','In mehr als zehn Jahren'],['unknown','Das weiß ich noch nicht']]],
 ['reserve','Hast du eine getrennte Reserve für unerwartete Ausgaben?',[['yes','Ja'],['no','Nein'],['unknown','Unsicher']]],
 ['loss','Könntest du Verluste tragen, ohne laufende Ausgaben oder dein Anlageziel zu gefährden?',[['yes','Ja'],['no','Nein'],['unknown','Unsicher']]],
 ['debt','Müsstest du Geld leihen oder laufende Kreditraten gefährden, um zu investieren?',[['no','Nein'],['yes','Ja'],['unknown','Unsicher']]],
 ['income','Bleibt nach deinen laufenden Ausgaben verlässlich Geld übrig?',[['yes','Ja'],['no','Nein'],['unknown','Das ist unregelmäßig oder noch unklar']]],
 ['experience','Wie viel Erfahrung hast du mit ETFs und Portfolios?',[['new','Ich beginne gerade'],['some','Ich kenne die Grundlagen'],['experienced','Ich habe praktische Erfahrung']]],
 ['effort','Wie möchtest du dich mit der Anlage beschäftigen?',[['low','Möglichst wenig Aufwand'],['active','Regelmäßig prüfen und bei Bedarf umschichten']]]
];

export function profilePolicy(profile) {
 const assessment=scoreRiskAnswers(profile?.answers),f=profile?.context??{};
 // Leer bedeutet übersprungen. „Unsicher“ ist dagegen eine gültige Angabe.
 if(!assessment||profileFields.some(([key,,values])=>f[key]!==undefined&&f[key]!==''&&!values.some(([v])=>v===f[key])))return null;
 const contextCount=profileFields.filter(([key,,values])=>values.some(([v])=>v===f[key])).length;
 const warnings=[];
 if(f.reserve==='no')warnings.push('Du hast keine getrennte Reserve angegeben. Unerwartete Ausgaben könnten einen Verkauf zu einem ungünstigen Zeitpunkt erzwingen.');
 if(f.reserve==='unknown')warnings.push('Du bist bei deiner Reserve unsicher. Diese Unsicherheit wird berücksichtigt: Historisch ruhigere Verläufe stehen zuerst, ohne dass damit Kapitalsicherheit zugesagt wird.');
 if(f.loss==='no')warnings.push('Du hast angegeben, dass Verluste deine laufenden Ausgaben oder dein Anlageziel gefährden könnten. Auch historisch ruhige Portfolios können Geld verlieren.');
 if(f.loss==='unknown')warnings.push('Dein finanzieller Verlustspielraum ist für dich noch unsicher. Deshalb werden vorsichtigere historische Vergleiche zuerst angezeigt.');
 if(f.debt==='yes')warnings.push('Du hast angegeben, dass geliehenes Geld oder laufende Kreditraten betroffen wären. Das erhöht die Belastung bei Verlusten.');
 if(f.debt==='unknown')warnings.push('Du bist hinsichtlich der Finanzierung unsicher. Diese Angabe führt zu einer vorsichtigeren Sortierung, nicht zum Ausschluss deines Profils.');
 if(f.income==='no')warnings.push('Du hast keinen verlässlichen Überschuss angegeben. Die Anwendung berechnet deshalb keine für dich tragbare Sparrate.');
 if(f.income==='unknown')warnings.push('Dein Überschuss ist unregelmäßig oder unklar. Das wird bei der vorsichtigen Sortierung berücksichtigt; eine tragbare Sparrate wird nicht geschätzt.');
 if(f.horizon==='short')warnings.push('Du könntest das Geld in weniger als fünf Jahren benötigen. Der Vergleich zeigt nicht, ob Verluste bis dahin aufgeholt wären. Sieh dir auch den Sparformenvergleich an.');
 if(f.horizon==='unknown')warnings.push('Du weißt noch nicht, wann du das Geld benötigen könntest. Deshalb stehen historisch ruhigere Verläufe zuerst; der Sparformenvergleich bleibt ebenfalls wichtig.');
 const cautious=assessment.band<=1||f.goal==='reserve'||f.horizon==='short'||f.horizon==='unknown'||warnings.length>0;
 return {...assessment,warnings,contextCount,mode:cautious?'calm':f.effort==='low'?'simple':'neutral',simple:f.effort==='low'};
}

// Textliche Rückmeldung aus vorhandenen Antworten, keine neue Typologie oder Punkteskala.
export function profileReflection(profile){
 const p=profilePolicy(profile);if(!p)return null;const f=profile.context??{};
 const risk=[
 'Deine Antworten sprechen dafür, dass du finanzielle Risiken möglichst vermeiden möchtest. Ein ruhiger Verlauf und der Umgang mit möglichen Verlusten sind für dich besonders wichtige Vergleichspunkte.',
 'Deine Antworten deuten auf einen eher vorsichtigen Umgang mit Geldanlagen hin. Du bist nicht grundsätzlich gegen Risiken, möchtest mögliche Verluste aber eher begrenzen.',
 'Deine Antworten zeigen eine mittlere Risikobereitschaft. Du scheinst zwischen möglichen Gewinnen und der Unsicherheit durch Verluste abwägen zu wollen.',
 'Deine Antworten deuten darauf hin, dass du für mögliche Gewinne auch stärkere Schwankungen akzeptieren würdest. Prüfe im Vergleich deshalb nicht nur den Gewinn, sondern auch die zwischenzeitlichen Verluste.',
 'Deine Antworten zeigen eine hohe Bereitschaft, finanzielle Risiken einzugehen. Das bedeutet nicht automatisch, dass du größere Verluste finanziell tragen kannst.'
 ][p.band];
 const preferences=[];
 if(f.goal==='save')preferences.push('Du möchtest regelmäßig Vermögen aufbauen.');
 if(f.goal==='reserve')preferences.push('Dir geht es darum, Geld für einen bestimmten Zweck zu erhalten.');
 if(f.goal==='learn')preferences.push('Du möchtest Geldanlagen zunächst kennenlernen.');
 if(f.effort==='low')preferences.push('Dabei ist dir wenig laufender Aufwand wichtig; achte beim Vergleich darauf, wie oft du die Aufteilung prüfen und anpassen müsstest.');
 if(f.effort==='active')preferences.push('Du bist bereit, die Anlage regelmäßig zu prüfen und bei Bedarf umzuschichten; häufigerer Handel allein garantiert allerdings kein besseres Ergebnis.');
 const timing=[],budget=[],portfolio=[];
 if(f.horizon==='short')timing.push('Lege zuerst fest, welchen Betrag du in den nächsten fünf Jahren tatsächlich brauchst. Prüfe für diesen Teil besonders, ob ein Kursverlust zum geplanten Auszahlungstermin dein Ziel gefährden würde; ein ETF kann verkäuflich sein und trotzdem gerade im Minus stehen.');
 if(f.horizon==='medium')timing.push('Vergleiche für deinen Zeitraum von fünf bis zehn Jahren nicht nur den Endwert, sondern auch die Verlustphasen: Wie tief fiel das Portfolio, und wie lange lag es unter seinem früheren Höchststand? Eine Erholung bis zu deinem Auszahlungstermin ist nicht garantiert.');
 if(f.horizon==='long')timing.push('Du planst mit mehr als zehn Jahren. Prüfe deshalb, ob du die Mischung auch während eines längeren Einbruchs halten könntest, statt nur auf den höchsten historischen Endwert zu schauen; ein langer Zeitraum garantiert keine Erholung.');
 if(f.horizon==='unknown')timing.push('Kläre zunächst, welcher Teil des Geldes möglicherweise kurzfristig gebraucht wird. Für diesen Teil ist entscheidend, ob du auch bei fallenden Kursen auf das Geld angewiesen wärst.');
 if(f.reserve==='no')timing.push('Du hast keine getrennte Reserve angegeben: Plane unerwartete Ausgaben getrennt vom investierten Kapital ein, damit sie dich nicht zu einem Verkauf während einer Verlustphase zwingen.');
 if(f.reserve==='unknown')timing.push('Bei deiner Reserve bist du noch unsicher; prüfe, welcher Betrag jederzeit für unerwartete Ausgaben verfügbar bleiben muss.');
 if(f.loss==='no')budget.push('Du hast angegeben, dass Verluste Ausgaben oder dein Ziel gefährden könnten. Rechne deshalb mögliche Verluste auch in Euro durch und kläre, welcher Betrag ohne diese Folgen verloren gehen dürfte; Risikobereitschaft ersetzt diesen finanziellen Spielraum nicht. Vergleiche diesen Betrag mit den Werten unter „Risiko verstehen“; historische Verluste und VaR sind keine Obergrenze für künftige Verluste.');
 if(f.loss==='unknown')budget.push('Deine finanziell verkraftbare Verlusthöhe ist noch unklar und sollte nicht aus deiner Risikobereitschaft abgeleitet werden. Lege dafür einen Betrag in Euro fest und vergleiche ihn mit den historischen Verlusten; diese sind keine Obergrenze künftiger Verluste.');
 if(f.loss==='yes')budget.push('Prüfe unter „Risiko verstehen“ neben den Schwankungen auch den größten historischen Einbruch und den VaR in Euro. Frage dich, ob ein solcher Verlust bei deinem Startkapital noch tragbar wäre; künftig können Verluste höher ausfallen.');
 if(f.debt==='yes')budget.push('Da geliehenes Geld oder Kreditraten betroffen wären, rechne auch durch, ob Zinsen und Rückzahlungen ohne Erträge oder Verkäufe aus dem Portfolio bezahlt werden könnten.');
 if(f.debt==='unknown')budget.push('Kläre außerdem, ob das investierte Geld für Kreditraten oder andere feste Verpflichtungen benötigt wird.');
 if(f.income==='no'||f.income==='unknown')budget.push('Vergleiche wegen deines unklaren oder fehlenden regelmäßigen Überschusses auch eine Simulation mit geringeren oder ohne monatliche Einzahlungen, statt eine dauerhaft verfügbare Sparrate vorauszusetzen.');
 if(p.contextCount){portfolio.push('Schau bei der Portfoliozusammensetzung auf die größten Anteile und darauf, welche Länder und Branchen dahinterstehen. Mehrere ETFs sind nicht automatisch breiter gestreut, wenn sie dieselben Unternehmen enthalten.');
  if(f.effort==='low')portfolio.push('Weil du wenig Aufwand möchtest, vergleiche außerdem Umschichtungsquote und Handelskosten: Wie häufig müsste die Mischung angepasst werden, und was kostet das? Ein historisch höherer Gewinn allein beantwortet diese Fragen nicht.');
  else if(f.effort==='active')portfolio.push('Beziehe bei deinem Wunsch nach regelmäßiger Prüfung die Umschichtungsquote und Handelskosten ein: Häufige Anpassungen verursachen Aufwand und können den Gewinn schmälern.');
  else portfolio.push('Vergleiche auch die Handelskosten und den Aufwand für spätere Anpassungen, nicht nur die Rendite.');
 }
 const focusParagraphs=[timing,budget,portfolio].map(x=>x.join(' ')).filter(Boolean);
 return {label:p.label,risk,preferences:preferences.join(' '),focus:focusParagraphs.join(' '),focusParagraphs,contextCount:p.contextCount};
}

// Eigene, offen ausgewiesene Anzeigeregel – keine validierte Eignungszuordnung.
// Nie historische Rendite maximieren; Fünfjahresrisiko unabhängig vom Startregler.
export function profileOrder(data,names,profile) {
 const policy=profilePolicy(profile);if(!policy)return names.map(name=>({name}));
 const simpleNames=['Welt-ETF','70/30 Welt/Schwellenländer','60/40 Welt/US-Anleihen','S&P 500 (SPY)','Nasdaq-100 (QQQ)','US-Marktportfolio (VTI)'];
 const entries=names.map((name,index)=>({name,index,simple:simpleNames.includes(name),risk:volatilityClass(data,data.portfolios[name])}));
 return entries.sort((a,b)=>{
   if(policy.mode==='calm'){const d=(a.risk?.vol??Infinity)-(b.risk?.vol??Infinity);if(d)return d;}
   if(policy.simple&&a.simple!==b.simple)return a.simple?-1:1;
   return a.index-b.index;
 });
}

// Nur Textgliederung: keine Änderungen an Zahlen, Aussagen oder Berechnungen.
// Die deutsche Satzsegmentierung lässt Datums- und Dezimalwerte zusammen.
export function explanationParagraphs(text) {
  return String(text??'').split(/\n\s*\n/).flatMap(block=>{
    const clean=block.trim();if(!clean)return [];
    return typeof Intl.Segmenter==='function'
      ? [...new Intl.Segmenter('de',{granularity:'sentence'}).segment(clean)].map(s=>s.segment.trim()).filter(Boolean)
      : clean.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ])/).filter(Boolean);
  });
}

// Eine Zusatzoption öffnet stets ihre zugehörige Ansicht, nicht nur das Menü.
export function setViewOption(state,key,checked) {
  const [page,section]=key.split(':');
  if(!page||!section)throw Error('Ungültige Ansichtsoption.');
  state.options[key]=Boolean(checked);state.page=page;state.navOpen[page]=true;
  return page;
}

export function validateData(d) {
  if(d?.schema!=='portfolio-lab-web-v1'||d.currency!=='EUR'||!Array.isArray(d.dates)||d.dates.length<2||d.dates.length>1200) throw Error('Bitte eine Portfolio-Lab-Importdatei im Format v1 auswählen.');
  if(!d.assets||!d.portfolios||!d.assumptions||!Array.isArray(d.attribution)||!Array.isArray(d.trades)||!Array.isArray(d.sources)) throw Error('Die Importdatei ist unvollständig.');
  if(new Set(d.dates).size!==d.dates.length||d.dates.some((v,i)=>!/^\d{4}-\d{2}-\d{2}$/.test(v)||(i>0&&v<=d.dates[i-1]))) throw Error('Die Datumsreihe muss eindeutig und aufsteigend sein.');
  for(const [i,date] of d.dates.entries()) {const expected=new Date(Date.UTC(+date.slice(0,4),+date.slice(5,7),0)).toISOString().slice(0,10);if(date!==expected)throw Error('Monatsenddaten erwartet.');if(i&&endOfPreviousMonth(date)!==d.dates[i-1])throw Error('Die Monatsreihe enthält Lücken.');}
  for(const a of [...Object.values(d.assets).map(a=>a.returns),...Object.values(d.portfolios)]) if(!Array.isArray(a)||a.length!==d.dates.length||a.some(v=>!finite(v)||v< -1)) throw Error('Renditen fehlen oder sind ungültig.');
  for(const key of ['fixedCost','proportionalCost','absoluteBand','relativeBand']) if(!finite(d.assumptions[key])||d.assumptions[key]<0)throw Error('Ungültige Kosten oder Rebalancing-Schwellen.');
  return d;
}

export function customPortfolio(data, weights, start=0) {
  const entries=Object.entries(weights).filter(([,w])=>w>0);
  if(!entries.length||Math.abs(sum(entries.map(([,w])=>w))-1)>1e-8||entries.some(([n,w])=>!data.assets[n]||!finite(w)||w<0))throw Error('Die Anteile müssen zusammen genau 100 % ergeben.');
  let current=entries.map(([,w])=>w); const target=[...current],returns=[],attr=[],trades=[];
  for(let i=start;i<data.dates.length;i++) {
    const date=data.dates[i];
    if(i>start&&(i-start)%12===0&&current.some((w,j)=>Math.abs(w-target[j])>Math.min(data.assumptions.absoluteBand,data.assumptions.relativeBand*target[j])+1e-12)) {
      entries.forEach(([n],j)=>trades.push({neuberechnung:date,instrument_name:n,handelsgewicht:target[j]-current[j],gewicht:target[j]}));current=[...target];
    }
    const values=entries.map(([n],j)=>current[j]*(1+data.assets[n].returns[i])),r=sum(values)-1;
    if(r<=-1)throw Error('Das Portfolio besitzt keinen positiven Restwert.');
    entries.forEach(([n],j)=>attr.push({datum:date,portfolio:'Eigenes Portfolio',instrument_name:n,startgewicht:current[j],instrumentrendite:data.assets[n].returns[i],renditebeitrag:current[j]*data.assets[n].returns[i],endgewicht:values[j]/(1+r)}));
    current=values.map(v=>v/(1+r));returns.push(r);
  }
  return {returns,attr,trades,start,initial:target};
}

export function simulate(data,name,start,capital,payment,custom=null,costs=true) {
  if(!finite(capital)||!finite(payment)||capital<0||payment<0||!Number.isInteger(start)||start<0||start>=data.dates.length)throw Error('Startkapital, Einzahlung oder Beginn sind ungültig.');
  const dates=data.dates.slice(start),returns=custom?custom.returns:data.portfolios[name]?.slice(start);
  if(!returns||returns.length!==dates.length)throw Error('Für das Portfolio fehlen Monatsrenditen.');
  const attr=custom?custom.attr:data.attribution.filter(a=>a.portfolio===name&&a.datum>=dates[0]);
  const events=custom?(custom.costTrades??custom.trades):data.trades.filter(t=>t.portfolio===name&&t.neuberechnung>=dates[0]);
  const initial=custom?(custom.costInitial??custom.initial):attr.filter(a=>a.datum===dates[0]).map(a=>a.startgewicht);
  if(!initial.length&&!custom?.costInitial)throw Error('Die Anfangsgewichte fehlen; Kosten können nicht zuverlässig berechnet werden.');
  let value=capital,paid=capital,cost=0;
  const rows=[{date:endOfPreviousMonth(dates[0]),value,paid,cost:0,totalCost:0}];
  dates.forEach((date,i)=>{
    if(i>0)value+=payment;
    const trades=i===0?initial:events.filter(t=>t.neuberechnung===date).map(t=>t.handelsgewicht??0);
    const amounts=trades.map(w=>Math.abs(w)*value).filter(v=>v>=.01);
    const fee=costs?Math.min(value,amounts.length*data.assumptions.fixedCost+sum(amounts)*data.assumptions.proportionalCost):0;
    value-=fee;cost+=fee;if(i===0)value+=payment;paid+=payment;value*=1+returns[i];
    rows.push({date,value,paid,cost:fee,totalCost:cost});
  });
  return {name,rows,returns,attr,events};
}

export function stats(returns,rf=[]) {
  const growth=returns.reduce((a,r)=>a*(1+r),1),sd=stdev(returns);
  let level=1,peak=1,maxDD=0;const drawdowns=returns.map(r=>{level*=1+r;peak=Math.max(peak,level);const dd=level/peak-1;maxDD=Math.min(maxDD,dd);return dd;});
  const excess=rf.length===returns.length&&rf.every(finite)?returns.map((r,i)=>r-rf[i]):null;
  return {annual:growth**(12/returns.length)-1,vol:sd===null?null:sd*Math.sqrt(12),sharpe:sd>0&&excess?mean(excess)/sd*Math.sqrt(12):null,maxDD,drawdowns,var95:sd===null?null:1.6448536269514722*sd-mean(returns)};
}

export function volatilityClass(data,returns,start=0) {
  const asOf=new Date(data.asOf+'T00:00:00Z');
  if(!Number.isFinite(asOf.getTime()))return null;
  const y=asOf.getUTCFullYear(),m=asOf.getUTCMonth(),isEnd=new Date(Date.UTC(y,m+1,0)).getUTCDate()===asOf.getUTCDate();
  const end=new Date(Date.UTC(y,m+(isEnd?1:0),0)).toISOString().slice(0,10),idx=data.dates.indexOf(end);
  if(idx<0||idx-59<start)return null;
  const vol=stdev(returns.slice(idx-59-start,idx+1-start))*Math.sqrt(12);
  return {class:1+[.005,.02,.05,.10,.15,.25].filter(b=>vol>=b).length,vol,from:data.dates[idx-59],to:end};
}

export function savings(dates,capital,payment,rate,months,nextRate) {
  let value=capital,paid=capital;const rows=[{date:endOfPreviousMonth(dates[0]),value,paid,totalCost:0}];
  dates.forEach((date,i)=>{paid+=payment;value=(value+payment)*(1+(i<months?rate:nextRate))**(1/12);rows.push({date,value,paid,totalCost:0});});return {name:'Tagesgeldkonto (Szenario)',rows};
}
// Entspricht der lokalen Bausparrechnung: nur die Sparphase, kein Darlehen.
export function buildingSavings(dates,capital,payment,contractSum,rate,closingFee,annualFee=0) {
  if(!dates.length||![capital,payment,contractSum,rate,closingFee,annualFee].every(finite)||capital<0||payment<0||contractSum<=0||rate<=-1||closingFee<0||annualFee<0)throw Error('Bitte gültige Angaben zum Bausparvertrag eingeben.');
  let totalCost=contractSum*closingFee,value=capital-totalCost,paid=capital;
  const rows=[{date:endOfPreviousMonth(dates[0]),value,paid,totalCost}];
  dates.forEach((date,i)=>{paid+=payment;value+=payment;const cost=(i+1)%12===0?annualFee:0;value-=cost;totalCost+=cost;if(value>0)value*=(1+rate)**(1/12);rows.push({date,value,paid,totalCost});});
  return {name:'Bausparvertrag – Sparphase (Szenario)',rows};
}
export function realValue(rows,cpi) {const base=cpi[rows[0].date];if(!finite(base)||base<=0)return [];return rows.filter(r=>finite(cpi[r.date])&&cpi[r.date]>0).map(r=>({...r,value:r.value*base/cpi[r.date]}));}

// Exakte additive Zerlegung des Geldabstands aus den monatlichen Kurven.
// Enthält Kostenwirkung einschließlich späterer entgangener Entwicklung.
export function compare(a,b) {
  const n=a.rows.length-1, contributions={};let feeImpact=0;
  for(let i=1;i<=n;i++) {
    const ar=a.rows[i],br=b.rows[i],growth=1+b.returns[i-1];
    Object.keys(contributions).forEach(k=>contributions[k]*=growth);feeImpact*=growth;
    const invested=(ar.value/(1+a.returns[i-1]));
    for(const x of a.attr.filter(x=>x.datum===ar.date))contributions[x.instrument_name]=(contributions[x.instrument_name]||0)+invested*x.startgewicht*(x.instrumentrendite-b.returns[i-1]);
    feeImpact+=(br.cost-ar.cost)*growth;
  }
  const gap=a.rows.at(-1).value-b.rows.at(-1).value;
  // Die erste Kostenzeile ist enthalten, die Gleichheit gilt auch mit Sparraten.
  const residual=gap-sum(Object.values(contributions))-feeImpact;
  const changes=a.rows.slice(1).map((r,i)=>({date:r.date,change:(r.value-b.rows[i+1].value)-(a.rows[i].value-b.rows[i].value)}));
  const sign=gap>=0?1:-1;let best={value:-Infinity,from:changes[0]?.date,to:changes[0]?.date};
  for(let i=0;i<changes.length;i++){const segment=changes.slice(i,i+6),v=sign*sum(segment.map(x=>x.change));if(v>best.value)best={value:v,from:segment[0].date,to:segment.at(-1).date};}
  return {gap,contributions,feeImpact,residual,phase:best};
}
