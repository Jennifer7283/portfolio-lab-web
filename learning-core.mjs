// Ausschließlich lokaler Einstieg; keine Einschätzung persönlicher Anlageeignung.
// Sichtfenster ausschneiden, ohne den Bereich zwischen Feld und Diagramm freizulegen.
export function tutorialMaskRects(bounds,width,height,padding=8){
 const holes=bounds.map(r=>({left:Math.max(0,r.left-padding),right:Math.min(width,r.right+padding),top:Math.max(0,r.top-padding),bottom:Math.min(height,r.bottom+padding)})).filter(r=>r.right>r.left&&r.bottom>r.top);
 const ys=[...new Set([0,height,...holes.flatMap(r=>[r.top,r.bottom])])].sort((a,b)=>a-b),rects=[];
 for(let i=0;i<ys.length-1;i++){
  const top=ys[i],bottom=ys[i+1],intervals=holes.filter(r=>r.top<bottom&&r.bottom>top).sort((a,b)=>a.left-b.left);let left=0;
  for(const r of intervals){if(r.left>left)rects.push([left,top,r.left-left,bottom-top]);left=Math.max(left,r.right);}
  if(left<width)rects.push([left,top,width-left,bottom-top]);
 }
 return rects;
}
export function localEntryRoute(choice){
 if(choice==='experienced')return {mode:'experienced',tourFinished:false,page:'simulation'};
 if(choice==='beginner-free')return {mode:'beginner',tourFinished:true,page:'simulation'};
 return {mode:'beginner',tourFinished:false,page:'lernen'};
}
export function localOnboardingProfile(profile,choice){
 const experience={beginner:'new','beginner-free':'some',experienced:'experienced'}[choice];
 if(!experience)throw Error('Unbekannter Einstieg');
 return {...profile,context:{...profile.context,experience},entry:choice==='beginner'?'basics':'compare'};
}
export const localLearningSteps = [
  {page:'lernen',title:'Grundlagen kennenlernen',destination:'zu den Grundlagen'},
  {page:'kurz',title:'Investieren in a nutshell',destination:'zu Investieren in a nutshell'},
  {page:'lektionen',title:'Grundlagen-Quiz',destination:'zum Grundlagen-Quiz'},
  {page:'simulation',title:'Mit einem ETF experimentieren',destination:'zur Vermögenssimulation'},
  {page:'eigen',title:'Dein eigenes ETF-Portfolio',destination:'zu deinem ETF-Portfolio'},
  {page:'sparen',title:'ETF und Tagesgeld vergleichen',destination:'zum Tagesgeldvergleich'},
  {page:'inflation',title:'Kaufkraft verstehen',destination:'zu Inflation und Kaufkraft'},
];
export const localLearningPortfolios = ['Welt-ETF','S&P 500 (SPY)','local-gold'];
export const localBeginnerPages=['kurz','simulation','eigen','sparen','inflation','radar'];
export function localActivePortfolio(name){
 return name.startsWith('Minimum-Varianz')||['Gleichgewichtung','Markowitz','Markowitz Black-Litterman','Tangentialportfolio','Risk Parity'].includes(name);
}
export function localBeginnerComparisons(available){
 return available.filter(n=>!localActivePortfolio(n)&&n!=='mix-cash');
}
export const localLearningSymbols = ['URTH','SPY','GLD','IEMG'];
export const localNoticeSlides=[
 {title:'Hallo, ich bin Lotti.',text:'Ich begleite dich durch Portfolio Lab. Hier kannst du Geldanlagen kennenlernen und historische Verläufe ausprobieren, ohne echtes Geld einzusetzen. Das Tool hilft dir beim Lernen und Analysieren – es ist keine Anlageberatung.'},
 {title:'Bevor wir loslegen',text:'Die Kurven zeigen die Vergangenheit, nicht die Zukunft – beim Investieren kannst du Geld verlieren. Unsere Rechnungen vereinfachen die Wirklichkeit; Kosten und Steuern sind nicht vollständig berücksichtigt. Deine persönliche finanzielle Situation wird nicht umfassend geprüft. Nutze das Tool zum Lernen, nicht als alleinige Grundlage für eine Anlageentscheidung.'},
];
export const localBasicsDialogue = [
  {title:'Schön, dass du da bist.',mood:'welcome',sentences:[
    'Schön, dass du dich mit dem Investieren beschäftigen möchtest.',
    'Du musst dafür noch keine Fachbegriffe kennen.',
    'Ich gehe die wichtigsten Grundlagen Schritt für Schritt mit dir durch.',
    'Danach kannst du selbst ausprobieren, wie sich Geld in verschiedenen Anlagen entwickelt hätte.',
  ]},
  {title:'Was ist eine Aktie?',mood:'explain',sentences:[
    'Eine Aktie ist ein kleiner Anteil an einem Unternehmen.',
    'Wenn du eine Aktie kaufst, gehört dir damit ein kleiner Teil dieses Unternehmens.',
    'Wie sich das Unternehmen und die Erwartungen an seine Zukunft entwickeln, kann den Aktienkurs beeinflussen.',
    'Der Kurs kann steigen, aber auch fallen – ein Gewinn ist nicht sicher.',
  ]},
  {title:'Was ist eigentlich ein ETF?',mood:'explain',sentences:[
    'Ein ETF ist ein Fonds, der viele Anlagen zusammenfasst.',
    'Ein Aktien-ETF hält zum Beispiel Anteile an vielen Unternehmen.',
    'So kannst du mit einem Kauf an der Entwicklung vieler Unternehmen teilhaben.',
    'Der Wert deines ETFs kann dabei steigen und fallen.',
  ]},
  {title:'Und was ist ein Portfolio?',mood:'explain',sentences:[
    'Dein Portfolio ist die Gesamtheit deiner Geldanlagen.',
    'Es kann aus einem einzigen ETF bestehen oder mehrere Anlagen enthalten.',
    'Wie du dein Geld aufteilst, beeinflusst, welche Entwicklungen sich besonders stark auf dein Ergebnis auswirken.',
    'Später kannst du diese Aufteilung hier selbst ausprobieren, ohne echtes Geld einzusetzen.',
  ]},
  {title:'Warum das Geld verteilen?',mood:'think',sentences:[
    'Wenn dein ganzes Geld von einem Unternehmen abhängt, trifft dich dessen Misserfolg besonders stark.',
    'Eine Verteilung auf unterschiedliche Unternehmen, Branchen und Regionen kann diese Abhängigkeit verringern.',
    'Das heißt Streuung oder Diversifikation.',
    'Mehrere ETFs helfen dabei nicht automatisch, wenn sie dieselben Unternehmen enthalten.',
    'Auch breit gestreute Anlagen können gemeinsam an Wert verlieren.',
  ]},
  {title:'Was bedeutet Risiko für dich?',mood:'think',sentences:[
    'Beim Investieren ist nicht sicher, wie viel dein Geld später wert sein wird.',
    'Kurse können deutlich fallen und längere Zeit unter deinem Einstiegspreis bleiben.',
    'Brauchst du das Geld dann, müsstest du möglicherweise mit Verlust verkaufen.',
    'Betrachte Geld für baldige Ausgaben und eine verfügbare Reserve deshalb getrennt von langfristigem Anlagegeld.',
  ]},
  {title:'Alles noch einmal auf einen Blick',mood:'happy',sentences:[
    'Du hast die wichtigsten Grundlagen kennengelernt.',
    'Auf der nächsten Seite findest du die Begriffe noch einmal kurz zusammengefasst und kannst in Ruhe nachlesen.',
  ]},
];
export const localStockQuestion={
 id:'aktie-etf',topic:'Aktie und ETF',question:'Was unterscheidet eine einzelne Aktie von einem Aktien-ETF?',correct:0,
 options:[
  {text:'Eine Aktie steht für ein Unternehmen; ein Aktien-ETF bündelt Aktien mehrerer Unternehmen.',explanation:'Genau: Mit einer einzelnen Aktie beteiligst du dich an einem Unternehmen. Ein Aktien-ETF fasst Aktien mehrerer Unternehmen zusammen.'},
  {text:'Ein Aktien-ETF ist nur ein anderer Name für eine einzelne Aktie.',explanation:'Eine einzelne Aktie steht für ein Unternehmen. Ein Aktien-ETF ist dagegen ein Fonds, der verschiedene Aktien bündelt.'},
  {text:'Eine Aktie kann fallen, ein Aktien-ETF dagegen nicht.',explanation:'Beide können an Wert verlieren. Mehrere enthaltene Unternehmen verhindern Verluste nicht.'},
 ],takeaway:'Eine Aktie ist ein Anteil an einem Unternehmen; ein Aktien-ETF bündelt mehrere Aktien in einem Fonds.',
};
// Fragen und Antworten gemeinsam kopieren; die Lösung bleibt an den Inhalt gebunden.
export function localShuffledQuiz(questions,random=Math.random){
 const shuffled=items=>{
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  if(result.length>1&&result.every((item,i)=>item===items[i]))result.push(result.shift());
  return result;
 };
 return shuffled(questions).map(question=>{
  const answer=question.options[question.correct],options=shuffled(question.options);
  return {...question,options,correct:options.indexOf(answer)};
 });
}
export const localNutshellCards=[
 {title:'Was ist eine Aktie?',text:'Eine Aktie ist ein kleiner Anteil an einem Unternehmen. Ihr Kurs kann steigen oder fallen. Wenn du nur eine Aktie hältst, hängt dein Ergebnis stark von diesem Unternehmen ab.'},
 {title:'Was ist ein ETF?',text:'Ein ETF bündelt mehrere Anlagen in einem Fonds. Ein Aktien-ETF enthält Aktien vieler Unternehmen. Mit einem Kauf beteiligst du dich an ihrer gemeinsamen Entwicklung.'},
 {title:'Was ist ein Portfolio?',text:'Dein Portfolio umfasst alle deine Geldanlagen. Es kann aus einem ETF oder mehreren Anlagen bestehen. Ihre Anteile bestimmen, welche Entwicklungen dein Ergebnis besonders beeinflussen.'},
 {title:'Warum das Geld verteilen?',text:'Verschiedene Unternehmen, Branchen und Regionen verteilen die Abhängigkeit von einzelnen Entwicklungen. Das nennt man Diversifikation. Mehrere ETFs mit denselben Inhalten bringen nicht automatisch mehr Streuung.'},
 {title:'Was bedeutet Risiko?',text:'Der Wert deiner Anlage kann fallen, auch über längere Zeit. Brauchst du das Geld dann, könntest du mit Verlust verkaufen müssen.'},
 {title:'Welches Geld könntest du anlegen?',text:'Geld für Miete, Rechnungen und baldige Anschaffungen solltest du verfügbar halten. Plane auch einen Puffer für unerwartete Ausgaben ein. Hier übst du nur mit Beispielbeträgen.'},
 {title:'Was kann deinen Geldzuwachs verringern?',text:'Beim Kaufen und Verkaufen können Gebühren entstehen; auf Gewinne können Steuern anfallen. Wenn die Preise steigen, kannst du dir vom selben Betrag weniger kaufen. Ein höherer Kontostand bedeutet deshalb nicht automatisch mehr Kaufkraft.'},
];
export function localBasicsMove(index,direction){
  const last=localBasicsDialogue.length-1;
  const current=Number.isInteger(index)?Math.max(0,Math.min(last,index)):0;
  return direction==='back'?{index:Math.max(0,current-1),complete:false}
    :{index:Math.min(last,current+1),complete:current===last};
}
export function localLearningRoute(page,mode,finished=false) {
  const allowed=finished?[...localBeginnerPages,'lektionen']:localLearningSteps.map(s=>s.page);
  return mode==='beginner'&&!allowed.includes(page)?(finished?'kurz':'lernen'):page;
}
export function localLearningSelection(selected,available) {
  const allowed=localLearningPortfolios.filter(n=>available.includes(n));
  return selected.filter(n=>allowed.includes(n));
}

