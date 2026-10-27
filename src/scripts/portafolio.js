import * as THREE from 'three';
import { WA_NUMBER } from '../config.js';
import { I18N, CATS, ROLES, PROJECTS } from '../i18n/portafolio.js';

(function(){
"use strict";

/* =========================================================
   1. TEXTOS (ES / EN / IT)
   ========================================================= */
/* =========================================================
   3. ESTADO + IDIOMA
   ========================================================= */
let lang = I18N[document.documentElement.lang] ? document.documentElement.lang : 'es';
const t = k => (I18N[lang] && I18N[lang][k]) || I18N.es[k] || k;
const $ = s => document.querySelector(s);

/* CONFIGURACIÓN */
const NO_LIVE_CATS = ['branding'];    // categorías que solo son imágenes (sin "Ver sitio en vivo")
const waLink = msg => 'https://wa.me/' + WA_NUMBER + (msg ? '?text=' + encodeURIComponent(msg) : '');
const pad = n => String(n).padStart(2,'0');
let filter = 'all';
let visible = PROJECTS.slice();     // proyectos según filtro
let activeIdx = 0;                  // índice dentro de "visible"
let openProject = null;

function applyLang(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  buildFilters();
  updateInfo(true);
  if(openProject) fillCase(openProject, false);
}


function buildFilters(){
  const box = $('#filters'); box.innerHTML = '';
  const ids = ['all', ...Object.keys(CATS)];
  ids.forEach(id => {
    const n = id === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.cat === id).length;
    if(!n) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-pressed', id === filter);
    b.innerHTML = `${id === 'all' ? t('all') : CATS[id][lang]} <sup>${n}</sup>`;
    b.addEventListener('click', () => setFilter(id));
    box.appendChild(b);
  });
}

/* =========================================================
   4. IMÁGENES DE EJEMPLO (se dibujan en canvas)
   Cuando tengas tus diseños, pon "image" en cada proyecto y esto se ignora.
   ========================================================= */
const CW = 1200, CH = 750;
const FONT = (w,s) => `${w} ${s}px Geist, "Helvetica Neue", Arial, sans-serif`;
const MONO = s => `500 ${s}px "Geist Mono", ui-monospace, monospace`;
function rr(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function lg(c,x0,y0,x1,y1,stops){ const g=c.createLinearGradient(x0,y0,x1,y1); stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s)); return g; }
function glow(c,x,y,r,col){ const g=c.createRadialGradient(x,y,0,x,y,r); g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.fillRect(0,0,CW,CH); }
function txt(c,s,x,y,font,fill,align){ c.font=font; c.fillStyle=fill; c.textAlign=align||'left'; c.fillText(s,x,y); c.textAlign='left'; }
function bars(c,x,y,widths,h,gap,col){ c.fillStyle=col; widths.forEach((w,i)=>{ rr(c,x,y+i*(h+gap),w,h,h/2); c.fill(); }); }
function spaced(c,s,x,y,font,fill,sp){ c.font=font; c.fillStyle=fill; let w=0; for(const ch of s) w+=c.measureText(ch).width+sp; w-=sp; let cx=x-w/2; for(const ch of s){ c.fillText(ch,cx,y); cx+=c.measureText(ch).width+sp; } }

function drawCasino(c,p,v){
  const {bg,ac,ac2}=p.pal;
  c.fillStyle=lg(c,0,0,CW,CH,bg); c.fillRect(0,0,CW,CH);
  glow(c,980,180,560,ac+'55'); glow(c,120,720,520,ac2+'40');
  txt(c,p.name.toUpperCase(),60,80,FONT(800,30),'#fff');
  ['CASINO','SPORTS','LIVE','PROMOS'].forEach((s,i)=>txt(c,s,430+i*118,78,MONO(15),'#ffffff8c'));
  rr(c,975,46,165,48,24); c.fillStyle=lg(c,975,0,1140,0,[ac,ac2]); c.fill(); txt(c,'DEPOSIT',1057,77,FONT(700,17),'#fff','center');
  const tileCols=[ac,ac2,'#2f5bff','#16c784','#ff7a1a','#e21cff','#22c3ff','#ff3b6b'];
  const games=['Crash','Plinko','Roulette','Slots','Dice','Blackjack','Mines','Baccarat','Keno','Limbo'];
  function tile(x,y,w,h,i){
    const col=tileCols[i%tileCols.length];
    rr(c,x,y,w,h,18); c.fillStyle=lg(c,x,y,x+w,y+h,[col,'#0a0614']); c.fill();
    c.strokeStyle='#ffffff1f'; c.lineWidth=2; c.stroke();
    c.beginPath(); c.arc(x+w*0.72,y+h*0.42,h*0.26,0,Math.PI*2); c.fillStyle='#ffffff26'; c.fill();
    c.beginPath(); c.arc(x+w*0.72,y+h*0.42,h*0.14,0,Math.PI*2); c.fillStyle='#ffffff55'; c.fill();
    txt(c,games[i%games.length],x+20,y+h-22,FONT(700,Math.round(h*0.14)),'#fff');
    txt(c,'x'+(1.2+((i*37)%90)/10).toFixed(2),x+20,y+34,MONO(14),'#ffffffb0');
  }
  if(v===0){
    txt(c,'WELCOME OFFER · CRYPTO ONLY',60,215,MONO(17),ac);
    c.font=FONT(800,118); c.fillStyle=lg(c,60,0,460,0,['#ffffff',ac]); c.fillText('200%',56,335);
    txt(c,'BONUS',56,450,FONT(800,118),'#fff');
    txt(c,'+ 50 free spins on your first deposit',60,500,FONT(400,23),'#ffffffa8');
    rr(c,60,535,230,62,31); c.fillStyle=lg(c,60,0,290,0,[ac,ac2]); c.fill(); txt(c,'PLAY NOW',175,574,FONT(700,19),'#fff','center');
    ['BTC 67,420','ETH 3,512','USDT 1.00'].forEach((s,i)=>{ rr(c,60+i*168,640,155,40,20); c.fillStyle='#ffffff12'; c.fill(); txt(c,s,137+i*168,666,MONO(14),'#ffffffcc','center'); });
    for(let i=0;i<6;i++) tile(650+(i%2)*255,140+Math.floor(i/2)*190,235,172,i);
  } else if(v===1){
    txt(c,'Top games',60,180,FONT(800,52),'#fff');
    ['All','Originals','Slots','Live','Table'].forEach((s,i)=>{ rr(c,60+i*140,210,128,42,21); c.fillStyle=i===0?ac:'#ffffff14'; c.fill(); txt(c,s,124+i*140,237,FONT(600,16),'#fff','center'); });
    for(let i=0;i<10;i++) tile(60+(i%5)*218,290+Math.floor(i/5)*215,200,195,i+2);
  } else {
    const cx=840,cy=410,R=260,n=16;
    for(let i=0;i<n;i++){ c.beginPath(); c.moveTo(cx,cy); c.arc(cx,cy,R,i/n*Math.PI*2,(i+1)/n*Math.PI*2); c.closePath(); c.fillStyle=i%2?ac:(i%4===0?ac2:'#140a20'); c.fill(); }
    c.beginPath(); c.arc(cx,cy,R,0,Math.PI*2); c.strokeStyle='#fff'; c.lineWidth=8; c.stroke();
    c.beginPath(); c.arc(cx,cy,70,0,Math.PI*2); c.fillStyle='#0b0612'; c.fill(); c.strokeStyle=ac; c.lineWidth=6; c.stroke();
    txt(c,'SPIN',cx,cy+10,FONT(800,30),'#fff','center');
    txt(c,'DAILY JACKPOT',60,230,MONO(17),ac);
    txt(c,'₿ 4.2069',56,340,FONT(800,104),'#fff');
    txt(c,'Spin & win every 24h',60,400,FONT(400,26),'#ffffffa8');
    rr(c,60,440,230,62,31); c.fillStyle=lg(c,60,0,290,0,[ac,ac2]); c.fill(); txt(c,'SPIN NOW',175,479,FONT(700,19),'#fff','center');
  }
}

