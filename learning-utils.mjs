const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function relevantContentMutation(records){
 return records.some(record=>{
  const element=record.target.nodeType===1?record.target:record.target.parentElement;
  return !element?.closest('.tooltip');
 });
}

export function beginnerReportPrompt(prompt,kind){
 const common='Schreibe für einen absoluten Anfänger ohne Finanzvorwissen. Kurze, vollständige Sätze in Alltagssprache; erkläre unvermeidbare Fachbegriffe sofort. Konzentriere dich auf die Kernaussagen, ohne Formeln oder Kennzahlen aufzuzählen. Pro ETF höchstens fünf Sätze insgesamt, nicht fünf Sätze je Unterabschnitt. Ergebnisse und Portfolioerklärungen: zusätzlich höchstens fünf Sätze je Portfolio insgesamt. Diese Kürze ersetzt ausführlichere Längen- und Gliederungsvorgaben. Keine Kaufempfehlung; vergangene Ergebnisse sind kein Zukunftsversprechen.';
 const tasks={ergebnisse:'Fasse je Portfolio das Ziel, die wichtigsten berechneten Einflüsse auf den Verlauf und eine wesentliche Grenze kurz zusammen. Lass unbelegte Abschnitte weg.',portfolio:'Erkläre je Portfolio in einem kurzen Absatz, welche tatsächlichen Anlagen seine Wertentwicklung und Schwankungen besonders prägten. Beim eigenen Portfolio erkläre einen aussagekräftigen Vergleich, ohne die selbst gewählte Zusammensetzung zu begründen. Behaupte keine eindeutige Ursache, wenn sie aus den Daten nicht folgt.',nachrichten:'Schreibe je tatsächlich enthaltener Anlage eine Überschrift und einen kurzen Absatz: worauf die Anlage allgemein reagieren kann und welchen belegten zeitlichen Hintergrund es gab. Erfinde keine Nachrichten oder Ursachen. Allgemeines Wissen ist kein Beleg für einen Kursverlauf.'};
 if(!tasks[kind])return `ANFÄNGERBERICHT\n${common}\n\n${prompt}`;
 return prompt.replace(/^AUFGABE\n[\s\S]*?(?=\n\nSPRACHE UND GRENZEN)/,`AUFGABE\n${common} ${tasks[kind]}`);
}

export function renderReport(text){
 return String(text).split(/\n\s*\n/).filter(Boolean).map(block=>{
  const heading=block.match(/^(#{1,4})\s+([^\n]+)$/);
  const inline=part=>esc(part).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  if(heading)return `<h3>${inline(heading[2])}</h3>`;
  return `<p>${inline(block).replaceAll('\n','<br>')}</p>`;
 }).join('');
}
