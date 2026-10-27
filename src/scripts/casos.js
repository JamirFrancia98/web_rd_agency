import RD from './rd.js';
import { T } from '../i18n/casos.js';
import { route } from '../i18n/routes.js';

(function(){
"use strict";
const {$, $$, clamp, pr, reduced, tr} = RD;
RD.addText(T);

/* ======= CASOS (ejemplos: cámbialos por los reales) ======= */
const CATS = [['all',['Todos','All','Tutti']],['software',['Software','Software','Software']],['ecommerce',['E-commerce','E-commerce','E-commerce']],['igaming',['iGaming','iGaming','iGaming']],['diseno',['Diseño','Design','Design']],['ia',['IA','AI','IA']]];
const CASES = [
 {id:'nexa', cat:'software', demo:'nexa', lg:'NX', co:'Nexa Logistics', sec:['Logística & distribución','Logistics & distribution','Logistica & distribuzione'],
  t:['Automatización de inventario y ERP operativo para red de distribución nacional','Inventory automation and operational ERP for a national distribution network','Automazione dell’inventario ed ERP operativo per una rete di distribuzione nazionale'],
  d:['Unificamos 6 almacenes en un solo sistema con stock sincronizado en tiempo real.','We unified 6 warehouses in one system with real-time synced stock.','Abbiamo unificato 6 magazzini in un unico sistema con stock sincronizzato in tempo reale.'],
  tags:['Software a medida','Arquitectura cloud','Sincronización IoT'],
  m:[['-70%',['Tiempo de despacho de órdenes','Order dispatch time','Tempo di evasione ordini']],['0',['Errores de sincronización de stock multi-almacén','Multi-warehouse stock sync errors','Errori di sincronizzazione dello stock'],[' Errores',' Errors',' Errori']]],
  r:['Cada almacén usaba hojas de cálculo distintas y los pedidos salían tarde o con stock equivocado.','Each warehouse ran its own spreadsheets, so orders shipped late or with wrong stock.','Ogni magazzino usava fogli diversi e gli ordini partivano in ritardo o con stock errato.'],
  s:['ERP a medida con lectores IoT en cada almacén y un panel central de despacho.','Custom ERP with IoT scanners in every warehouse and a central dispatch dashboard.','ERP su misura con lettori IoT in ogni magazzino e un pannello centrale di spedizione.'],
  res:['Despachos 70% más rápidos y cero diferencias de stock desde el primer mes.','Dispatch 70% faster and zero stock mismatches from the first month.','Spedizioni più veloci del 70% e zero differenze di stock dal primo mese.']},
 {id:'vivant', cat:'ecommerce', demo:'checkout', lg:'VS', co:'Vivant Store', sec:['Retail omnicanal','Omnichannel retail','Retail omnicanale'],
  t:['Plataforma de compras ultra-rápida y checkout en 1 clic','Ultra-fast shopping platform with 1-click checkout','Piattaforma di shopping ultra-veloce e checkout in 1 clic'],
  d:['Reemplazamos una tienda lenta y abandonada por una arquitectura moderna que procesa transacciones sin fricción ni esperas en el móvil.','We replaced a slow, abandoned store with a modern stack that processes payments on mobile with no friction or waiting.','Abbiamo sostituito uno store lento e abbandonato con un’architettura moderna che elabora i pagamenti da mobile senza attese.'],
  tags:['E-commerce headless','Next.js & Edge CDN','Checkout express'],
  m:[['0.4s',['Tiempo de carga del checkout','Checkout load time','Tempo di caricamento del checkout']],['+38%',['Conversión en móvil','Mobile conversion','Conversione da mobile']]],
  r:['El 70% de los carritos se abandonaba en el móvil por pasos de pago lentos.','70% of carts were abandoned on mobile because checkout was slow.','Il 70% dei carrelli veniva abbandonato da mobile per un checkout lento.'],
  s:['Tienda headless con checkout en 1 clic, pagos guardados y páginas servidas desde el borde.','Headless store with 1-click checkout, saved payments and edge-served pages.','Store headless con checkout in 1 clic, pagamenti salvati e pagine servite dall’edge.'],
  res:['Checkout en 0.4 segundos y 38% más ventas desde el celular.','Checkout in 0.4 seconds and 38% more sales from phones.','Checkout in 0,4 secondi e il 38% di vendite in più da smartphone.']},
 {id:'betpulse', cat:'igaming', demo:'casino', lg:'BP', co:'BetPulse LatAm', sec:['iGaming platform','iGaming platform','Piattaforma iGaming'],
  t:['Motor de apuestas y cajero multi-divisa de alta concurrencia','High-concurrency betting engine and multi-currency cashier','Motore di scommesse e cassa multivaluta ad alta concorrenza'],
  d:['Infraestructura blindada para soportar decenas de miles de apuestas por segundo durante las finales de fútbol, liquidando retiros de inmediato sin intervención humana.','Hardened infrastructure that handles tens of thousands of bets per second during football finals, paying out withdrawals instantly with no manual work.','Infrastruttura blindata che regge decine di migliaia di scommesse al secondo durante le finali, con prelievi istantanei senza intervento umano.'],
  tags:['Sportsbook engine','Cajero cripto & FIAT','Microservicios Go'],
  m:[['48.200',['Apuestas por segundo en picos','Bets per second at peak','Scommesse al secondo nei picchi']],['8.2s',['Tiempo medio de retiro','Average withdrawal time','Tempo medio di prelievo']]],
  r:['La plataforma anterior caía en cada final y los retiros tardaban hasta 48 horas.','The old platform crashed at every final and withdrawals took up to 48 hours.','La vecchia piattaforma cadeva a ogni finale e i prelievi richiedevano fino a 48 ore.'],
  s:['Microservicios en Go con colas de apuestas y un cajero cripto + PIX automatizado.','Go microservices with bet queues and an automated crypto + PIX cashier.','Microservizi in Go con code di scommesse e una cassa crypto + PIX automatizzata.'],
  res:['Cero caídas en temporada alta y retiros liquidados en segundos.','No downtime in peak season and withdrawals settled in seconds.','Zero interruzioni in alta stagione e prelievi liquidati in pochi secondi.']},
 {id:'medikal', cat:'ia', demo:'chat', lg:'MK', co:'Medikal B2B', sec:['Salud & atención B2B','Healthcare & B2B service','Sanità & servizio B2B'],
  t:['Asistente inteligente 24/7 integrado a WhatsApp y facturación','24/7 smart assistant integrated with WhatsApp and invoicing','Assistente intelligente 24/7 integrato con WhatsApp e fatturazione'],
  d:['Atendemos consultas repetitivas de proveedores y clínicas al instante, emitiendo comprobantes y agendando pedidos sin saturar al equipo de soporte.','Repetitive questions from suppliers and clinics are answered instantly, with invoices issued and orders scheduled without overloading support.','Le domande ripetitive di fornitori e cliniche ricevono risposta immediata, con fatture emesse e ordini programmati senza sovraccaricare il supporto.'],
  tags:['Automatización IA','WhatsApp API gateway','Integración ERP'],
  m:[['24/7',['Atención sin pausas','Always-on service','Assistenza senza pause']],['-65%',['Consultas manuales al equipo','Manual requests to the team','Richieste manuali al team']]],
  r:['El equipo de soporte pasaba el día reenviando facturas y confirmando pedidos por WhatsApp.','The support team spent the day resending invoices and confirming orders on WhatsApp.','Il supporto passava la giornata a reinviare fatture e confermare ordini su WhatsApp.'],
  s:['Copiloto de IA en WhatsApp conectado al ERP y a la facturación electrónica.','AI copilot on WhatsApp connected to the ERP and e-invoicing.','Copilota IA su WhatsApp collegato all’ERP e alla fatturazione elettronica.'],
  res:['65% menos consultas manuales y facturas entregadas en segundos, a cualquier hora.','65% fewer manual requests and invoices delivered in seconds, at any hour.','Il 65% di richieste manuali in meno e fatture consegnate in pochi secondi, a ogni ora.']},
 {id:'cobrapay', cat:'software', demo:'bank', lg:'CP', co:'CobraPay LatAm', sec:['Fintech & pagos','Fintech & payments','Fintech & pagamenti'],
  t:['Plataforma de conciliación y cobros recurrentes','Reconciliation and recurring billing platform','Piattaforma di riconciliazione e incassi ricorrenti'],
  d:['Unificamos pasarelas de pago y entidades bancarias locales para conciliar cobros recurrentes sin descuadres ni retrasos en el flujo de caja.','We unified payment gateways and local banks to reconcile recurring payments with no mismatches or cash-flow delays.','Abbiamo unificato gateway di pagamento e banche locali per riconciliare gli incassi ricorrenti senza differenze né ritardi.'],
  tags:['Fintech engine','Multi-gateway','PCI-DSS compliant'],
  m:[['100%',['Cobros conciliados automáticamente','Payments reconciled automatically','Incassi riconciliati automaticamente']],['99.99%',['Disponibilidad del sistema (SLA)','System availability (SLA)','Disponibilità del sistema (SLA)']]],
  r:['Conciliar cuatro pasarelas y tres bancos tomaba una semana de trabajo manual cada mes.','Reconciling four gateways and three banks took a week of manual work every month.','Riconciliare quattro gateway e tre banche richiedeva una settimana di lavoro manuale al mese.'],
  s:['Motor de conciliación multi-gateway con dispersión automática y alertas en tiempo real.','Multi-gateway reconciliation engine with automatic payouts and real-time alerts.','Motore di riconciliazione multi-gateway con pagamenti automatici e avvisi in tempo reale.'],
  res:['Cierre de mes automático, 100% cuadrado y con disponibilidad del 99.99%.','Month-end close is automatic, 100% balanced and runs at 99.99% availability.','Chiusura mensile automatica, 100% quadrata e con disponibilità del 99,99%.']}
];

let filter = 'all';
const WA_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/></svg>';

/* ----- demos ----- */
const DEMO = {
 nexa: () => `<div class="ba">
   <div class="ba-card"><span class="mono">${tr('nx.ba')}</span>
     <div class="ba-row before"><span>${tr('nx.bef')}</span><div class="ba-bar"><i></i></div><b>4h 10m</b></div>
     <div class="ba-row after"><span>${tr('nx.aft')}</span><div class="ba-bar"><i id="nx-bar"></i></div><b id="nx-time">4h 10m</b></div></div>
   <div class="ba-card"><span class="mono">${tr('nx.err')}</span>
     <div class="err"><b id="nx-err">1.284</b><svg viewBox="0 0 200 44"><defs><linearGradient id="eg" x1="0" x2="1"><stop offset="0" stop-color="#ff5b6b"/><stop offset=".6" stop-color="#9b30ff"/><stop offset="1" stop-color="#3ee08a"/></linearGradient></defs><polyline id="nx-line" points="0,6 25,10 50,4 75,14 100,12 125,26 150,34 175,40 200,42"/></svg></div></div>
 </div>`,
 checkout: () => `<div class="panel" data-demo="checkout"><div class="ph"><span class="lv">${tr('b.ck')}</span><em>0.4s load</em></div>
   <div class="prod"><span class="bag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg></span><span class="ln"><i></i><i></i></span><b>$189.00</b></div>
   <div class="buy" data-r="buy">⚡ <span>${tr('b.buy')}</span></div>
   <svg class="cursor" viewBox="0 0 24 24" fill="#fff"><path d="M4 2l16 9-7 2-3 7z" stroke="#000" stroke-width="1"/></svg></div>`,
 casino: () => `<div class="panel" data-demo="casino"><div class="ph"><span class="lv mg">Live casino & sports</span><em>${tr('b.conc')}: <span data-r="ops">48,200</span> ops/s</em></div>
   <div class="odds"><div><small>${tr('b.loc')}</small><b>1.84</b></div><div><small>${tr('b.emp')}</small><b>3.40</b></div><div><small>${tr('b.vis')}</small><b>4.15</b></div></div>
   <div class="cashier"><span>₿ ${tr('b.cash')}</span><span class="g" data-r="wd">${tr('b.wd')}: 8.2s</span></div></div>`,
 chat: () => `<div class="panel" data-demo="chat"><div class="ph"><span class="lv">${tr('b.copi')}</span><em style="color:#ff9cf0">${tr('b.fact')}</em></div>
   <div class="chat"><div class="msg u">${tr('b.q')}</div><div class="dotsx"><i></i><i></i><i></i></div>
   <div class="msg b"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/></svg><span>${tr('b.a')}<br><span class="pdf">PDF · F-4092.pdf</span></span></div></div></div>`,
 bank: () => `<div class="panel" data-demo="bank"><div class="ph"><span class="lv">${tr('b.bank')}</span><em data-r="sq">${tr('b.sq')}</em></div>
   <div class="brow"><span>${tr('b.subs')}</span><b data-r="amt">$428,900.00</b></div>
   <div class="brow"><span>${tr('b.disp')}</span><span class="st done" data-r="st">${tr('b.done')}</span></div>
   <div class="sla"><span>${tr('b.avail')}</span><b>SLA: 99.99%</b></div></div>`
};
const fmtMoney = v => '$' + v.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
const runners = {
 checkout(el, T){
  const buy = el.querySelector('[data-r=buy]'), cur = el.querySelector('.cursor');
  const reset = () => { buy.className = 'buy'; buy.innerHTML = `⚡ <span>${tr('b.buy')}</span>`; cur.classList.remove('show'); cur.style.left = '78%'; cur.style.top = '115%'; };
  const cycle = () => { reset();
    T(() => { cur.classList.add('show'); cur.style.left = '52%'; cur.style.top = '76%'; }, 600);
    T(() => buy.classList.add('press'), 1400);
    T(() => { buy.classList.remove('press'); buy.classList.add('load'); buy.innerHTML = `<span>${tr('b.proc')}</span>`; }, 1600);
    T(() => { buy.className = 'buy ok'; buy.innerHTML = `✓ <span>${tr('b.paid')}</span>`; cur.classList.remove('show'); }, 2050);
    T(cycle, 5200); };
  cycle();
 },
 casino(el, T){
  const ops = el.querySelector('[data-r=ops]'), cells = el.querySelectorAll('.odds div'), wd = el.querySelector('[data-r=wd]');
  let n = 48200, k = 0;
  const tick = () => { n = Math.max(41000, Math.min(52000, n + Math.round((Math.random()-.45)*900))); ops.textContent = n.toLocaleString('en-US'); k++;
    if(k % 12 === 0){ const c = cells[Math.random()*3|0], b = c.querySelector('b'), v = +b.textContent, nv = Math.max(1.05, v + (Math.random() < .5 ? -1 : 1)*(.05 + Math.random()*.2));
      c.classList.remove('up','dn'); void c.offsetWidth; c.classList.add(nv > v ? 'up' : 'dn'); b.textContent = nv.toFixed(2); T(() => c.classList.remove('up','dn'), 700); }
    if(k % 33 === 0){ wd.textContent = tr('b.wdok'); T(() => { wd.textContent = tr('b.wd') + ': 8.2s'; }, 1300); }
    T(tick, 120); };
  tick();
 },
 chat(el, T){
  const u = el.querySelector('.msg.u'), d = el.querySelector('.dotsx'), b = el.querySelector('.msg.b');
  const cycle = () => { [u,d,b].forEach(x => x.classList.remove('in')); d.style.display = '';
    T(() => u.classList.add('in'), 500); T(() => d.classList.add('in'), 1200);
    T(() => { d.classList.remove('in'); d.style.display = 'none'; b.classList.add('in'); }, 2600);
    T(cycle, 6200); };
  cycle();
 },
 bank(el, T){
  const amt = el.querySelector('[data-r=amt]'), st = el.querySelector('[data-r=st]'), sq = el.querySelector('[data-r=sq]');
  const cycle = () => { st.className = 'st pend'; st.textContent = tr('b.pend'); sq.textContent = tr('b.sqing'); sq.style.color = '#ffb35b';
    const t0 = performance.now(); (function step(now){ const k = clamp((now - t0)/1800), e = 1 - Math.pow(1-k,3); amt.textContent = fmtMoney(428900*e); if(k < 1 && el.isConnected) T(() => step(performance.now()), 30); })(t0);
    T(() => { st.className = 'st done'; st.textContent = tr('b.done'); }, 2000);
    T(() => { sq.textContent = tr('b.sq'); sq.style.color = 'var(--green)'; }, 2300);
    T(cycle, 6000); };
  cycle();
 }
};
const demoIO = new IntersectionObserver(es => es.forEach(e => {
  const el = e.target, kind = el.dataset.demo;
  if(e.isIntersecting && !el._on && !reduced){ el._on = true; el._timers = []; runners[kind](el, (f, ms) => { if(!el._on) return; el._timers.push(setTimeout(() => el._on && f(), ms)); }); }
  else if(!e.isIntersecting && el._on){ el._on = false; el._timers.forEach(clearTimeout); }
}), {threshold:.3});

/* ----- render de tarjetas ----- */
function cardHTML(c){
  const L = RD.L, wide = c.demo === 'nexa';
  const body = `<div class="body">
    <span class="co"><span class="lg">${c.lg}</span><b>${c.co}</b> / ${c.sec[L]}</span>
    <h3>${c.t[L]}</h3>
    ${wide ? '' : `<p>${c.d[L]}</p>`}
    <div class="tags">${c.tags.map(x => `<span>${x}</span>`).join('')}</div>
    ${wide ? `<div class="metrics">${c.m.map((m,i) => `<div><b data-metric="${i}">${m[0]}${m[2] ? m[2][L] : ''}</b><span>${m[1][L]}</span></div>`).join('')}</div>` : ''}
    ${wide ? `<span class="more">${tr('more')} <span aria-hidden="true">→</span></span>` : ''}
  </div>`;
  return `<article class="case-card${wide ? ' wide' : ''}" tabindex="0" role="button" data-id="${c.id}" data-cat="${c.cat}" aria-label="${c.co}: ${c.t[L]}">
    ${wide ? body + `<div class="stage">${DEMO.nexa()}</div>` : `<div class="stage">${DEMO[c.demo]()}</div>` + body}
  </article>`;
}
function renderCases(){
  const L = RD.L;
  $('#cases').innerHTML = CASES.map(cardHTML).join('') +
    `<div class="design-card" data-cat="diseno"><div><h3>${tr('d.t')}</h3><p>${tr('d.d')}</p></div><a class="btn primary" href="${route('portafolio')}">${tr('d.b')} <span aria-hidden="true">→</span></a></div>`;
  $$('#cases .case-card').forEach(card => {
    const c = CASES.find(x => x.id === card.dataset.id);
    card.addEventListener('click', () => openCase(c, card));
    card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openCase(c, card); } });
  });
  $$('#cases [data-demo]').forEach(el => demoIO.observe(el));
  applyFilter(false);
  nexaDone = false;
}
function renderChips(){
  const L = RD.L;
  $('#chips').innerHTML = CATS.map(([id, lab]) => `<button type="button" data-f="${id}" aria-pressed="${id === filter}">${lab[L]}</button>`).join('');
  $$('#chips button').forEach(b => b.addEventListener('click', () => { if(b.dataset.f === filter) return; filter = b.dataset.f; $$('#chips button').forEach(x => x.setAttribute('aria-pressed', x.dataset.f === filter)); applyFilter(true); }));
}
// filtro con animación FLIP: las tarjetas se reacomodan en lugar de saltar
function applyFilter(animate){
  const items = $$('#cases > *');
  const match = el => filter === 'all' ? true : el.dataset.cat === filter;
  if(!animate || reduced){ items.forEach(el => { el.hidden = !match(el); }); RD.spine.build(); return; }
  const first = new Map(items.filter(el => !el.hidden).map(el => [el, el.getBoundingClientRect()]));
  const leaving = items.filter(el => !el.hidden && !match(el));
  leaving.forEach(el => el.classList.add('leaving'));
  setTimeout(() => {
    items.forEach(el => { el.hidden = !match(el); el.classList.remove('leaving'); });
    items.filter(el => !el.hidden).forEach(el => {
      const a = first.get(el), b = el.getBoundingClientRect();
      const anim = a ? [{transform:`translate(${a.left-b.left}px,${a.top-b.top}px)`},{transform:'none'}] : [{opacity:0, transform:'scale(.96) translateY(14px)'},{opacity:1, transform:'none'}];
      el.animate(anim, {duration:600, easing:'cubic-bezier(.16,1,.3,1)'});
    });
    RD.spine.build();
  }, leaving.length ? 260 : 0);
}

