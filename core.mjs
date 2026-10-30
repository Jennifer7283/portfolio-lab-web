// Rechenfunktionen ohne DOM, Netzwerk oder versteckte globalen Einstellungen.
export const sum = a => a.reduce((x,y)=>x+y,0);
export const mean = a => a.length ? sum(a)/a.length : null;
export const stdev = a => a.length>1 ? Math.sqrt(sum(a.map(x=>(x-mean(a))**2))/(a.length-1)) : null;
export const endOfPreviousMonth = d => {const x=new Date(d+'T00:00:00Z');x.setUTCDate(0);return x.toISOString().slice(0,10);};
export const finite = x=>typeof x==='number' && Number.isFinite(x);
export const pretty = n=>n.replaceAll('_',' ').replace('Nasdaq 100','Nasdaq-100').replace('SP 500','S&P 500');

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
  const events=custom?custom.trades:data.trades.filter(t=>t.portfolio===name&&t.neuberechnung>=dates[0]);
  const initial=custom?custom.initial:attr.filter(a=>a.datum===dates[0]).map(a=>a.startgewicht);
  if(!initial.length)throw Error('Die Anfangsgewichte fehlen; Kosten können nicht zuverlässig berechnet werden.');
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
