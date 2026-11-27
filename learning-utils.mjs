const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function relevantContentMutation(records){
 return records.some(record=>{
  const element=record.target.nodeType===1?record.target:record.target.parentElement;
  return !element?.closest('.tooltip');
 });
}

export function beginnerReportPrompt(prompt,kind){
 if(kind==='radar')return prompt;
 if(kind==='ergebnisse')return prompt.replace(/^AUFGABE\n[\s\S]*?(?=\n\nSPRACHE UND GRENZEN)/,'AUFGABE\nGemeinsamer Vergleich aller ausgewählten Portfolios.')+'\n\nVERBINDLICHE ERGEBNISZUSAMMENFASSUNG: Ein gemeinsamer zusammenhängender Vergleichstext für ALLE ausgewählten Portfolios, mit kurzen Absätzen nur zur sinnvollen Gliederung, höchstens zehn Sätze insgesamt. Vergleiche ihre tatsächlichen Ergebnisse miteinander: Wertentwicklung, wesentliche Unterschiede und gegebenenfalls Schwankungen oder Verlustphasen. Kurze rechnerische Erklärung nur soweit belegt. Keine ETF-Definitionen, Länderabdeckung oder Aufbau-Erklärungen, keine getrennten Einzelberichte und keine Unterüberschriften. Absolute Anfänger: Alltagssprache, Fachbegriffe sofort erklären. Keine angehängte Floskel über Zukunftsversprechen; eine nötige Grenze als eigenständigen vollständigen Satz formulieren.';
 const scope='VERBINDLICHER UMFANG: Genau ein zusammenhängender Bericht je Portfolio, insgesamt höchstens fünf kurze Sätze unabhängig von der ETF-Anzahl. Keine Unterberichte je ETF. Für absolute Anfänger: Fachbegriffe vermeiden oder sofort erklären; einen klaren Zusammenhang statt einer Aufzählung vermitteln. Jede Berichtsart behandelt nur ihren Schwerpunkt, ohne andere Berichte zu wiederholen.';
 const common='Schreibe für einen absoluten Anfänger ohne Finanzvorwissen. Kurze, vollständige Sätze in Alltagssprache; erkläre unvermeidbare Fachbegriffe sofort. Konzentriere dich auf die Kernaussagen, ohne Formeln oder Kennzahlen aufzuzählen. Pro ETF höchstens fünf Sätze insgesamt, nicht fünf Sätze je Unterabschnitt. Ergebnisse und Portfolioerklärungen: zusätzlich höchstens fünf Sätze je Portfolio insgesamt. Diese Kürze ersetzt ausführlichere Längen- und Gliederungsvorgaben. Keine Kaufempfehlung; vergangene Ergebnisse sind kein Zukunftsversprechen.';
 const tasks={ergebnisse:'Fasse je Portfolio das Ziel, die wichtigsten berechneten Einflüsse auf den Verlauf und eine wesentliche Grenze kurz zusammen. Lass unbelegte Abschnitte weg.',portfolio:'Besteht das Portfolio nur aus einem ETF, erkläre in einem kurzen zusammenhängenden Absatz dessen Aufbau, enthaltene Märkte, Gewichtungsmethode, Schwerpunkte und ein wesentliches Risiko anhand der belegten Beschreibungen. Bei mehreren ETFs erkläre die Mischung und ihre rechnerischen Zusammenhänge. Beim eigenen Portfolio erkläre einen aussagekräftigen Vergleich, ohne die selbst gewählte Zusammensetzung zu begründen. Behaupte keine eindeutige Ursache, wenn sie aus den Daten nicht folgt.',nachrichten:'Schreibe je tatsächlich enthaltener Anlage eine Überschrift und einen kurzen Absatz: worauf die Anlage allgemein reagieren kann und welchen belegten zeitlichen Hintergrund es gab. Erfinde keine Nachrichten oder Ursachen. Allgemeines Wissen ist kein Beleg für einen Kursverlauf.'};
 if(!tasks[kind])return `ANFÄNGERBERICHT\n${common}\n\n${prompt}\n\n${scope}`;
 return prompt.replace(/^AUFGABE\n[\s\S]*?(?=\n\nSPRACHE UND GRENZEN)/,`AUFGABE\n${common} ${tasks[kind]}`)+'\n\n'+scope;
}

export function renderReport(text){
 return String(text).replace(/\\(?=#{1,6}\s)/g,'').replace(/\\[ \t]*(?=\r?$)/gm,'').replace(/^(#{1,6}[^\n]+)\n(?!\n)/gm,'$1\n\n').split(/\n\s*\n/).filter(Boolean).map(block=>{
  const heading=block.match(/^(#{1,4})\s+([^\n]+)$/);
  const inline=part=>{
   const bold=value=>esc(value).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
   let html='',last=0;
   for(const match of part.matchAll(/\[(?:\[([^\]\n]+)\]|([^\]\n]+))\]\((https:\/\/[^\s<>"\)]+)\)/g)){
    let url;try{url=new URL(match[3]);}catch{continue;}
    if(url.protocol!=='https:'||url.username||url.password)continue;
    html+=bold(part.slice(last,match.index))+`<a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">${bold(match[1]?'['+match[1]+']':match[2])}</a>`;last=match.index+match[0].length;
   }
   return html+bold(part.slice(last));
  };
  if(heading)return `<h3>${inline(heading[2])}</h3>`;
  return `<p>${inline(block).replaceAll('\n','<br>')}</p>`;
 }).join('');
}
