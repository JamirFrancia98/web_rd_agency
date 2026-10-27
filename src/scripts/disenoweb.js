import RD from './rd.js';
import { T, MONTHS } from '../i18n/disenoweb.js';
import { STORES } from '../data/ventas.js';
import { clientT, langIndex } from '../i18n/t.js';

const { $, $$, reduced } = RD;
const t = clientT(T), L = langIndex(), LG = ['es', 'en', 'it'][L];
const fmt = (n) => 'S/ ' + Math.round(n).toLocaleString('en-US');
const short = (n) => n >= 1e6 ? 'S/ ' + (n / 1e6).toFixed(2) + 'M' : 'S/ ' + Math.round(n / 1000) + 'K';

/* ---- hero: contador y pedidos en vivo ---- */
const num = $('#rev-num');
RD.onEnter([num], (el) => { if (!reduced) RD.countUp(el, +el.dataset.to, { pre: 'S/ ', dur: 2200, fmt: (v) => Math.round(v).toLocaleString('en-US') }); }, { threshold: .4 });
const order = $('#order'), amt = $('#order-amt');
if (!reduced) setInterval(() => {
  order.classList.add('swap');
  setTimeout(() => { amt.textContent = 'S/ ' + (Math.random() * 420 + 49).toFixed(2); order.classList.remove('swap'); }, 350);
}, 2600);

/* ---- gráfico de ventas reales ---- */
let store = 0, year = 'all';
const svg = $('#chart'), tip = $('#tip');
function data() {
  const s = STORES[store];
  const ys = Object.keys(s.years).map(Number);
  const pick = year === 'all' ? ys : [year];
  const bars = [];
  pick.forEach((y) => s.years[y].months.forEach((v, m) => { if (y === ys[0] && v === 0 && s.id === 'c02') return; bars.push({ y, m, v }); }));
  return { s, ys, bars, total: pick.reduce((a, y) => a + s.years[y].total, 0) };
}
function yearTabs() {
  const { ys } = data();
  $('#yr-tabs').innerHTML = [['all', t('r.all')], ...ys.map((y) => [y, y])].map(([v, l]) => `<button type="button" data-y="${v}" aria-pressed="${String(v) === String(year)}">${l}</button>`).join('');
  $$('#yr-tabs button').forEach((b) => b.addEventListener('click', () => { year = b.dataset.y === 'all' ? 'all' : +b.dataset.y; yearTabs(); draw(true); }));
}
function draw(animate) {
  const { s, bars, total } = data();
  const W = svg.clientWidth || 800, H = svg.clientHeight || 320, pl = 54, pb = 26, pt = 10;
  const max = Math.max(...bars.map((b) => b.v)) * 1.1;
  const step = Math.pow(10, Math.floor(Math.log10(max / 3))); const tick = Math.ceil(max / 3 / step) * step;
  const bw = (W - pl) / bars.length, gap = Math.min(10, bw * .22);
  const y = (v) => H - pb - (v / (tick * 3)) * (H - pb - pt);
  const peak = bars.reduce((a, b) => (b.v > a.v ? b : a), bars[0]);
  let g = '<defs><linearGradient id="barg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9b30ff"/><stop offset="1" stop-color="#2f5bff" stop-opacity=".55"/></linearGradient><linearGradient id="barp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ee08a"/><stop offset="1" stop-color="#1c7a4d"/></linearGradient></defs><g class="grid">';
  for (let i = 0; i <= 3; i++) { const yy = y(tick * i); g += `<line x1="${pl}" x2="${W}" y1="${yy}" y2="${yy}"/><text x="${pl - 8}" y="${yy + 3}" text-anchor="end">${i ? short(tick * i) : 'S/ 0'}</text>`; }
  g += '</g>';
  bars.forEach((b, i) => {
    const x = pl + i * bw + gap / 2, h = H - pb - y(b.v);
    g += `<rect class="bar${b === peak ? ' peak' : ''}" data-i="${i}" x="${x.toFixed(1)}" y="${y(b.v).toFixed(1)}" width="${Math.max(1, bw - gap).toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" rx="3"/>`;
    const label = bars.length <= 15 || b.m === 0;
    if (label) g += `<text class="xl" x="${(x + (bw - gap) / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle">${bars.length <= 15 ? MONTHS[L][b.m] : b.y}</text>`;
  });
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = g;
  if (animate && !reduced) $$('#chart .bar').forEach((r, i) => r.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 700, delay: i * (420 / bars.length), easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
  $$('#chart .bar').forEach((r) => { r.style.transformOrigin = 'center bottom'; r.style.transformBox = 'fill-box'; });
  $('#k-total').textContent = fmt(total);
  $('#k-best').textContent = `${MONTHS[L][peak.m]} ${peak.y} · ${short(peak.v)}`;
  $('#k-avg').textContent = short(total / bars.length);
  $('#k-hl').textContent = s.highlight.value;
  $('#k-hl-l').textContent = s.highlight.label[LG];
  svg._bars = bars;
}
svg.addEventListener('pointermove', (e) => {
  const r = e.target.closest('.bar'); if (!r) { tip.hidden = true; $$('#chart .bar').forEach((b) => b.classList.remove('dim')); return; }
  const b = svg._bars[+r.dataset.i], box = r.getBoundingClientRect(), wr = svg.parentElement.getBoundingClientRect();
  tip.innerHTML = `${MONTHS[L][b.m]} ${b.y}<b>${fmt(b.v)}</b>`;
  tip.style.left = (box.left - wr.left + box.width / 2) + 'px'; tip.style.top = (box.top - wr.top - 8) + 'px'; tip.hidden = false;
  $$('#chart .bar').forEach((x) => x.classList.toggle('dim', x !== r));
});
svg.addEventListener('pointerleave', () => { tip.hidden = true; $$('#chart .bar').forEach((b) => b.classList.remove('dim')); });
$$('#st-tabs button').forEach((b) => b.addEventListener('click', () => {
  store = +b.dataset.store; year = 'all';
  $$('#st-tabs button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  yearTabs(); draw(true);
}));
yearTabs(); draw(false);
RD.onEnter([svg], () => draw(true), { threshold: .3 });
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => draw(false), 150); });

/* ---- antes / después ---- */
const ba = $('#ba'), range = $('#ba-range');
range.addEventListener('input', () => ba.style.setProperty('--pos', range.value + '%'));
RD.onEnter([ba], () => {
  if (reduced) return;
  let k = 0; const t0 = performance.now();
  (function hint(now) { k = (now - t0) / 1400; if (k > 1) return; const v = 50 + Math.sin(k * Math.PI * 2) * 18; ba.style.setProperty('--pos', v + '%'); range.value = v; requestAnimationFrame(hint); })(t0);
}, { threshold: .6 });

/* ---- quiz de plataforma ---- */
const ans = [null, null, null];
$$('#quiz .qrow').forEach((row) => row.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
  ans[+row.dataset.q] = b.dataset.v === '1';
  row.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  decide();
})));
function decide() {
  let win = null;
  if (ans[0] === false) win = 'wp';
  else if (ans[0] === true) win = ans[2] === true ? 'sh' : ans[1] === true ? 'ps' : 'wp';
  $('#plats').classList.toggle('decided', !!win);
  $$('#plats .plat').forEach((p) => p.classList.toggle('win', p.dataset.p === win));
}

/* ---- señal y apariciones ---- */
RD.spine.init({ end: $('#rmark') });
RD.footerR();
RD.reveals();