export const localTutorialSpecs={
 simulation:[
  {kind:'intro',title:'Was wäre aus deinem Geld geworden?',text:'Hier vergleichen wir, wie sich derselbe Betrag in verschiedenen Anlagen entwickelt hätte. Ich zeige dir zuerst die Auswahl und die wichtigsten Eingaben. Danach kannst du frei ausprobieren, was sich verändert.'},
  {kind:'choice',target:'[data-local-target="choice"]',title:'Vergleiche unterschiedliche Anlagen',text:'Du kannst mit dem ausgewählten Welt-ETF weitermachen oder S&P 500 und Gold ergänzen. Die beiden Aktien-ETFs enthalten Unternehmen; GLD bildet dagegen den Goldpreis ab. Achte später darauf, ob die Kurven ähnlich oder unterschiedlich verlaufen.'},
  {kind:'capital',target:'#capital',title:'Mit welchem Betrag möchtest du rechnen?',text:'Gib einen frei gewählten Beispielbetrag ein. Du investierst hier kein echtes Geld. Für alle ausgewählten Anlagen rechnen wir mit demselben Betrag.'},
  {kind:'start',target:'#start',title:'Was wäre bei einem anderen Start passiert?',text:'Verschiebe den Investitionsbeginn auf einen anderen Monat. Schau auf die Kurven: Ein anderer Einstieg kann Gewinne und Rückgänge deutlich verändern. Vergleiche deshalb nicht nur einen einzigen Startzeitpunkt.'},
  {kind:'payment',target:'#payment',title:'Was verändern regelmäßige Einzahlungen?',text:'Ändere den monatlich zusätzlich eingezahlten Betrag. Die Kurve zeigt dann auch dein zusätzlich eingezahltes Geld. Ein höherer Endwert bedeutet deshalb nicht automatisch eine bessere Rendite.'},
  {kind:'observe',target:'[data-local-target="chart"]',title:'Schau auch auf den Weg dazwischen',text:'Bewege die Maus über die Kurven, um die Monatswerte zu sehen. Ein hoher Endwert kann leicht verdecken, dass es zwischendurch deutlich bergab ging. Solche Rückgänge schauen wir uns jetzt genauer an.'},
  {kind:'risk-history',target:'[data-local-target="risk-history"]',title:'Auch gestreut sind Verluste möglich',text:'Schau auf die Rückgänge unter null. Auch ein ETF mit vielen Unternehmen kann deutlich verlieren. Im Infofenster siehst du den Rückgang auch als Eurobeispiel für deinen Startbetrag.'},
  {kind:'risk-causes',target:'[data-local-target="risk-history"]',title:'Warum können viele Anlagen zugleich fallen?',text:'Schlechtere Geschäftsaussichten, höhere Zinsen oder Krisen können viele Unternehmen gleichzeitig treffen. Streuung verringert die Abhängigkeit von einzelnen Unternehmen, verhindert solche gemeinsamen Rückgänge aber nicht.'},
 ],
 eigen:[
  {kind:'intro',title:'Deine eigene Mischung',text:'Jetzt bestimmst du selbst, welche Anlagen zusammengehören und wie du dein Geld verteilst. Wir gehen die Auswahl und die Anteile gemeinsam durch. Anschließend kannst du beobachten, wie sich deine Mischung historisch entwickelt hätte.'},
  {kind:'own-choice',target:'[data-local-target="own"]',title:'Was soll in dein Portfolio?',text:'Wähle zuerst einen ETF aus der Liste aus. Trage anschließend im Feld „Anteil in Prozent“ daneben ein, wie viel von deinem Geld in diesen ETF fließen soll. Für einen einzigen ETF trägst du 100 ein; mit „Anlage hinzufügen“ kannst du das Geld auf weitere ETFs verteilen.'},
  {kind:'weights',target:'[data-local-target="own"]',title:'Verteile den gesamten Betrag',text:'Die Prozentangaben teilen deinen gesamten Anlagebetrag auf: 50 % bedeutet die Hälfte deines Geldes. Trage zum Beispiel bei zwei ETFs jeweils 50 ein und prüfe darunter die Summe. Erst wenn sie 100 % ergibt, kann deine Mischung berechnet werden.'},
  {kind:'capital',target:'#capital',title:'Lege deinen Beispielbetrag fest',text:'Gib einen Beispielbetrag für deine Mischung ein. Die Prozentanteile teilen diesen Betrag auf die gewählten Anlagen auf. Der Vergleich verwendet denselben Betrag.'},
  {kind:'start',target:'#start',title:'Ändere den Einstieg',text:'Wähle einen anderen Startmonat. Hat deine Mischung in diesem Abschnitt anders abgeschnitten? Ein gutes Ergebnis in einem einzelnen Zeitraum ist noch keine Aussage über die Zukunft.'},
  {kind:'payment',target:'#payment',title:'Probiere monatliche Einzahlungen aus',text:'Ändere den zusätzlichen Monatsbetrag und schau auf den Verlauf. Denke daran: Ein Teil des Geldzuwachses stammt dann aus deinen Einzahlungen.'},
  {kind:'observe',target:'[data-local-target="chart"]',title:'Was fällt dir an deiner Mischung auf?',text:'Vergleiche den Verlauf deiner Mischung mit den einzelnen Anlagen. Achte darauf, ob Rückgänge ähnlich verlaufen oder sich teilweise ausgleichen. Danach kannst du deine Auswahl und Anteile frei verändern.'},
  {kind:'diversify',target:'[data-local-target="own"]',title:'Probiere mehr Streuung aus',text:'Kombiniere unterschiedliche Branchen oder Anlagearten. Zusammen müssen die Anteile wieder hundert Prozent ergeben. Du kannst auch mit deiner bisherigen Mischung weitergehen.'},
  {kind:'diversify-loss',target:'[data-local-target="risk-history"]',title:'Was verändert deine Mischung?',text:'Vergleiche deine Verlustkurve mit einer einzelnen Branche. Unterschiedliche Entwicklungen können Rückgänge abfedern. Fallen Anlagen gemeinsam, kann auch eine breite Mischung verlieren.'},
 ],
 sparen:[
  {kind:'intro',title:'ETF oder klassische Sparform?',text:'Jetzt stellen wir die ETF-Verläufe einem Tagesgeld-Beispiel gegenüber. Tagesgeld wird verzinst und schwankt nicht wie ein Aktien-ETF. Welche Kurve historisch höher endete, sagt allein noch nicht, welche Sparform für einen bestimmten Zweck passt.'},
  {kind:'choice',target:'[data-local-target="choice"]',title:'Was möchtest du gegenüberstellen?',text:'Vergleiche MSCI World, S&P 500 und Gold mit dem Tagesgeld-Beispiel. Die Auswahl ist dieselbe wie in der Vermögenssimulation. Nach der Einführung kannst du einzelne Anlagen wieder ausblenden.'},
  {kind:'capital',target:'#capital',title:'Vergleiche denselben Betrag',text:'Wähle einen Beispielbetrag für den Vergleich. Wir rechnen bei allen angezeigten Sparformen mit denselben Einzahlungen.'},
  {kind:'rate',target:'#rate',title:'Was verändert der Tagesgeldzins?',text:'Ändere den jährlichen Zins und beobachte den Verlauf. Der Zins bleibt in diesem vereinfachten Beispiel gleich. Es handelt sich nicht um ein damals verfügbares Bankangebot.'},
  {kind:'start',target:'#start',title:'Vergleiche einen anderen Zeitraum',text:'Verschiebe den Anlagebeginn. Schau darauf, wie sich der Abstand zwischen Tagesgeld und ETF verändert. Gerade bei kurzen Zeiträumen können Kursrückgänge stark ins Gewicht fallen.'},
  {kind:'payment',target:'#payment',title:'Und mit regelmäßigem Sparen?',text:'Ändere die monatliche Einzahlung. Alle angezeigten Sparformen erhalten denselben zusätzlichen Betrag. Vergleiche neben dem Endwert auch, wie ruhig oder unruhig die Wege dorthin waren.'},
  {kind:'observe',target:'[data-local-target="chart"]',title:'Unterschiedliche Wege zum Endwert',text:'Schau dir an, ob ein höherer Endwert auch mit stärkeren Rückgängen verbunden war. Ein ETF ist nicht grundsätzlich lohnender als Tagesgeld. Beide haben unterschiedliche Eigenschaften, die zu unterschiedlichen Zielen passen können.'},
  {kind:'savings-use',target:'[data-local-target="chart"]',title:'Wann brauchst du das Geld?',text:'Für baldige Ausgaben oder eine Reserve kann Tagesgeld sinnvoller sein: Es schwankt nicht mit Börsenkursen und ist kurzfristig verfügbar. Einen ETF müsstest du bei einem ungünstigen Zeitpunkt vielleicht mit Verlust verkaufen.'},
  {kind:'savings-safety',target:'[data-local-target="savings-purpose"]',title:'Was schützt dein Tagesgeld?',text:'Tagesgeld hat keine börsenbedingten Kursverluste. Die gesetzliche Einlagensicherung schützt in der EU in der Regel bis zu 100.000 € je Person und Bank. Sinkende Zinsen und steigende Preise können trotzdem deine Kaufkraft belasten.'},
  {kind:'savings-mix',target:'[data-local-target="savings-purpose"]',title:'Du musst dich nicht für eines entscheiden',text:'Du kannst Geld für baldige Ausgaben auf Tagesgeld halten und längerfristiges Geld getrennt in ETFs anlegen. Überlege beim Vergleichen deshalb zuerst, wann du welchen Teil deines Geldes brauchen könntest.'},
 ],
 inflation:[
  {kind:'intro',title:'Was bedeutet Inflation?',text:'Inflation bedeutet, dass die Preise im Durchschnitt steigen. Das heißt nicht, dass jedes einzelne Produkt teurer wird. Für denselben Geldbetrag kannst du dir dann insgesamt weniger kaufen – seine Kaufkraft sinkt. Zum Schluss schauen wir deshalb auf Geld, das ohne Zinsen liegen bleibt.'},
  {kind:'inflation-rate',target:'[data-local-inflation-explanation]',title:'Was sagt die Inflationsrate?',text:'Die Inflationsrate zeigt, wie stark sich die Preise verändern, meist gegenüber dem Vorjahresmonat. Sinkt die Rate, bleibt aber positiv, steigen die Preise weiter – nur langsamer. Bei einer negativen Rate sind die Preise im Durchschnitt niedriger als im Vergleichszeitraum.'},
  {kind:'history',title:'Wie haben sich die Preise entwickelt?',text:'Wir schauen auf die gespeicherten deutschen Inflationsdaten. Sie zeigen, wie sich das allgemeine Preisniveau im ausgewählten Zeitraum verändert hat.'},
  {kind:'capital',target:'#capital',title:'Welchen Betrag möchtest du betrachten?',text:'Gib einen Beispielbetrag ein. Wir vergleichen den Kontostand ohne Zinsen mit seiner Kaufkraft. Es wird dabei kein Geld vom Konto abgebucht.'},
  {kind:'start',target:'#start',title:'Wie verändert die Zeit die Kaufkraft?',text:'Verschiebe den Startmonat. Die Kaufkraftkurve verwendet die gespeicherten deutschen Inflationsdaten für diesen Zeitraum. Sie zeigt keine Vorhersage zukünftiger Preise.'},
  {kind:'observe',target:'[data-local-target="chart"]',title:'Gleicher Kontostand, weniger Kaufkraft',text:'Vergleiche die beiden Kurven. Die eine zeigt den Geldbetrag, die andere, was du dir dafür bei den Ausgangspreisen kaufen konntest. Danach kannst du in einem kurzen Quiz prüfen, was du mitgenommen hast.'},
 ],
};
export function localTutorialReady(kind,snapshot,touched=[]){
 if(['intro','history','inflation-rate','observe','risk-history','risk-causes','diversify-loss','savings-use','savings-safety','savings-mix'].includes(kind))return true;
 if(kind==='diversify')return snapshot.ownValid===true;
 if(kind==='choice')return snapshot.required.some(n=>snapshot.selected.includes(n));
 if(kind==='own-choice')return snapshot.own.length>0&&snapshot.own.every(r=>!!r.name);
 if(kind==='weights')return snapshot.ownValid===true;
 if(kind==='start')return snapshot.dateCount>0;
 if(kind==='capital')return Number.isFinite(snapshot.capital)&&snapshot.capital>0;
 if(kind==='payment')return Number.isFinite(snapshot.payment)&&snapshot.payment>=0;
 if(kind==='rate')return Number.isFinite(snapshot.rate)&&snapshot.rate>=0&&snapshot.rate<=50;
 return false;
}
export function localInflationNarrative(facts,labelDate=date=>date){
 if(!facts)return 'Für diesen Zeitraum fehlen passende Inflationsdaten. Wähle anschließend einen anderen Startmonat, um die Kaufkraft zu vergleichen.';
 const period=`Zwischen ${labelDate(facts.base)} und ${labelDate(facts.last)}`;
 const text=facts.total>0?[`${period} ist das Leben im Durchschnitt teurer geworden.`,'Mit demselben Geld konntest du am Ende also weniger kaufen.']
  :facts.total<0?[`${period} sind die Preise im Durchschnitt gesunken.`,'Mit demselben Geld konntest du am Ende also mehr kaufen.']
  :[`${period} waren die Preise am Anfang und am Ende im Durchschnitt gleich hoch.`,'Die Kaufkraft deines Geldes war am Ende deshalb unverändert.'];
 if(facts.latest?.rate>0&&facts.peak?.rate>facts.latest.rate){
  text.push('Zuletzt stiegen die Preise langsamer als in der stärksten Teuerungsphase deines Zeitraums.','Das heißt nicht, dass alles wieder günstiger wurde – die Preise stiegen nur nicht mehr so schnell.');
 }else if(facts.latest?.rate>0)text.push('Auch zuletzt lagen die Preise höher als ein Jahr zuvor.','Dein Kontostand wird dadurch nicht kleiner, aber du kannst dir weniger dafür kaufen.');
 else if(facts.latest?.rate<0)text.push('Zuletzt lagen die Preise allerdings niedriger als ein Jahr zuvor.','Das bedeutet nicht automatisch, dass alle früheren Preissteigerungen wieder ausgeglichen waren.');
 else text.push('Nicht jedes Produkt entwickelte sich gleich: Manche Dinge konnten teurer, andere günstiger werden.');
 return text.join(' ');
}
export function localInflationFacts(dates,cpi,start=0){
 const first=dates[start];if(!first)return null;
 const date=new Date(first+'T00:00:00Z');
 const base=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),0)).toISOString().slice(0,10);
 const available=dates.slice(start).filter(d=>Number.isFinite(cpi[d])&&cpi[d]>0),last=available.at(-1);
 if(!last||!Number.isFinite(cpi[base])||cpi[base]<=0)return null;
 const annual=available.flatMap(d=>{
  const t=new Date(d+'T00:00:00Z'),previous=new Date(Date.UTC(t.getUTCFullYear()-1,t.getUTCMonth()+1,0)).toISOString().slice(0,10);
  return Number.isFinite(cpi[previous])&&cpi[previous]>0?[{date:d,rate:cpi[d]/cpi[previous]-1}]:[];
 });
 return {base,last,total:cpi[last]/cpi[base]-1,loss:1-cpi[base]/cpi[last],peak:annual.reduce((a,b)=>!a||b.rate>a.rate?b:a,null),latest:annual.find(a=>a.date===last)||null};
}