function drawMark(c,p,x,y,s,col,col2){
  c.save(); c.translate(x,y);
  if(p.mark==='arch'){
    c.beginPath(); c.arc(0,0,s,Math.PI,0); c.lineTo(s,s); c.lineTo(-s,s); c.closePath(); c.fillStyle=col; c.fill();
    c.beginPath(); c.arc(0,s*0.15,s*0.45,Math.PI,0); c.lineTo(s*0.45,s); c.lineTo(-s*0.45,s); c.closePath(); c.fillStyle=col2; c.fill();
  } else if(p.mark==='leaf'){
    c.beginPath(); c.ellipse(0,0,s*0.55,s,Math.PI/5,0,Math.PI*2); c.fillStyle=col; c.fill();
    c.beginPath(); c.moveTo(-s*0.5,s*0.8); c.quadraticCurveTo(0,0,s*0.55,-s*0.75); c.strokeStyle=col2; c.lineWidth=s*0.08; c.stroke();
  } else {
    c.beginPath(); c.arc(0,0,s,0,Math.PI*2); c.fillStyle=col; c.fill();
    c.lineWidth=s*0.12; c.strokeStyle=col2;
    for(let k=0;k<2;k++){ c.beginPath(); for(let i=0;i<=40;i++){ const xx=-s*0.7+i*(s*1.4/40); const yy=Math.sin(i/40*Math.PI*3)*s*0.12+(k?s*0.3:-s*0.05); i?c.lineTo(xx,yy):c.moveTo(xx,yy);} c.stroke(); }
  }
  c.restore();
}
function drawBranding(c,p,v){
  const {bg,ac,ac2,ink}=p.pal;
  if(v===1){
    c.fillStyle=ink; c.fillRect(0,0,CW,CH); glow(c,900,200,600,ac+'40');
    c.save(); c.translate(380,380); c.rotate(-0.12);
    rr(c,-230,-140,460,280,14); c.fillStyle=bg[0]; c.fill();
    drawMark(c,p,-140,-20,48,ac,bg[0]); txt(c,p.name,-70,0,FONT(700,34),ink); txt(c,'hola@'+p.id+'.com',-70,40,MONO(15),ink+'99');
    c.restore();
    c.save(); c.translate(820,410); c.rotate(0.08);
    rr(c,-200,-270,400,540,10); c.fillStyle='#fbfaf7'; c.fill();
    drawMark(c,p,-140,-200,30,ac,'#fbfaf7'); bars(c,-160,-110,[300,260,310,180,280,240,120],10,18,'#00000022');
    c.restore();
    rr(c,90,610,250,80,12); c.fillStyle=ac; c.fill(); txt(c,'Stationery',110,660,FONT(700,26),bg[0]);
    return;
  }
  c.fillStyle=lg(c,0,0,CW,CH,bg); c.fillRect(0,0,CW,CH);
  if(v===2){
    txt(c,'Aa',60,470,FONT(800,330),ink);
    txt(c,'Geist Display',640,190,MONO(17),ac);
    ['ABCDEFGHIJKLM','NOPQRSTUVWXYZ','abcdefghijklm','0123456789 &?!'].forEach((s,i)=>txt(c,s,640,260+i*62,FONT(i<2?700:400,44),ink));
    [ac,ac2,ink,bg[1]].forEach((col,i)=>{ c.beginPath(); c.arc(680+i*110,600,42,0,Math.PI*2); c.fillStyle=col; c.fill(); });
    return;
  }
  glow(c,600,300,400,ac+'22');
  drawMark(c,p,600,250,92,ac,bg[0]);
  spaced(c,p.name.toUpperCase(),600,450,FONT(700,62),ink,10);
  spaced(c,'EST. '+p.year,600,495,MONO(16),ink+'99',6);
  const sw=[ac,ac2,ink,bg[1],'#ffffff'];
  sw.forEach((col,i)=>{ const x=150+i*185; rr(c,x,575,170,110,12); c.fillStyle=col; c.fill(); c.strokeStyle=ink+'22'; c.lineWidth=2; c.stroke(); txt(c,col.toUpperCase(),x+14,700+22,MONO(13),ink+'aa'); });
}

