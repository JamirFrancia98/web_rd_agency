import RD from './rd.js';
import { T } from '../i18n/nosotros.js';
import { route } from '../i18n/routes.js';

(function(){
"use strict";
const {$, $$, clamp, pr, reduced, tr} = RD;
RD.addText(T);

/* comparativa (datos) */
const ROWL = [['Propiedad del código','Code ownership','Proprietà del codice'],['Contacto directo','Direct contact','Contatto diretto'],['Adaptación al negocio','Fit to your business','Adattamento al business'],['Costos','Costs','Costi']];
const COLS = [
 {cls:'side', k:['Alternativa A','Option A','Alternativa A'], t:['Agencia tradicional','Traditional agency','Agenzia tradizionale'], s:['Múltiples capas intermedias y cobro por hora inflado.','Several layers of middlemen and inflated hourly billing.','Molti livelli intermedi e tariffe orarie gonfiate.'],
  rows:[['Código retenido o contratos que dificultan la migración autónoma.','Code held back or contracts that make it hard to move on.','Codice trattenuto o contratti che ostacolano la migrazione.'],['Ejecutivo de cuentas no técnico que filtra mensajes.','A non-technical account manager filters every message.','Un account manager non tecnico filtra i messaggi.'],['Plazos lentos, cambios con sobrecosto y presupuestos inflados.','Slow timelines, costly changes and padded budgets.','Tempi lenti, modifiche a pagamento e preventivi gonfiati.'],['Tarifas infladas por horas muertas y cargos de gestión.','Fees inflated by idle hours and management charges.','Tariffe gonfiate da ore morte e costi di gestione.']],
  foot:['✕ Control parcial','✕ Partial control','✕ Controllo parziale']},
 {cls:'rd', k:['Socio directo','Direct partner','Partner diretto'], t:['Revolution Digital','Revolution Digital','Revolution Digital'], s:['Ingeniería pura conectada directamente a tus objetivos comerciales.','Pure engineering tied directly to your business goals.','Ingegneria pura collegata direttamente ai tuoi obiettivi.'],
  rows:[['100% tuyo, en tu propio GitHub y Cloud desde el día uno.','100% yours, in your own GitHub and cloud from day one.','100% tuo, nel tuo GitHub e cloud dal primo giorno.'],['Directo con los ingenieros y diseñadores de tu proyecto.','Straight to the engineers and designers on your project.','Direttamente con ingegneri e designer del tuo progetto.'],['Hecho a la medida exacta de tus flujos y necesidades de escala.','Built to fit your exact workflows and growth needs.','Fatto su misura per i tuoi flussi e la tua crescita.'],['Precio fijo acordado, entregables claros y sin tarifas ocultas.','Agreed fixed price, clear deliverables, no hidden fees.','Prezzo fisso concordato, consegne chiare e nessun costo nascosto.']],
  foot:['◎ Propiedad total','◎ Full ownership','◎ Proprietà totale']},
 {cls:'side', k:['Alternativa B','Option B','Alternativa B'], t:['SaaS genérico','Generic SaaS','SaaS generico'], s:['Alquiler de plantillas prediseñadas y soporte automatizado.','Rented templates and automated support.','Template in affitto e supporto automatizzato.'],
  rows:[['Ninguna. Si dejas de pagar la suscripción, pierdes todo.','None. Stop paying the subscription and you lose everything.','Nessuna. Se smetti di pagare, perdi tutto.'],['Tickets lentos y bots de respuesta automática.','Slow tickets and auto-reply bots.','Ticket lenti e bot di risposta automatica.'],['Tu empresa debe amoldarse a los límites rígidos del sistema.','Your company has to bend to the system’s limits.','La tua azienda deve adattarsi ai limiti del sistema.'],['Cobro creciente por usuario, transacción y módulo.','Costs grow per user, transaction and add-on.','Costi crescenti per utente, transazione e modulo.']],
  foot:['🔒 Dependencia permanente','🔒 Permanent lock-in','🔒 Dipendenza permanente']}
];
const REC = ['Recomendado','Recommended','Consigliato'], GO = ['Comenzar →','Get started →','Inizia →'];
function renderCmp(){
  const L = RD.L;
  $('#cmp').innerHTML = COLS.filter(c => c.cls === 'rd').map(c => `
    <div class="col ${c.cls}">
      ${c.cls === 'rd' ? `<span class="rec">${REC[L]}</span>` : ''}
      <span class="mono">${c.k[L]}</span>
      <div><h3>${c.t[L]}${c.cls === 'rd' ? ' <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e21cff" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.8"/></svg>' : ''}</h3><p class="sub" style="margin-top:6px">${c.s[L]}</p></div>
      <div class="rows">${c.rows.map((r,i) => `<div class="row" data-row="${i}"><small>${ROWL[i][L]}</small><p>${r[L]}</p></div>`).join('')}</div>
      <div class="foot"><span class="${c.cls === 'rd' ? 'ok' : ''}">${c.foot[L]}</span>${c.cls === 'rd' ? `<a href="#" data-wa="wa.call">${GO[L]}</a>` : ''}</div>
    </div>`).join('');
  $$('#cmp [data-wa]').forEach(a => { a.href = RD.waLink(tr('wa.call')); a.target = '_blank'; a.rel = 'noopener'; });
}

/* hero: título y diagrama */
function renderHero(){ RD.splitWords($('#h1'), [['h.t1',''],['h.t2','grad-text']]); }
const conn = $('#conn');
if(reduced) conn.classList.add('direct');
else RD.onEnter([conn], el => setTimeout(() => el.classList.add('direct'), 900), {threshold:.5});

/* cifras */
RD.onEnter('#stats .stat b', b => RD.countUp(b, +b.dataset.to, {suf: b.dataset.suf || ''}), {threshold:.6});
RD.onEnter([$('#dots')], d => Array.from(d.children).forEach((i,k) => setTimeout(() => i.classList.add('on'), reduced ? 0 : 300 + k*320)), {threshold:.6});
RD.onEnter([$('#bar')], b => { b.style.width = '100%'; }, {threshold:.6});

/* flujo: se activa con el scroll y el entregable se escribe solo */
const steps = $$('#flow .fstep'), arrows = $$('#flow .arrowc');
function typeIn(el){
  if(el.dataset.done === RD.L + '') return;
  el.dataset.done = RD.L; const full = tr(el.dataset.k); let i = 0;
  if(reduced){ el.textContent = full; return; }
  el.classList.add('typing'); clearInterval(el._t);
  el._t = setInterval(() => { i++; el.textContent = full.slice(0, i); if(i >= full.length){ clearInterval(el._t); setTimeout(() => el.classList.remove('typing'), 900); } }, 24);
}
function updFlow(){
  const mobile = innerWidth <= 860;
  steps.forEach((s,i) => {
    const p = reduced ? 1 : (mobile ? pr(s, .8, .5) : pr($('#flow'), .8, .25));
    const on = mobile ? p > .05 : p > .05 + i*.3;
    s.classList.toggle('on', on);
    if(on) s.querySelectorAll('.type').forEach(typeIn);
    if(arrows[i]) arrows[i].classList.toggle('on', mobile ? on : p > .2 + i*.3);
  });
}

/* comparativa: fila por fila, luego la decisión */
function updCmp(){
  const cmp = $('#cmp'); if(!cmp.children.length) return;
  const p = reduced ? 1 : pr(cmp, .75, -.05);
  const row = p < .08 ? -1 : Math.min(3, Math.floor((p - .08)/.18));
  $$('#cmp .row').forEach(r => r.classList.toggle('hl', +r.dataset.row <= row || p >= .82));
  cmp.classList.toggle('decided', p >= .82);
}

RD.onLang(() => { renderHero(); renderCmp(); $$('.type').forEach(t => { t.dataset.done = ''; t.textContent = ''; }); updFlow(); updCmp(); });
RD.spine.updaters.push(updFlow, updCmp);
RD.spine.init({end: $('#rmark')});
RD.footerR();
RD.reveals();
RD.onEnter('.pr', el => el.classList.add('in'), {threshold:.4});
RD.applyLang();
addEventListener('scroll', () => { updFlow(); updCmp(); }, {passive:true});
})();