// Anwendungsquiz nach der Vermögenssimulation, unabhängig vom Begriffsquiz.
export const localSimulationQuiz=[
 {id:'zeitraum',topic:'Zeiträume vergleichen',question:'Du verschiebst den Investitionsbeginn. Nun erzielt ein anderes Portfolio im ausgewählten Zeitraum die höchste Rendite. Was bedeutet das?',correct:0,options:[
  {text:'Welches Portfolio die höchste Rendite erzielt, hängt auch vom betrachteten Zeitraum ab.'},
  {text:'Das Tool hat beim ersten Vergleich falsch gerechnet.'},
  {text:'Das nun führende Portfolio wird auch künftig die höchste Rendite erzielen.'}],feedback:'Mit einem anderen Startzeitpunkt betrachtest du andere Marktphasen. Deshalb kann sich auch die Rangfolge nach Rendite ändern.'},
 {id:'verlust-tragen',topic:'Gewinn und Verluste einordnen',question:'Ein Portfolio erzielte im Vergleich den höchsten Gewinn, zeigte zwischenzeitlich aber auch starke Rückgänge. Was solltest du vor einer Anlageentscheidung zusätzlich bedenken?',correct:0,options:[
  {text:'Ob du solche Rückgänge finanziell verkraften könntest und wann du das Geld wieder brauchst.'},
  {text:'Nichts weiter, denn der höchste historische Gewinn macht es zur besten Wahl.'},
  {text:'Ob du Verluste verhindern könntest, indem du mehr Geld investierst.'}],feedback:'Ein hoher Gewinn am Ende macht zwischenzeitliche Verluste nicht unwichtig. Wenn du dein Geld während eines Rückgangs brauchst, könntest du mit Verlust verkaufen müssen.'},
 {id:'verlustkurve',topic:'Verlustkurven verstehen',question:'Ein ETF steigt über mehrere Jahre deutlich im Wert. Seine Verlustkurve zeigt zwischendurch trotzdem starke Rückgänge. Was zeigt dir das?',correct:0,options:[
  {text:'Auch eine insgesamt erfolgreiche Anlage kann zwischenzeitlich deutlich an Wert verlieren.'},
  {text:'Die beiden Diagramme widersprechen sich.'},
  {text:'Bei einer insgesamt steigenden Anlage sind zwischenzeitliche Verluste ausgeschlossen.'}],feedback:'Eine langfristig steigende Kurve kann starke Rückgänge enthalten. Die Verlustkurve macht sichtbar, wie groß diese Rückschläge unterwegs waren.'}
].map(q=>({...q,options:q.options.map(o=>({...o,explanation:q.feedback}))}));
export function localQuizProgress(questions){return {index:0,choices:questions.map(()=>null),checked:questions.map(()=>false),complete:false};}