function drawProduct(c,x,y,s,col,col2){
  c.save(); c.translate(x,y);
  c.beginPath(); c.ellipse(0,s*0.95,s*0.9,s*0.12,0,0,Math.PI*2); c.fillStyle='#00000022'; c.fill();
  c.rotate(-0.25);
  rr(c,-s*0.95,-s*0.15,s*1.9,s*0.7,s*0.32); c.fillStyle=col; c.fill();
  rr(c,-s*0.95,s*0.32,s*1.9,s*0.24,s*0.12); c.fillStyle='#ffffff'; c.fill();
  rr(c,-s*0.35,-s*0.55,s*0.95,s*0.6,s*0.3); c.fillStyle=col; c.fill();
  c.beginPath(); c.moveTo(-s*0.6,s*0.05); c.lineTo(s*0.5,s*0.05); c.strokeStyle=col2; c.lineWidth=s*0.08; c.stroke();
  c.restore();
}
function drawEcom(c,p,v){
  const {bg,ac,ac2,ink}=p.pal;
  c.fillStyle=lg(c,0,0,CW,CH,bg); c.fillRect(0,0,CW,CH);
  txt(c,p.name,60,78,FONT(800,30),ink);
  ['Shop','Collections','Journal','About'].forEach((s,i)=>txt(c,s,420+i*130,76,FONT(500,17),ink+'aa'));
  c.beginPath(); c.arc(1110,68,22,0,Math.PI*2); c.fillStyle=ink; c.fill(); txt(c,'2',1110,75,FONT(700,16),bg[0],'center');
  if(v===0){
    txt(c,'NEW SEASON — '+p.year,60,215,MONO(16),ac);
    txt(c,'Made to',56,320,FONT(800,100),ink); txt(c,'move.',56,425,FONT(800,100),ink);
    txt(c,'Free shipping on orders over $80',60,480,FONT(400,22),ink+'99');
    rr(c,60,520,200,62,31); c.fillStyle=ink; c.fill(); txt(c,'Shop now',160,559,FONT(700,19),bg[0],'center');
    txt(c,'$129',290,562,FONT(700,26),ink);
    c.beginPath(); c.arc(860,400,265,0,Math.PI*2); c.fillStyle=ac; c.fill();
    c.beginPath(); c.arc(860,400,265,0,Math.PI*2); c.fillStyle=lg(c,600,140,1120,660,['#ffffff33','#00000022']); c.fill();
    drawProduct(c,860,410,170,ac2,ink);
  } else if(v===1){
    txt(c,'Best sellers',60,180,FONT(800,48),ink);
    for(let i=0;i<4;i++){
      const x=60+i*275,y=220;
      rr(c,x,y,255,470,18); c.fillStyle='#ffffff'; c.fill();
      rr(c,x+14,y+14,227,280,12); c.fillStyle=i%2?ac+'22':ac2+'26'; c.fill();
      drawProduct(c,x+127,y+150,70,i%2?ac:ac2,ink);
      txt(c,['Runner 01','Trail X','Court Low','Street Hi'][i],x+20,y+340,FONT(700,22),ink);
      txt(c,'$'+(99+i*20),x+20,y+378,FONT(500,20),ink+'99');
      rr(c,x+20,y+405,215,44,22); c.strokeStyle=ink+'33'; c.lineWidth=2; c.stroke(); txt(c,'Add to cart',x+127,y+433,FONT(600,15),ink,'center');
    }
  } else {
    rr(c,60,130,560,560,24); c.fillStyle='#ffffff'; c.fill();
    drawProduct(c,340,410,150,ac,ink);
    txt(c,'Runner 01',680,220,FONT(800,64),ink);
    txt(c,'$129.00',680,280,FONT(600,30),ink+'aa');
    bars(c,680,320,[420,380,300],10,18,ink+'22');
    ['38','39','40','41','42'].forEach((s,i)=>{ rr(c,680+i*86,440,74,54,10); c.fillStyle=i===2?ink:'#ffffff'; c.fill(); txt(c,s,717+i*86,475,FONT(600,18),i===2?bg[0]:ink,'center'); });
    rr(c,680,530,420,66,33); c.fillStyle=ac; c.fill(); txt(c,'Add to cart',890,571,FONT(700,20),'#fff','center');
  }
}