/* ----- caso destacado: antes/después ligado al scroll ----- */
let nexaDone = false;
function updNexa(){
  const bar = $('#nx-bar'); if(!bar) return;
  const card = bar.closest('.case-card'); if(card.hidden) return;
  const p = reduced ? 1 : pr(card, .85, .2);
  bar.style.width = (100 - 70*p) + '%';
  const mins = Math.round(250 - 175*p);
  $('#nx-time').textContent = Math.floor(mins/60) + 'h ' + String(mins%60).padStart(2,'0') + 'm';
  const err = Math.round(1284*(1-p));
  const e = $('#nx-err'); e.textContent = err.toLocaleString('es-ES'); e.classList.toggle('z', err === 0);
  const ln = $('#nx-line'), len = 230; ln.style.strokeDasharray = len; ln.style.strokeDashoffset = len*(1-p);
  if(p >= 1 && !nexaDone){ nexaDone = true; }
}

/* ----- botón final: se enciende cuando llega la línea ----- */
function updCta(){ $('#wa-main').classList.toggle('lit', RD.spine.progress > .985); }

/* ----- caso completo (misma pestaña) ----- */
const caseEl = $('#case');
let openC = null, originScroll = 0, originCard = null, closing = false, pullAcc = 0, pullTimer = null, lockUntil = 0;
function rectOf(el){ const r = el.getBoundingClientRect(); return `inset(${Math.max(0,r.top)}px ${Math.max(0,innerWidth-r.right)}px ${Math.max(0,innerHeight-r.bottom)}px ${Math.max(0,r.left)}px round 18px)`; }
function fillCase(c){
  const L = RD.L, list = CASES.filter(x => filter === 'all' || x.cat === filter), pool = list.length ? list : CASES;
  const next = pool[(pool.indexOf(c) + 1) % pool.length] || CASES[0];
  $('#c-co').innerHTML = `<span class="lg">${c.lg}</span><b>${c.co}</b> / ${c.sec[L]}`;
  $('#c-title').textContent = c.t[L]; $('#c-desc').textContent = c.d[L];
  $('#c-tags').innerHTML = c.tags.map(x => `<span>${x}</span>`).join('');
  $('#c-metrics').innerHTML = c.m.map(m => `<div class="c-metric"><b>${m[0]}</b><span>${m[1][L]}</span></div>`).join('');
  $('#c-reto').textContent = c.r[L]; $('#c-sol').textContent = c.s[L]; $('#c-res').textContent = c.res[L];
  const wa = RD.waLink(tr('wa.case').replace('{c}', c.co)); $('#c-wa').href = wa; $('#c-wa-top').href = wa;
  $('#c-next-t').textContent = next.co + ' — ' + next.t[L];
  $('#c-next').onclick = () => { caseEl.classList.remove('shown'); setTimeout(() => { openC = next; fillCase(next); caseEl.scrollTop = 0; caseEl.classList.add('shown'); }, 250); };
  $('#c-meter').style.width = '0';
}
function openCase(c, card){
  if(openC) return;
  openC = c; originScroll = scrollY; originCard = card;
  fillCase(c);
  caseEl.hidden = false; caseEl.scrollTop = 0; pullAcc = 0;
  caseEl.classList.remove('anim','shown','leaving');
  caseEl.style.clipPath = rectOf(card);
  document.documentElement.style.overflow = 'hidden';
  requestAnimationFrame(() => requestAnimationFrame(() => { caseEl.classList.add('anim','shown'); caseEl.style.clipPath = 'inset(0px 0px 0px 0px round 0px)'; $('#c-back').focus({preventScroll:true}); }));
}
function closeCase(mode){
  if(!openC || closing) return;
  closing = true;
  if(mode === 'pull') lockUntil = performance.now() + 1400;
  document.documentElement.style.overflow = '';
  scrollTo({top: originScroll, behavior:'auto'});
  requestAnimationFrame(() => {
    caseEl.classList.add('leaving'); caseEl.style.clipPath = rectOf(originCard);
    setTimeout(() => { caseEl.hidden = true; caseEl.classList.remove('anim','shown','leaving'); caseEl.scrollTop = 0; openC = null; closing = false; }, 900);
  });
}
$('#c-back').addEventListener('click', () => closeCase('back'));
$('#c-close').addEventListener('click', () => closeCase('back'));
addEventListener('keydown', e => { if(e.key === 'Escape') closeCase('back'); });
const atBottom = () => caseEl.scrollTop + caseEl.clientHeight >= caseEl.scrollHeight - 4;
function pushPull(dy){
  if(!atBottom() || dy <= 0) return;
  pullAcc += dy; $('#c-meter').style.width = Math.min(100, pullAcc/4.5) + '%';
  clearTimeout(pullTimer); pullTimer = setTimeout(() => { pullAcc = 0; $('#c-meter').style.width = '0'; }, 700);
  if(pullAcc > 450){ pullAcc = 0; closeCase('pull'); }
}
caseEl.addEventListener('wheel', e => pushPull(e.deltaY), {passive:true});
let ty0 = null;
caseEl.addEventListener('touchstart', e => { ty0 = e.touches[0].clientY; }, {passive:true});
caseEl.addEventListener('touchmove', e => { if(ty0 == null) return; const y = e.touches[0].clientY; pushPull((ty0 - y)*1.6); ty0 = y; }, {passive:true});
const block = e => { const n = performance.now(); if(closing || n < lockUntil){ e.preventDefault(); lockUntil = Math.max(lockUntil, n + 450); } };
addEventListener('wheel', block, {passive:false}); addEventListener('touchmove', block, {passive:false});

/* ----- arranque ----- */
RD.onLang(() => { RD.splitWords($('#h1'), [['h.t1',''],['h.t2','grad-text']]); renderChips(); renderCases(); if(openC) fillCase(openC); });
RD.spine.updaters.push(updNexa, updCta);
RD.spine.init({end: $('#wa-main')});
RD.applyLang();
addEventListener('scroll', updNexa, {passive:true});
})();