export const localOwnPortfolioQuiz=[
 {id:'zusatz-streuung',topic:'ETF-Inhalte vergleichen',question:'Du ergänzt dein Portfolio um einen zweiten ETF. Wann verbessert sich die Streuung besonders?',correct:1,options:[
  {text:'Wenn der zweite ETF von einem anderen Anbieter stammt.'},
  {text:'Wenn er zusätzliche Unternehmen, Branchen oder Regionen abdeckt.'},
  {text:'Wenn sein Name anders lautet als der des ersten ETFs.'}],feedback:'Entscheidend ist, was in den ETFs steckt. Enthalten beide überwiegend dieselben Unternehmen, hängt dein Geld weiterhin stark von deren Entwicklung ab.'},
 {id:'ausgleich',topic:'Unterschiedliche Kursverläufe',question:'Zwei Anlagen entwickeln sich unterschiedlich. Was kann ihre Kombination bewirken?',correct:0,options:[
  {text:'Unterschiedliche Kursverläufe können die Schwankungen des Portfolios abmildern.'},
  {text:'Das Portfolio kann keine Verluste mehr erleiden.'},
  {text:'Das Portfolio erzielt automatisch eine höhere Rendite als beide Anlagen einzeln.'}],feedback:'Eine Anlage kann Rückgänge der anderen teilweise ausgleichen. Verluste bleiben trotzdem möglich.'},
 {id:'rueckblick-auswahl',topic:'Vergangenheit und Zukunft',question:'Du testest verschiedene ETF-Gewichtungen. Was zeigt dir das Portfolio mit der höchsten historischen Rendite?',correct:1,options:[
  {text:'Welche Gewichtung künftig die höchste Rendite erzielen wird.'},
  {text:'Welche der getesteten Gewichtungen im betrachteten Zeitraum die höchste Rendite erzielte.'},
  {text:'Welche Gewichtung unabhängig vom Zeitraum überlegen ist.'}],feedback:'Das Portfolio wurde anhand bekannter Kursverläufe ausgewählt. In Zukunft können andere Gewichtungen besser abschneiden.'}
].map(q=>({...q,options:q.options.map(o=>({...o,explanation:q.feedback}))}));