function drawLanding(c,p,v){
  const {bg,ac,ac2}=p.pal;
  c.fillStyle=lg(c,0,0,CW,CH,bg); c.fillRect(0,0,CW,CH);
  glow(c,920,260,520,ac+'50'); glow(c,1100,640,400,ac2+'38');
  txt(c,p.name,60,78,FONT(800,28),'#fff');
  ['Product','Pricing','Docs','Blog'].forEach((s,i)=>txt(c,s,440+i*120,76,FONT(500,17),'#ffffff99'));
  rr(c,990,46,150,46,10); c.fillStyle='#fff'; c.fill(); txt(c,'Get started',1065,76,FONT(700,16),'#0a0a12','center');
  if(v===1){
    txt(c,'Everything you need,',600,210,FONT(800,58),'#fff','center');
    c.font=FONT(800,58); c.fillStyle=lg(c,380,0,820,0,[ac,ac2]); c.textAlign='center'; c.fillText('nothing you don’t.',600,280); c.textAlign='left';
    for(let i=0;i<3;i++){ const x=60+i*365; rr(c,x,350,345,320,20); c.fillStyle='#ffffff0d'; c.fill(); c.strokeStyle='#ffffff1a'; c.lineWidth=2; c.stroke();
      rr(c,x+28,380,56,56,14); c.fillStyle=[ac,ac2,'#ffffff'][i]; c.fill();
      txt(c,['Automations','Analytics','Integrations'][i],x+28,490,FONT(700,28),'#fff'); bars(c,x+28,520,[280,240,180],9,16,'#ffffff26'); }
    return;
  }
  if(v===2){
    txt(c,'Simple pricing',600,200,FONT(800,58),'#fff','center');
    ['Starter','Pro','Scale'].forEach((s,i)=>{ const x=90+i*350,hi=i===1; rr(c,x,250,320,430,22); c.fillStyle=hi?lg(c,x,250,x+320,680,[ac,ac2]):'#ffffff0d'; c.fill();
      txt(c,s,x+30,305,FONT(700,26),'#fff'); txt(c,['$0','$29','$99'][i],x+30,390,FONT(800,64),'#fff'); bars(c,x+30,430,[240,200,220,160],9,20,hi?'#ffffff55':'#ffffff22');
      rr(c,x+30,600,260,52,26); c.fillStyle=hi?'#fff':'#ffffff1a'; c.fill(); txt(c,'Choose plan',x+160,633,FONT(700,16),hi?'#0a0a12':'#fff','center'); });
    return;
  }
  rr(c,60,170,250,36,18); c.fillStyle='#ffffff12'; c.fill(); txt(c,'NEW · v2.0 is live',80,194,MONO(14),'#ffffffcc');
  txt(c,'Create faster',56,305,FONT(800,84),'#fff');
  c.font=FONT(800,84); c.fillStyle=lg(c,56,0,560,0,[ac,ac2]); c.fillText('with AI.',56,395);
  bars(c,60,435,[440,380],12,16,'#ffffff30');
  rr(c,60,520,200,60,12); c.fillStyle=lg(c,60,0,260,0,[ac,ac2]); c.fill(); txt(c,'Start free',160,558,FONT(700,19),'#fff','center');
  rr(c,275,520,180,60,12); c.strokeStyle='#ffffff40'; c.lineWidth=2; c.stroke(); txt(c,'Watch demo',365,558,FONT(600,18),'#fff','center');
  rr(c,660,160,460,300,20); c.fillStyle='#ffffff10'; c.fill(); c.strokeStyle='#ffffff22'; c.stroke();
  txt(c,'Conversions',690,210,MONO(14),'#ffffff99'); txt(c,'+248%',690,275,FONT(800,56),'#fff');
  c.beginPath(); for(let i=0;i<=20;i++){ const x=690+i*20, y=420-Math.pow(i/20,1.6)*110-Math.sin(i*1.3)*10; i?c.lineTo(x,y):c.moveTo(x,y);} c.strokeStyle=ac; c.lineWidth=5; c.stroke();
  rr(c,760,490,360,170,20); c.fillStyle='#ffffff10'; c.fill(); c.strokeStyle='#ffffff22'; c.stroke();
  c.beginPath(); c.arc(820,560,32,0,Math.PI*2); c.fillStyle=ac2; c.fill(); bars(c,870,535,[200,140],12,16,'#ffffff40');
}

function drawPhone(c,x,y,s,p,kind){
  const {ac,ac2}=p.pal, w=290*s, h=600*s;
  c.save(); c.shadowColor='#00000080'; c.shadowBlur=40; c.shadowOffsetY=20;
  rr(c,x,y,w,h,46*s); c.fillStyle='#0d0d12'; c.fill(); c.restore();
  rr(c,x+10*s,y+10*s,w-20*s,h-20*s,38*s); c.fillStyle='#16161e'; c.fill();
  rr(c,x+w/2-45*s,y+20*s,90*s,24*s,12*s); c.fillStyle='#000'; c.fill();
  const ix=x+30*s, iy=y+80*s, iw=w-60*s;
  if(kind===0){
    txt(c,'Balance',ix,iy+10*s,MONO(13*s),'#ffffff88');
    txt(c,'$12,480',ix,iy+60*s,FONT(800,40*s),'#fff');
    rr(c,ix,iy+85*s,iw,150*s,18*s); c.fillStyle=lg(c,ix,0,ix+iw,0,[ac,ac2]); c.fill();
    txt(c,'•••• 4092',ix+16*s,iy+215*s,MONO(14*s),'#ffffffdd');
    for(let i=0;i<4;i++){ const yy=iy+265*s+i*58*s; c.beginPath(); c.arc(ix+18*s,yy+18*s,18*s,0,Math.PI*2); c.fillStyle=i%2?ac+'55':ac2+'55'; c.fill(); bars(c,ix+48*s,yy+6*s,[110*s,70*s],9*s,9*s,'#ffffff30'); txt(c,(i%2?'-':'+')+'$'+(24+i*13),ix+iw,yy+24*s,FONT(600,15*s),'#fff','right'); }
  } else if(kind===1){
    txt(c,'This week',ix,iy+10*s,MONO(13*s),'#ffffff88');
    txt(c,'4,820 kcal',ix,iy+58*s,FONT(800,34*s),'#fff');
    for(let i=0;i<7;i++){ const bh=(40+((i*53)%110))*s; rr(c,ix+i*(iw/7)+4*s,iy+230*s-bh,iw/7-10*s,bh,8*s); c.fillStyle=i===4?ac:'#ffffff26'; c.fill(); }
    rr(c,ix,iy+260*s,iw,90*s,18*s); c.fillStyle=ac2+'33'; c.fill(); txt(c,'Next: HIIT 30’',ix+16*s,iy+312*s,FONT(700,18*s),'#fff');
    rr(c,ix,iy+365*s,iw,56*s,28*s); c.fillStyle=ac; c.fill(); txt(c,'Start workout',ix+iw/2,iy+400*s,FONT(700,16*s),'#0b0b10','center');
  } else {
    c.beginPath(); c.arc(ix+iw/2,iy+120*s,95*s,0,Math.PI*2); c.strokeStyle='#ffffff1a'; c.lineWidth=16*s; c.stroke();
    c.beginPath(); c.arc(ix+iw/2,iy+120*s,95*s,-Math.PI/2,Math.PI*1.1); c.strokeStyle=ac; c.lineWidth=16*s; c.lineCap='round'; c.stroke(); c.lineCap='butt';
    txt(c,'72%',ix+iw/2,iy+135*s,FONT(800,40*s),'#fff','center');
    for(let i=0;i<3;i++){ rr(c,ix,iy+250*s+i*70*s,iw,58*s,14*s); c.fillStyle='#ffffff0f'; c.fill(); bars(c,ix+16*s,iy+268*s+i*70*s,[140*s],10*s,0,'#ffffff40'); }
  }
}
function drawApps(c,p,v){
  const {bg,ac,ac2}=p.pal;
  c.fillStyle=lg(c,0,0,CW,CH,bg); c.fillRect(0,0,CW,CH);
  glow(c,600,380,520,ac+'45'); glow(c,1050,120,380,ac2+'30');
  if(v===0){ drawPhone(c,150,140,1,p,1); drawPhone(c,455,70,1.04,p,0); drawPhone(c,770,140,1,p,2); }
  else if(v===1){
    txt(c,p.name,60,220,FONT(800,76),'#fff');
    txt(c,'iOS · Android',60,270,MONO(17),ac);
    bars(c,60,310,[420,360,300],12,18,'#ffffff30');
    rr(c,60,420,180,58,14); c.fillStyle='#fff'; c.fill(); txt(c,'App Store',150,456,FONT(700,17),'#0b0b10','center');
    rr(c,255,420,180,58,14); c.strokeStyle='#ffffff55'; c.lineWidth=2; c.stroke(); txt(c,'Google Play',345,456,FONT(600,17),'#fff','center');
    drawPhone(c,720,80,1.02,p,0);
  } else { drawPhone(c,300,90,1,p,2); drawPhone(c,640,60,1,p,1); }
}

