import RD from './rd.js';
import { T } from '../i18n/software.js';
import { clientT } from '../i18n/t.js';
import { waLink } from '../config.js';

const { $, $$, reduced } = RD;
const t = clientT(T);

/* ---- hero: contadores ---- */
RD.onEnter('.appw .cnt', (b) => RD.countUp(b, +b.dataset.to, { pre: b.textContent.startsWith('S/') ? 'S/ ' : '', fmt: (v) => Math.round(v).toLocaleString('en-US') }), { threshold: .3 });

/* ---- constructor de sistema ---- */
function syncBuilder() {
  const on = $$('#mods .mod').filter((m) => m.getAttribute('aria-pressed') === 'true').map((m) => m.dataset.m);
  $$('#pv-side span').forEach((s) => s.classList.toggle('on', on.includes(s.dataset.m)));
  $$('#pv-tiles .tile').forEach((x) => x.classList.toggle('on', on.includes(x.dataset.m)));
  $('#pv-tiles').classList.toggle('has', on.length > 0);
  $('#mcount').textContent = on.length;
  const names = on.map((k) => t('mod.' + k)).join(', ');
  $('#quote').href = waLink(t('b.msg') + (names || '—'));
}
$$('#mods .mod').forEach((m) => m.addEventListener('click', () => { m.setAttribute('aria-pressed', String(m.getAttribute('aria-pressed') !== 'true')); syncBuilder(); }));
syncBuilder();

/* ---- demos ---- */
let cur = 'crm', timers = [];
const clear = () => { timers.forEach(clearTimeout); timers.forEach(clearInterval); timers = []; };
const later = (f, ms) => timers.push(setTimeout(f, ms));
const every = (f, ms) => timers.push(setInterval(f, ms));
const DEALS = [['Andes Retail', 'S/ 18,400'], ['Clínica Sol', 'S/ 9,800'], ['Grupo Norte', 'S/ 42,000'], ['Café Lima', 'S/ 3,600'], ['TransPerú', 'S/ 26,500'], ['Moda Inca', 'S/ 7,200']];
const runs = {
  crm() {
    const cols = $$('#kanban .kcards'); cols.forEach((c) => (c.innerHTML = ''));
    const counts = [0, 0, 0, 0]; const deals = DEALS.map((d, i) => ({ d, c: i % 3 }));
    const render = () => { cols.forEach((c, ci) => { c.innerHTML = deals.filter((x) => x.c === ci).map((x) => `<div class="kc"><b>${x.d[0]}</b><span>${x.d[1]}</span></div>`).join(''); }); $$('#kanban h4 em').forEach((e, i) => (e.textContent = deals.filter((x) => x.c === i).length)); };
    render();
    if (reduced) return;
    every(() => { const movable = deals.filter((x) => x.c < 3); if (!movable.length) { deals.forEach((x, i) => (x.c = i % 2)); } else movable[Math.random() * movable.length | 0].c++; render(); }, 1400);
  },
  fac() {
    const st = $('#inv-st'), n = $('#inv-n'), lbl = st.querySelector('span');
    const cycle = () => { st.className = 'id-status'; lbl.textContent = t('f.issue'); n.textContent = +n.textContent + 1;
      later(() => { st.className = 'id-status sent'; lbl.textContent = t('f.sent'); }, 1200);
      later(() => { st.className = 'id-status ok'; lbl.textContent = t('f.ok'); }, 2300); };
    cycle(); if (!reduced) every(cycle, 4600);
  },
  inv() {
    const rows = $$('#stock .srow'), al = $('#salert');
    const vals = [82, 46, 18, 64, 31];
    const cycle = () => { al.classList.remove('in'); rows.forEach((r, i) => { vals[i] = i === 2 ? 34 : Math.max(20, vals[i]); r.classList.remove('low'); set(r, vals[i]); });
      let k = 0; const step = () => { const i = [0, 2, 1, 2, 4, 2][k % 6]; vals[i] = Math.max(6, vals[i] - (i === 2 ? 7 : 4)); set(rows[i], vals[i]); if (vals[2] <= 12) { rows[2].classList.add('low'); al.classList.add('in'); return; } k++; later(step, 450); }; later(step, 500); };
    const set = (r, v) => { r.querySelector('i').style.setProperty('--v', v + '%'); r.querySelector('b').textContent = v; };
    cycle(); if (!reduced) every(cycle, 6500);
  },
  res() {
    const slots = $$('#cal span'), toast = $('#caltoast');
    const cycle = () => { slots.forEach((s) => s.classList.remove('on')); toast.classList.remove('in');
      const pick = [3, 7, 11, 14, 18, 21, 6, 12].sort(() => Math.random() - .5);
      pick.forEach((i, k) => later(() => slots[i].classList.add('on'), 300 + k * 420));
      later(() => toast.classList.add('in'), 300 + pick.length * 420); };
    cycle(); if (!reduced) every(cycle, 6200);
  },
};
function show(k) {
  cur = k; clear();
  $$('#dtabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.d === k)));
  $$('#demo .dv').forEach((v) => v.classList.toggle('on', v.dataset.d === k));
  runs[k]();
}
$$('#dtabs button').forEach((b) => b.addEventListener('click', () => show(b.dataset.d)));
let started = false;
new IntersectionObserver((es) => { if (es[0].isIntersecting && !started) { started = true; show(cur); } else if (!es[0].isIntersecting && started) { started = false; clear(); } }, { threshold: .2 }).observe($('#demo'));
runs.crm();

/* ---- calculadora de ahorro ---- */
const rp = $('#r-p'), rh = $('#r-h'), rc = $('#r-c'), coins = $('.coins');
let lastSav = 0;
function calc() {
  const p = +rp.value, h = +rh.value, c = +rc.value;
  $('#o-p').textContent = p; $('#o-h').textContent = h; $('#o-c').textContent = 'S/ ' + c;
  const hrs = Math.round(p * h * 52 * 0.6), sav = hrs * c;
  $('#hrs').textContent = hrs.toLocaleString('en-US');
  $('#sav').textContent = 'S/ ' + sav.toLocaleString('en-US');
  if (sav > lastSav && !reduced) { coins.classList.remove('go'); void coins.offsetWidth; $$('.coins i').forEach((i) => { i.style.left = Math.random() * 90 + 5 + '%'; i.style.animationDelay = Math.random() * .5 + 's'; }); coins.classList.add('go'); }
  lastSav = sav;
}
[rp, rh, rc].forEach((r) => r.addEventListener('input', calc));
calc();

RD.spine.init({ end: $('#rmark') });
RD.footerR();
RD.reveals();