export const localSavingsQuiz=[
 {id:'sparformen-endwert',topic:'Ergebnisse einordnen',question:'Im Vergleich erreicht ein Aktien-ETF einen höheren Endwert als Tagesgeld. Ist er deshalb grundsätzlich die bessere Wahl?',correct:1,options:[
  {text:'Ja, allein der höhere Endwert entscheidet.'},
  {text:'Nein, auch mögliche Verluste und die benötigte Verfügbarkeit des Geldes sind wichtig.'},
  {text:'Ja, sofern der Vergleich mehrere Jahre umfasst.'}],feedback:'Der höhere Endwert zeigt den historischen Geldzuwachs. Er sagt allein nicht, welche Sparform zu deinem Geldbedarf passt.'},
 {id:'sparformen-kombinieren',topic:'Geld für verschiedene Ziele',question:'Du möchtest Geld für unerwartete Ausgaben zurücklegen und gleichzeitig langfristig Vermögen aufbauen. Was ist grundsätzlich möglich?',correct:2,options:[
  {text:'Du musst dich für dein gesamtes Geld zwischen Tagesgeld und ETFs entscheiden.'},
  {text:'Eine Aufteilung verhindert sämtliche Verluste.'},
  {text:'Du kannst einen verfügbaren Geldpuffer halten und einen anderen Teil langfristig in Aktien-ETFs investieren.'}],feedback:'Verschiedene Teile deines Geldes können unterschiedliche Aufgaben erfüllen. Der langfristig investierte Teil bleibt dabei mit Risiken verbunden.'},
 {id:'sparformen-etf-chance',topic:'Chancen von Aktien-ETFs',question:'Welchen Vorteil kann ein breit gestreuter Aktien-ETF gegenüber Tagesgeld bieten?',correct:0,options:[
  {text:'Du beteiligst dich an vielen Unternehmen und kannst von deren Gewinnen und steigenden Aktienkursen profitieren.'},
  {text:'Du erhältst einen fest vereinbarten Zinssatz.'},
  {text:'Dein angelegtes Geld kann nicht an Wert verlieren.'}],feedback:'Bei Tagesgeld erhältst du Zinsen. Mit einem Aktien-ETF beteiligst du dich an Unternehmen und ihren wirtschaftlichen Chancen – trägst aber auch mögliche Kursverluste mit.'}
].map(q=>({...q,options:q.options.map(o=>({...o,explanation:q.feedback}))}));

