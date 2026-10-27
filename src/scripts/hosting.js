import RD from './rd.js';
import { T } from '../i18n/hosting.js';
import { clientT } from '../i18n/t.js';

const { $, $$, reduced } = RD;
const t = clientT(T);

/* ---- panel de estado: reloj de Lima, latencia y barras ---- */
const clock = $('#clock');
const tick = () => { clock.textContent = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Lima', hour12: false }).format(new Date()) + ' GMT-5'; };
tick(); setInterval(tick, 1000);
$$('.days i').forEach((d, i) => (d.style.animationDelay = (i * 8) + 'ms'));
const pts = Array.from({ length: 30 }, () => 120 + Math.random() * 50);
const spark = $('#spark'), ms = $('#ms');
const drawSpark = () => { spark.setAttribute('points', pts.map((v, i) => `${(i / 29 * 200).toFixed(1)},${(40 - (v - 90) / 110 * 36).toFixed(1)}`).join(' ')); };
drawSpark();
if (!reduced) setInterval(() => { pts.shift(); const v = 110 + Math.random() * 60; pts.push(v); ms.textContent = Math.round(v); drawSpark(); }, 1200);

/* ---- planes: mensual / anual ---- */
const plans = $('.plans');
$$('#billing button').forEach((b) => b.addEventListener('click', () => {
  const y = b.dataset.b === 'y';
  $$('#billing button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  plans.classList.toggle('yearly', y);
  $$('.price b').forEach((p) => { p.classList.add('flip'); setTimeout(() => { p.textContent = y ? p.dataset.y : p.dataset.m; p.classList.remove('flip'); }, 180); });
}));

/* ---- migración paso a paso ---- */
const mig = $('#mig'), steps = $$('.msteps li');
function runMig() {
  mig.classList.remove('done'); mig.classList.add('run'); steps.forEach((s) => s.classList.remove('on'));
  steps.forEach((s, i) => setTimeout(() => s.classList.add('on'), reduced ? 0 : 900 + i * 900));
  setTimeout(() => { mig.classList.remove('run'); mig.classList.add('done'); }, reduced ? 0 : 900 + steps.length * 900);
}
RD.onEnter([mig], runMig, { threshold: .5 });

/* ---- correo: llegan mensajes nuevos ---- */
const mails = $('#mails'), notif = $('#notif'), subjects = t('e.m');
let k = 0;
RD.onEnter([mails], () => {
  if (reduced) return;
  setInterval(() => {
    k++; const s = subjects[k % subjects.length];
    const row = mails.firstElementChild.cloneNode(true);
    row.classList.add('new'); row.querySelector('b').textContent = s; row.querySelector('em').textContent = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima', hour12: false }).format(new Date());
    row.querySelector('i').style.setProperty('--h', (k * 53) % 300);
    mails.prepend(row); mails.lastElementChild.remove();
    setTimeout(() => row.classList.remove('new'), 1500);
    notif.classList.add('swap'); setTimeout(() => { notif.querySelector('span').textContent = s; notif.classList.remove('swap'); }, 350);
  }, 3200);
}, { threshold: .4 });

RD.spine.init({ end: $('#rmark') });
RD.footerR();
RD.reveals();