const DRAW = {casino:drawCasino, branding:drawBranding, ecommerce:drawEcom, landing:drawLanding, apps:drawApps};
const imgCache = {};
function projectCanvas(p,v){
  const c=document.createElement('canvas'); c.width=CW; c.height=CH;
  DRAW[p.cat](c.getContext('2d'),p,v||0);
  return c;
}
function projectImageURL(p,v){
  const key=p.id+'-'+v;
  if(p.image && v===0) return p.image;
  if(p.gallery && v>0 && p.gallery[v-1]) return p.gallery[v-1];
  if(!imgCache[key]) imgCache[key]=projectCanvas(p,v).toDataURL('image/jpeg',0.86);
  return imgCache[key];
}

/* =========================================================
   5. ESCENA 3D (Three.js)
   ========================================================= */
const canvas = $('#gl');
const stage = $('#stage');
const isTouch = matchMedia('(hover: none)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if(!THREE || !THREE.WebGLRenderer){
  canvas.insertAdjacentHTML('afterend','<div class="noscript-msg">No se pudo cargar el motor 3D.</div>');
  return;
}
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'high-performance'});
renderer.setClearColor(0x000000,0);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32,1,0.1,100);
const group = new THREE.Group(); scene.add(group);

// Geometría del cilindro
const R = 4.6;           // radio
const W = 3.2, H = 2.0;  // tamaño de cada tarjeta (16:10)
const STEP = (W*1.16)/R; // ángulo entre tarjetas
let CAM_Y = 0;
let DY = 0.62;           // cuánto baja la espiral por tarjeta (en móvil se reduce en resize)

function bentPlane(){
  const g = new THREE.PlaneGeometry(W,H,isTouch?24:48,1);
  const pos = g.attributes.position;
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i), a=x/R;
    pos.setX(i, Math.sin(a)*R);
    pos.setZ(i, Math.cos(a)*R);
  }
  g.computeBoundingBox(); g.computeBoundingSphere();
  return g;
}
const geo = bentPlane();

const VERT = `
uniform float uVel; uniform float uR;
varying vec2 vUv; varying float vZ;
void main(){
  vUv = uv;
  vec3 p = position;
  p.y += sin(uv.x*3.14159) * uVel;
  vec4 w = modelMatrix * vec4(p,1.0);
  vZ = w.z / uR;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const FRAG = `
