import { WA_NUMBER } from '../config.js';
/* ===== Base común RD: idioma, señal, contadores, apariciones ===== */
const RD = (function(){
  "use strict";
  const LANGS = ['es','en','it'];
  let L = Math.max(0, LANGS.indexOf(document.documentElement.lang));
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const clamp = (v,a=0,b=1) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;
  const waLink = msg => 'https://wa.me/' + WA_NUMBER + (msg ? '?text=' + encodeURIComponent(msg) : '');
  function pr(el, a, b){ const r = el.getBoundingClientRect(), vh = innerHeight; return clamp((a*vh - r.top) / ((a-b)*vh)); }

  const T = {}, LISTS = {};
  const pageT = {}, langHooks = [];
  const tr = k => (pageT[k] || T[k] || [k])[L] ?? k;

  function splitWords(el, parts){
    if(el.hasAttribute('data-split')) return; // ya viene animado desde el servidor
    el.innerHTML = ''; let i = 0;
    parts.forEach(([k,cls]) => tr(k).split(' ').forEach(w => {
      const s = document.createElement('span'); s.className = 'w ' + (cls||''); s.textContent = w;
      s.style.animationDelay = (.15 + i*.08) + 's'; el.appendChild(s); el.appendChild(document.createTextNode(' ')); i++;
    }));
  }
  function applyLang(){
    document.documentElement.lang = LANGS[L];
    $$('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach(el => { el.innerHTML = tr(el.dataset.i18nHtml); });
    $$('[data-wa]').forEach(a => { a.href = waLink(tr(a.dataset.wa)); a.target = '_blank'; a.rel = 'noopener'; });
    langHooks.forEach(f => f());
    requestAnimationFrame(() => spine.build());
  }
  // el idioma lo define la URL (/, /en/, /it/); el header enlaza a la versión de cada idioma
  function setLang(){}

  /* ---- la señal ---- */
  const spine = (function(){
    let main, svg, ghost, live, head, halo, sg, total = 1, samples = [], headLen = 0, endEl = null, ticking = false;
    const updaters = [];
    function build(){
      if(!svg) return;
      const mr = main.getBoundingClientRect(), W = main.clientWidth, H = main.offsetHeight;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.style.height = H + 'px'; sg.setAttribute('y2', H);
      const pts = $$('.node').filter(n => n.offsetParent !== null).map(n => { const r = n.getBoundingClientRect(); return [r.left - mr.left + 1, r.top - mr.top + 1]; }).sort((a,b) => a[1]-b[1]);
      if(endEl){ const r = endEl.getBoundingClientRect(); pts.push([r.left - mr.left + r.width/2, r.top - mr.top + 6]); }
      if(pts.length < 2) return;
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for(let i=0;i<pts.length-1;i++){
        const p0 = pts[i-1]||pts[i], p1 = pts[i], p2 = pts[i+1], p3 = pts[i+2]||p2;
        d += ` C${(p1[0]+(p2[0]-p0[0])/6).toFixed(1)},${(p1[1]+(p2[1]-p0[1])/6).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])/6).toFixed(1)},${(p2[1]-(p3[1]-p1[1])/6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
      }
      ghost.setAttribute('d', d); live.setAttribute('d', d);
      total = live.getTotalLength(); samples = [];
      for(let l=0; l<=total; l+=6) samples.push([l, live.getPointAtLength(l).y]);
      live.style.strokeDasharray = total;
      kick(true);
    }
    function lenAtY(y){ let best = 0; for(const s of samples){ if(s[1] <= y) best = s[0]; } return best; }
    function frame(){
      ticking = false;
      const y = -main.getBoundingClientRect().top + innerHeight*.62;
      let target = reduced ? total : lenAtY(y);
      if(innerHeight + scrollY >= document.documentElement.scrollHeight - 4) target = total;
      headLen += (target - headLen) * (reduced ? 1 : .35);
      if(Math.abs(target - headLen) < .5) headLen = target;
      live.style.strokeDashoffset = total - headLen;
      const hp = live.getPointAtLength(headLen);
      head.setAttribute('cx', hp.x); head.setAttribute('cy', hp.y); halo.setAttribute('cx', hp.x); halo.setAttribute('cy', hp.y);
      head.style.opacity = halo.style.opacity = (headLen > 2 || scrollY < 40) ? 1 : 0;
      spine.progress = total ? headLen/total : 0;
      updaters.forEach(f => f());
      if(Math.abs(target - headLen) > .5){ ticking = true; requestAnimationFrame(frame); }
    }
    function kick(force){ if(ticking && !force) return; ticking = true; requestAnimationFrame(frame); }
    function init(opts){
      main = $('main'); svg = $('#spine'); ghost = svg.querySelector('.ghost'); live = svg.querySelector('.live');
      head = svg.querySelector('.head'); halo = svg.querySelector('.halo'); sg = $('#sg'); endEl = opts && opts.end || null;
      addEventListener('scroll', () => kick(), {passive:true});
      let rz; const rb = () => { clearTimeout(rz); rz = setTimeout(build, 150); };
      addEventListener('resize', rb); new ResizeObserver(rb).observe(main);
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);
    }
    return {init, build, kick, updaters, progress:0, get headY(){ return head ? +head.getAttribute('cy') : 0; }};
  })();

  /* ---- R del footer ---- */
  function footerR(){
    const rm = $('#rmark'); if(!rm) return;
    const paths = Array.from(rm.querySelectorAll('.sq, .r'));
    paths.forEach(p => { const l = p.getTotalLength(); p.style.strokeDasharray = l; p.dataset.l = l; });
    spine.updaters.push(() => {
      const p = reduced ? 1 : pr(rm, 1.0, .72);
      paths.forEach((el,i) => { const k = clamp(i === 0 ? p/.6 : (p-.35)/.6); el.style.strokeDashoffset = el.dataset.l*(1-k); });
      rm.classList.toggle('done', p >= 1);
    });
  }

  /* ---- contadores y apariciones ---- */
  function countUp(el, to, opts={}){
    const from = opts.from || 0, dec = opts.dec || 0, fmt = opts.fmt || (v => v.toFixed(dec)), dur = reduced ? 1 : (opts.dur || 1500), t0 = performance.now();
    (function step(now){ const k = clamp((now - t0)/dur), e = 1 - Math.pow(1-k,3); el.textContent = (opts.pre||'') + fmt(from + (to-from)*e) + (opts.suf||''); if(k < 1) requestAnimationFrame(step); })(t0);
  }
  function onEnter(els, fn, opts){
    const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ io.unobserve(e.target); fn(e.target); } }), opts || {threshold:.35});
    (Array.isArray(els) ? els : $$(els)).forEach(el => io.observe(el));
  }
  function reveals(){ onEnter('.rv', el => el.classList.add('in'), {threshold:.15}); }

  return {$, $$, clamp, pr, reduced, isTouch, waLink, tr, splitWords, applyLang, setLang, spine, footerR, countUp, onEnter, reveals,
          addText(d){ Object.assign(pageT, d); }, onLang(f){ langHooks.push(f); }, get L(){ return L; }};
})();
export default RD;
