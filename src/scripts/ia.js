import RD from './rd.js';
import { FLOWS } from '../i18n/ia.js';

const { $, $$, reduced } = RD;

/* ---- hero: conversación de WhatsApp ---- */
const bubs = $$('#wa-body .bub'), typing = $('#typing'), crm = $('#wa-crm');
let chatTimers = [];
function chat() {
  chatTimers.forEach(clearTimeout); chatTimers = [];
  bubs.forEach((b) => b.classList.remove('show')); crm.classList.remove('in'); typing.classList.remove('show');
  if (reduced) { bubs.forEach((b) => b.classList.add('show')); crm.classList.add('in'); return; }
  let tm = 400;
  bubs.forEach((b) => {
    if (b.classList.contains('b')) { chatTimers.push(setTimeout(() => typing.classList.add('show'), tm)); tm += 1100; }
    chatTimers.push(setTimeout(() => { typing.classList.remove('show'); b.parentNode.insertBefore(b, typing); b.classList.add('show'); }, tm));
    tm += b.classList.contains('u') ? 1000 : 900;
  });
  chatTimers.push(setTimeout(() => crm.classList.add('in'), tm));
  chatTimers.push(setTimeout(chat, tm + 4000));
}
RD.onEnter([$('#wa-body')], chat, { threshold: .3 });

/* ---- lienzo de agentes ---- */
let cur = 0, anim = null;
function geometry(flowEl) {
  const box = flowEl.getBoundingClientRect(), map = {};
  flowEl.querySelectorAll('.nd').forEach((n) => { const r = n.getBoundingClientRect(); map[n.dataset.id] = { l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top, x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, el: n }; });
  return { box, map };
}
function drawEdges(fi) {
  const flowEl = $$('.flow')[fi], svg = flowEl.querySelector('.edges'), { box, map } = geometry(flowEl);
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  const vertical = innerWidth <= 760;
  svg.innerHTML = FLOWS[fi].edges.map(([a, b]) => { const A = map[a], B = map[b];
    if (vertical) { const y1 = A.b, y2 = B.t, my = (y1 + y2) / 2; return `<path data-e="${a}-${b}" d="M${A.x},${y1} C${A.x},${my} ${B.x},${my} ${B.x},${y2}"/>`; }
    const x1 = A.r, x2 = B.l, mx = (x1 + x2) / 2;
    return `<path data-e="${a}-${b}" d="M${x1},${A.y} C${mx},${A.y} ${mx},${B.y} ${x2},${B.y}"/>`; }).join('') + '<circle r="4" cx="-20" cy="-20"/>';
  return map;
}
function play(fi) {
  cancelAnimationFrame(anim);
  const flowEl = $$('.flow')[fi], svg = flowEl.querySelector('.edges'); const map = drawEdges(fi);
  const dot = svg.querySelector('circle'), paths = Array.from(svg.querySelectorAll('path'));
  const order = [];
  const visit = (id) => FLOWS[fi].edges.filter((e) => e[0] === id).forEach((e) => { order.push(e); });
  FLOWS[fi].nodes.forEach((n) => visit(n[0]));
  let k = 0, t0 = performance.now();
  const lit = (id) => { Object.values(map).forEach((m) => m.el.classList.remove('lit')); if (map[id]) map[id].el.classList.add('lit'); };
  lit(FLOWS[fi].nodes[0][0]);
  if (reduced) return;
  (function step(now) {
    const e = order[k % order.length], p = svg.querySelector(`path[data-e="${e[0]}-${e[1]}"]`);
    const dur = 900, f = Math.min(1, (now - t0) / dur);
    paths.forEach((x) => x.classList.toggle('hot', x === p));
    const pt = p.getPointAtLength(p.getTotalLength() * f); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
    if (f >= 1) { lit(e[1]); k++; t0 = now + 250; const ex = $('#execs'); if (k % 3 === 0) ex.textContent = (parseInt(ex.textContent.replace(/\D/g, ''), 10) + 1).toLocaleString('en-US'); if (k % order.length === 0) { t0 = now + 900; setTimeout(() => lit(FLOWS[fi].nodes[0][0]), 600); } }
    anim = requestAnimationFrame(step);
  })(t0);
}
$$('#ftabs button').forEach((b) => b.addEventListener('click', () => {
  cur = +b.dataset.f;
  $$('#ftabs button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  $$('.flow').forEach((f, i) => f.classList.toggle('on', i === cur));
  play(cur);
}));
new IntersectionObserver((es) => { if (es[0].isIntersecting) play(cur); else cancelAnimationFrame(anim); }, { threshold: .2 }).observe($('#canvas'));
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => play(cur), 200); });

/* ---- simulador ---- */
const range = $('#s-range'), bubbles = $('#bubbles');
function sim() {
  const m = +range.value, auto = Math.round(m * 0.7), hrs = Math.round(auto * 4 / 60);
  $('#s-msgs').textContent = m.toLocaleString('en-US');
  $('#s-auto').textContent = auto.toLocaleString('en-US');
  $('#s-hours').textContent = hrs.toLocaleString('en-US');
  if (!reduced) for (let i = 0; i < 3; i++) { const b = document.createElement('i'); b.style.left = Math.random() * 95 + '%'; b.style.animationDuration = 2 + Math.random() * 2 + 's'; bubbles.appendChild(b); setTimeout(() => b.remove(), 4000); }
}
range.addEventListener('input', sim);
sim();

RD.spine.init({ end: $('#rmark') });
RD.footerR();
RD.reveals();
