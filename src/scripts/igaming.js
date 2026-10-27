import RD from './rd.js';
import { T } from '../i18n/igaming.js';
import { route } from '../i18n/routes.js';

(function(){
"use strict";
const {$, $$, clamp, pr, reduced, isTouch, tr} = RD;
RD.addText(T);

/* ======= MONEDAS (dibujadas en canvas) ======= */
const COINS = {
  btc:{c:'#f7931a', d:'#b86a0c', s:'BTC', draw:(g,r)=>{ g.font=`800 ${r*1.15}px Geist, Arial, sans-serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#fff'; g.fillText('₿',0,r*.06); }},
  usdt:{c:'#26a17b', d:'#187052', s:'USDT', draw:(g,r)=>{ g.fillStyle='#fff'; g.fillRect(-r*.5,-r*.5,r,r*.2); g.fillRect(-r*.11,-r*.5,r*.22,r*1.02); g.strokeStyle='#fff'; g.lineWidth=r*.1; g.beginPath(); g.ellipse(0,-r*.05,r*.55,r*.16,0,0,7); g.stroke(); }},
  eth:{c:'#627eea', d:'#3c55b4', s:'ETH', draw:(g,r)=>{ g.fillStyle='#fff'; g.beginPath(); g.moveTo(0,-r*.7); g.lineTo(r*.42,r*.02); g.lineTo(0,r*.25); g.lineTo(-r*.42,r*.02); g.closePath(); g.fill(); g.globalAlpha=.75; g.beginPath(); g.moveTo(-r*.42,r*.14); g.lineTo(0,r*.38); g.lineTo(r*.42,r*.14); g.lineTo(0,r*.72); g.closePath(); g.fill(); g.globalAlpha=1; }},
  trx:{c:'#eb0029', d:'#a3001c', s:'TRX', draw:(g,r)=>{ g.strokeStyle='#fff'; g.lineWidth=r*.09; g.lineJoin='round'; g.beginPath(); g.moveTo(-r*.5,-r*.42); g.lineTo(r*.55,-r*.18); g.lineTo(-r*.05,r*.55); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(-r*.5,-r*.42); g.lineTo(-r*.05,r*.55); g.moveTo(r*.55,-r*.18); g.lineTo(-r*.12,-r*.05); g.stroke(); }},
  ada:{c:'#0033ad', d:'#00227a', s:'ADA', draw:(g,r)=>{ g.fillStyle='#fff'; for(let k=0;k<6;k++){ const a=k/6*Math.PI*2; g.beginPath(); g.arc(Math.cos(a)*r*.45,Math.sin(a)*r*.45,r*.11,0,7); g.fill(); } for(let k=0;k<6;k++){ const a=k/6*Math.PI*2+Math.PI/6; g.beginPath(); g.arc(Math.cos(a)*r*.72,Math.sin(a)*r*.72,r*.06,0,7); g.fill(); } g.beginPath(); g.arc(0,0,r*.16,0,7); g.fill(); }},
  usdc:{c:'#2775ca', d:'#1a5394', s:'USDC', draw:(g,r)=>{ g.strokeStyle='#fff'; g.lineWidth=r*.09; g.beginPath(); g.arc(0,0,r*.62,Math.PI*.62,Math.PI*1.38); g.stroke(); g.beginPath(); g.arc(0,0,r*.62,-Math.PI*.38,Math.PI*.38); g.stroke(); g.font=`800 ${r*.85}px Geist, Arial, sans-serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#fff'; g.fillText('$',0,r*.05); }}
};
const KINDS = Object.keys(COINS);
const SPR = {};
function makeSprites(){
  KINDS.forEach(k => { const s = 128, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d'); g.translate(s/2,s/2); const r = s/2 - 4, co = COINS[k];
    g.beginPath(); g.arc(0,0,r,0,7); g.fillStyle = co.d; g.fill();
    g.beginPath(); g.arc(0,0,r*.9,0,7); g.fillStyle = co.c; g.fill();
    const sh = g.createLinearGradient(-r,-r,r,r); sh.addColorStop(0,'rgba(255,255,255,.35)'); sh.addColorStop(.5,'rgba(255,255,255,0)'); g.fillStyle = sh; g.beginPath(); g.arc(0,0,r*.9,0,7); g.fill();
    co.draw(g, r*.9); SPR[k] = c; });
}

/* ======= HERO: órbita de monedas alrededor de la ficha RD ======= */
function orbit(){
  const cv = $('#orbit'), g = cv.getContext('2d'); let W, H, on = true, last = 0, t = 0, mx = 0, my = 0, tmx = 0, tmy = 0;
  const coins = []; KINDS.forEach((k,i) => { coins.push({k, a:i/6*Math.PI*2, ring:0, spin:Math.random()*6}); coins.push({k, a:i/6*Math.PI*2 + .5, ring:1, spin:Math.random()*6}); });
  function size(){ const dpr = Math.min(devicePixelRatio||1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W*dpr; cv.height = H*dpr; g.setTransform(dpr,0,0,dpr,0,0); }
  function chip(cx, cy, r){
    g.save(); g.translate(cx, cy); g.rotate(t*.25);
    const gl = g.createRadialGradient(0,0,r*.2,0,0,r*1.8); gl.addColorStop(0,'rgba(155,48,255,.55)'); gl.addColorStop(1,'rgba(155,48,255,0)'); g.fillStyle = gl; g.beginPath(); g.arc(0,0,r*1.8,0,7); g.fill();
    g.beginPath(); g.arc(0,0,r,0,7); g.fillStyle = '#1b0f33'; g.fill();
    for(let i=0;i<12;i++){ g.beginPath(); g.arc(0,0,r*.92,i/12*Math.PI*2,i/12*Math.PI*2 + .26); g.lineWidth = r*.14; g.strokeStyle = i%2 ? '#e21cff' : '#ffffff'; g.stroke(); }
    g.beginPath(); g.arc(0,0,r*.72,0,7); const ig = g.createLinearGradient(-r,-r,r,r); ig.addColorStop(0,'#2f5bff'); ig.addColorStop(.55,'#9b30ff'); ig.addColorStop(1,'#e21cff'); g.fillStyle = ig; g.fill();
    g.setLineDash([4,5]); g.beginPath(); g.arc(0,0,r*.62,0,7); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.5)'; g.stroke(); g.setLineDash([]);
    g.rotate(-t*.25); g.font = `800 ${r*.7}px Geist, Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('R', 0, r*.04);
    g.restore();
  }
  function draw(now){
    if(!on) return;
    const dt = Math.min(.05, (now - last)/1000 || .016); last = now; if(!reduced) t += dt;
    mx += (tmx - mx)*.05; my += (tmy - my)*.05;
    g.clearRect(0,0,W,H);
    const cx = W/2 + mx*14, cy = H/2 + my*10, R0 = Math.min(W,H)*.36, tilt = .32 + my*.08;
    const items = coins.map(c => { const rr = R0*(c.ring ? 1.18 : .82), a = c.a + t*(c.ring ? .32 : -.45); const z = Math.sin(a);
      return {c, x: cx + Math.cos(a)*rr, y: cy + z*rr*tilt + (c.ring ? -14 : 14), z}; });
    const draw1 = it => { const s = (Math.min(W,H)*.085)*(.7 + (it.z+1)*.3), sx = Math.max(.12, Math.abs(Math.cos(t*1.6 + it.c.spin)));
      g.save(); g.globalAlpha = .45 + (it.z+1)*.27; g.translate(it.x, it.y); g.scale(sx,1); g.drawImage(SPR[it.c.k], -s/2, -s/2, s, s); g.restore(); };
    items.filter(i => i.z < 0).sort((a,b) => a.z-b.z).forEach(draw1);
    chip(cx, cy, Math.min(W,H)*.16);
    items.filter(i => i.z >= 0).sort((a,b) => a.z-b.z).forEach(draw1);
    if(!vaultReady){ vaultReady = true; $('#vault').classList.add('ready'); }
    if(!reduced) requestAnimationFrame(draw);
  }
  let vaultReady = false;
  size(); addEventListener('resize', size);
  if(!isTouch) $('.ghero').addEventListener('pointermove', e => { tmx = e.clientX/innerWidth*2 - 1; tmy = e.clientY/innerHeight*2 - 1; });
  new IntersectionObserver(es => { const was = on; on = es[0].isIntersecting; if(on && !was){ last = performance.now(); requestAnimationFrame(draw); } }).observe(cv);
  requestAnimationFrame(draw);
}
/* feed en vivo del hero */
const FEED = [['btc','0.25 BTC'],['usdt','1,500 USDT'],['visa','$250 · Visa'],['eth','0.8 ETH'],['trx','12,000 TRX'],['usdc','900 USDC'],['ada','3,400 ADA']];
const DEPW = [' depositado',' deposited',' depositato'];
function heroLive(){
  let jp = 152480, i = 0;
  const jpEl = $('#jp'), feed = $('#feed');
  const showFeed = () => { const [k, amt] = FEED[i % FEED.length]; feed.classList.add('swap');
    setTimeout(() => { feed.innerHTML = (k === 'visa' ? '💳 ' : '') + `<b>${amt}</b>${DEPW[RD.L]}`; feed.classList.remove('swap'); }, 250); i++; };
  showFeed();
  if(reduced) return;
  setInterval(() => { jp += Math.round(Math.random()*37 + 3); jpEl.textContent = '$' + jp.toLocaleString('en-US'); }, 140);
  setInterval(showFeed, 2200);
}
/* cinta de precios (valores de ejemplo, con variación simulada) */
const TICK = [['btc','BTC',67420],['eth','ETH',3512],['usdt','USDT',1.00],['trx','TRX',0.162],['ada','ADA',0.452],['usdc','USDC',1.00]];
function ticker(){
  const box = $('#ticker');
  const cell = ([k, s, p]) => `<span class="tk"><img alt="" src="${SPR[k].toDataURL()}"><span>${s}</span><b data-p="${p}">${fmtP(p)}</b><em>+0.00%</em></span>`;
  box.innerHTML = TICK.map(cell).join('') + TICK.map(cell).join('');
  if(reduced) return;
  setInterval(() => { $$('#ticker .tk').forEach((t,i) => { if(Math.random() < .5) return; const b = t.querySelector('b'), base = +b.dataset.p, stable = TICK[i % TICK.length][1].startsWith('USD');
    const ch = stable ? (Math.random()-.5)*.02 : (Math.random()-.48)*2.4; const v = base*(1 + ch/100);
    b.textContent = fmtP(v); const em = t.querySelector('em'); em.textContent = (ch >= 0 ? '+' : '') + ch.toFixed(2) + '%'; em.className = ch >= 0 ? 'up' : 'dn'; }); }, 1800);
}
function fmtP(v){ return '$' + (v >= 100 ? v.toLocaleString('en-US',{maximumFractionDigits:0}) : v.toFixed(v < 1 ? 3 : 2)); }

/* ======= CIFRAS: rodillos de tragamonedas ======= */
function reels(){
  $$('[data-reel]').forEach(el => {
    const txt = el.dataset.reel; el.innerHTML = '';
    [...txt].forEach(ch => {
      if(/\d/.test(ch)){ const r = document.createElement('span'); r.className = 'reel'; const strip = document.createElement('i');
        for(let k=0;k<3;k++) for(let d=0; d<10; d++){ const b = document.createElement('b'); b.textContent = d; strip.appendChild(b); }
        r.dataset.d = ch; r.appendChild(strip); el.appendChild(r); }
      else el.appendChild(document.createTextNode(ch === ' ' ? '\u00a0' : ch));
    });
  });
  RD.onEnter('#stats .val', el => {
    Array.from(el.querySelectorAll('.reel')).forEach((r, i) => { const strip = r.firstChild, target = 20 + (+r.dataset.d);
      strip.style.transition = reduced ? 'none' : `transform ${1.4 + i*.28}s cubic-bezier(.2,.9,.25,1.04)`;
      requestAnimationFrame(() => { strip.style.transform = `translateY(-${target}em)`; }); });
  }, {threshold:.6});
}

/* ======= MOTOR RD: los módulos encajan en el núcleo ======= */
const MODS = [['Pasarela cripto','Crypto gateway','Gateway crypto'],['Visa & tarjetas','Visa & cards','Visa & carte'],['KYC / AML','KYC / AML','KYC / AML'],['Motor de apuestas','Betting engine','Motore scommesse'],['Antifraude','Anti-fraud','Antifrode'],['Hosting 24/7','24/7 hosting','Hosting 24/7'],['Licencias','Licensing','Licenze'],['Backoffice','Back office','Backoffice']];
function renderEngine(){
  const eng = $('#engine'); eng.querySelectorAll('.mod').forEach(m => m.remove());
  const R = 41;
  MODS.forEach((m,i) => { const a = i/MODS.length*Math.PI*2 - Math.PI/2, el = document.createElement('div');
    el.className = 'mod'; el.innerHTML = `<i></i>${m[RD.L]}`;
    el.style.setProperty('--tx', (Math.cos(a)*R) + '%'); el.style.setProperty('--ty', (Math.sin(a)*R) + '%');
    el.style.setProperty('--fx', (Math.cos(a)*90) + '%'); el.style.setProperty('--fy', (Math.sin(a)*90) + '%');
    el.dataset.a = a; eng.appendChild(el); });
  sizeEngine();
}
function sizeEngine(){
  const eng = $('#engine'), w = eng.clientWidth, R = w*.39;
  const svg = $('#eng-lines'); svg.setAttribute('viewBox', `0 0 ${w} ${w}`);
  svg.innerHTML = $$('#engine .mod').map(m => { const a = +m.dataset.a; return `<line x1="${w/2}" y1="${w/2}" x2="${w/2 + Math.cos(a)*R}" y2="${w/2 + Math.sin(a)*R}"/>`; }).join('');
  $$('#engine .mod').forEach(m => { const a = +m.dataset.a; m.style.setProperty('--tx', (Math.cos(a)*R) + 'px'); m.style.setProperty('--ty', (Math.sin(a)*R) + 'px'); m.style.setProperty('--fx', (Math.cos(a)*w*.9) + 'px'); m.style.setProperty('--fy', (Math.sin(a)*w*.9) + 'px'); });
  updEngine();
}
function updEngine(){
  const eng = $('#engine'), p = reduced ? 1 : pr(eng, .9, .25), mods = $$('#engine .mod'), lines = $$('#eng-lines line');
  let n = 0; mods.forEach((m,i) => { const on = p > .06 + i*.1; m.classList.toggle('in', on); if(lines[i]) lines[i].classList.toggle('on', on); if(on) n++; });
  const full = n === mods.length; eng.classList.toggle('full', full); $('#core-st').textContent = tr(full ? 'm.core1' : 'm.core0');
}

/* ======= PLATAFORMA: 4 pantallas ======= */
const GAMES = [['Neon Fruits','Pragmatic','96.5%','HOT',['#ff3df5','#5a1170'],'M7 17c0-4 2-7 5-9M12 8c2-2 5-2 6 0-2 1-4 1-6 0zM8 21a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM16 21a4 4 0 1 1 0-8 4 4 0 0 1 0 8z'],
 ['Thunder Gates','Pragmatic','96.2%','TOP',['#7b95ff','#1d2a6b'],'M13 2L4 14h7l-1 8 9-12h-7z'],
 ['Lightning Wheel','Evolution','LIVE','EN VIVO',['#3ee08a','#0f3b28'],'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 3'],
 ['Sky Rocket','Spribe','97%','CRASH',['#ff9f1a','#4a1d05'],'M5 19c3-1 5-3 6-6l6-6 2 2-6 6c-3 1-5 3-6 6zM15 5l4 4']];
const PLAYERS = ['luc***21','ana***07','mrk***88','sol***14','dav***03','kai***56'];
function views(){
  const L = RD.L;
  const T = ['p.t1','p.t2','p.t3','p.t4'];
  $('#ptabs').innerHTML = T.map((k,i) => `<button type="button" role="tab" data-v="${i}" aria-pressed="${i===curView}">${tr(k)}</button>`).join('');
  $$('#ptabs button').forEach(b => b.addEventListener('click', () => setView(+b.dataset.v)));
  const tx = {
    lobby:['Lobby','Lobby','Lobby'], tour:['Torneo semanal en vivo','Live weekly tournament','Torneo settimanale live'], pool:['Bolsa de premios','Prize pool','Montepremi'],
    tourd:['Compite en slots y mesas en vivo con cashback diario del 12%.','Compete on slots and live tables with 12% daily cashback.','Gareggia su slot e tavoli live con cashback giornaliero del 12%.'], join:['Participar ahora','Join now','Partecipa ora'],
    all:['Todos','All','Tutti'], dep:['Depositar','Deposit','Deposita'], won:['ganó','won','ha vinto'], quick:['Apuesta rápida 1-click','1-click quick bet','Scommessa rapida 1 clic'],
    place:['Colocar $50 USDT','Place $50 USDT','Punta $50 USDT'], wheel:['Rueda en vivo','Live wheel','Ruota live'], tourn:['Torneos','Tournaments','Tornei'], online:['jugando','playing','in gioco'],
    ggr:['GGR hoy','GGR today','GGR oggi'], act:['Jugadores activos','Active players','Giocatori attivi'], deps:['Depósitos hoy','Deposits today','Depositi oggi'], ret:['Retención 30d','30-day retention','Retention 30g'],
    last:['Últimos movimientos','Latest activity','Ultimi movimenti'], dmeth:['Métodos de depósito','Deposit methods','Metodi di deposito'], tx:['Depósito en curso','Deposit in progress','Deposito in corso'],
    s1:['Pago detectado en la red','Payment detected on-chain','Pagamento rilevato on-chain'], s2:['2/2 confirmaciones','2/2 confirmations','2/2 conferme'], s3:['Saldo acreditado al jugador','Balance credited to player','Saldo accreditato al giocatore'],
    link:['Tu enlace de afiliado','Your affiliate link','Il tuo link affiliato'], clicks:['Clics','Clicks','Clic'], regs:['Registros','Sign-ups','Registrazioni'], ftd:['Primer depósito','First deposit','Primo deposito'], com:['Comisión del mes','Commission this month','Commissione del mese'], top:['Top afiliados','Top affiliates','Top affiliati'], card:['Tarjeta','Card','Carta']
  };
  const t = k => tx[k][L];
  const coinImg = k => `<img alt="" src="${SPR[k].toDataURL()}">`;
  $('#views').innerHTML = `
  <div class="view" data-i="0">
    <div class="screen"><div class="sbar"><span class="brand"><i>R</i>REVO CASINO</span><nav><span>${t('lobby').toUpperCase()}</span><span>SLOTS</span><span>LIVE</span><span>SPORTS</span><span>VIP</span></nav><span class="bal"><b id="bal">6,050.50 USDT</b><em>${t('dep')}</em></span></div>
      <div class="sbody">
        <div class="banner"><div><small>● ${t('tour')}</small><b>${t('pool')} <span class="gold-text led" id="pool">$150,000</span> USDT</b><p>${t('tourd')}</p></div><span class="btnw">${t('join')}</span></div>
        <div class="cats"><span>${t('all')} (5,120)</span><span>Pragmatic</span><span>Evolution</span><span>Spribe</span><span>Hacksaw</span></div>
        <div class="games">${GAMES.map(g => `<div class="game"><div class="art" style="background:linear-gradient(140deg,${g[4][0]},${g[4][1]})"><span class="rtp">RTP ${g[2]}</span><span class="tag">${g[3]}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${g[5]}"/></svg></div><div class="nm">${g[0]}<em>${g[1]}</em></div></div>`).join('')}</div>
        <div class="wins"><span class="lv"></span><span id="win"></span></div>
      </div></div>
    <div class="phone"><div class="in"><div class="top">RevoBet <em id="online">1,284 ${t('online')}</em></div>
      <div class="bet"><small>${t('quick')}</small><b>Atlético Norte vs Dínamo Sur</b><div class="od" id="od"><span>1.84</span><span>3.40</span><span>4.15</span></div><div class="place">${t('place')}</div></div>
      <div class="mini"><span>🎡 ${t('wheel')}<small>x25 bonus</small></span><span>🏆 ${t('tourn')}<small>$150K</small></span></div></div></div>
  </div>
  <div class="view single" data-i="1">
    <div class="screen"><div class="sbar"><span class="brand"><i>R</i>Backoffice</span><span class="bal"><b>Live · UTC-5</b></span></div>
      <div class="sbody">
        <div class="kp"><div><small>${t('ggr')}</small><b id="ggr">$84,210</b><em>▲ 12.4%</em></div><div><small>${t('act')}</small><b id="act">3,482</b><em>▲ 6.1%</em></div><div><small>${t('deps')}</small><b id="deps">1,129</b><em>▲ 9.8%</em></div><div><small>${t('ret')}</small><b>41%</b><em>▲ 2.3%</em></div></div>
        <div class="pgrid"><div class="bars" id="pbars">${Array.from({length:14}, () => `<i style="height:${30 + Math.random()*60}%"></i>`).join('')}</div>
          <div class="tbl"><b style="color:var(--fg)">${t('last')}</b><div><span>luc***21 · BTC</span><em style="color:var(--green)">+0.12 BTC</em></div><div><span>ana***07 · ${t('card')} Visa</span><em style="color:var(--green)">+$250</em></div><div><span>mrk***88 · USDT</span><em style="color:#ff9cf0">-1,200</em></div><div><span>sol***14 · ETH</span><em style="color:var(--green)">+0.8 ETH</em></div><div><span>kai***56 · TRX</span><em style="color:var(--green)">+12,000</em></div></div></div>
      </div></div>
  </div>
  <div class="view single" data-i="2">
    <div class="screen"><div class="sbar"><span class="brand"><i>R</i>${tr('p.t3')}</span><span class="bal"><b>BTC · ETH · USDT · TRX · ADA · USDC · Visa</b></span></div>
      <div class="sbody"><div class="cash">
        <div class="methods" id="methods">
          ${[['btc','Bitcoin','BTC'],['usdt','Tether','USDT · TRC20'],['eth','Ethereum','ETH'],['trx','TRON','TRX'],['ada','Cardano','ADA'],['usdc','USD Coin','USDC']].map(m => `<div class="method">${coinImg(m[0])}<b>${m[1]}</b><small>${m[2]}</small></div>`).join('')}
          <div class="method"><span class="vc"></span><b>Visa</b><small>${t('card')}</small></div>
        </div>
        <div class="txflow"><h4>${t('tx')}</h4>
          <div class="txstep" data-s="0"><i>✓</i>${t('s1')}</div><div class="txstep" data-s="1"><i>✓</i>${t('s2')}</div><div class="txstep" data-s="2"><i>✓</i>${t('s3')}</div>
          <div class="txamt"><b id="txamt">0.25 BTC</b><span id="txt">≈ $16,855</span></div></div>
      </div></div></div>
  </div>
  <div class="view single" data-i="3">
    <div class="screen"><div class="sbar"><span class="brand"><i>R</i>${tr('p.t4')}</span><span class="bal"><b>RevShare 35% · CPA $120</b></span></div>
      <div class="sbody"><div class="aff">
        <div class="alink">${t('link')}: <b>revocasino.com/?ref=STREAMER21</b><span>📋</span></div>
        <div class="txflow"><div class="funnel" id="funnel">
          <div><span>${t('clicks')}</span><span class="b" style="width:100%"></span><b id="f0">48,920</b></div>
          <div><span>${t('regs')}</span><span class="b" style="width:42%"></span><b id="f1">6,214</b></div>
          <div><span>${t('ftd')}</span><span class="b" style="width:18%"></span><b id="f2">1,903</b></div></div>
          <div class="txamt"><span style="color:var(--muted)">${t('com')}</span><b class="gold-text" id="com">$18,420</b></div></div>
        <div class="tbl"><b style="color:var(--fg)">${t('top')}</b><div><span>STREAMER21</span><b>$18,420</b></div><div><span>BETGURU</span><b>$11,980</b></div><div><span>CRYPTOKINGS</span><b>$9,310</b></div><div><span>LATAMWIN</span><b>$6,775</b></div></div>
      </div></div></div>
  </div>`;
  setView(curView, true);
}
let curView = 0, platOn = false;
function setView(i){ curView = i; $$('#ptabs button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.v === i)); $$('#views .view').forEach(v => v.classList.toggle('on', +v.dataset.i === i)); if(i === 2) runTx(); }
let txTimers = [];
function runTx(){
  txTimers.forEach(clearTimeout); txTimers = [];
  const steps = $$('.txstep'); steps.forEach(s => s.classList.remove('on'));
  const ms = $$('#methods .method'); ms.forEach(m => m.classList.remove('on'));
  const pick = [['0.25 BTC','≈ $16,855',0],['1,500 USDT','≈ $1,500',1],['$250','Visa',6],['0.8 ETH','≈ $2,810',2]][Math.random()*4|0];
  if(ms[pick[2]]) ms[pick[2]].classList.add('on');
  $('#txamt').textContent = pick[0]; $('#txt').textContent = pick[1];
  steps.forEach((s,k) => txTimers.push(setTimeout(() => s.classList.add('on'), reduced ? 0 : 500 + k*800)));
  if(!reduced) txTimers.push(setTimeout(() => { if(curView === 2 && platOn) runTx(); }, 4600));
}
function platLive(){
  let pool = 150000, k = 0;
  setInterval(() => {
    if(!platOn || reduced) return; k++;
    if(curView === 0){
      pool += Math.round(Math.random()*24); const pe = $('#pool'); if(pe) pe.textContent = '$' + pool.toLocaleString('en-US');
      if(k % 14 === 0){ const g = GAMES[Math.random()*4|0], amt = (Math.random()*4800 + 120).toFixed(0), w = $('#win'); if(w) w.innerHTML = `${PLAYERS[Math.random()*6|0]} ${ {0:'ganó',1:'won',2:'ha vinto'}[RD.L] } <b>${(+amt).toLocaleString('en-US')} USDT</b> · ${g[0]}`; }
      if(k % 10 === 0){ const od = $$('#od span'), c = od[Math.random()*3|0], v = +c.textContent, nv = Math.max(1.05, v + (Math.random()<.5?-1:1)*(.04 + Math.random()*.18)); c.className = nv > v ? 'up' : 'dn'; c.textContent = nv.toFixed(2); setTimeout(() => { c.className = ''; }, 700); }
    }
    if(curView === 1 && k % 4 === 0){ const g = $('#ggr'); g.textContent = '$' + (parseInt(g.textContent.replace(/\D/g,'')) + Math.round(Math.random()*60)).toLocaleString('en-US');
      const a = $('#act'); a.textContent = (parseInt(a.textContent.replace(/\D/g,'')) + Math.round((Math.random()-.4)*12)).toLocaleString('en-US');
      const bars = $$('#pbars i'); const last = bars[bars.length-1]; last.style.height = clamp(parseFloat(last.style.height) + (Math.random()-.4)*8, 20, 98) + '%'; }
    if(curView === 3 && k % 8 === 0){ const c = $('#com'); c.textContent = '$' + (parseInt(c.textContent.replace(/\D/g,'')) + Math.round(Math.random()*40)).toLocaleString('en-US'); const f = $('#f0'); f.textContent = (parseInt(f.textContent.replace(/\D/g,'')) + Math.round(Math.random()*9)).toLocaleString('en-US'); }
  }, 120);
}

/* ======= OPERADORES ======= */
const OPS = [
 {k:['Crypto casino internacional','International crypto casino','Casinò crypto internazionale'], when:['Lanzado en 3 semanas','Launched in 3 weeks','Lanciato in 3 settimane'], n:'Area51 Casino',
  d:['Migró desde una solución heredada con caídas frecuentes de catálogo. Implementó nuestro agregador unificado y pasarela multi-token en tiempo récord.','Moved off a legacy setup with frequent catalogue outages, onto our unified aggregator and multi-token gateway in record time.','Ha lasciato una soluzione legacy con frequenti cadute del catalogo, passando al nostro aggregatore e gateway multi-token in tempi record.'],
  m:[[['Volumen mensual','Monthly volume','Volume mensile'],2.4,'+$','M USD',1],[['Usuarios activos','Active users','Utenti attivi'],18500,'','+',0]]},
 {k:['Sportsbook híbrido LatAm','Hybrid LatAm sportsbook','Sportsbook ibrido LatAm'], when:['Copa América & Champions','Copa América & Champions','Copa América & Champions'], n:'Bitsky Sportsbook',
  d:['Plataforma deportiva enfocada en apuestas rápidas con PIX y USDT. Soportó picos masivos de tráfico concurrente sin un solo segundo de degradación.','Sports platform built for fast bets with PIX and USDT. It handled massive concurrent traffic peaks without a second of slowdown.','Piattaforma sportiva per scommesse rapide con PIX e USDT. Ha retto enormi picchi di traffico senza un secondo di rallentamento.'],
  m:[[['Uptime en finales','Uptime in finals','Uptime nelle finali'],99.98,'','%',2],[['Incidentes graves','Major incidents','Incidenti gravi'],0,'','',0,[' casos',' cases',' casi']]]}
];
const SEECASE = ['Ver caso de estudio completo →','View full case study →','Vedi il caso completo →'];
function renderOps(){
  const L = RD.L;
  $('#ops').innerHTML = OPS.map(o => `<div class="op"><div class="top"><span class="mono">${o.k[L]}</span><span>${o.when[L]}</span></div><h3>${o.n}</h3><p>${o.d[L]}</p>
    <div class="om">${o.m.map(m => `<div><small>${m[0][L]}</small><b class="${m[4] === 2 ? '' : ''}" style="color:${m[1] === 0 ? 'var(--fg)' : (m[3] === '%' ? 'var(--green)' : '#ff9cf0')}" data-to="${m[1]}" data-pre="${m[2]}" data-suf="${m[3]}${m[5] ? m[5][L] : ''}" data-dec="${m[4]}">${m[2]}${m[1]}${m[3]}${m[5] ? m[5][L] : ''}</b></div>`).join('')}</div>
    <a href="${route('casos')}">${SEECASE[L]}</a></div>`).join('');
  RD.onEnter('#ops .om b', b => RD.countUp(b, +b.dataset.to, {pre:b.dataset.pre, suf:b.dataset.suf, dec:+b.dataset.dec, fmt: v => (+b.dataset.dec ? v.toFixed(+b.dataset.dec) : Math.round(v).toLocaleString('en-US'))}), {threshold:.6});
  if(!isTouch && !reduced) $$('#ops .op').forEach(op => {
    op.addEventListener('pointermove', e => { const r = op.getBoundingClientRect(), x = (e.clientX - r.left)/r.width, y = (e.clientY - r.top)/r.height;
      op.style.setProperty('--ry', ((x-.5)*8).toFixed(2)+'deg'); op.style.setProperty('--rx', ((.5-y)*6).toFixed(2)+'deg'); op.style.setProperty('--mx', (x*100).toFixed(1)+'%'); });
    op.addEventListener('pointerleave', () => { op.style.setProperty('--rx','0deg'); op.style.setProperty('--ry','0deg'); });
  });
}
function coinRain(){
  const cv = $('#coins'), g = cv.getContext('2d'), sec = cv.parentElement; let W, H, coins = [], on = false, last = 0;
  const spawn = init => { const z = Math.random(); return {k: KINDS[Math.random()*KINDS.length|0], x: Math.random()*W, y: init ? Math.random()*H : -60, z, r: 12 + z*22, vy: 35 + z*70, sw: Math.random()*6, ss: .6 + Math.random(), sp: Math.random()*6, vs: 1.5 + Math.random()*3}; };
  function size(){ const dpr = Math.min(devicePixelRatio||1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W*dpr; cv.height = H*dpr; g.setTransform(dpr,0,0,dpr,0,0); coins = Array.from({length: Math.round(clamp(W/42, 10, 32))}, () => spawn(true)); }
  function draw(now){ if(!on) return; const dt = Math.min(.05, (now - last)/1000 || .016); last = now; g.clearRect(0,0,W,H);
    coins.sort((a,b) => a.z - b.z).forEach(c => { if(!reduced){ c.y += c.vy*dt; c.sw += dt*c.ss; c.sp += dt*c.vs; } if(c.y > H + 60) Object.assign(c, spawn(false));
      g.save(); g.translate(c.x + Math.sin(c.sw)*18, c.y); g.globalAlpha = .3 + c.z*.55; g.scale(Math.max(.08, Math.abs(Math.cos(c.sp))), 1); g.drawImage(SPR[c.k], -c.r, -c.r, c.r*2, c.r*2); g.restore(); });
    if(!reduced) requestAnimationFrame(draw); }
  size(); addEventListener('resize', size);
  new IntersectionObserver(es => { const was = on; on = es[0].isIntersecting; if(on && !was){ last = performance.now(); requestAnimationFrame(draw); } }).observe(sec);
}

/* ======= NIVELES ======= */
const LV = [
 [['Demo personalizada','Tailored demo','Demo personalizzata'],['Analizamos en 30 minutos tu modelo de negocio, mercados objetivo y la selección de juegos que necesitas para tu público.','In 30 minutes we review your business model, target markets and the game mix your audience needs.','In 30 minuti analizziamo modello di business, mercati e selezione di giochi per il tuo pubblico.'],['Día 1: kickoff estratégico','Day 1: strategy kickoff','Giorno 1: kickoff strategico']],
 [['Configuración de marca','Brand setup','Configurazione del brand'],['Personalizamos el lobby, paleta de colores, logos, dominio seguro con SSL propio y plantillas de correo transaccional.','We customise the lobby, colours, logos, secure domain with its own SSL and transactional email templates.','Personalizziamo lobby, colori, loghi, dominio sicuro con SSL e template email transazionali.'],['Semana 1: branding completo','Week 1: full branding','Settimana 1: branding completo']],
 [['Conexión de pagos y juegos','Payments & games','Pagamenti e giochi'],['Habilitamos pasarelas cripto, Visa y pagos locales, configuramos los feeds de cuotas deportivas y cargamos los títulos de casino.','We enable crypto, Visa and local payments, set up sports odds feeds and load the casino titles.','Attiviamo gateway crypto, Visa e pagamenti locali, configuriamo le quote sportive e carichiamo i giochi.'],['Semana 2: integración core','Week 2: core integration','Settimana 2: integrazione core']],
 [['Lanzamiento al mercado','Go to market','Lancio sul mercato'],['Go-live oficial con servidores dedicados, pruebas de estrés bajo carga simulada y monitoreo técnico ininterrumpido 24/7.','Official go-live on dedicated servers, load stress tests and non-stop 24/7 technical monitoring.','Go-live ufficiale su server dedicati, stress test sotto carico e monitoraggio tecnico 24/7.'],['Semana 3: ¡listo para operar!','Week 3: ready to operate!','Settimana 3: pronto per operare!']]
];
function renderLevels(){
  const L = RD.L;
  $('#levels').innerHTML = LV.map((l,i) => `<div class="lvl"><span class="lock">🔒</span><b class="n">0${i+1}</b><h4>${l[0][L]}</h4><p>${l[1][L]}</p><span class="badge2">LVL ${i+1} · ${l[2][L]}</span></div>`).join('');
}
function updLevels(){
  const xp = $('#xp'), p = reduced ? 1 : pr(xp, .85, .3);
  $('#xpfill').style.width = (p*100) + '%';
  $$('#xp .mk').forEach((m,i) => m.classList.toggle('on', p >= .125 + i*.25));
  $$('#levels .lvl').forEach((l,i) => { const on = p >= .125 + i*.25; l.classList.toggle('on', on); l.querySelector('.lock').textContent = on ? '🏆' : '🔒'; });
}

/* ======= RADAR antibots ======= */
function radar(){
  const cv = $('#radar'), g = cv.getContext('2d'); let W, H, on = false, last = 0, t = 0, dots = [], bots = 0, spawnT = 0;
  function size(){ const dpr = Math.min(devicePixelRatio||1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W*dpr; cv.height = H*dpr; g.setTransform(dpr,0,0,dpr,0,0); }
  function draw(now){
    if(!on) return; const dt = Math.min(.05, (now - last)/1000 || .016); last = now; t += dt; spawnT -= dt;
    g.clearRect(0,0,W,H);
    const gx = W*.55;
    g.strokeStyle = 'rgba(255,255,255,.04)'; g.lineWidth = 1; for(let y=20;y<H;y+=28){ g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }
    const sweep = (Math.sin(t*1.4)*.5 + .5)*H;
    const gg = g.createLinearGradient(gx-60,0,gx+60,0); gg.addColorStop(0,'rgba(155,48,255,0)'); gg.addColorStop(.5,'rgba(155,48,255,.18)'); gg.addColorStop(1,'rgba(155,48,255,0)'); g.fillStyle = gg; g.fillRect(gx-60,0,120,H);
    g.strokeStyle = 'rgba(226,28,255,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(gx,0); g.lineTo(gx,H); g.stroke();
    g.fillStyle = 'rgba(226,28,255,.9)'; g.beginPath(); g.arc(gx, sweep, 4, 0, 7); g.fill();
    g.font = '600 10px "Geist Mono", monospace'; g.fillStyle = 'rgba(226,28,255,.9)'; g.fillText('RD SHIELD', gx + 8, 16);
    if(spawnT <= 0 && !reduced){ spawnT = .22 + Math.random()*.3; dots.push({x:-10, y: 24 + Math.random()*(H-70), v: 70 + Math.random()*60, bot: Math.random() < .14, st:0, a:1, ring:0}); }
    dots.forEach(d => {
      if(d.st === 0){ d.x += d.v*dt; if(d.x >= gx - 4){ if(d.bot){ d.st = 2; bots++; $('#bots').textContent = bots; } else d.st = 1; } }
      else if(d.st === 1){ d.x += d.v*dt; }
      else { d.ring += dt*60; d.a -= dt*.6; }
      const col = d.st === 0 ? 'rgba(200,200,220,.7)' : d.st === 1 ? '#3ee08a' : '#ff5b6b';
      g.globalAlpha = Math.max(0, d.a);
      if(d.st === 2){ g.strokeStyle = '#ff5b6b'; g.lineWidth = 1.5; g.beginPath(); g.arc(d.x, d.y, 6 + d.ring*.4, 0, 7); g.stroke(); g.font = '600 9px "Geist Mono", monospace'; g.fillStyle = '#ff5b6b'; g.fillText('BOT', d.x - 30, d.y + 3); }
      g.fillStyle = col; g.beginPath(); g.arc(d.x, d.y, d.st === 2 ? 4 : 3, 0, 7); g.fill(); g.globalAlpha = 1;
    });
    dots = dots.filter(d => d.x < W + 20 && d.a > 0);
    if(!reduced) requestAnimationFrame(draw);
  }
  size(); addEventListener('resize', size);
  new IntersectionObserver(es => { const was = on; on = es[0].isIntersecting; if(on && !was){ last = performance.now(); requestAnimationFrame(draw); } }).observe(cv);
}

/* ======= FAQ ======= */
const FAQ = [
 [['¿Cuáles son los costos de instalación y mantenimiento de la plataforma?','Trabajamos con un pago de implementación y una cuota mensual de operación que incluye hosting, soporte y actualizaciones. En la demo te damos una cotización cerrada según tus mercados y productos.'],['What are the setup and maintenance costs?','We charge a one-off implementation fee and a monthly operating fee that covers hosting, support and updates. In the demo we give you a fixed quote based on your markets and products.'],['Quali sono i costi di installazione e manutenzione?','Prevediamo un costo di implementazione e un canone mensile che include hosting, supporto e aggiornamenti. Nella demo ti diamo un preventivo chiuso in base a mercati e prodotti.']],
 [['¿Cómo funciona el licenciamiento para operar un casino online?','Puedes operar con tu propia licencia o te acompañamos con proveedores de licencia en la jurisdicción que elijas. La plataforma ya incluye los controles técnicos que suelen exigir los reguladores.'],['How does licensing work for an online casino?','You can operate under your own licence, or we connect you with licence providers in the jurisdiction you choose. The platform already includes the technical controls regulators usually require.'],['Come funziona la licenza per un casinò online?','Puoi operare con la tua licenza oppure ti affianchiamo con fornitori di licenze nella giurisdizione scelta. La piattaforma include già i controlli tecnici richiesti di solito dai regolatori.']],
 [['¿Cuánto tiempo tarda realmente el lanzamiento desde el primer día?','Entre 3 y 6 semanas desde la demo, según las integraciones de pago y el nivel de personalización que necesites.'],['How long does launch really take from day one?','Between 3 and 6 weeks from the demo, depending on payment integrations and how much customisation you need.'],['Quanto tempo serve davvero per il lancio?','Tra 3 e 6 settimane dalla demo, in base alle integrazioni di pagamento e al livello di personalizzazione.']],
 [['¿Qué métodos de pago y criptomonedas se pueden integrar?','Cripto: BTC, ETH, USDT, USDC, TRX y ADA. Fiat: tarjetas Visa, transferencias bancarias y pasarelas locales como PIX.'],['Which payment methods and cryptocurrencies can be integrated?','Crypto: BTC, ETH, USDT, USDC, TRX and ADA. Fiat: Visa cards, bank transfers and local gateways such as PIX.'],['Quali metodi di pagamento e criptovalute si possono integrare?','Crypto: BTC, ETH, USDT, USDC, TRX e ADA. Fiat: carte Visa, bonifici e gateway locali come PIX.']]
];
let faqOpen = 0;
function renderFaq(){
  const L = RD.L;
  $('#faq').innerHTML = FAQ.map((q,i) => `<div class="qa${i===faqOpen?' open':''}"><button type="button" aria-expanded="${i===faqOpen}"><span>${q[L][0]}</span><span class="pm" aria-hidden="true"></span></button><div class="ans"><div><p>${q[L][1]}</p></div></div></div>`).join('');
  $$('#faq .qa button').forEach((b,i) => b.addEventListener('click', () => { faqOpen = faqOpen === i ? -1 : i; $$('#faq .qa').forEach((q,j) => { q.classList.toggle('open', j === faqOpen); q.querySelector('button').setAttribute('aria-expanded', j === faqOpen); }); }));
}

/* ======= ARRANQUE ======= */
makeSprites();
new IntersectionObserver(es => { platOn = es[0].isIntersecting; if(platOn && curView === 2) runTx(); }).observe($('#views'));
RD.onLang(() => { RD.splitWords($('#h1'), [['h.t1',''],['h.t2','hot']]); $('#wd').textContent = tr('h.wd'); renderEngine(); views(); renderOps(); renderLevels(); renderFaq(); updLevels(); });
RD.spine.updaters.push(updEngine, updLevels, () => $('#jackpot').classList.toggle('lit', $('#jackpot').getBoundingClientRect().top < innerHeight*.62));
RD.spine.init({end: $('#rmark')});
RD.footerR();
RD.reveals();
RD.applyLang();
orbit(); heroLive(); ticker(); reels(); platLive(); coinRain(); radar();
addEventListener('scroll', () => { updEngine(); updLevels(); }, {passive:true});
addEventListener('resize', () => { clearTimeout(window.__se); window.__se = setTimeout(sizeEngine, 150); });
})();
