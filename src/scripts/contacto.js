import RD from './rd.js';
import { T, SVC_KEYS } from '../i18n/contacto.js';
import { clientT } from '../i18n/t.js';
import { waLink } from '../config.js';

const { $, $$ } = RD;
const t = clientT(T);
const form = $('#ct-form'), btn = $('#send'), err = $('#ferr'), done = $('#done');

/* tiempo de inicio (anti-bots) */
$('#f-ts').value = String(Date.now());

/* servicio preseleccionado desde otras páginas: /contacto/?servicio=web */
const pre = new URLSearchParams(location.search).get('servicio');
if (pre) { const opt = $$('#f-servicio option').find((o) => o.dataset.k === pre); if (opt) opt.selected = true; }

/* disponibilidad según la hora de Lima */
const avail = $('#avail'), lima = $('#lima');
function limaNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false }).formatToParts(new Date());
  const get = (k) => parts.find((p) => p.type === k)?.value;
  return { h: +get('hour'), m: +get('minute'), wd: get('weekday'), txt: `${get('hour')}:${get('minute')}` };
}
function tick() {
  const n = limaNow(), [oh] = avail.dataset.open.split(':').map(Number), [ch] = avail.dataset.close.split(':').map(Number);
  const open = n.wd !== 'Sun' && n.h >= oh && n.h < ch;
  avail.classList.toggle('off', !open);
  avail.querySelector('span').textContent = t(open ? 'wa.on' : 'wa.off');
  lima.textContent = n.txt;
}
tick(); setInterval(tick, 30000);

/* copiar correo */
$('#copy').addEventListener('click', async (e) => {
  const b = e.currentTarget, mail = $('#email').textContent.trim(), label = b.textContent;
  try { await navigator.clipboard.writeText(mail); } catch { const r = document.createRange(); r.selectNodeContents($('#email')); getSelection().removeAllRanges(); getSelection().addRange(r); }
  b.textContent = b.dataset.ok; setTimeout(() => (b.textContent = label), 1600);
});

/* validación en el navegador (el servidor vuelve a validar todo) */
const rules = {
  nombre: (v) => v.trim().length >= 2,
  empresa: (v) => v.trim().length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  telefono: (v) => v.trim() === '' || /^[0-9 +()\-]{6,40}$/.test(v.trim()),
  mensaje: (v) => v.trim().length >= 10,
};
const mark = (name, bad) => form.querySelector(`[name="${name}"]`).closest('.fld').classList.toggle('bad', bad);
Object.keys(rules).forEach((n) => form.querySelector(`[name="${n}"]`).addEventListener('input', (e) => { if (e.target.closest('.fld').classList.contains('bad')) mark(n, !rules[n](e.target.value)); }));

const showErr = (key) => { err.innerHTML = ''; err.append(t(key) + ' '); const a = document.createElement('a'); a.href = waLink(t('wa.msg')); a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'WhatsApp →'; if (key !== 'f.err.invalid') err.append(a); err.hidden = false; };

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  err.hidden = true;
  const data = Object.fromEntries(new FormData(form).entries());
  const bad = Object.keys(rules).filter((n) => !rules[n](data[n] || ''));
  Object.keys(rules).forEach((n) => mark(n, bad.includes(n)));
  if (bad.length) { showErr('f.err.invalid'); form.querySelector(`[name="${bad[0]}"]`).focus(); return; }
  btn.disabled = true; btn.firstElementChild.textContent = t('f.sending');
  try {
    const res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data), credentials: 'same-origin' });
    const out = await res.json().catch(() => ({}));
    if (res.ok && out.ok) { done.hidden = false; form.reset(); return; }
    if (out.error === 'invalid' && Array.isArray(out.fields)) { out.fields.forEach((f) => rules[f] && mark(f, true)); showErr('f.err.invalid'); }
    else showErr(out.error === 'rate' ? 'f.err.rate' : 'f.err.net');
  } catch { showErr('f.err.net'); }
  finally { btn.disabled = false; btn.firstElementChild.textContent = t('f.send'); }
});
$('#again').addEventListener('click', () => { done.hidden = true; $('#f-ts').value = String(Date.now()); $('#f-nombre').focus(); });

RD.spine.init({ end: $('#rmark') });
RD.footerR();
