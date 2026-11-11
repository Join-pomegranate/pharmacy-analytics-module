// Sample-data engine and helpers for the pharmacy analytics module (prototype data only).
function create() {
  const TODAY = '2026-10-14';
  const USER = 'Alex Rivera';
  const pad = n => String(n).padStart(2, '0');
  const d2n = s => Math.round(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 864e5);
  const n2d = n => new Date(n * 864e5).toISOString().slice(0, 10);
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fS = s => MON[+s.slice(5, 7) - 1] + ' ' + (+s.slice(8, 10));
  const fD = s => (s ? fS(s) + ', ' + s.slice(0, 4) : '—');
  const fN = n => Math.round(n || 0).toLocaleString('en-US');
  const t12 = t => { let [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + pad(m) + ' ' + ap; };
  const fT = ts => { if (!ts) return '—'; const [d, t] = ts.split(' '); return fD(d) + ' · ' + t12(t) + ' ET'; };
  const nowTs = () => { const d = new Date(); return TODAY + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  const rangeLabel = (a, b) => (a === b ? fD(a) : (a.slice(0, 4) === b.slice(0, 4) ? fS(a) : fD(a)) + ' – ' + fD(b));

  const PHARMACIES = ['Apothecary', 'BPI', 'Empower', 'Hallandale', 'Hyalo', 'Millers', 'NewLife', 'NOVA', 'OptioRx', 'Red Rock', 'Reshape'];
  const PHW = { Apothecary: 5, BPI: 6, Empower: 14, Hallandale: 18, Hyalo: 8, Millers: 12, NewLife: 10, NOVA: 5, OptioRx: 7, 'Red Rock': 4, Reshape: 11 };
  const PFX = { Apothecary: 'APO', BPI: 'BPI', Empower: 'EMP', Hallandale: 'HAL', Hyalo: 'HYA', Millers: 'MIL', NewLife: 'NLF', NOVA: 'NOV', OptioRx: 'OPT', 'Red Rock': 'RRK', Reshape: 'RSH' };
  const RPH = [
    { id: 'RPh-2041', name: 'Dana Whitfield', w: 9 }, { id: 'RPh-2087', name: 'Marcus Lee', w: 8 }, { id: 'RPh-2112', name: 'Priya Raman', w: 7 },
    { id: 'RPh-2156', name: 'Elena Torres', w: 6 }, { id: 'RPh-2193', name: 'Samuel Okafor', w: 5 }, { id: 'RPh-2230', name: 'Hannah Brooks', w: 4 }, { id: 'RPh-2264', name: 'Victor Nguyen', w: 3 }];
  const STAFF = ['Alex Rivera', 'Mina Shah', 'Jordan Ellis', 'Tomás Ortega'];
  const REASONS = ['No API integration', 'Processed manually', 'Missed from portal', 'Operational exception'];
  const FORMS = [
    ['Tirzepatide', '10 mg/mL', '1 mL', 10], ['Tirzepatide', '10 mg/mL', '2 mL', 8], ['Tirzepatide', '15 mg/mL', '4 mL', 6], ['Tirzepatide', '20 mg/mL', '2 mL', 5],
    ['Tirzepatide + B12', '12.5 mg/mL', '2 mL', 6], ['Tirzepatide + B6', '15 mg/mL', '2 mL', 5],
    ['Semaglutide', '2.5 mg/mL', '1 mL', 8], ['Semaglutide', '5 mg/mL', '2 mL', 6], ['Semaglutide + B12', '2.5 mg/mL', '2 mL', 5], ['Semaglutide + Glycine', '5 mg/mL', '2 mL', 4],
    ['NAD+', '100 mg/mL', '10 mL', 2], ['Sermorelin', '3 mg/vial', '3 mL', 2], ['Cyanocobalamin (B12)', '1000 mcg/mL', '10 mL', 2]];
  const FIRST = ['Avery', 'Jordan', 'Riley', 'Morgan', 'Casey', 'Quinn', 'Harper', 'Rowan', 'Emerson', 'Finley', 'Sawyer', 'Reese', 'Hayden', 'Parker', 'Skyler', 'Dakota'];
  const LAST = ['Sample', 'Testerson', 'Demo', 'Placeholder', 'Example', 'Mockford', 'Fakeley', 'Trialson', 'Prototype', 'Specimen', 'Dummett', 'Exempla'];
  const USERS = [
    { name: 'Alex Rivera', email: 'alex.rivera@joinpomegranate.com', role: 'Administrator', last: 'Today' },
    { name: 'Mina Shah', email: 'mina.shah@joinpomegranate.com', role: 'Pharmacy Operations', last: 'Today' },
    { name: 'Jordan Ellis', email: 'jordan.ellis@joinpomegranate.com', role: 'Pharmacy Operations', last: 'Yesterday' },
    { name: 'Tomás Ortega', email: 'tomas.ortega@joinpomegranate.com', role: 'Pharmacy Operations', last: 'Oct 10' },
    { name: 'Leah Grant', email: 'leah.grant@joinpomegranate.com', role: 'Read-only Management', last: 'Oct 9' },
    { name: 'Omar Siddiqui', email: 'omar.siddiqui@joinpomegranate.com', role: 'Read-only Management', last: 'Oct 2' }];
  const SRC_COLOR = { 'Portal · API': '#660C21', 'Portal · Batch': '#B5677A', 'Manual': '#DDBFAE' };
  const I = {
    overview: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
    orders: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    pharmacy: 'M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M12 7v4M10 9h4',
    vial: 'M9 2h6M10 2v4L7 9v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9l-3-3V2M7 14h10',
    pharmacist: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    manual: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    reports: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M12 18v-6M9 15l3 3 3-3',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
    box: 'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8',
    layers: 'M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    avg: 'M3 3v18h18M7 14l4-4 4 4 5-5',
    alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8'
  };
  const COLS = [
    { k: 'id', l: 'Order ID', def: true }, { k: 'pharmacy', l: 'Pharmacy', def: true }, { k: 'med', l: 'Medication', def: true },
    { k: 'conc', l: 'Concentration', def: false }, { k: 'size', l: 'Vial size', def: false }, { k: 'qty', l: 'Quantity', def: false, align: 'right' },
    { k: 'vials', l: 'Vials', def: true, align: 'right' }, { k: 'date', l: 'Created', def: true }, { k: 'rph', l: 'Pharmacist', def: true },
    { k: 'source', l: 'Source', def: true }, { k: 'provider', l: 'Provider', def: false }, { k: 'poid', l: 'Provider order ID', def: false },
    { k: 'last', l: 'Patient last name', def: false, phi: true }, { k: 'first', l: 'Patient first name', def: false, phi: true },
    { k: 'dob', l: 'Patient DOB', def: false, phi: true }, { k: 'addedBy', l: 'Record added by', def: false }];

  function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
  const vialsOf = (o, drug) => o.lines.reduce((t, l) => t + ((l.supply || l.vials == null || (drug && drug !== 'all' && l.drug !== drug)) ? 0 : l.vials), 0);
  const finish = o => { o.vials = vialsOf(o, 'all'); o.review = o.lines.some(l => l.review); return o; };

  function build() {
    const r = rng(20261014);
    const pick = a => a[Math.floor(r() * a.length)];
    const wpick = (items, wf) => { const t = items.reduce((s, x) => s + wf(x), 0); let v = r() * t; for (const x of items) { v -= wf(x); if (v <= 0) return x; } return items[items.length - 1]; };
    const cat = {};
    PHARMACIES.forEach(p => {
      const tir = FORMS.filter(f => f[0].startsWith('Tirz')), sem = FORMS.filter(f => f[0].startsWith('Sema')), oth = FORMS.filter(f => !/^(Tirz|Sema)/.test(f[0]));
      const set = new Set(); while (set.size < 2) set.add(pick(tir)); set.add(pick(sem)); if (r() < 0.6) set.add(pick(sem)); if (r() < 0.5) set.add(pick(oth)); if (r() < 0.3) set.add(pick(oth));
      cat[p] = [...set];
    });
    const orders = []; let seq = 0; const end = d2n(TODAY), start = end - 180;
    for (let n = start; n <= end; n++) {
      const dow = new Date(n * 864e5).getUTCDay();
      const f = dow === 0 ? 0.3 : dow === 6 ? 0.5 : 1;
      const k = Math.round((5 + (n - start) * 0.035) * f * (0.7 + r() * 0.6));
      for (let j = 0; j < k; j++) {
        seq++;
        const ph = wpick(PHARMACIES, p => PHW[p]);
        const nl = r() < 0.18 ? 2 : 1, lines = [], used = new Set();
        for (let l = 0; l < nl; l++) {
          const fm = wpick(cat[ph], x => x[3]); if (used.has(fm)) continue; used.add(fm);
          const qty = r() < 0.68 ? 1 : r() < 0.75 ? 2 : 3; const review = r() < 0.012;
          lines.push({ drug: fm[0], conc: fm[1], size: fm[2], qty, vials: review ? null : qty, supply: false, review, unit: review ? 'Kit' : 'Vial' });
        }
        if (r() < 0.14) lines.push({ drug: 'Syringes (insulin, 0.5 mL)', conc: '—', size: '—', qty: pick([10, 20, 30]), vials: 0, supply: true, review: false, unit: 'Box' });
        const sr = r(); const manual = sr < 0.1; const source = manual ? 'Manual' : sr < 0.62 ? 'Portal · API' : 'Portal · Batch';
        const time = pad(8 + Math.floor(r() * 11)) + ':' + pad(Math.floor(r() * 60));
        const date = n2d(n);
        const o = {
          uid: 'rec_' + (100000 + seq), id: 'PG-' + (204300 + seq), poid: PFX[ph] + '-' + (2000000 + Math.floor(r() * 7999999)),
          provider: ph, pharmacy: ph, first: pick(FIRST), last: pick(LAST), dob: n2d(d2n('1958-01-01') + Math.floor(r() * 16000)),
          date, time, rph: r() < (manual ? 0.12 : 0.025) ? null : wpick(RPH, x => x.w), source, manual,
          reason: manual ? pick(REASONS) : '', addedBy: manual ? pick(STAFF) : 'System sync', status: r() < 0.025 ? 'Voided' : 'Active', lines, notes: ''
        };
        if (manual && r() < 0.3) o.id = '';
        o.created = date + ' ' + time; o.modified = o.created;
        if (manual) { const et = d2n(date) + (r() < 0.5 ? 0 : 1 + Math.floor(r() * 3)); o.created = n2d(Math.min(et, end)) + ' ' + pad(9 + Math.floor(r() * 8)) + ':' + pad(Math.floor(r() * 60)); o.modified = o.created; }
        orders.push(finish(o));
      }
    }
    const audit = [];
    orders.filter(o => o.manual).slice(-14).forEach(o => audit.push({ ts: o.created, user: o.addedBy, action: 'Manual order created', detail: (o.id || o.poid) + ' · ' + o.pharmacy }));
    orders.filter(o => o.manual && o.status === 'Voided').slice(-3).forEach(o => audit.push({ ts: o.modified, user: 'Mina Shah', action: 'Record voided', detail: (o.id || o.poid) + ' · duplicate of portal order' }));
    for (let d = 0; d < 7; d++) { const ds = n2d(end - d); audit.push({ ts: ds + ' 06:00', user: 'System', action: 'Portal sync', detail: orders.filter(o => o.date === n2d(end - d - 1) && !o.manual).length + ' records imported · pharmacist attribution matched' }); }
    audit.sort((a, b) => (a.ts < b.ts ? 1 : -1));
    return { orders, cat, audit };
  }

  const nice = v => { if (v <= 0) return 4; const p = Math.pow(10, Math.floor(Math.log10(v))); for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return Math.max(4, m * p); return 10 * p; };

  function buckets(from, to, group) {
    const a = d2n(from), b = d2n(to), out = [];
    if (group === 'day') for (let n = a; n <= b; n++) { const s = n2d(n); out.push({ s, e: s, label: fS(s), full: fD(s) }); }
    else if (group === 'week') {
      let st = a - ((new Date(a * 864e5).getUTCDay() + 6) % 7);
      for (; st <= b; st += 7) { const s = n2d(Math.max(st, a)), e = n2d(Math.min(st + 6, b)); out.push({ s, e, label: fS(s), full: rangeLabel(s, e) }); }
    } else {
      let y = +from.slice(0, 4), m = +from.slice(5, 7);
      while (true) {
        const ms = y + '-' + pad(m) + '-01'; if (ms > to) break;
        const nm = m === 12 ? (y + 1) + '-01-01' : y + '-' + pad(m + 1) + '-01';
        const s = ms < from ? from : ms, e = n2d(Math.min(d2n(nm) - 1, b));
        out.push({ s, e, label: MON[m - 1] + ' ' + String(y).slice(2), full: MON[m - 1] + ' ' + y });
        m++; if (m > 12) { m = 1; y++; }
      }
    }
    return out;
  }

  function chart(list, from, to, metric, group, drug, hoverIdx, setHover) {
    const bs = buckets(from, to, group), idx = {};
    bs.forEach((b, i) => { for (let n = d2n(b.s); n <= d2n(b.e); n++) idx[n2d(n)] = i; });
    const vals = bs.map(() => 0);
    list.forEach(o => { const i = idx[o.date]; if (i != null) vals[i] += metric === 'vials' ? vialsOf(o, drug) : 1; });
    const max = nice(Math.max(0, ...vals)), n = bs.length, H = 260, top = 12;
    const X = i => (n === 1 ? 500 : i / (n - 1) * 1000), Y = v => H - (v / max) * (H - top);
    const line = vals.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');
    const area = n ? line + ' L ' + X(n - 1) + ' ' + H + ' L ' + X(0) + ' ' + H + ' Z' : '';
    const ticks = [0, 1, 2, 3, 4].map(k => ({ top: (Y(max * k / 4) / H * 100).toFixed(2) + '%', label: fN(max * k / 4) }));
    const step = n > 1 ? 1000 / (n - 1) : 1000, every = Math.max(1, Math.ceil(n / 7));
    const xl = bs.map((b, i) => ({ i, left: (X(i) / 10).toFixed(2) + '%', label: b.label, tx: n === 1 ? '-50%' : i === 0 ? '0%' : i === n - 1 ? '-100%' : '-50%' })).filter(x => x.i % every === 0 || (n <= 7));
    const hits = bs.map((b, i) => ({ left: (Math.max(0, X(i) - step / 2) / 10).toFixed(2) + '%', w: (step / 10).toFixed(2) + '%', on: () => setHover(i) }));
    const h = hoverIdx;
    const tip = h != null && h < n
      ? { show: true, left: (X(h) / 10).toFixed(2) + '%', top: (Y(vals[h]) / H * 100).toFixed(2) + '%', label: bs[h].full, value: fN(vals[h]) + (metric === 'vials' ? ' vials' : ' orders'), tx: X(h) > 820 ? '-100%' : X(h) < 180 ? '0%' : '-50%' }
      : { show: false, left: '0%', top: '0%', label: '', value: '', tx: '0%' };
    return { area, line, ticks, xl, hits, tip, off: () => setHover(null), isEmpty: vals.every(v => v === 0) };
  }

  function bars(items, fmt) {
    const max = Math.max(1, ...items.map(i => i.value));
    return {
      items: items.map(i => ({
        label: i.label, sub: i.sub || '', hasSub: !!i.sub, title: i.label + (i.sub ? ' · ' + i.sub : ''), value: fmt ? fmt(i.value) : fN(i.value),
        w: (i.value / max * 100).toFixed(1) + '%', color: i.color || '#660C21', fw: i.fw || 400, onClick: i.onClick || null, cursor: i.onClick ? 'pointer' : 'default'
      })), isEmpty: items.length === 0
    };
  }

  const C = (v, o = {}) => ({
    v: v == null || v === '' ? '—' : String(v), align: o.align || 'left', fg: o.fg || '#24040B', fw: o.fw || 400,
    link: !!o.onClick && !o.tag, plain: !o.onClick && !o.tag, tag: !!o.tag, tagBg: o.tagBg || '#F3ECE2', tagFg: o.tagFg || '#4A4540',
    onClick: o.onClick || null, hasBadge: !!o.badge, badge: o.badge || '', badgeBg: o.badgeBg || '#FCF1DF', badgeFg: o.badgeFg || '#8A5A12', hasSub: !!o.sub, sub: o.sub || ''
  });
  const H = (l, o = {}) => ({ l, align: o.align || 'left', arrow: o.arrow || '', cursor: o.onClick ? 'pointer' : 'default', onClick: o.onClick || null });
  const T = (head, rows, empty, maxH) => ({ head: head.map(h => (typeof h === 'string' ? H(h) : h)), rows: rows.map(r => (Array.isArray(r) ? { cells: r, bg: 'transparent' } : r)), isEmpty: rows.length === 0, emptyText: empty || 'No records match these filters. Try widening the date range or resetting filters.', maxH: maxH || 'none' });
  const srcTag = o => C(o.source, { tag: true, tagBg: o.manual ? '#F8E9EC' : '#F3ECE2', tagFg: o.manual ? '#660C21' : '#4A4540' });
  const medLines = o => o.lines.filter(l => !l.supply);

  function exportFile(name, title, meta, aoa, fmt) {
    const head = [['Pomegranate Health — ' + title], ...meta, ['Generated', nowTs().replace(' ', ' ') + ' ET'], ['Note', 'Prototype · sample data only'], []];
    const rows = head.concat(aoa);
    let blob, ext;
    if (fmt === 'csv') {
      const esc = v => { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
      blob = new Blob(['\ufeff' + rows.map(r => r.map(esc).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }); ext = 'csv';
    } else {
      const x = v => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Report"><Table>' +
        rows.map(r => '<Row>' + r.map(c => '<Cell><Data ss:Type="' + (typeof c === 'number' ? 'Number' : 'String') + '">' + x(c) + '</Data></Cell>').join('') + '</Row>').join('') + '</Table></Worksheet></Workbook>';
      blob = new Blob([xml], { type: 'application/vnd.ms-excel' }); ext = 'xls';
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name + '.' + ext;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    return name + '.' + ext;
  }

  function parseCSV(text) {
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
      else if (ch === '"') q = true; else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some(c => c.trim() !== '')) rows.push(row); row = []; }
      else cell += ch;
    }
    row.push(cell); if (row.some(c => c.trim() !== '')) rows.push(row);
    return rows;
  }

  const CSV_FIELDS = [
    { k: 'pharmacy', l: 'Pharmacy', req: true, m: ['pharmacy'] }, { k: 'date', l: 'Order date', req: true, m: ['order_date', 'date'] },
    { k: 'pomId', l: 'Pomegranate order ID', m: ['pomegranate', 'pom_id', 'order_id'] }, { k: 'poid', l: 'Provider order ID', m: ['provider_order', 'poid'] },
    { k: 'first', l: 'Patient first name', m: ['first'] }, { k: 'last', l: 'Patient last name', req: true, m: ['last'] }, { k: 'dob', l: 'Patient DOB', m: ['dob', 'birth'] },
    { k: 'drug', l: 'Drug name', req: true, m: ['drug', 'medication'] }, { k: 'conc', l: 'Concentration', req: true, m: ['conc'] }, { k: 'size', l: 'Vial size', req: true, m: ['size'] },
    { k: 'qty', l: 'Quantity', req: true, m: ['quantity', 'qty'] }, { k: 'vials', l: 'Vial count', req: true, m: ['vial_count', 'vials'] },
    { k: 'rph', l: 'Pharmacist ID', m: ['pharmacist'] }, { k: 'reason', l: 'Reason', m: ['reason'] }];

  return { TODAY, USER, pad, d2n, n2d, MON, fS, fD, fN, t12, fT, nowTs, rangeLabel, PHARMACIES, RPH, STAFF, REASONS, FORMS, USERS, SRC_COLOR, I, COLS, vialsOf, finish, build, chart, bars, C, H, T, srcTag, medLines, exportFile, parseCSV, CSV_FIELDS };
}

export const A = create();
export default A;
