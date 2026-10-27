import { WA_NUMBER } from '../config.js';
import { T, LISTS, FAQ, IA_TABS } from '../i18n/home.js';

(function(){
"use strict";
/* ============ CONFIGURACIÓN ============ */

/* ============ TEXTOS ES / EN / IT ============ */
const LANGS = ['es','en','it'];
let L = Math.max(0, LANGS.indexOf(document.documentElement.lang));
const tr = k => (T[k] ? T[k][L] : k);
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(hover: none)').matches;
const clamp = (v,a=0,b=1) => Math.min(b, Math.max(a, v));
const waLink = msg => 'https://wa.me/' + WA_NUMBER + (msg ? '?text=' + encodeURIComponent(msg) : '');

let iaTab = 0, firstRender = true;
function renderHero(){
  const h = $('#h1');
  if(h.hasAttribute('data-split')){ firstRender = false; return; } // ya viene animado desde el servidor
  h.innerHTML = '';
  let i = 0;
  [['hero.t1',''],['hero.t2','grad-text'],['hero.t3','']].forEach(([k,cls]) => {
    tr(k).split(' ').forEach(w => {
      const s = document.createElement('span'); s.className = 'w ' + cls; s.textContent = w;
      s.style.animationDelay = (firstRender ? 0.15 + i*0.08 : 0) + 's';
      if(!firstRender){ s.style.animation = 'none'; s.style.opacity = 1; s.style.transform = 'none'; s.style.filter = 'none'; }
      h.appendChild(s); h.appendChild(document.createTextNode(' ')); i++;
    });
  });
  firstRender = false;
}
function applyLang(){
  document.documentElement.lang = LANGS[L];
  $$('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
  $$('[data-list]').forEach(ul => { ul.innerHTML = LISTS[ul.dataset.list][L].map(x => `<li><a href="#top">${x}</a></li>`).join(''); });
  $$('.wa-link').forEach(a => { a.href = waLink(tr(a.dataset.wa || 'call.wa')); });
  renderHero(); renderFaq(); renderIaTabs(); setIa(iaTab, true);
  requestAnimationFrame(buildSpine);
}


/* ============ LA SEÑAL ============ */
const main = $('main'), svg = $('#spine'), ghost = svg.querySelector('.ghost'), live = svg.querySelector('.live'),
      head = svg.querySelector('.head'), halo = svg.querySelector('.halo'), sg = $('#sg');
let total = 1, samples = [], headLen = 0, pts = [];
function buildSpine(){
  const mr = main.getBoundingClientRect();
  const W = main.clientWidth, H = main.offsetHeight;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.style.height = H + 'px';
  sg.setAttribute('y2', H);
  pts = $$('.node').filter(n => n.offsetParent !== null).map(n => { const r = n.getBoundingClientRect(); return [r.left - mr.left + 1, r.top - mr.top + 1]; })
        .sort((a,b) => a[1]-b[1]);
  // termina en la "R" del footer
  const rm = $('#rmark').getBoundingClientRect();
  pts.push([rm.left - mr.left + rm.width/2, rm.top - mr.top + 6]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for(let i=0;i<pts.length-1;i++){
    const p0 = pts[i-1]||pts[i], p1 = pts[i], p2 = pts[i+1], p3 = pts[i+2]||p2;
    const c1 = [p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6], c2 = [p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  ghost.setAttribute('d', d); live.setAttribute('d', d);
  total = live.getTotalLength();
  samples = [];
  for(let l=0; l<=total; l+=6){ const p = live.getPointAtLength(l); samples.push([l, p.y]); }
  live.style.strokeDasharray = total;
  layoutFlow();
  onScroll(true);
}
function lenAtY(y){
  let lo = 0, hi = samples.length-1;
  if(y <= samples[0][1]) return 0;
  // la curva es casi monótona en Y: búsqueda lineal desde el final aproximado
  let best = 0;
  for(let i=0;i<samples.length;i++){ if(samples[i][1] <= y) best = samples[i][0]; }
  return best;
}

/* ============ PROGRESO POR SECCIÓN ============ */
// a/b = posición del borde superior del elemento (fracción de la ventana) cuando p = 0 y p = 1
function pr(el, a, b){ const r = el.getBoundingClientRect(), vh = innerHeight; return clamp((a*vh - r.top) / ((a-b)*vh)); }

/* --- 01 diseño --- */
const mockMarkup = () => `
  <div class="nv"><span class="lg"></span><span class="nl"><span></span><span></span><span></span></span><span class="nb"></span></div>
  <div class="hr"><div class="ht"><div class="t1"><span>Vende más con</span><br><span>un diseño que</span><br><span>convierte.</span></div><div class="t2"><span>Landing optimizada para captar clientes</span><br><span>desde el primer scroll.</span></div><span class="cb">Empezar ahora</span></div><div class="im"></div></div>
  <div class="cards"><div class="cd"><i></i><span></span><span></span></div><div class="cd"><i></i><span></span><span></span></div><div class="cd"><i></i><span></span><span></span></div></div>`;
$('#mock-wire').innerHTML = mockMarkup() + '<div class="sel" id="sel"><i></i><i></i><i></i><i></i><span class="dim">560 × 220</span></div>';
$('#mock-final').innerHTML = mockMarkup();
function placeSel(){
  const m = $('#mock').getBoundingClientRect(), t = $('#mock-wire .ht').getBoundingClientRect(), s = $('#sel');
  s.style.left = (t.left - m.left - 6) + 'px'; s.style.top = (t.top - m.top - 6) + 'px';
  s.style.width = (t.width + 12) + 'px'; s.style.height = (t.height + 12) + 'px';
}
function updDesign(){
  const p = reduced ? 1 : pr($('#mock'), .85, .05);
  const e = clamp((p - .08) / .8);
  const mock = $('#mock'), hgt = mock.clientHeight, wdt = mock.clientWidth;
  $('#mock-final').style.clipPath = `inset(0 0 ${((1-e)*100).toFixed(2)}% 0)`;
  const sc = $('#scan'); sc.style.top = (e*hgt) + 'px'; sc.style.opacity = (e > 0 && e < 1) ? 1 : 0;
  const cx = wdt*(0.25 + 0.5*(0.5 + 0.5*Math.sin(e*Math.PI*3)));
  $('#fcur').style.transform = `translate(${cx}px, ${Math.max(8, e*hgt - 10)}px)`;
  $('#fcur').style.opacity = e >= 1 ? 0 : 1;
  $$('#feats .feat').forEach((f,i) => f.classList.toggle('on', p > 0.3 + i*0.18));
}

/* --- 02 software --- */
const CODE = [
 [['k','import'],['',' { '],['f','createSystem'],['',' } '],['k','from'],['',' '],['s',"'@rd/core'"]],
 [],
 [['k','const'],['',' erp = '],['f','createSystem'],['','({']],
 [['','  company: '],['s',"'Tu Empresa'"],['',',']],
 [['','  modules: ['],['s',"'inventario'"],['',', '],['s',"'ventas'"],['',', '],['s',"'facturas'"],['','],']],
 [['','  sync: '],['s',"'tiempo real'"],['',',']],
 [['','})']],
 [],
 [['k','await'],['',' erp.'],['f','deploy'],['','({ cloud: '],['b','true'],['',' })']],
 [['c','// ✓ listo para producción']]
];
const codeEl = $('#code');
codeEl.innerHTML = CODE.map((ln,i) => `<span class="ln" data-len="${ln.reduce((a,t)=>a+t[1].length,0)}"><span class="n">${i+1}</span>${ln.map(t => t[0] ? `<span class="${t[0]}">${t[1].replace(/</g,'&lt;')}</span>` : t[1]).join('')}</span>`).join('');
const lines = $$('#code .ln'), totalChars = lines.reduce((a,l) => a + (+l.dataset.len), 0);
function updSoft(){
  const p = reduced ? 1 : pr($('#ide'), .85, .0);
  let chars = Math.floor(clamp(p/.55) * totalChars), caretSet = false;
  const caret = $('#caret'), ir = $('#ide').getBoundingClientRect();
  lines.forEach(l => {
    const len = +l.dataset.len, show = clamp(chars, 0, len); chars -= len;
    const full = len + 3; // + número de línea
    l.style.clipPath = show >= len ? 'none' : `inset(0 calc(100% - ${3 + show}ch) 0 0)`;
    if(!caretSet && show < len){
      const r = l.getBoundingClientRect(), ch = r.height ? parseFloat(getComputedStyle(l).fontSize)*0.6 : 8;
      caret.style.left = (r.left - ir.left + (3 + show)*ch) + 'px'; caret.style.top = (r.top - ir.top + 2) + 'px'; caretSet = true;
    }
  });
  if(!caretSet){ const r = lines[lines.length-1].getBoundingClientRect(); caret.style.top = (r.top - ir.top + 2) + 'px'; }
  const c = clamp((p - .56)/.1);
  $('#compile').style.opacity = (c > 0 && c < 1) ? 1 : 0;
  $('#pb').style.width = (c*100) + '%';
  $('#ide').classList.toggle('compiled', p > .67);
  $$('#tags .tag').forEach((t,i) => t.classList.toggle('in', p > .12 + i*.06));
}

/* --- 03 hosting --- */
const net = $('#net'), nctx = net.getContext('2d');
let nodes = [], edges = [], pulses = [], netOn = false, netW = 0, netH = 0;
function initNet(){
  const dpr = Math.min(devicePixelRatio||1, 2);
  netW = net.clientWidth; netH = net.clientHeight;
  net.width = netW*dpr; net.height = netH*dpr; nctx.setTransform(dpr,0,0,dpr,0,0);
  const seed = [[.5,.45,1],[.18,.22],[.33,.15],[.7,.16],[.86,.3],[.12,.5],[.28,.62],[.72,.62],[.9,.58],[.42,.78],[.6,.82],[.22,.82],[.82,.82],[.5,.2]];
  nodes = seed.map(s => ({x:s[0]*netW, y:s[1]*netH*0.86, main:!!s[2], ph:Math.random()*6}));
  edges = [];
  nodes.forEach((a,i) => {
    const near = nodes.map((b,j) => [j, Math.hypot(a.x-b.x, a.y-b.y)]).filter(x => x[0] !== i).sort((x,y) => x[1]-y[1]).slice(0, a.main ? 6 : 2);
    near.forEach(([j]) => { if(!edges.some(e => (e[0]===i&&e[1]===j)||(e[0]===j&&e[1]===i))) edges.push([i,j]); });
  });
}
let nt = 0, lastNet = 0;
function drawNet(now){
  if(!netOn) return;
  const dt = Math.min(.05, (now - lastNet)/1000 || .016); lastNet = now; nt += dt;
  nctx.clearRect(0,0,netW,netH);
  edges.forEach(([i,j]) => { const a = nodes[i], b = nodes[j]; nctx.strokeStyle = 'rgba(120,110,255,.18)'; nctx.lineWidth = 1; nctx.beginPath(); nctx.moveTo(a.x,a.y); nctx.lineTo(b.x,b.y); nctx.stroke(); });
  if(!reduced && Math.random() < dt*9){ const e = edges[(Math.random()*edges.length)|0]; pulses.push({e, t:0, dir:Math.random()<.5, sp:.5 + Math.random()*.7}); }
  pulses = pulses.filter(p => p.t <= 1);
  pulses.forEach(p => {
    p.t += dt*p.sp;
    const a = nodes[p.e[p.dir?0:1]], b = nodes[p.e[p.dir?1:0]], x = a.x + (b.x-a.x)*p.t, y = a.y + (b.y-a.y)*p.t;
    const g = nctx.createRadialGradient(x,y,0,x,y,10); g.addColorStop(0,'rgba(226,28,255,.9)'); g.addColorStop(1,'rgba(226,28,255,0)');
    nctx.fillStyle = g; nctx.beginPath(); nctx.arc(x,y,10,0,7); nctx.fill();
    nctx.fillStyle = '#fff'; nctx.beginPath(); nctx.arc(x,y,1.8,0,7); nctx.fill();
  });
  nodes.forEach(n => {
    const r = n.main ? 16 : 6, bl = .5 + .5*Math.sin(nt*2 + n.ph);
    nctx.fillStyle = n.main ? 'rgba(47,91,255,.25)' : 'rgba(62,224,138,' + (.08 + bl*.12) + ')';
    nctx.beginPath(); nctx.arc(n.x,n.y,r*2.2,0,7); nctx.fill();
    nctx.fillStyle = n.main ? '#1d2a6b' : '#0f2a1c'; nctx.strokeStyle = n.main ? '#5b7cff' : '#3ee08a'; nctx.lineWidth = 1.5;
    nctx.beginPath(); nctx.arc(n.x,n.y,r,0,7); nctx.fill(); nctx.stroke();
    if(n.main){ nctx.fillStyle = '#fff'; nctx.font = '600 12px Geist, sans-serif'; nctx.textAlign = 'center'; nctx.fillText('RD Cloud', n.x, n.y + 36); }
  });
  requestAnimationFrame(drawNet);
}
new IntersectionObserver(es => { const was = netOn; netOn = es[0].isIntersecting; if(netOn && !was){ lastNet = performance.now(); requestAnimationFrame(drawNet); } }).observe($('#netbox'));
function updHost(){
  const p = reduced ? 1 : pr($('#checks'), .9, .35);
  $$('#checks li').forEach((li,i) => li.classList.toggle('on', p > .1 + i*.17));
  const u = reduced ? 1 : pr($('#netbox'), .9, .25);
  $('#uptime').textContent = (u*99.99).toFixed(2) + '%';
}

/* --- 04 IA --- */
function renderIaTabs(){
  const box = $('#ia-tabs'); box.innerHTML = '';
  IA_TABS.forEach((t,i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t.label[L]; b.setAttribute('aria-pressed', i === iaTab); b.addEventListener('click', () => setIa(i)); box.appendChild(b); });
}
function setIa(i, instant){
  iaTab = i;
  $$('#ia-tabs button').forEach((b,j) => b.setAttribute('aria-pressed', j === i));
  const flow = $('#flow'), fill = () => $$('#flow .fnode').forEach((n,k) => { n.querySelector('h4').textContent = IA_TABS[i].nodes[k][0][L]; n.querySelector('.mono').textContent = IA_TABS[i].nodes[k][1][L]; });
  if(instant){ fill(); return; }
  flow.classList.add('swap'); setTimeout(() => { fill(); flow.classList.remove('swap'); }, 300);
}
const fsvg = $('#flow-svg'); let flowSegs = [], dots = [];
function layoutFlow(){
  const fr = $('#flow').getBoundingClientRect(), ns = $$('#flow .fnode').map(n => n.getBoundingClientRect());
  const vertical = ns[1].top > ns[0].bottom;
  flowSegs = [];
  for(let k=0;k<2;k++){
    const a = ns[k], b = ns[k+1];
    flowSegs.push(vertical ? [a.left - fr.left + a.width/2, a.bottom - fr.top, b.left - fr.left + b.width/2, b.top - fr.top]
                           : [a.right - fr.left, a.top - fr.top + a.height/2, b.left - fr.left, b.top - fr.top + b.height/2]);
  }
  fsvg.innerHTML = flowSegs.map(s => `<line x1="${s[0]}" y1="${s[1]}" x2="${s[2]}" y2="${s[3]}" stroke="rgba(155,48,255,.35)" stroke-width="2" stroke-dasharray="4 5"/>`).join('') +
                   Array.from({length:6}, () => `<circle r="4" fill="#9b30ff"/>`).join('');
  dots = Array.from(fsvg.querySelectorAll('circle')).map((c,i) => ({c, seg:i%2, t:(i/6)}));
}
let flowOn = false, lastFlow = 0;
function drawFlow(now){
  if(!flowOn) return;
  const dt = Math.min(.05, (now - lastFlow)/1000 || .016); lastFlow = now;
  dots.forEach(d => {
    d.t += dt*.55;
    if(d.t > 1){ d.t -= 1; const n = $$('#flow .fnode')[d.seg+1]; n.classList.add('pulse'); setTimeout(() => n.classList.remove('pulse'), 260); }
    const s = flowSegs[d.seg]; if(!s) return;
    d.c.setAttribute('cx', s[0] + (s[2]-s[0])*d.t); d.c.setAttribute('cy', s[1] + (s[3]-s[1])*d.t);
    d.c.setAttribute('opacity', Math.sin(d.t*Math.PI));
  });
  requestAnimationFrame(drawFlow);
}
if(!reduced) new IntersectionObserver(es => { const was = flowOn; flowOn = es[0].isIntersecting; if(flowOn && !was){ lastFlow = performance.now(); requestAnimationFrame(drawFlow); } }).observe($('#flow'));
function updIa(){
  const s = $('#s-ia'), n = Array.from(s.querySelectorAll('.node')).find(x => x.offsetParent !== null), sr = s.getBoundingClientRect(), nr = n.getBoundingClientRect();
  const p = reduced ? 1 : pr(s, .78, .12);
  const diag = Math.hypot(sr.width, sr.height);
  s.style.setProperty('--fx', (nr.left - sr.left) + 'px'); s.style.setProperty('--fy', (nr.top - sr.top) + 'px');
  s.style.setProperty('--fr', (Math.pow(p,1.4)*diag*1.05) + 'px');
  s.style.setProperty('--io', clamp((p - .25)/.35).toFixed(3));
}
const counted = new WeakSet();
let statsIO;

/* --- iGaming holográfico --- */
const holo = $('#holo');
if(!isTouch && !reduced){
  holo.addEventListener('pointermove', e => { const r = holo.getBoundingClientRect(), x = (e.clientX - r.left)/r.width, y = (e.clientY - r.top)/r.height;
    holo.style.setProperty('--ry', ((x-.5)*10).toFixed(2)+'deg'); holo.style.setProperty('--rx', ((.5-y)*8).toFixed(2)+'deg'); holo.style.setProperty('--mx', (x*100).toFixed(1)+'%'); });
  holo.addEventListener('pointerleave', () => { holo.style.setProperty('--rx','0deg'); holo.style.setProperty('--ry','0deg'); });
}


/* --- lluvia de criptomonedas (solo en la sección casino, detrás del recuadro) --- */
(function(){
  const cv = $('#coins'), cx = cv.getContext('2d'), sec = $('#s-gaming');
  const KINDS = [
    {c:'#f7931a', d:'#b86a0c', draw:(g,r)=>{ g.font = `800 ${r*1.15}px Geist, Arial, sans-serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#fff'; g.fillText('₿',0,r*.06); }},
    {c:'#0033ad', d:'#00227a', draw:(g,r)=>{ g.fillStyle='#fff'; for(let k=0;k<6;k++){ const a=k/6*Math.PI*2; g.beginPath(); g.arc(Math.cos(a)*r*.45,Math.sin(a)*r*.45,r*.11,0,7); g.fill(); } for(let k=0;k<6;k++){ const a=k/6*Math.PI*2+Math.PI/6; g.beginPath(); g.arc(Math.cos(a)*r*.72,Math.sin(a)*r*.72,r*.06,0,7); g.fill(); } g.beginPath(); g.arc(0,0,r*.16,0,7); g.fill(); }},
    {c:'#2775ca', d:'#1a5394', draw:(g,r)=>{ g.strokeStyle='#fff'; g.lineWidth=r*.09; g.beginPath(); g.arc(0,0,r*.62,Math.PI*.62,Math.PI*1.38); g.stroke(); g.beginPath(); g.arc(0,0,r*.62,-Math.PI*.38,Math.PI*.38); g.stroke(); g.font=`800 ${r*.85}px Geist, Arial, sans-serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#fff'; g.fillText('$',0,r*.05); }},
    {c:'#eb0029', d:'#a3001c', draw:(g,r)=>{ g.strokeStyle='#fff'; g.lineWidth=r*.09; g.lineJoin='round'; g.beginPath(); g.moveTo(-r*.5,-r*.42); g.lineTo(r*.55,-r*.18); g.lineTo(-r*.05,r*.55); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(-r*.5,-r*.42); g.lineTo(-r*.05,r*.55); g.moveTo(r*.55,-r*.18); g.lineTo(-r*.12,-r*.05); g.stroke(); }}
  ];
  // cada moneda se dibuja una vez en un canvas pequeño
  const SPR = KINDS.map(k => { const s = 96, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d'); g.translate(s/2,s/2); const r = s/2 - 4;
    g.beginPath(); g.arc(0,0,r,0,7); g.fillStyle = k.d; g.fill();
    g.beginPath(); g.arc(0,0,r*.9,0,7); g.fillStyle = k.c; g.fill();
    const sh = g.createLinearGradient(-r,-r,r,r); sh.addColorStop(0,'rgba(255,255,255,.35)'); sh.addColorStop(.5,'rgba(255,255,255,0)'); g.fillStyle = sh; g.beginPath(); g.arc(0,0,r*.9,0,7); g.fill();
    k.draw(g, r*.9); return c; });
  let W = 0, H = 0, coins = [], on = false, last = 0;
  function size(){ const dpr = Math.min(devicePixelRatio||1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W*dpr; cv.height = H*dpr; cx.setTransform(dpr,0,0,dpr,0,0);
    const n = Math.round(clamp(W/40, 12, 36)); coins = Array.from({length:n}, (_,i) => spawn(true, i)); }
  function spawn(init, i){ const z = Math.random(); return { k: (i ?? (Math.random()*4|0)) % 4, x: Math.random()*W, y: init ? Math.random()*H : -60, z,
    r: 13 + z*24, vy: 35 + z*75, sway: Math.random()*6.28, sw: .6 + Math.random(), spin: Math.random()*6.28, vs: 1.5 + Math.random()*3 }; }
  function draw(now){
    if(!on) return;
    const dt = Math.min(.05, (now - last)/1000 || .016); last = now;
    cx.clearRect(0,0,W,H);
    coins.sort((a,b) => a.z - b.z).forEach((c,i) => {
      if(!reduced){ c.y += c.vy*dt; c.sway += dt*c.sw; c.spin += dt*c.vs; }
      if(c.y > H + 60){ Object.assign(c, spawn(false, c.k)); }
      const x = c.x + Math.sin(c.sway)*18, sx = Math.max(.08, Math.abs(Math.cos(c.spin)));
      cx.save(); cx.translate(x, c.y); cx.globalAlpha = .35 + c.z*.6;
      cx.scale(sx, 1); cx.drawImage(SPR[c.k], -c.r, -c.r, c.r*2, c.r*2); cx.restore();
    });
    if(!reduced) requestAnimationFrame(draw);
  }
  size(); addEventListener('resize', size);
  new IntersectionObserver(es => { const was = on; on = es[0].isIntersecting; if(on && !was){ last = performance.now(); requestAnimationFrame(draw); } }).observe(sec);
})();

/* --- 4 pasos --- */
function updSteps(){
  const s = $('#s-steps'), r = s.getBoundingClientRect();
  const pinned = getComputedStyle($('.steps-pin')).position === 'sticky';
  let p;
  if(reduced) p = 1;
  else if(pinned) p = clamp(-r.top / (s.offsetHeight - innerHeight));
  else p = pr($('#steps'), .9, .3);
  $('#rail').style.width = (clamp(p/.9)*100) + '%';
  $$('#steps .step').forEach((st,i) => st.classList.toggle('on', p >= i*.25 + .02));
}

/* --- FAQ --- */
let faqOpen = 0;
function renderFaq(){
  $('#faq').innerHTML = FAQ.map((q,i) => `<div class="qa${i===faqOpen?' open':''}"><button type="button" aria-expanded="${i===faqOpen}" id="q${i}"><span>${q[L][0]}</span><span class="pm" aria-hidden="true"></span></button><div class="ans" role="region" aria-labelledby="q${i}"><div><p>${q[L][1]}</p></div></div></div>`).join('');
  $$('#faq .qa button').forEach((b,i) => b.addEventListener('click', () => {
    faqOpen = faqOpen === i ? -1 : i;
    $$('#faq .qa').forEach((q,j) => { q.classList.toggle('open', j === faqOpen); q.querySelector('button').setAttribute('aria-expanded', j === faqOpen); });
  }));
}

/* --- R del footer --- */
const rPaths = $$('#rmark .sq, #rmark .r');
rPaths.forEach(p => { const l = p.getTotalLength(); p.style.strokeDasharray = l; p.dataset.l = l; });
function updR(){
  const p = reduced ? 1 : pr($('#rmark'), 1.0, .72);
  rPaths.forEach((el,i) => { const k = clamp(i === 0 ? p/.6 : (p-.35)/.6); el.style.strokeDashoffset = el.dataset.l*(1-k); });
  $('#rmark').classList.toggle('done', p >= 1);
}

/* ============ SCROLL LOOP ============ */
let ticking = false, targetLen = 0;
function onScroll(force){
  if(ticking && !force) return; ticking = true;
  requestAnimationFrame(frame);
}
function frame(){
  ticking = false;
  const mainTop = main.getBoundingClientRect().top;
  const y = -mainTop + innerHeight*0.62;
  targetLen = reduced ? total : lenAtY(y);
  // si la página llegó al final, completa la línea hasta la R
  if(innerHeight + scrollY >= document.documentElement.scrollHeight - 4) targetLen = total;
  headLen += (targetLen - headLen) * (reduced ? 1 : .35);
  if(Math.abs(targetLen - headLen) < .5) headLen = targetLen;
  live.style.strokeDashoffset = total - headLen;
  const hp = live.getPointAtLength(headLen);
  head.setAttribute('cx', hp.x); head.setAttribute('cy', hp.y); halo.setAttribute('cx', hp.x); halo.setAttribute('cy', hp.y);
  const vis = headLen > 2 || scrollY < 40;
  head.style.opacity = halo.style.opacity = vis ? 1 : 0;
  updDesign(); updSoft(); updHost(); updIa(); updSteps(); updR();
  if(Math.abs(targetLen - headLen) > .5){ ticking = true; requestAnimationFrame(frame); }
}
addEventListener('scroll', () => onScroll(), {passive:true});
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { initNet(); placeSel(); buildSpine(); }, 120); });

/* ============ HERO (WebGL) ============ */
function heroGL(){
  const c = $('#hero-gl'), gl = c.getContext('webgl', {premultipliedAlpha:false, antialias:false});
  if(!gl) return;
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
  float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
  void main(){
    vec2 uv=gl_FragCoord.xy/r; float as=r.x/r.y; vec2 p=vec2(uv.x*as,uv.y); vec2 mm=vec2(m.x*as,m.y);
    float dm=distance(p,mm); p+=(p-mm)*.12*exp(-dm*3.5);
    float q=fb(p*1.5+vec2(t*.035,-t*.025)); float q2=fb(p*2.3+q*1.6-vec2(t*.02,0.));
    vec3 bg=vec3(.035,.035,.047);
    float b1=smoothstep(.85,0.,distance(p,vec2(.12*as+.05*sin(t*.2),.28+.05*cos(t*.17))));
    float b2=smoothstep(.9,0.,distance(p,vec2(.9*as+.05*cos(t*.15),.92+.04*sin(t*.21))));
    float k=mix(.28,1.,clamp((as-.4)/.8,0.,1.));
    vec3 col=bg+(vec3(.18,.36,1.)*b1*(.25+.55*q2)+vec3(.88,.11,1.)*b2*(.25+.55*q2))*k;
    col+=vec3(.6,.19,1.)*pow(q2,3.)*.22*k;
    col+=vec3(.55,.2,1.)*.16*exp(-dm*5.);
    float lines=smoothstep(.015,0.,abs(fract(q*9.)-.5)-.47)*.05; col+=vec3(.6,.4,1.)*lines*(b1+b2+.3)*k;
    col=mix(bg,col,smoothstep(0.,.35,uv.y));
    col+=(h(gl_FragCoord.xy+t)-.5)*.025;
    gl_FragColor=vec4(col,1.);
  }`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pg = gl.createProgram(); gl.attachShader(pg, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pg, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pg); gl.useProgram(pg);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pg,'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const uR = gl.getUniformLocation(pg,'r'), uT = gl.getUniformLocation(pg,'t'), uM = gl.getUniformLocation(pg,'m');
  let mx = .5, my = .6, tx = .5, ty = .6, on = true;
  if(isTouch){ mx = tx = -5; my = ty = -5; }
  const hero = $('#hero');
  hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); tx = (e.clientX - r.left)/r.width; ty = 1 - (e.clientY - r.top)/r.height; });
  new IntersectionObserver(es => { const was = on; on = es[0].isIntersecting; if(on && !was) requestAnimationFrame(loop); }).observe(hero);
  function size(){ const s = isTouch ? .6 : .75; c.width = c.clientWidth*s; c.height = c.clientHeight*s; gl.viewport(0,0,c.width,c.height); }
  size(); addEventListener('resize', size);
  const t0 = performance.now();
  function loop(now){
    if(!on) return;
    mx += (tx-mx)*.05; my += (ty-my)*.05;
    gl.uniform2f(uR, c.width, c.height); gl.uniform1f(uT, reduced ? 10 : (now - t0)/1000); gl.uniform2f(uM, mx, my);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if(!reduced) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* pestañas magnéticas → bajan siguiendo la señal */
$$('#tabs .tab').forEach(tb => {
  if(!isTouch && !reduced){
    tb.addEventListener('pointermove', e => { const r = tb.getBoundingClientRect(); tb.style.transform = `translate(${((e.clientX - r.left)/r.width - .5)*10}px, ${((e.clientY - r.top)/r.height - .5)*8}px)`; });
    tb.addEventListener('pointerleave', () => { tb.style.transform = ''; });
  }
  tb.addEventListener('click', () => { const s = document.getElementById(tb.dataset.go); scrollTo({top: s.getBoundingClientRect().top + scrollY - 40, behavior: reduced ? 'auto' : 'smooth'}); });
});

/* ============ ARRANQUE ============ */
statsIO = new IntersectionObserver(es => es.forEach(e => {
  if(!e.isIntersecting || counted.has(e.target)) return; counted.add(e.target);
  const b = e.target, to = parseFloat(b.dataset.count); if(isNaN(to)) return;
  const from = parseFloat(b.dataset.from||0), pre = b.dataset.prefix||'';
  const suf = () => b.dataset.suffix === ' seg' ? tr('i.sec') : (b.dataset.suffix||'');
  const t0 = performance.now(), dur = reduced ? 1 : 1600;
  (function step(now){ const k = clamp((now - t0)/dur), e2 = 1 - Math.pow(1-k,3); b.textContent = pre + Math.round(from + (to-from)*e2) + suf(); if(k < 1) requestAnimationFrame(step); })(t0);
}), {threshold:.6});
$$('#stats b[data-count]').forEach(b => statsIO.observe(b));

applyLang();
initNet(); placeSel(); heroGL();
const ready = document.fonts ? document.fonts.ready : Promise.resolve();
ready.then(() => { placeSel(); buildSpine(); });
new ResizeObserver(() => { clearTimeout(rz); rz = setTimeout(() => { placeSel(); buildSpine(); }, 150); }).observe(main);
})();
