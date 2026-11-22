import {onlineAIState,askLotti} from './online-ai.mjs?v=20261122-sync';
// Nur lokale Browser-Version. Keine Gesprächs- oder Profildaten dauerhaft speichern.
import {renderReport,relevantContentMutation} from './learning-utils.mjs?v=20261122-sync';
const $=id=>document.getElementById(id);
let config,context,history=[],controller=null,busy=false,revision=0,refreshRevision=0;

export function historyForRequest(messages){
 const result=messages.filter(x=>x.role==='user'||x.role==='assistant').slice(-8).map(({role,content})=>({role,content}));
 while(result.reduce((n,x)=>n+x.content.length,0)>20000)result.shift();
 if(result[0]?.role==='assistant')result.shift();
 return result;
}
async function snapshot(includeProfile){
 return new Promise((resolve,reject)=>window.dispatchEvent(new CustomEvent('portfolio-local-chat-context',{detail:{includeProfile,resolve,reject}})));
}
function status(text){$('igel-chat-status').textContent=text;}
function controls(){
 if($('igel-chat-connect'))$('igel-chat-connect').hidden=onlineAIState().connected;
 $('igel-chat-send').disabled=busy||!config||!onlineAIState().connected;
 $('igel-chat-stop').hidden=!busy;$('igel-chat-question').disabled=busy;
}
function message(role,text,meta=''){
 const article=document.createElement('article');article.className='igel-chat-message '+role;
 const label=document.createElement('strong');label.className='sr-only';label.textContent=role==='user'?'Deine Frage':'Antwort des Lernbegleiters';
 const body=document.createElement('div');body.className='igel-chat-prose';body.innerHTML=renderReport(text);
 article.append(label,body);
 if(meta){const note=document.createElement('p');note.className='igel-chat-meta';note.textContent=meta;article.append(note);}
 $('igel-chat-messages').append(article);article.scrollIntoView({block:'nearest'});
}
function clearConversation(note='Neues Gespräch. Frühere Nachrichten werden nicht erneut übertragen.'){
 revision++;controller?.abort();controller=null;busy=false;history=[];
 $('igel-chat-messages').replaceChildren();
 message('assistant','Hallo! Schön, dass du da bist. Ist ein Begriff noch unklar oder möchtest du einen Zusammenhang genauer verstehen? Frag mich einfach – wir können uns auch gemeinsam die Ergebnisse auf deiner Seite anschauen. Du musst deine Frage nicht in Fachsprache formulieren.');
 status(note);controls();
}
async function refresh(){
 const run=++refreshRevision;
 try{
  const next=await snapshot($('igel-chat-profile').checked);if(run!==refreshRevision)return;context=next;
  $('igel-chat-area').textContent=next.area;
  const list=$('igel-chat-context-summary');list.replaceChildren();
  const items=[['Bereich',next.area],['Erklärstil',next.depth],['Datenstand',next.asOf],
   ['Zeitraum',next.period?next.period.from+' bis '+next.period.to:null],
   ['Portfolios',next.portfolios?.map(p=>p.Portfolio).join(', ')],
   ['Profil',next.profile?'Freigegebene Zusammenfassung (siehe unten)':'Wird nicht übertragen']];
  for(const [name,value]of items){if(!value)continue;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=name;dd.textContent=value;list.append(dt,dd);}
  $('igel-chat-context-data').textContent=JSON.stringify(next,null,2);
  const profile=$('igel-chat-profile-preview');profile.replaceChildren();
  if(next.profile){
   for(const item of next.profile.Angaben){const p=document.createElement('p');p.textContent=item.Frage+' '+item.Antwort;profile.append(p);}
   const p=document.createElement('p');p.textContent='Risikobereitschaft: '+next.profile.Risikobereitschaft;profile.append(p);
  }
 }catch(error){context=null;status(error.message);}
}
async function send(){
 if(busy)return;
 const question=$('igel-chat-question').value.trim();if(!question)return;
 if(question.length>2000){status('Bitte die Frage auf höchstens 2.000 Zeichen kürzen.');return;}
 const run=++revision;busy=true;controls();
 await refresh();if(run!==revision)return;if(!context){busy=false;controls();return;}
 const includeProfile=$('igel-chat-profile').checked;
 const sentContext=context,signature=JSON.stringify(sentContext);
 const prior=historyForRequest(history);busy=true;controller=new AbortController();const attempt=controller;controls();
 message('user',question);$('igel-chat-question').value='';
 status('Die Frage wird thematisch geprüft und die Antwort mit deinem aktuellen Seitenkontext erstellt …');
 try{
  const data=await askLotti({question,context:sentContext,includeProfile,history:prior},AbortSignal.any([attempt.signal,AbortSignal.timeout(390000)]));
  if(typeof data.text!=='string'||!data.text.trim())throw Error('Die KI hat keine lesbare Antwort geliefert.');
  await refresh();if(run!==revision)return;
  const changed=signature!==JSON.stringify(context);
  message('assistant',data.text,'Bezug: '+sentContext.area+(sentContext.period?' · '+sentContext.period.from+' bis '+sentContext.period.to:'')+(changed?' · Angaben wurden inzwischen geändert.':''));
  if(!data.refused)history=[...prior,{role:'user',content:question},{role:'assistant',content:data.text}];
  status(changed?'Die Antwort bezieht sich auf den Stand beim Absenden. Die nächste Frage nutzt die inzwischen geänderten Angaben.':'');
 }catch(error){
  if(run===revision){status(error.name==='AbortError'?'Anfrage abgebrochen. Eine bereits gesendete Verarbeitung kann auf GPUStack weiterlaufen.':error.name==='TimeoutError'?'Die KI hat nicht rechtzeitig geantwortet. Es erfolgt keine automatische Wiederholung.':error.message);$('igel-chat-question').value=question;}
 }finally{if(run===revision){busy=false;controller=null;controls();}}
}
async function start(){
 if(document.documentElement.hasAttribute('data-local-ai'))return;
 const app=document.querySelector('script[src*="app.mjs"]');if(!app)return;await import(app.src);
 config={mode:'online'};
 const root=document.createElement('div');root.id='igel-chat-root';
 root.innerHTML=`<button id="igel-chat-launch" aria-expanded="false" aria-controls="igel-chat-panel"><img src="./hedgehog-explain.png" alt="" width="64" height="64"><span>Frag Lotti</span></button>
 <section id="igel-chat-panel" role="dialog" aria-label="Lernchat mit Lotti" hidden>
  <header class="igel-chat-header"><img id="igel-chat-avatar" src="./hedgehog-explain.png" alt="" width="72" height="72"><div><h2>Lotti</h2><p id="igel-chat-area" hidden></p></div><button id="igel-chat-close" aria-label="Chat schließen">×</button></header>
  <div id="igel-chat-messages" role="region" aria-label="Chatverlauf" tabindex="0"></div>
  <details class="igel-chat-settings"><summary>Datenschutz und Chat-Einstellungen</summary><p class="igel-chat-small">KI-Chat über die Hochschulinstanz. Kann Fehler machen und hat keinen Webzugriff. Bitte keine Namen, Kontodaten oder Schlüssel in deine Frage schreiben.</p>
   <details id="igel-chat-context"><summary>Was wird bei meiner nächsten Frage übertragen?</summary><div class="igel-chat-context-body"><p>Deine Frage, die letzten Gesprächsbeiträge und der aktuelle Toolkontext werden an GPUStack gesendet. Keine vollständigen Kursreihen und keine einzelnen Antworten aus dem Risikofragebogen.</p><dl id="igel-chat-context-summary"></dl><div id="igel-chat-profile-preview"></div><details><summary>Kontextdaten im Detail</summary><pre id="igel-chat-context-data"></pre></details></div></details>
   <label class="igel-chat-profile-choice"><input type="checkbox" id="igel-chat-profile"><span>Meine Profilzusammenfassung für diesen Chat freigeben</span></label>
   <p class="igel-chat-small">Enthält auch finanzielle Rahmenbedingungen. Die Vorschau oben zeigt die Angaben. Ein Wechsel beginnt ein neues Gespräch.</p>
  </details>
  <form id="igel-chat-form"><label for="igel-chat-question" class="sr-only">Deine Frage zu Finanzen oder zum Tool</label><textarea id="igel-chat-question" rows="2" maxlength="2000" placeholder="Was möchtest du verstehen?"></textarea><p id="igel-chat-status" role="status" aria-live="polite"></p><div class="igel-chat-actions"><button type="button" id="igel-chat-clear" class="secondary">Gespräch löschen</button><button type="button" id="igel-chat-stop" class="secondary" hidden>Abbrechen</button><button type="button" id="igel-chat-connect" class="secondary">Eigene KI verbinden</button><button id="igel-chat-send" class="primary" type="submit">Senden</button></div></form>
 </section>`;
 document.body.append(root);
 const open=async()=>{$('igel-chat-panel').hidden=false;$('igel-chat-launch').hidden=true;$('igel-chat-launch').setAttribute('aria-expanded','true');await refresh();$('igel-chat-question').focus();};
 const close=()=>{$('igel-chat-panel').hidden=true;$('igel-chat-launch').hidden=false;$('igel-chat-launch').setAttribute('aria-expanded','false');$('igel-chat-launch').focus();};
 $('igel-chat-launch').addEventListener('click',open);$('igel-chat-close').addEventListener('click',close);
 $('igel-chat-panel').addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();}});
 $('igel-chat-form').addEventListener('submit',event=>{event.preventDefault();send();});
 $('igel-chat-question').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();send();}});
 $('igel-chat-clear').addEventListener('click',()=>{$('igel-chat-profile').checked=false;clearConversation();$('igel-chat-question').value='';refresh();});
 $('igel-chat-stop').addEventListener('click',()=>controller?.abort());
 $('igel-chat-profile').addEventListener('change',()=>{clearConversation('Die Profilfreigabe wurde geändert. Das Gespräch wurde zurückgesetzt. Bereits übertragene Daten lassen sich dadurch nicht beim Anbieter zurückrufen.');refresh();$('igel-chat-context').open=true;});
 let queued=false;const scheduleRefresh=()=>{if(queued||$('igel-chat-panel').hidden)return;queued=true;queueMicrotask(()=>{queued=false;refresh();});};
 new MutationObserver(records=>{if(relevantContentMutation(records))scheduleRefresh();}).observe($('content'),{childList:true,subtree:true});
 $('content').addEventListener('input',scheduleRefresh);$('content').addEventListener('change',scheduleRefresh);
 window.addEventListener('hashchange',()=>{if(!$('igel-chat-panel').hidden)refresh();});
 window.addEventListener('pagehide',()=>{revision++;controller?.abort();history=[];context=null;});
 $('igel-chat-connect').addEventListener('click',()=>$('online-api-open').click());
 window.addEventListener('portfolio-online-ai-change',()=>{$('igel-chat-profile').checked=false;clearConversation('');if(!onlineAIState().connected)status('Für Antworten von Lotti kannst du deine eigene KI verbinden.');if(!$('igel-chat-panel').hidden)refresh();});
 clearConversation('');
 if(!onlineAIState().connected)status('Für Antworten von Lotti kannst du deine eigene KI über die Verbindungseinstellungen einrichten.');
}
if(typeof document!=='undefined')start();