precision highp float;
uniform sampler2D uTex; uniform vec2 uMouse; uniform float uHover; uniform float uTime;
uniform float uAspect; uniform vec2 uRes; uniform float uActive; uniform vec2 uCover; uniform float uShow; uniform vec2 uFade;
varying vec2 vUv; varying float vZ;
void main(){
  vec2 uv = vUv;
  // --- gota de agua: lente + ondas desde el cursor ---
  vec2 p = uv - uMouse; p.x *= uAspect;
  float d = length(p);
  float ring = sin(d*46.0 - uTime*6.5) * exp(-d*6.5);
  vec2 dir = p/(d+1e-4); dir.x /= uAspect;
  vec2 off = dir * ring * 0.010 * uHover;
  off -= (uv - uMouse) * smoothstep(0.24,0.0,d) * 0.11 * uHover;
  vec2 t = (uv - 0.5) * uCover + 0.5;
  vec3 col;
  col.r = texture2D(uTex, t + off*1.35).r;
  col.g = texture2D(uTex, t + off).g;
  col.b = texture2D(uTex, t + off*0.7).b;
  col += vec3(0.95,0.85,1.0) * smoothstep(0.05,0.0,d) * 0.10 * uHover;
  // --- profundidad: delante brillante, detrás oscuro y violeta ---
  float facing = smoothstep(-1.0, 1.0, vZ);
  float g = dot(col, vec3(0.299,0.587,0.114));
  col = mix(vec3(g), col, mix(0.45, 1.0, uActive));
  col = mix(col, vec3(0.30,0.08,0.55) * (g*1.6 + 0.08), (1.0-facing)*0.55);
  float bright = mix(0.12, 1.0, pow(facing, 1.5));
  if(!gl_FrontFacing) bright *= 0.4;
  col *= bright * mix(0.82, 1.0, uActive);
  // --- esquinas redondeadas y fundido en bordes de pantalla ---
  vec2 q = abs(vUv - 0.5) * vec2(uAspect, 1.0);
  float r = 0.035;
  float sd = length(max(q - (vec2(0.5*uAspect, 0.5) - r), 0.0)) - r;
  float corner = 1.0 - smoothstep(-0.004, 0.0, sd);
  float sy = gl_FragCoord.y / uRes.y;
  float edge = smoothstep(uFade.x - 0.14, uFade.x, sy) * smoothstep(1.0 - uFade.y + 0.12, 1.0 - uFade.y, sy);
  gl_FragColor = vec4(col, corner * edge * uShow);
}`;

const loader = new THREE.TextureLoader();
const cards = PROJECTS.map((p,i) => {
  const mat = new THREE.ShaderMaterial({
    vertexShader:VERT, fragmentShader:FRAG, transparent:true, side:THREE.DoubleSide,
    uniforms:{
      uTex:{value:null}, uMouse:{value:new THREE.Vector2(0.5,0.5)}, uHover:{value:0}, uTime:{value:0},
      uAspect:{value:W/H}, uRes:{value:new THREE.Vector2(1,1)}, uActive:{value:0}, uCover:{value:new THREE.Vector2(1,1)},
      uVel:{value:0}, uR:{value:R}, uShow:{value:1}, uFade:{value:new THREE.Vector2(0.12,0.12)}
    }
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = {p, slot:i, targetSlot:i, show:1, targetShow:1, hover:0, mouse:new THREE.Vector2(0.5,0.5)};
  group.add(mesh);
  return mesh;
});

function setTexture(mesh, source, isImage){
  const tex = isImage ? source : new THREE.CanvasTexture(source);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  tex.needsUpdate = true;
  const img = tex.image, ia = img.width/img.height, pa = W/H;
  mesh.material.uniforms.uCover.value.set(ia>pa ? pa/ia : 1, ia>pa ? 1 : ia/pa);
  mesh.material.uniforms.uTex.value = tex;
}
function loadTextures(){
  cards.forEach(m => {
    const p = m.userData.p;
    if(p.image){ loader.load(p.image, tex => setTexture(m, tex, true), undefined, () => setTexture(m, projectCanvas(p,0))); }
    else setTexture(m, projectCanvas(p,0));
  });
}

/* ---------- tamaño ---------- */
let vw=1, vh=1;
function resize(){
  vw = canvas.clientWidth; vh = canvas.clientHeight;
  const dpr = Math.min(window.devicePixelRatio||1, isTouch?1.5:2);
  renderer.setPixelRatio(dpr); renderer.setSize(vw, vh, false);
  camera.aspect = vw/vh;
  const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
  const mobile = camera.aspect < .8;
  DY = mobile ? 0.34 : 0.62;
  CAM_Y = mobile ? -0.55 : 0;   // móvil: sube un poco la tarjeta activa  // móvil: espiral más compacta, menos espacio vertical entre tarjetas
  const frac = mobile ? .9 : camera.aspect < 1.2 ? .62 : .46;
  const dW = W/(frac*2*tan*camera.aspect), dH = H/(.46*2*tan);
  camera.position.set(0, 0, R + Math.max(dW,dH));
  camera.updateProjectionMatrix();
  // móvil: las tarjetas de abajo se funden antes para no chocar con el texto del proyecto
  cards.forEach(m => { m.material.uniforms.uRes.value.set(vw*dpr, vh*dpr); m.material.uniforms.uFade.value.set(mobile ? 0.36 : 0.12, mobile ? 0.22 : 0.12); });
  layoutStage();
}

/* ---------- scroll → giro (exacto) ---------- */
const SCROLL_PER_CARD = 0.6; // pantallas de scroll por proyecto
function layoutStage(){
  const n = Math.max(visible.length,1);
  stage.style.height = (vh + (n-1)*vh*SCROLL_PER_CARD) + 'px';
  $('#r-total').textContent = '/ ' + pad(visible.length);
}
function stageProgress(){
  const r = stage.getBoundingClientRect();
  const span = stage.offsetHeight - vh;
  return span > 0 ? Math.min(1, Math.max(0, -r.top/span)) : 0;
}
function scrollToIndex(i, smooth){
  const span = stage.offsetHeight - vh;
  const top = stage.getBoundingClientRect().top + window.scrollY;
  const n = Math.max(visible.length-1,1);
  window.scrollTo({top: top + span*(i/n), behavior: smooth ? 'smooth' : 'auto'});
}

let cur = 0, prev = 0, vel = 0;
function targetPos(){ return stageProgress() * Math.max(visible.length-1,0); }

/* ---------- filtros ---------- */
function setFilter(id){
  if(id === filter) return;
  filter = id;
  visible = PROJECTS.filter(p => id === 'all' || p.cat === id);
  let k = 0;
  cards.forEach(m => {
    const inF = id === 'all' || m.userData.p.cat === id;
    m.userData.targetShow = inF ? 1 : 0;
    if(inF) m.userData.targetSlot = k++;
  });
  buildFilters();
  layoutStage();
  scrollToIndex(0, false);
  cur = targetPos(); // salta sin girar todo el cilindro
  updateInfo(true);
}

/* ---------- HUD ---------- */
const info = $('#info');
let infoShown = -1, swapTimer = null;
function updateInfo(force){
  const p = visible[activeIdx]; if(!p) return;
  $('#r-now').textContent = pad(activeIdx+1);
  if(!force && infoShown === activeIdx) return;
  infoShown = activeIdx;
  const fill = () => {
    $('#i-cat').textContent = CATS[p.cat][lang];
    $('#i-year').textContent = p.year;
    $('#i-name').textContent = p.name;
    $('#i-role').textContent = ROLES[p.role][lang];
  };
  if(force || reduced){ fill(); return; }
  info.classList.add('changing');
  clearTimeout(swapTimer);
  swapTimer = setTimeout(() => { fill(); info.classList.remove('changing'); }, 220);
}
$('#i-open').addEventListener('click', () => openCase(visible[activeIdx], cardOf(visible[activeIdx])));
function cardOf(p){ return cards.find(m => m.userData.p === p); }

/* ---------- puntero / hover ---------- */
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2(9,9);
let pointerIn = false, hovered = null, mx = 0, my = 0;
canvas.addEventListener('pointermove', e => {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1);
  mx = ndc.x; my = ndc.y; pointerIn = true;
});
canvas.addEventListener('pointerleave', () => { pointerIn = false; ndc.set(9,9); });
function pick(){
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(cards.filter(m => m.userData.show > .5), false);
  const h = hits.find(h => h.point.z > -R*0.2);
  return h || null;
}
canvas.addEventListener('click', e => {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1);
  const h = pick();
  if(h) openCase(h.object.userData.p, h.object);
});

/* ---------- bucle de render ---------- */
let running = true, last = performance.now(), time = 0, started = false;
const io = new IntersectionObserver(es => { running = es[0].isIntersecting; if(running){ last = performance.now(); requestAnimationFrame(tick); } }, {rootMargin:'100px'});
io.observe(stage);
let tiltX = 0, tiltY = 0;

function tick(now){
  if(!running || openProject) { started = false; return; }
  started = true;
  const dt = Math.min(0.05, (now - last)/1000); last = now; time += dt;
  // scroll exacto con un suavizado mínimo: cuando el usuario para, se detiene
  const target = targetPos();
  const k = reduced ? 1 : 1 - Math.pow(1 - 0.16, dt*60);
  cur += (target - cur) * k;
  if(Math.abs(target-cur) < 0.0005) cur = target;
  const v = (cur - prev) / Math.max(dt, 1e-3); prev = cur;
  vel += (THREE.MathUtils.clamp(v*0.05, -0.35, 0.35) - vel) * 0.12;
  group.rotation.y = -cur * STEP;
  group.position.y = cur * DY;
  // leve paralaje con el mouse
  const tx = pointerIn && !isTouch ? my*0.04 : 0, ty = pointerIn && !isTouch ? mx*0.05 : 0;
  tiltX += (tx - tiltX)*0.06; tiltY += (ty - tiltY)*0.06;
  group.rotation.x = -tiltX;
  camera.position.x = tiltY*1.2; camera.position.y = CAM_Y; camera.lookAt(0,CAM_Y,0);

  const ai = Math.round(cur);
  if(ai !== activeIdx && ai >= 0 && ai < visible.length){ activeIdx = ai; updateInfo(false); }
  $('#r-bar').style.height = (visible.length>1 ? (cur/(visible.length-1))*100 : 100) + '%';
  $('#hint').style.opacity = cur > 0.3 ? 0 : 1;

  // hover (solo en dispositivos con mouse)
  let hit = null;
  if(pointerIn && !isTouch) hit = pick();
  hovered = hit ? hit.object : null;
  canvas.classList.toggle('hover', !!hovered);

  cards.forEach(m => {
    const u = m.material.uniforms, d = m.userData;
    d.slot += (d.targetSlot - d.slot) * Math.min(1, dt*6);
    d.show += (d.targetShow - d.show) * Math.min(1, dt*7);
    m.visible = d.show > 0.01;
    m.rotation.y = d.slot * STEP;
    m.position.y = -d.slot * DY;
    const isH = m === hovered && !reduced;
    if(isH) d.mouse.lerp(hit.uv, 0.25);
    d.hover += ((isH ? 1 : 0) - d.hover) * Math.min(1, dt*5);
    u.uHover.value = d.hover; u.uMouse.value.copy(d.mouse); u.uTime.value = time;
    u.uVel.value = vel; u.uShow.value = d.show;
    const isActive = d.targetShow > .5 && Math.abs(d.slot - cur) < 0.5;
    u.uActive.value += ((isActive ? 1 : 0) - u.uActive.value) * Math.min(1, dt*6);
    // orden de dibujo según profundidad
    m.renderOrder = Math.round(Math.cos((d.slot - cur) * STEP) * 1000);
  });
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
function kick(){ if(running && !started && !openProject){ last = performance.now(); requestAnimationFrame(tick); } }

/* =========================================================
   6. CASO DE ESTUDIO (overlay en la misma pestaña)
   ========================================================= */
const caseEl = $('#case');
let pullAcc = 0, pullTimer = null, closing = false, originScroll = 0, originProject = null;

function screenRect(mesh){
  if(!mesh) return null;
  mesh.updateMatrixWorld();
  const bb = mesh.geometry.boundingBox, v = new THREE.Vector3();
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for(let i=0;i<8;i++){
    v.set(i&1?bb.max.x:bb.min.x, i&2?bb.max.y:bb.min.y, i&4?bb.max.z:bb.min.z).applyMatrix4(mesh.matrixWorld).project(camera);
    const sx=(v.x+1)/2*vw, sy=(1-v.y)/2*vh;
    x0=Math.min(x0,sx); x1=Math.max(x1,sx); y0=Math.min(y0,sy); y1=Math.max(y1,sy);
  }
  const off = canvas.getBoundingClientRect();
  return {top:off.top+y0, left:off.left+x0, right:innerWidth-(off.left+x1), bottom:innerHeight-(off.top+y1)};
}
function clipFrom(r){ return r ? `inset(${Math.max(0,r.top)}px ${Math.max(0,r.right)}px ${Math.max(0,r.bottom)}px ${Math.max(0,r.left)}px round 14px)` : 'inset(50% 50% 50% 50% round 14px)'; }

function fillCase(p, resetScroll){
  const list = visible.includes(p) ? visible : PROJECTS;
  const idx = list.indexOf(p), next = list[(idx+1) % list.length];
  $('#c-count').textContent = pad(idx+1) + ' / ' + pad(list.length);
  $('#c-hero').src = projectImageURL(p,0); $('#c-hero').alt = p.name;
  $('#c-cat').textContent = CATS[p.cat][lang] + ' · ' + p.year;
  $('#c-name').textContent = p.name;
  $('#c-desc').textContent = p.desc[lang];
  $('#c-year').textContent = p.year;
  $('#c-role').textContent = ROLES[p.role][lang];
  $('#c-cat2').textContent = CATS[p.cat][lang];
  const hasLive = !!p.url && !NO_LIVE_CATS.includes(p.cat);
  $('#c-live').hidden = !hasLive;
  $('#c-live').href = hasLive ? p.url : '#';
  const wa = waLink(t('case.waMsg').replace('{p}', p.name));
  $('#c-wa').href = wa; $('#c-wa-top').href = wa;
  const gal = $('#c-gallery'); gal.innerHTML = '';
  [1,2,0].forEach(v => { const f = document.createElement('figure'); const im = new Image(); im.alt = p.name; im.loading = 'lazy'; im.src = projectImageURL(p,v); f.appendChild(im); gal.appendChild(f); });
  $('#c-next-name').textContent = next.name;
  $('#c-next-img').src = projectImageURL(next,0); $('#c-next-img').alt = next.name;
  $('#c-next').onclick = () => { caseEl.classList.remove('shown'); setTimeout(() => { openProject = next; fillCase(next, true); caseEl.classList.add('shown'); }, 250); };
  if(resetScroll) caseEl.scrollTop = 0;
  setMeter(0);
}

function openCase(p, mesh){
  if(!p || openProject) return;
  openProject = p;
  originProject = p; originScroll = window.scrollY;
  fillCase(p, true);
  caseEl.hidden = false;
  caseEl.scrollTop = 0;   // siempre empieza en la imagen principal
  pullAcc = 0; setMeter(0);
  caseEl.classList.remove('anim','shown','leaving');
  caseEl.style.clipPath = clipFrom(screenRect(mesh));
  document.documentElement.style.overflow = 'hidden';
  try{ history.pushState({rdCase:p.id}, '', '#' + p.id); }catch(e){}
  requestAnimationFrame(() => requestAnimationFrame(() => {
    caseEl.classList.add('anim','shown');
    caseEl.style.clipPath = 'inset(0px 0px 0px 0px round 0px)';
    $('#c-back').focus({preventScroll:true});
  }));
}

function closeCase(mode){ // 'back' (botón / Esc) | 'pull' (seguir bajando al final del caso)
  if(!openProject || closing) return;
  closing = true;
  // bloquea la inercia del trackpad/rueda para que el cilindro no siga girando al cerrar
  if(mode === 'pull') lockScroll(1400);
  document.documentElement.style.overflow = '';
  // vuelve exactamente al punto del portafolio donde se abrió el caso
  window.scrollTo({top: originScroll, behavior:'auto'});
  cur = prev = targetPos(); activeIdx = Math.round(cur); updateInfo(true);
  const p = originProject || openProject;
  openProject = null; kick();
  requestAnimationFrame(() => {
    const r = screenRect(cardOf(p));
    openProject = p;
    caseEl.classList.add('leaving');
    caseEl.style.clipPath = clipFrom(r);
    setTimeout(finish, 900);
  });
  function finish(){
    caseEl.scrollTop = 0;
    caseEl.hidden = true; caseEl.style.opacity = ''; caseEl.style.transition = '';
    caseEl.classList.remove('anim','shown','leaving');
    openProject = null; originProject = null; closing = false; kick();
    try{ if(history.state && history.state.rdCase) history.replaceState(null, '', location.pathname + location.search); }catch(e){}
  }
}
$('#c-back').addEventListener('click', () => closeCase('back'));
$('#c-continue').addEventListener('click', () => closeCase('back'));
addEventListener('keydown', e => { if(e.key === 'Escape') closeCase('back'); });
addEventListener('popstate', () => { if(openProject) closeCase('back'); });

// El bloqueo se alarga mientras sigan llegando eventos (inercia del trackpad), hasta 3 s como máximo
let lockUntil = 0, lockMax = 0;
function lockScroll(ms){ const n = performance.now(); lockUntil = n + ms; lockMax = n + 3000; }
const blockIfLocked = e => {
  const n = performance.now();
  if(closing || n < lockUntil){ e.preventDefault(); lockUntil = Math.min(lockMax, Math.max(lockUntil, n + 450)); }
};
addEventListener('wheel', blockIfLocked, {passive:false});
addEventListener('touchmove', blockIfLocked, {passive:false});
addEventListener('keydown', e => { if(performance.now() < lockUntil && ['ArrowDown','PageDown',' ','End'].includes(e.key)) e.preventDefault(); });

// "sigue bajando" al final del caso → pasa a la siguiente sección del sitio
function atBottom(){ return caseEl.scrollTop + caseEl.clientHeight >= caseEl.scrollHeight - 4; }
function setMeter(v){ $('#c-meter').style.width = Math.min(100, v) + '%'; }
function pushPull(dy){
  if(!atBottom() || dy <= 0){ return; }
  pullAcc += dy; setMeter(pullAcc/4.5);
  clearTimeout(pullTimer);
  pullTimer = setTimeout(() => { pullAcc = 0; setMeter(0); }, 700);
  if(pullAcc > 450){ pullAcc = 0; closeCase('pull'); }
}
caseEl.addEventListener('wheel', e => pushPull(e.deltaY), {passive:true});
let ty0 = null;
caseEl.addEventListener('touchstart', e => { ty0 = e.touches[0].clientY; }, {passive:true});
caseEl.addEventListener('touchmove', e => { if(ty0 == null) return; const y = e.touches[0].clientY; pushPull((ty0 - y)*1.6); ty0 = y; }, {passive:true});

/* =========================================================
   7. ARRANQUE
   ========================================================= */
addEventListener('resize', resize);
addEventListener('scroll', kick, {passive:true});
const fontsReady = Promise.race([
  Promise.all([document.fonts.load('800 40px Geist'), document.fonts.load('700 40px Geist'), document.fonts.load('400 20px Geist'), document.fonts.load('500 16px "Geist Mono"')]),
  new Promise(r => setTimeout(r, 2500))
]);
applyLang();
resize();
fontsReady.then(() => {
  loadTextures();
  cur = prev = targetPos(); activeIdx = Math.round(cur); updateInfo(true);
  kick();
  // abrir directo un caso si el enlace trae #id-del-proyecto
  const h = location.hash.slice(1); const p = PROJECTS.find(x => x.id === h);
  if(p) setTimeout(() => openCase(p, cardOf(p)), 400);
});
})();