export const localInflationQuiz=[
 {id:'inflationsrate',topic:'Inflationsrate einordnen',question:'Die Inflationsrate sinkt, bleibt aber positiv. Was bedeutet das?',correct:1,options:[
  {text:'Die Preise sinken wieder.'},
  {text:'Die Preise steigen weiter, aber langsamer.'},
  {text:'Die Preise bleiben unverändert.'}],feedback:'Eine niedrigere positive Inflationsrate bedeutet, dass die Preise langsamer steigen – nicht, dass sie wieder sinken.'},
 {id:'kaufkraft-zeitvergleich',topic:'Kaufkraft vergleichen',question:'Wie unterschied sich die Kaufkraft von 100 Euro aufgrund der Inflation zwischen 2021 und 2026?',correct:0,options:[
  {text:'Die Kaufkraft war 2021 höher als 2026.'},
  {text:'Die Kaufkraft war 2026 höher als 2021.'},
  {text:'Die Kaufkraft war in beiden Jahren gleich hoch.'}],feedback:'Die Preise stiegen in diesem Zeitraum insgesamt. Deshalb konntest du dir 2021 mit 100 Euro mehr kaufen als 2026.'},
 {id:'kaufkraft-erhalten',topic:'Kaufkraftverlust entgegenwirken',question:'Welche Aussage trifft zu?',correct:1,options:[
  {text:'Ein Aktien-ETF ist die einzige Möglichkeit, einem Kaufkraftverlust entgegenzuwirken.'},
  {text:'Sowohl ein Aktien-ETF als auch ein Tagesgeldkonto können einem Kaufkraftverlust entgegenwirken.'},
  {text:'Man kann dem Kaufkraftverlust durch Inflation nicht entgegenwirken.'}],feedback:'Zinsen auf Tagesgeld und mögliche Gewinne eines Aktien-ETFs können den Kaufkraftverlust abmildern. Ob sie ihn vollständig ausgleichen, hängt davon ab, wie hoch sie im Verhältnis zur Inflation ausfallen.'}
].map(q=>({...q,options:q.options.map(o=>({...o,explanation:q.feedback}))}));
