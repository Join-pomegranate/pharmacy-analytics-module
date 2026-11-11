import React from 'react';
import { A } from './analytics.js';
import { AppShell } from '../AppShell.jsx';

/**
 * Page logic for the analytics module. Holds all state and builds the view-models
 * (renderVals) that the components in ../components and ../pages render.
 */
export class Controller extends React.Component {
  state = { ready: false };
  componentDidMount() { this.init(); }
  componentWillUnmount() { clearTimeout(this._lt); clearTimeout(this._tt); }
  componentDidUpdate(prev) {
    if (!this.state.ready) return;
    if (prev.role !== this.props.role && this.props.role) this.setRole(this.props.role);
    if (prev.syncError !== this.props.syncError) this.setState({ syncErr: !!this.props.syncError });
    if (prev.sidebarCollapsed !== this.props.sidebarCollapsed) this.setState({ collapsed: !!this.props.sidebarCollapsed });
  }
  init() {
    if (!A._data) A._data = A.build(); const D = A._data; this.A = A; this.CAT = D.cat;
    const t = A.d2n(A.TODAY);
    this.setState({
      ready: true, page: 'overview', collapsed: !!this.props.sidebarCollapsed, role: this.props.role || 'Administrator',
      preset: '30d', cFrom: A.n2d(t - 29), cTo: A.TODAY, fPh: 'all', fDrug: 'all', fRph: 'all', fSrc: 'all',
      met: { ov: 'orders', pa: 'orders', pr: 'vials', rp: 'orders', bar: 'orders' }, grp: { ov: 'day', pa: 'week', pr: 'week', rp: 'week' }, hover: {},
      q: '', ordQ: '', sort: { k: 'date', d: -1 }, ordPage: 0, cols: A.COLS.filter(c => c.def).map(c => c.k), colsOpen: false, incVoided: false, reviewOnly: false,
      drawer: null, modal: null, form: null, fErr: {}, lErr: [], fStep: 'edit', dups: [],
      paPh: 'Hallandale', prDrug: 'all', prPh: 'all', rpPh: 'all', rphSel: null,
      rep: { type: 'phSummary', from: '', to: '', ph: 'all', drug: 'all', conc: 'all', size: 'all', rph: 'all', src: 'all' },
      setTab: 'pharmacies', pharmacies: A.PHARMACIES.map(n => ({ name: n, active: true, edit: n })), newPh: '', users: A.USERS.map(u => ({ ...u })),
      audit: D.audit.slice(), orders: D.orders, toast: null, loading: true, syncErr: !!this.props.syncError, syncing: false, lastSync: '6:00 AM',
      profileOpen: false, csv: null
    });
    this._lt = setTimeout(() => this.setState({ loading: false }), 650);
  }
  bump(patch) { this.setState({ ...patch, loading: true }); clearTimeout(this._lt); this._lt = setTimeout(() => this.setState({ loading: false }), 360); }
  toast(msg) { this.setState({ toast: msg }); clearTimeout(this._tt); this._tt = setTimeout(() => this.setState({ toast: null }), 3200); }
  log(action, detail) { this.setState(s => ({ audit: [{ ts: this.A.nowTs(), user: this.A.USER, action, detail }, ...s.audit] })); }
  setRole(role) { this.setState(s => ({ role, profileOpen: false, page: role !== 'Administrator' && s.page === 'settings' ? 'overview' : s.page })); }
  canEdit() { return this.state.role !== 'Read-only Management'; }
  canPHI() { return this.state.role !== 'Read-only Management'; }
  range() {
    const s = this.state, A = this.A, t = A.d2n(A.TODAY), y = +A.TODAY.slice(0, 4), m = +A.TODAY.slice(5, 7);
    switch (s.preset) {
      case 'today': return [A.TODAY, A.TODAY];
      case 'yesterday': return [A.n2d(t - 1), A.n2d(t - 1)];
      case '7d': return [A.n2d(t - 6), A.TODAY];
      case '30d': return [A.n2d(t - 29), A.TODAY];
      case 'month': return [y + '-' + A.pad(m) + '-01', A.TODAY];
      case 'lastmonth': { const pm = m === 1 ? 12 : m - 1, py = m === 1 ? y - 1 : y; return [py + '-' + A.pad(pm) + '-01', A.n2d(A.d2n(y + '-' + A.pad(m) + '-01') - 1)]; }
      default: { let a = s.cFrom || A.TODAY, b = s.cTo || A.TODAY; if (a > b) [a, b] = [b, a]; return [a, b]; }
    }
  }
  prevRange(a, b) { const A = this.A, len = A.d2n(b) - A.d2n(a) + 1; return [A.n2d(A.d2n(a) - len), A.n2d(A.d2n(a) - 1)]; }
  filt(o) {
    const { from, to, ph = 'all', drug = 'all', rph = 'all', src = 'all', voided = false } = o;
    return this.state.orders.filter(x => {
      if (!voided && x.status === 'Voided') return false;
      if (x.date < from || x.date > to) return false;
      if (ph !== 'all' && x.pharmacy !== ph) return false;
      if (drug !== 'all' && !x.lines.some(l => l.drug === drug)) return false;
      if (rph !== 'all') { if (rph === 'unknown' ? !!x.rph : (!x.rph || x.rph.id !== rph)) return false; }
      if (src !== 'all') { if (src === 'imported' ? x.manual : src === 'manual' ? !x.manual : x.source !== src) return false; }
      return true;
    });
  }
  stats(list, drug) {
    const A = this.A, phs = new Set(), prods = new Set(); let vials = 0, manual = 0, review = 0;
    list.forEach(o => { phs.add(o.pharmacy); vials += A.vialsOf(o, drug); if (o.manual) manual++; o.lines.forEach(l => { if (!l.supply && (drug === 'all' || l.drug === drug)) prods.add(o.pharmacy + '|' + l.drug + '|' + l.conc + '|' + l.size); if (l.review) review++; }); });
    return { orders: list.length, vials, phs: phs.size, prods: prods.size, manual, avg: list.length ? vials / list.length : 0, review };
  }
  kpi(label, cur, prev, icon, note, dec, vSize) {
    const A = this.A; let delta = '', dBg = '#F3ECE2', dFg = '#6B6762', hasDelta = prev != null;
    if (hasDelta) {
      if (prev === 0) { delta = cur > 0 ? 'New' : '0%'; }
      else { const p = (cur - prev) / prev * 100; delta = (p >= 0 ? '▲ ' : '▼ ') + Math.abs(p).toFixed(1) + '%'; if (Math.abs(p) >= 0.05) { dBg = p >= 0 ? '#EDF3EE' : '#F8E9EC'; dFg = p >= 0 ? '#3F6E4E' : '#8A1F36'; } }
    }
    return { label, value: typeof cur === 'string' ? cur : dec ? cur.toFixed(dec) : A.fN(cur), icon, note: note || '', delta, dBg, dFg, hasDelta, vSize: vSize || '38px' };
  }
  setHover(key, i) { if (this.state.hover[key] === i) return; this.setState(s => ({ hover: { ...s.hover, [key]: i } })); }
  trend(key, list, from, to, drug) { const s = this.state; return this.A.chart(list, from, to, s.met[key], s.grp[key], drug || 'all', s.hover[key], i => this.setHover(key, i)); }
  seg(opts, cur, set) { return opts.map(([v, l]) => ({ l, bg: v === cur ? '#FFFFFF' : 'transparent', fg: v === cur ? '#24040B' : '#6B6762', sh: v === cur ? '0 1px 3px rgba(36,4,11,0.14)' : 'none', onClick: () => set(v) })); }
  setMet(k, v) { this.setState(s => ({ met: { ...s.met, [k]: v } })); }
  setGrp(k, v) { this.setState(s => ({ grp: { ...s.grp, [k]: v }, hover: { ...s.hover, [k]: null } })); }
  groupBy(list, keyFn) { const m = new Map(); list.forEach(o => { const k = keyFn(o); if (k == null) return; if (!m.has(k)) m.set(k, []); m.get(k).push(o); }); return m; }
  lineGroups(list, keyFn, drug, lineFilter) {
    const m = new Map();
    list.forEach(o => { const seen = new Set(); o.lines.forEach(l => { if (l.supply || (drug && drug !== 'all' && l.drug !== drug) || (lineFilter && !lineFilter(l))) return; const k = keyFn(o, l); if (!m.has(k)) m.set(k, { key: k, o, l, orders: 0, vials: 0, review: 0 }); const g = m.get(k); if (!seen.has(k)) { g.orders++; seen.add(k); } if (l.vials == null) g.review++; else g.vials += l.vials; }); });
    return [...m.values()];
  }
  openOrder(o) { this.setState({ drawer: o.uid }); }
  cellFor(o, k) {
    const A = this.A, C = A.C, L = A.medLines(o), f = L[0] || o.lines[0], phi = this.canPHI();
    switch (k) {
      case 'id': return C(o.id || 'No Pom ID', { onClick: () => this.openOrder(o), badge: o.status === 'Voided' ? 'Voided' : o.review ? 'Review' : '', badgeBg: o.status === 'Voided' ? '#EEE9E2' : '#FCF1DF', badgeFg: o.status === 'Voided' ? '#6B6762' : '#8A5A12' });
      case 'pharmacy': return C(o.pharmacy);
      case 'provider': return C(o.provider);
      case 'poid': return C(o.poid);
      case 'med': return C(f ? f.drug : '—', { sub: L.length > 1 ? '+' + (L.length - 1) + ' more' : '' });
      case 'conc': return C(L.length > 1 ? 'Multiple' : f.conc);
      case 'size': return C(L.length > 1 ? 'Multiple' : f.size);
      case 'qty': return C(L.reduce((t, l) => t + l.qty, 0), { align: 'right' });
      case 'vials': return C(A.fN(o.vials), { align: 'right', fw: 500 });
      case 'date': return C(A.fD(o.date), { sub: A.t12(o.time) });
      case 'rph': return o.rph ? C(o.rph.name) : C('Unknown', { fg: '#8A847B' });
      case 'source': return A.srcTag(o);
      case 'last': return C(phi ? o.last : '•••••', { fg: phi ? '#24040B' : '#8A847B' });
      case 'first': return C(phi ? o.first : '•••••', { fg: phi ? '#24040B' : '#8A847B' });
      case 'dob': return C(phi ? A.fD(o.dob) : '•••••', { fg: phi ? '#24040B' : '#8A847B' });
      case 'addedBy': return C(o.addedBy, { fg: o.manual ? '#24040B' : '#8A847B' });
    }
    return C('');
  }
  sortVal(o, k) {
    const L = this.A.medLines(o);
    switch (k) { case 'vials': return o.vials; case 'qty': return L.reduce((t, l) => t + l.qty, 0); case 'date': return o.created; case 'rph': return o.rph ? o.rph.name : 'zzz'; case 'med': return L[0] ? L[0].drug : ''; case 'conc': return L[0] ? L[0].conc : ''; case 'size': return L[0] ? L[0].size : ''; case 'dob': return o.dob; default: return String(o[k] || ''); }
  }
  orderRows(list, keys) { return list.map(o => ({ cells: keys.map(k => this.cellFor(o, k)), bg: o.status === 'Voided' ? '#FBF9F6' : 'transparent' })); }
  phOpts(all) { const o = this.state.pharmacies.map(p => ({ v: p.name, l: p.name + (p.active ? '' : ' (inactive)') })); return all ? [{ v: 'all', l: 'All pharmacies' }, ...o] : o; }
  drugList() { const s = new Set(); Object.values(this.CAT).forEach(a => a.forEach(f => s.add(f[0]))); return [...s].sort(); }
  rphOpts() { return [{ v: 'all', l: 'All pharmacists' }, ...this.A.RPH.map(r => ({ v: r.id, l: r.name })), { v: 'unknown', l: 'Unknown / not recorded' }]; }
  page_overview(from, to, pf, pt) {
    const s = this.state, A = this.A, f = { ph: s.fPh, drug: s.fDrug, rph: s.fRph, src: s.fSrc };
    const list = this.filt({ from, to, ...f }), prev = this.filt({ from: pf, to: pt, ...f });
    const a = this.stats(list, s.fDrug), b = this.stats(prev, s.fDrug), days = A.d2n(to) - A.d2n(from) + 1, pn = 'vs prev. ' + days + (days === 1 ? ' day' : ' days');
    const kpis = [
      this.kpi('Total orders', a.orders, b.orders, A.I.box, pn), this.kpi('Total vials ordered', a.vials, b.vials, A.I.vial, pn),
      this.kpi('Pharmacies', a.phs, b.phs, A.I.pharmacy, 'with ≥1 order'), this.kpi('Products', a.prods, b.prods, A.I.layers, 'distinct formulations'),
      this.kpi('Manual orders', a.manual, b.manual, A.I.manual, pn), this.kpi('Avg vials / order', a.avg, b.avg, A.I.avg, 'active orders only', 1)];
    const metBar = s.met.bar;
    const byPh = [...this.groupBy(list, o => o.pharmacy)].map(([k, l]) => ({ label: k, value: metBar === 'vials' ? l.reduce((t, o) => t + A.vialsOf(o, s.fDrug), 0) : l.length, onClick: () => this.bump({ fPh: k, page: 'orders', ordPage: 0 }) })).sort((x, y) => y.value - x.value);
    const prods = this.lineGroups(list, (o, l) => l.drug + '|' + l.conc + '|' + l.size, s.fDrug).sort((x, y) => y.vials - x.vials).slice(0, 8)
      .map(g => ({ label: g.l.drug, sub: g.l.conc + ' · ' + g.l.size, value: g.vials, onClick: () => this.bump({ fDrug: g.l.drug, page: 'orders', ordPage: 0 }) }));
    const srcs = ['Portal · API', 'Portal · Batch', 'Manual'].map(k => ({ k, n: list.filter(o => o.source === k).length }));
    const tot = srcs.reduce((t, x) => t + x.n, 0), Cc = 2 * Math.PI * 70; let acc = 0;
    const donut = srcs.map(x => { const len = tot ? x.n / tot * Cc : 0; const seg = { color: A.SRC_COLOR[x.k], dash: len.toFixed(2) + ' ' + (Cc - len).toFixed(2), off: (-acc).toFixed(2), label: x.k, value: A.fN(x.n), pct: tot ? (x.n / tot * 100).toFixed(1) + '%' : '0%', onClick: () => this.bump({ fSrc: x.k === 'Manual' ? 'manual' : x.k, page: 'orders', ordPage: 0 }) }; acc += len; return seg; });
    const recent = list.slice().sort((x, y) => (x.created < y.created ? 1 : -1)).slice(0, 8);
    return {
      kpis, trend: this.trend('ov', list, from, to, s.fDrug),
      segOvMet: this.seg([['orders', 'Orders'], ['vials', 'Vials']], s.met.ov, v => this.setMet('ov', v)),
      segOvGrp: this.seg([['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly']], s.grp.ov, v => this.setGrp('ov', v)),
      segBarMet: this.seg([['orders', 'Orders'], ['vials', 'Vials']], metBar, v => this.setMet('bar', v)),
      phBars: A.bars(byPh), prodBars: A.bars(prods.map(p => ({ ...p })), n => A.fN(n)), donut, donutTotal: A.fN(tot),
      recentTable: A.T(['Order ID', 'Pharmacy', 'Medication', { l: 'Vials', align: 'right', arrow: '' }, 'Pharmacist', 'Created', 'Source'].map(h => (typeof h === 'string' ? A.H(h) : h)), this.orderRows(recent, ['id', 'pharmacy', 'med', 'vials', 'rph', 'date', 'source'])),
      viewAll: () => this.setState({ page: 'orders' }), hasReview: a.review > 0, reviewText: a.review + ' line item' + (a.review === 1 ? '' : 's') + ' couldn’t be mapped to a vial count and are excluded from vial totals until reviewed.',
      openReview: () => this.bump({ page: 'orders', reviewOnly: true, ordPage: 0 }), ovEmpty: list.length === 0, syncBanner: s.syncErr
    };
  }
  page_orders(from, to) {
    const s = this.state, A = this.A, phi = this.canPHI();
    let list = this.filt({ from, to, ph: s.fPh, drug: s.fDrug, rph: s.fRph, src: s.fSrc, voided: s.incVoided });
    if (s.reviewOnly) list = list.filter(o => o.review);
    const q = s.ordQ.trim().toLowerCase();
    if (q) list = list.filter(o => [o.id, o.poid, o.pharmacy, o.rph && o.rph.name, ...o.lines.map(l => l.drug), phi ? o.first : '', phi ? o.last : ''].some(x => x && String(x).toLowerCase().includes(q)));
    const { k, d } = s.sort; list = list.slice().sort((x, y) => { const a = this.sortVal(x, k), b = this.sortVal(y, k); return (a < b ? -1 : a > b ? 1 : 0) * d; });
    const per = 25, pages = Math.max(1, Math.ceil(list.length / per)), pg = Math.min(s.ordPage, pages - 1), rows = list.slice(pg * per, pg * per + per);
    const visible = A.COLS.filter(c => s.cols.includes(c.k) && (!c.phi || phi));
    const head = visible.map(c => A.H(c.l, { align: c.align, arrow: c.k === k ? (d > 0 ? '↑' : '↓') : '', onClick: () => this.setState({ sort: { k: c.k, d: c.k === k ? -d : (c.k === 'date' || c.k === 'vials' ? -1 : 1) }, ordPage: 0 }) }));
    this._ordList = list;
    return {
      ordersTable: A.T(head, this.orderRows(rows, visible.map(c => c.k)), q ? 'No orders match “' + s.ordQ + '”. Search covers order IDs, provider order IDs, medications, pharmacies, pharmacists' + (phi ? ' and patient names.' : '.') : undefined, '640px'),
      ordQ: s.ordQ, onOrdQ: e => this.setState({ ordQ: e.target.value, ordPage: 0 }), clearOrdQ: () => this.setState({ ordQ: '', q: '' }), hasOrdQ: !!s.ordQ,
      searchPh: phi ? 'Search order ID, provider ID, patient, medication…' : 'Search order ID, provider ID, medication…',
      ordCount: A.fN(list.length), ordVials: A.fN(list.reduce((t, o) => t + (o.status === 'Voided' ? 0 : o.vials), 0)),
      pageText: list.length ? 'Showing ' + A.fN(pg * per + 1) + '–' + A.fN(Math.min(list.length, pg * per + per)) + ' of ' + A.fN(list.length) : 'No results',
      pgLabel: 'Page ' + (pg + 1) + ' of ' + pages, prevOp: pg > 0 ? 1 : 0.35, nextOp: pg < pages - 1 ? 1 : 0.35,
      prevPage: () => pg > 0 && this.setState({ ordPage: pg - 1 }), nextPage: () => pg < pages - 1 && this.setState({ ordPage: pg + 1 }),
      colsOpen: s.colsOpen, toggleCols: () => this.setState({ colsOpen: !s.colsOpen }),
      colItems: A.COLS.map(c => { const on = s.cols.includes(c.k), locked = c.k === 'id', hidden = c.phi && !phi; return { l: c.l + (hidden ? ' (restricted)' : ''), on: on ? 1 : 0, op: hidden || locked ? 0.45 : 1, bg: on ? '#660C21' : '#FFFFFF', onClick: () => { if (locked || hidden) return; this.setState({ cols: on ? s.cols.filter(x => x !== c.k) : [...s.cols, c.k] }); } }; }),
      voidTog: this.tog(s.incVoided), toggleVoided: () => this.bump({ incVoided: !s.incVoided, ordPage: 0 }),
      reviewTog: this.tog(s.reviewOnly), toggleReview: () => this.bump({ reviewOnly: !s.reviewOnly, ordPage: 0 }),
      exportOrders: fmt => () => this.exportRows('detail', list, from, to, fmt, 'orders'),
      expCsv: () => this.exportRows('detail', list, from, to, 'csv', 'orders'), expXls: () => this.exportRows('detail', list, from, to, 'xls', 'orders')
    };
  }
  tog(on) { return { bg: on ? '#660C21' : '#FFFFFF', fg: on ? '#FFFFFF' : '#24040B', sh: on ? 'none' : 'inset 0 0 0 1.5px #E0D6C6', tick: on ? 1 : 0 }; }
  page_pharmacy(from, to, pf, pt) {
    const s = this.state, A = this.A, ph = s.paPh, list = this.filt({ from, to, ph }), prev = this.filt({ from: pf, to: pt, ph });
    const a = this.stats(list, 'all'), b = this.stats(prev, 'all');
    const groups = this.lineGroups(list, (o, l) => l.drug + '|' + l.conc + '|' + l.size).sort((x, y) => y.vials - x.vials);
    const C = A.C, totV = groups.reduce((t, g) => t + g.vials, 0);
    const rows = groups.map(g => [C(g.l.drug, { fw: 500 }), C(g.l.conc), C(g.l.size), C(A.fN(g.orders), { align: 'right' }), C(A.fN(g.vials), { align: 'right', fw: 500, badge: g.review ? g.review + ' review' : '' }), C(totV ? (g.vials / totV * 100).toFixed(1) + '%' : '—', { align: 'right', fg: '#6B6762' })]);
    if (groups.length) rows.push({ cells: [C('Total', { fw: 500 }), C(''), C(''), C(A.fN(a.orders) + ' orders', { align: 'right', fw: 500 }), C(A.fN(a.vials), { align: 'right', fw: 500 }), C('100%', { align: 'right', fw: 500 })], bg: '#FBF8F3' });
    const ol = list.slice().sort((x, y) => (x.created < y.created ? 1 : -1));
    return {
      paPh: ph, onPaPh: e => this.bump({ paPh: e.target.value }), phOpts: this.phOpts(false),
      paKpis: [this.kpi('Unique orders', a.orders, b.orders, A.I.box, 'vs prev. period'), this.kpi('Medication vials', a.vials, b.vials, A.I.vial, 'vs prev. period'), this.kpi('Formulations', a.prods, b.prods, A.I.layers, 'distinct'), this.kpi('Manual orders', a.manual, b.manual, A.I.manual, 'included in totals'), this.kpi('Avg vials / order', a.avg, b.avg, A.I.avg, 'active orders', 1)],
      paTrend: this.trend('pa', list, from, to), segPaMet: this.seg([['orders', 'Orders'], ['vials', 'Vials']], s.met.pa, v => this.setMet('pa', v)), segPaGrp: this.seg([['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly']], s.grp.pa, v => this.setGrp('pa', v)),
      paProdTable: A.T(['Drug', 'Concentration', 'Vial size', A.H('Orders', { align: 'right' }), A.H('Vials', { align: 'right' }), A.H('% of volume', { align: 'right' })], rows, 'No ' + ph + ' orders in this period.'),
      paOrdersTable: A.T(['Order ID', 'Provider order ID', 'Medication', 'Concentration', 'Vial size', A.H('Vials', { align: 'right' }), 'Created', 'Pharmacist', 'Source'], this.orderRows(ol, ['id', 'poid', 'med', 'conc', 'size', 'vials', 'date', 'rph', 'source']), 'No ' + ph + ' orders in this period.', '520px'),
      paOrderCount: A.fN(ol.length), paSummary: A.fN(a.orders) + ' orders · ' + A.fN(a.vials) + ' vials',
      paExpCsv: () => this.exportPharmacy(ph, list, groups, a, from, to, 'csv'), paExpXls: () => this.exportPharmacy(ph, list, groups, a, from, to, 'xls'),
      paReview: a.review > 0, paReviewText: a.review + ' line item' + (a.review === 1 ? '' : 's') + ' flagged for vial review — not included in the vial total.'
    };
  }
  page_product(from, to, pf, pt) {
    const s = this.state, A = this.A, C = A.C, drug = s.prDrug, list = this.filt({ from, to, drug }), prev = this.filt({ from: pf, to: pt, drug });
    const a = this.stats(list, drug), b = this.stats(prev, drug);
    const forms = this.lineGroups(list, (o, l) => l.drug + '|' + l.conc + '|' + l.size, drug).sort((x, y) => y.vials - x.vials);
    const top = forms[0];
    const all = this.filt({ from, to });
    const byDrug = this.lineGroups(all, (o, l) => l.drug).sort((x, y) => y.vials - x.vials).map(g => ({ label: g.l.drug, value: g.vials, color: drug === 'all' || drug === g.l.drug ? '#660C21' : '#D9C3C8', fw: drug === g.l.drug ? 500 : 400, onClick: () => this.bump({ prDrug: drug === g.l.drug ? 'all' : g.l.drug }) }));
    const byPh = this.lineGroups(list, o => o.pharmacy, drug).sort((x, y) => y.vials - x.vials).map(g => ({ label: g.o.pharmacy, value: g.vials, onClick: () => this.bump({ prPh: g.o.pharmacy }) }));
    const tbl = this.lineGroups(list, (o, l) => o.pharmacy + '|' + l.drug + '|' + l.conc + '|' + l.size, drug, null).filter(g => s.prPh === 'all' || g.o.pharmacy === s.prPh).sort((x, y) => (x.o.pharmacy + x.l.drug < y.o.pharmacy + y.l.drug ? -1 : 1));
    this._prodTbl = tbl;
    return {
      prDrug: drug, onPrDrug: e => this.bump({ prDrug: e.target.value }), prPh: s.prPh, onPrPh: e => this.bump({ prPh: e.target.value }),
      prKpis: [this.kpi('Orders', a.orders, b.orders, A.I.box, 'containing ' + (drug === 'all' ? 'any medication' : drug)), this.kpi('Vials', a.vials, b.vials, A.I.vial, 'vs prev. period'), this.kpi('Supplying pharmacies', a.phs, b.phs, A.I.pharmacy, 'with orders'), this.kpi('Most ordered formulation', top ? top.l.drug + ' ' + top.l.conc + ' · ' + top.l.size : '—', null, A.I.layers, top ? A.fN(top.vials) + ' vials' : '', 0, '21px')],
      prTopBars: A.bars(byDrug), prFormBars: A.bars(forms.slice(0, 8).map(g => ({ label: drug === 'all' ? g.l.drug : g.l.conc, sub: drug === 'all' ? g.l.conc + ' · ' + g.l.size : g.l.size + ' vial', value: g.vials }))),
      prPhBars: A.bars(byPh), prTrend: this.trend('pr', list, from, to, drug),
      segPrMet: this.seg([['orders', 'Orders'], ['vials', 'Vials']], s.met.pr, v => this.setMet('pr', v)), segPrGrp: this.seg([['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly']], s.grp.pr, v => this.setGrp('pr', v)),
      prTable: A.T(['Pharmacy', 'Medication', 'Concentration', 'Vial size', A.H('Orders', { align: 'right' }), A.H('Total vials', { align: 'right' })], tbl.map(g => [C(g.o.pharmacy), C(g.l.drug, { fw: 500 }), C(g.l.conc), C(g.l.size), C(A.fN(g.orders), { align: 'right' }), C(A.fN(g.vials), { align: 'right', fw: 500, badge: g.review ? g.review + ' review' : '' })]), undefined, '520px'),
      prExpCsv: () => this.exportRows('product', list, from, to, 'csv', 'products', { drug, ph: s.prPh }), prExpXls: () => this.exportRows('product', list, from, to, 'xls', 'products', { drug, ph: s.prPh }),
      prDrugLabel: drug === 'all' ? 'All medications' : drug
    };
  }
  page_pharmacist(from, to, pf, pt) {
    const s = this.state, A = this.A, C = A.C, ph = s.rpPh, list = this.filt({ from, to, ph }), prev = this.filt({ from: pf, to: pt, ph });
    const g = this.groupBy(list, o => (o.rph ? o.rph.id : 'unknown')), gp = this.groupBy(prev, o => (o.rph ? o.rph.id : 'unknown'));
    const attributed = list.filter(o => o.rph), pAttr = prev.filter(o => o.rph), un = list.length - attributed.length;
    const rows = [...A.RPH.map(r => ({ r, l: g.get(r.id) || [] })), { r: null, l: g.get('unknown') || [] }].filter(x => x.l.length).sort((x, y) => (x.r ? 0 : 1) - (y.r ? 0 : 1) || y.l.length - x.l.length);
    const sel = s.rphSel, selL = sel ? (g.get(sel) || []).slice().sort((x, y) => (x.created < y.created ? 1 : -1)) : [];
    const selName = sel === 'unknown' ? 'Unknown / not recorded' : sel ? (A.RPH.find(r => r.id === sel) || {}).name : '';
    return {
      rpPh: ph, onRpPh: e => this.bump({ rpPh: e.target.value, rphSel: null }),
      rpKpis: [this.kpi('Pharmacists with activity', A.RPH.filter(r => g.has(r.id)).length, A.RPH.filter(r => gp.has(r.id)).length, A.I.users, 'vs prev. period'), this.kpi('Orders created', attributed.length, pAttr.length, A.I.box, 'with pharmacist attribution'), this.kpi('Vials on those orders', attributed.reduce((t, o) => t + o.vials, 0), pAttr.reduce((t, o) => t + o.vials, 0), A.I.vial, 'vs prev. period'), this.kpi('Unattributed orders', un, prev.length - pAttr.length, A.I.alert, 'pharmacist not recorded')],
      rpTrend: this.trend('rp', attributed, from, to), segRpMet: this.seg([['orders', 'Orders'], ['vials', 'Vials']], s.met.rp, v => this.setMet('rp', v)), segRpGrp: this.seg([['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly']], s.grp.rp, v => this.setGrp('rp', v)),
      rpTable: A.T(['Pharmacist', 'Pharmacist ID', A.H('Orders created', { align: 'right' }), A.H('Vials', { align: 'right' }), 'Pharmacies', 'Last order'], rows.map(x => {
        const id = x.r ? x.r.id : 'unknown', phs = [...new Set(x.l.map(o => o.pharmacy))], last = x.l.reduce((m, o) => (o.date > m ? o.date : m), '');
        return { cells: [C(x.r ? x.r.name : 'Unknown / not recorded', { onClick: () => this.setState({ rphSel: sel === id ? null : id }) }), C(x.r ? x.r.id : '—', { fg: '#6B6762' }), C(A.fN(x.l.length), { align: 'right', fw: 500 }), C(A.fN(x.l.reduce((t, o) => t + o.vials, 0)), { align: 'right' }), C(phs.length + (phs.length === 1 ? ' pharmacy' : ' pharmacies'), { sub: phs.slice(0, 3).join(', ') + (phs.length > 3 ? '…' : '') }), C(A.fD(last))], bg: sel === id ? '#FBF3F4' : 'transparent' };
      })),
      hasRphSel: !!sel, rphSelName: selName, rphSelCount: A.fN(selL.length) + ' orders · ' + A.fN(selL.reduce((t, o) => t + o.vials, 0)) + ' vials', clearRph: () => this.setState({ rphSel: null }),
      rphOrdersTable: A.T(['Order ID', 'Pharmacy', 'Medication', A.H('Vials', { align: 'right' }), 'Created', 'Source'], this.orderRows(selL, ['id', 'pharmacy', 'med', 'vials', 'date', 'source']), undefined, '460px')
    };
  }
  page_manual(from, to, pf, pt) {
    const s = this.state, A = this.A, C = A.C, list = this.filt({ from, to, ph: s.fPh, src: 'manual', voided: true }), act = list.filter(o => o.status !== 'Voided');
    const prev = this.filt({ from: pf, to: pt, ph: s.fPh, src: 'manual' });
    const rc = {}; act.forEach(o => { rc[o.reason] = (rc[o.reason] || 0) + 1; }); const topR = Object.entries(rc).sort((a, b) => b[1] - a[1])[0];
    const ol = list.slice().sort((x, y) => (x.created < y.created ? 1 : -1));
    return {
      mKpis: [this.kpi('Manual orders', act.length, prev.length, A.I.manual, 'active, vs prev. period'), this.kpi('Vials on manual orders', act.reduce((t, o) => t + o.vials, 0), prev.reduce((t, o) => t + o.vials, 0), A.I.vial, 'vs prev. period'), this.kpi('Staff contributors', new Set(act.map(o => o.addedBy)).size, null, A.I.users, 'Record added by'), this.kpi('Most common reason', topR ? topR[0] : '—', null, A.I.alert, topR ? topR[1] + ' orders' : '', 0, '21px')],
      manualTable: A.T(['Order ID', 'Provider order ID', 'Pharmacy', 'Medication', A.H('Vials', { align: 'right' }), 'Order date', 'Reason', 'Record added by', 'Entry timestamp', 'Pharmacist'], ol.map(o => ({ cells: [this.cellFor(o, 'id'), C(o.poid), C(o.pharmacy), this.cellFor(o, 'med'), this.cellFor(o, 'vials'), C(A.fD(o.date)), C(o.reason, { tag: true, tagBg: '#F8E9EC', tagFg: '#660C21' }), C(o.addedBy), C(A.fT(o.created), { fg: '#6B6762' }), this.cellFor(o, 'rph')], bg: o.status === 'Voided' ? '#FBF9F6' : 'transparent' })), 'No manual orders in this period.', '600px'),
      openCsv: () => this.setState({ modal: 'csv', csv: { step: 'upload' } }),
      dlTemplate: () => { const h = A.CSV_FIELDS.map(f => f.k === 'pomId' ? 'pomegranate_order_id' : f.k === 'poid' ? 'provider_order_id' : f.l.toLowerCase().replace(/ /g, '_')); A.exportFile('manual-order-template', 'Manual order import template', [], [h, ['Hallandale', A.TODAY, '', 'HAL-1234567', 'Avery', 'Sample', '1980-04-12', 'Tirzepatide', '10 mg/mL', '1 mL', 1, 1, 'RPh-2041', 'Missed from portal']], 'csv'); },
      mExpCsv: () => this.exportRows('manual', list, from, to, 'csv', 'manual-orders'), mExpXls: () => this.exportRows('manual', list, from, to, 'xls', 'manual-orders')
    };
  }
  repRange(from, to) { const r = this.state.rep; let a = r.from || from, b = r.to || to; if (a > b) [a, b] = [b, a]; return [a, b]; }
  buildReport(type, list, opt) {
    const A = this.A, drug = opt.drug || 'all', lf = l => (!opt.conc || opt.conc === 'all' || l.conc === opt.conc) && (!opt.size || opt.size === 'all' || l.size === opt.size), phi = this.canPHI();
    if (opt.conc && opt.conc !== 'all' || opt.size && opt.size !== 'all') list = list.filter(o => o.lines.some(l => !l.supply && (drug === 'all' || l.drug === drug) && lf(l)));
    const vOf = o => o.lines.reduce((t, l) => t + (!l.supply && l.vials != null && (drug === 'all' || l.drug === drug) && lf(l) ? l.vials : 0), 0);
    if (type === 'phSummary') {
      const g = this.groupBy(list, o => o.pharmacy), rows = [...g].sort((a, b) => b[1].length - a[1].length).map(([k, l]) => { const v = l.reduce((t, o) => t + vOf(o), 0), f = new Set(); l.forEach(o => o.lines.forEach(x => !x.supply && f.add(x.drug + x.conc + x.size))); return [k, l.length, v, f.size, l.filter(o => o.manual).length, l.length ? +(v / l.length).toFixed(2) : 0]; });
      const tv = rows.reduce((t, r) => t + r[2], 0); if (rows.length) rows.push(['Total', list.length, tv, '', list.filter(o => o.manual).length, list.length ? +(tv / list.length).toFixed(2) : 0]);
      return { title: 'Pharmacy summary report', head: ['Pharmacy', 'Orders', 'Vials', 'Formulations', 'Manual orders', 'Avg vials/order'], rows, num: [1, 2, 3, 4, 5] };
    }
    if (type === 'detail') {
      const head = ['Order ID', 'Provider order ID', 'Pharmacy', 'Provider', 'Created (ET)', ...(phi ? ['Patient last', 'Patient first', 'Patient DOB'] : []), 'Drug', 'Concentration', 'Vial size', 'Quantity', 'Vials', 'Pharmacist', 'Pharmacist ID', 'Source', 'Record added by', 'Status', 'Note'];
      const rows = []; list.slice().sort((a, b) => (a.created < b.created ? -1 : 1)).forEach(o => o.lines.forEach(l => { if (!l.supply && drug !== 'all' && l.drug !== drug) return; if (!l.supply && !lf(l)) return; rows.push([o.id || '', o.poid, o.pharmacy, o.provider, o.date + ' ' + o.time, ...(phi ? [o.last, o.first, o.dob] : []), l.drug, l.conc, l.size, l.qty, l.supply ? 0 : l.vials == null ? '' : l.vials, o.rph ? o.rph.name : 'Unknown', o.rph ? o.rph.id : '', o.source, o.addedBy, o.status, l.supply ? 'Supply — not counted as vials' : l.review ? 'Needs vial review' : '']); }));
      return { title: 'Detailed pharmacy order report', head, rows, num: [] };
    }
    if (type === 'product') {
      const g = this.lineGroups(list.filter(o => !opt.ph || opt.ph === 'all' || o.pharmacy === opt.ph), (o, l) => o.pharmacy + '|' + l.drug + '|' + l.conc + '|' + l.size, drug, lf).sort((a, b) => (a.key < b.key ? -1 : 1));
      return { title: 'Product summary report', head: ['Pharmacy', 'Drug', 'Concentration', 'Vial size', 'Orders', 'Vials', 'Lines needing review'], rows: g.map(x => [x.o.pharmacy, x.l.drug, x.l.conc, x.l.size, x.orders, x.vials, x.review]), num: [4, 5, 6] };
    }
    if (type === 'pharmacist') {
      const g = this.groupBy(list, o => (o.rph ? o.rph.name + '|' + o.rph.id : 'Unknown|'));
      return { title: 'Pharmacist activity report', head: ['Pharmacist', 'Pharmacist ID', 'Orders created', 'Vials', 'Pharmacies', 'Last order'], rows: [...g].sort((a, b) => b[1].length - a[1].length).map(([k, l]) => [k.split('|')[0], k.split('|')[1], l.length, l.reduce((t, o) => t + vOf(o), 0), [...new Set(l.map(o => o.pharmacy))].join('; '), l.reduce((m, o) => (o.date > m ? o.date : m), '')]), num: [2, 3] };
    }
    const m = list.filter(o => o.manual);
    return { title: 'Manual orders report', head: ['Order ID', 'Provider order ID', 'Pharmacy', 'Order date', 'Reason', 'Vials', 'Pharmacist', 'Record added by', 'Entry timestamp (ET)', 'Status', 'Notes'], rows: m.map(o => [o.id || '', o.poid, o.pharmacy, o.date, o.reason, vOf(o), o.rph ? o.rph.name : 'Unknown', o.addedBy, o.created, o.status, o.notes || '']), num: [5] };
  }
  exportRows(type, list, from, to, fmt, name, opt) {
    const A = this.A, r = this.buildReport(type, list, opt || {});
    const file = A.exportFile('pomegranate-' + name + '-' + from + '-to-' + to, r.title, [['Date range', A.rangeLabel(from, to)], ['Timezone', 'America/New_York (ET)'], ['Records', list.length]], [r.head, ...r.rows], fmt);
    this.log('Report exported', r.title + ' · ' + file); this.toast('Downloaded ' + file);
  }
  exportPharmacy(ph, list, groups, a, from, to, fmt) {
    const A = this.A, det = this.buildReport('detail', list, {});
    const aoa = [['Summary'], ['Unique orders', a.orders], ['Medication vials', a.vials], ['Formulations', a.prods], ['Manual orders', a.manual], ['Lines needing vial review', a.review], [], ['Product breakdown'], ['Drug', 'Concentration', 'Vial size', 'Orders', 'Vials'], ...groups.map(g => [g.l.drug, g.l.conc, g.l.size, g.orders, g.vials]), [], ['Order detail'], det.head, ...det.rows];
    const file = A.exportFile('pomegranate-' + ph.toLowerCase().replace(/ /g, '-') + '-report-' + from + '-to-' + to, ph + ' pharmacy report', [['Pharmacy', ph], ['Billing period', A.rangeLabel(from, to)], ['Timezone', 'America/New_York (ET)']], aoa, fmt);
    this.log('Report exported', ph + ' pharmacy report · ' + file); this.toast('Downloaded ' + file);
  }
  page_reports(from, to) {
    const s = this.state, A = this.A, C = A.C, r = s.rep, [a, b] = this.repRange(from, to);
    const set = (k, v) => this.bump({ rep: { ...r, [k]: v, ...(k === 'drug' ? { conc: 'all', size: 'all' } : k === 'conc' ? { size: 'all' } : {}) } });
    const list = this.filt({ from: a, to: b, ph: r.ph, drug: r.drug, rph: r.rph, src: r.src });
    const rep = this.buildReport(r.type, list, { drug: r.drug, conc: r.conc, size: r.size, ph: r.ph });
    const forms = Object.values(this.CAT).flat().filter(f => r.drug === 'all' || f[0] === r.drug);
    const concs = [...new Set(forms.map(f => f[1]))].sort(), sizes = [...new Set(forms.filter(f => r.conc === 'all' || f[1] === r.conc).map(f => f[2]))].sort();
    const TYPES = [['phSummary', 'Pharmacy summary', 'Orders and vials by pharmacy'], ['detail', 'Detailed pharmacy orders', 'Every order line with pharmacist'], ['product', 'Product summary', 'By medication, concentration, vial size'], ['pharmacist', 'Pharmacist activity', 'Orders and vials per pharmacist'], ['manual', 'Manual orders', 'Manual entries and who added them']];
    const preview = rep.rows.slice(0, 12);
    return {
      repTypes: TYPES.map(([k, l, d]) => ({ l, d, bg: r.type === k ? '#FBF3F4' : '#FFFFFF', sh: r.type === k ? 'inset 0 0 0 1.5px #660C21' : 'inset 0 0 0 1px #EAE0D1', dot: r.type === k ? '#660C21' : '#FFFFFF', ring: r.type === k ? 'inset 0 0 0 4px #660C21' : 'inset 0 0 0 1.5px #CFC3B1', onClick: () => this.bump({ rep: { ...r, type: k } }) })),
      repFrom: a, repTo: b, onRepFrom: e => set('from', e.target.value), onRepTo: e => set('to', e.target.value),
      repPh: r.ph, onRepPh: e => set('ph', e.target.value), repDrug: r.drug, onRepDrug: e => set('drug', e.target.value),
      repConc: r.conc, onRepConc: e => set('conc', e.target.value), concOpts: [{ v: 'all', l: 'All concentrations' }, ...concs.map(c => ({ v: c, l: c }))],
      repSize: r.size, onRepSize: e => set('size', e.target.value), sizeOpts: [{ v: 'all', l: 'All vial sizes' }, ...sizes.map(c => ({ v: c, l: c }))],
      repRph: r.rph, onRepRph: e => set('rph', e.target.value), repSrc: r.src, onRepSrc: e => set('src', e.target.value),
      repReset: () => this.bump({ rep: { type: r.type, from: '', to: '', ph: 'all', drug: 'all', conc: 'all', size: 'all', rph: 'all', src: 'all' } }),
      repTitle: rep.title, repMeta: A.rangeLabel(a, b) + ' · ET · ' + A.fN(list.length) + ' orders · ' + A.fN(rep.rows.length) + ' rows',
      repPreview: A.T(rep.head.map((h, i) => A.H(h, { align: rep.num.includes(i) ? 'right' : 'left' })), preview.map(row => row.map((c, i) => C(typeof c === 'number' ? A.fN(c) : c, { align: rep.num.includes(i) ? 'right' : 'left', fw: row[0] === 'Total' ? 500 : 400 }))), 'No records match these report filters.'),
      repMore: rep.rows.length > 12, repMoreText: 'Preview shows 12 of ' + A.fN(rep.rows.length) + ' rows. The export includes all rows.',
      repCsv: () => this.exportRows(r.type, list, a, b, 'csv', r.type, { drug: r.drug, conc: r.conc, size: r.size, ph: r.ph }), repXls: () => this.exportRows(r.type, list, a, b, 'xls', r.type, { drug: r.drug, conc: r.conc, size: r.size, ph: r.ph })
    };
  }
  page_settings() {
    const s = this.state, A = this.A, C = A.C;
    const tabs = [['pharmacies', 'Pharmacies'], ['catalog', 'Product catalog'], ['users', 'User permissions'], ['audit', 'Audit log']];
    const counts = {}; s.orders.forEach(o => o.lines.forEach(l => { if (!l.supply) { const k = o.pharmacy + '|' + l.drug + '|' + l.conc + '|' + l.size; counts[k] = (counts[k] || 0) + 1; } }));
    const catRows = Object.entries(this.CAT).flatMap(([p, fs]) => fs.map(f => [C(p), C(f[0], { fw: 500 }), C(f[1]), C(f[2]), C('1 unit = 1 vial', { fg: '#6B6762' }), C(A.fN(counts[p + '|' + f[0] + '|' + f[1] + '|' + f[2]] || 0), { align: 'right' }), C('Mapped', { tag: true, tagBg: '#EDF3EE', tagFg: '#3F6E4E' })]));
    catRows.push([C('All pharmacies'), C('Syringes (insulin, 0.5 mL)', { fw: 500 }), C('—'), C('—'), C('Supply — not a vial', { fg: '#6B6762' }), C('—', { align: 'right' }), C('Excluded', { tag: true })]);
    catRows.push([C('Any'), C('Kit (multi-item)', { fw: 500 }), C('—'), C('—'), C('Unknown vial count', { fg: '#6B6762' }), C(A.fN(s.orders.reduce((t, o) => t + o.lines.filter(l => l.review).length, 0)), { align: 'right' }), C('Needs mapping', { tag: true, tagBg: '#FCF1DF', tagFg: '#8A5A12' })]);
    const upd = (i, patch) => this.setState(st => ({ pharmacies: st.pharmacies.map((p, j) => (j === i ? { ...p, ...patch } : p)) }));
    return {
      setTabs: tabs.map(([k, l]) => ({ l, bg: s.setTab === k ? '#FFFFFF' : 'transparent', fg: s.setTab === k ? '#24040B' : '#6B6762', sh: s.setTab === k ? '0 1px 3px rgba(36,4,11,0.14)' : 'none', onClick: () => this.setState({ setTab: k }) })),
      tabPh: s.setTab === 'pharmacies', tabCat: s.setTab === 'catalog', tabUsers: s.setTab === 'users', tabAudit: s.setTab === 'audit',
      phRows: s.pharmacies.map((p, i) => {
        const n = s.orders.filter(o => o.pharmacy === p.name).length;
        return { name: p.name, edit: p.edit, count: A.fN(n) + ' orders', status: p.active ? 'Active' : 'Inactive', sBg: p.active ? '#EDF3EE' : '#EEE9E2', sFg: p.active ? '#3F6E4E' : '#6B6762', togLabel: p.active ? 'Deactivate' : 'Activate', dirty: p.edit.trim() !== p.name && p.edit.trim() !== '',
          onEdit: e => upd(i, { edit: e.target.value }),
          onSave: () => { const nn = p.edit.trim(); if (s.pharmacies.some((q, j) => j !== i && q.name.toLowerCase() === nn.toLowerCase())) { this.toast('A pharmacy named ' + nn + ' already exists'); return; } const old = p.name; this.setState(st => ({ pharmacies: st.pharmacies.map((q, j) => (j === i ? { ...q, name: nn, edit: nn } : q)), orders: st.orders.map(o => (o.pharmacy === old ? { ...o, pharmacy: nn, provider: o.provider === old ? nn : o.provider } : o)), paPh: st.paPh === old ? nn : st.paPh, fPh: st.fPh === old ? nn : st.fPh })); this.CAT[nn] = this.CAT[old]; delete this.CAT[old]; this.log('Pharmacy renamed', old + ' → ' + nn); this.toast('Renamed ' + old + ' to ' + nn); },
          onToggle: () => { upd(i, { active: !p.active }); this.log(p.active ? 'Pharmacy deactivated' : 'Pharmacy activated', p.name); } };
      }),
      newPh: s.newPh, onNewPh: e => this.setState({ newPh: e.target.value }),
      addPh: () => { const n = s.newPh.trim(); if (!n) return; if (s.pharmacies.some(p => p.name.toLowerCase() === n.toLowerCase())) { this.toast(n + ' is already in the directory'); return; } this.CAT[n] = []; this.setState({ pharmacies: [...s.pharmacies, { name: n, active: true, edit: n }], newPh: '' }); this.log('Pharmacy added', n); this.toast(n + ' added to the pharmacy directory'); },
      catTable: A.T(['Pharmacy', 'Medication', 'Concentration', 'Vial size', 'Vial rule', A.H('Lines (all time)', { align: 'right' }), 'Status'], catRows, undefined, '560px'),
      userRows: s.users.map((u, i) => ({ name: u.name, email: u.email, role: u.role, last: u.last, onRole: e => { const role = e.target.value; this.setState(st => ({ users: st.users.map((x, j) => (j === i ? { ...x, role } : x)) })); this.log('Permission changed', u.name + ' → ' + role); } })),
      roleOpts: ['Administrator', 'Pharmacy Operations', 'Read-only Management'].map(r => ({ v: r, l: r })),
      auditTable: A.T(['Timestamp', 'User', 'Action', 'Details'], s.audit.slice(0, 60).map(e => [C(A.fT(e.ts), { fg: '#6B6762' }), C(e.user), C(e.action, { tag: true, tagBg: /void/i.test(e.action) ? '#EEE9E2' : /manual|edit/i.test(e.action) ? '#F8E9EC' : '#F3ECE2', tagFg: /manual|edit/i.test(e.action) ? '#660C21' : '#4A4540' }), C(e.detail)]), 'No audit events yet.', '600px')
    };
  }
  drawerVals() {
    const s = this.state, A = this.A, o = s.drawer && s.orders.find(x => x.uid === s.drawer);
    if (!o) return { drawerOpen: false };
    const phi = this.canPHI(), canEd = this.canEdit() && o.manual;
    const sec = (title, items) => ({ title, items: items.map(([l, v]) => ({ l, v: v == null || v === '' ? '—' : String(v) })) });
    return {
      drawerOpen: true, closeDrawer: () => this.setState({ drawer: null }),
      dTitle: o.id || 'Order without Pomegranate ID', dSub: o.pharmacy + ' · ' + A.fT(o.created),
      dManual: o.manual, dVoided: o.status === 'Voided', dReview: o.review,
      dSecA: [sec('Order information', [['Order ID', o.id || 'Not available'], ['Provider order ID', o.poid || 'Not available'], ['Pharmacy', o.pharmacy], ['Provider', o.provider], ['Order created', A.fT(o.date + ' ' + o.time)], ['Source', o.source + (o.manual && o.reason ? ' · ' + o.reason : '')]]),
        sec('Patient information', phi ? [['Patient name', o.first + ' ' + o.last + ' (sample)'], ['Date of birth', A.fD(o.dob)]] : [['Patient name', 'Restricted for your role'], ['Date of birth', 'Restricted for your role']])],
      dLines: o.lines.map(l => ({ drug: l.drug, meta: l.supply ? 'Medical supply · ' + l.unit : l.conc + ' · ' + l.size + ' vial', qty: 'Qty ' + l.qty, vials: l.supply ? 'Not counted' : l.review ? 'Needs review' : l.vials + (l.vials === 1 ? ' vial' : ' vials'), vfg: l.supply ? '#8A847B' : l.review ? '#8A5A12' : '#24040B' })),
      dVials: A.fN(o.vials) + (o.vials === 1 ? ' vial' : ' vials'),
      dSecB: [sec('Pharmacist', [['Order created by', o.rph ? o.rph.name : 'Unknown / not recorded'], ['Pharmacist ID', o.rph ? o.rph.id : ''], ['Attribution source', o.manual ? 'Entered manually' : 'Orders Dashboard']]),
        sec('Record', [['Record type', o.manual ? 'Manual entry' : 'Imported from order portal'], ['Record added by', o.addedBy], ['Record created', A.fT(o.created)], ['Last modified', A.fT(o.modified)], ['Status', o.status], ['Internal record ID', o.uid]])],
      dHasNotes: !!o.notes, dNotes: o.notes, dCanEdit: canEd,
      dEdit: () => this.openManual(o),
      dVoidLabel: o.status === 'Voided' ? 'Restore record' : 'Void record',
      dVoid: () => { const ns = o.status === 'Voided' ? 'Active' : 'Voided'; this.setState(st => ({ orders: st.orders.map(x => (x.uid === o.uid ? { ...x, status: ns, modified: A.nowTs() } : x)) })); this.log(ns === 'Voided' ? 'Record voided' : 'Record restored', (o.id || o.poid) + ' · ' + o.pharmacy); this.toast(ns === 'Voided' ? 'Record voided — excluded from active metrics, kept for audit' : 'Record restored'); }
    };
  }
  blankForm() { return { editUid: null, pharmacy: '', provider: '', pomId: '', poid: '', date: this.A.TODAY, reason: '', first: '', last: '', dob: '', rph: '', notes: '', lines: [{ drug: '', conc: '', size: '', qty: '1', vials: '1', vEd: false }] }; }
  openManual(o) {
    const f = o ? { editUid: o.uid, pharmacy: o.pharmacy, provider: o.provider, pomId: o.id, poid: o.poid, date: o.date, reason: o.reason, first: o.first, last: o.last, dob: o.dob, rph: o.rph ? o.rph.id : 'unknown', notes: o.notes || '', lines: o.lines.filter(l => !l.supply).map(l => ({ drug: l.drug, conc: l.conc, size: l.size, qty: String(l.qty), vials: l.vials == null ? '' : String(l.vials), vEd: true })) } : this.blankForm();
    this.setState({ modal: 'manual', form: f, fErr: {}, lErr: [], fStep: 'edit', dups: [], drawer: null, profileOpen: false });
  }
  setF(k, v) { this.setState(s => { const f = { ...s.form, [k]: v }; if (k === 'pharmacy' && (!s.form.provider || s.form.provider === s.form.pharmacy)) f.provider = v; return { form: f, fErr: { ...s.fErr, [k]: '' } }; }); }
  setL(i, k, v) { this.setState(s => { const lines = s.form.lines.map((l, j) => { if (j !== i) return l; const n = { ...l, [k]: v }; if (k === 'drug') { n.conc = ''; n.size = ''; } if (k === 'conc') n.size = ''; if (k === 'qty' && !l.vEd) n.vials = v; if (k === 'vials') n.vEd = true; return n; }); const le = s.lErr.slice(); le[i] = ''; return { form: { ...s.form, lines }, lErr: le }; }); }
  validate(f) {
    const e = {}, le = [];
    if (!f.pharmacy) e.pharmacy = 'Select a pharmacy';
    if (!f.date) e.date = 'Enter the order date'; else if (f.date > this.A.TODAY) e.date = 'Order date can’t be in the future';
    if (!f.reason) e.reason = 'Select why this order is entered manually';
    if (!f.last.trim()) e.last = 'Required to identify the order';
    if (!f.first.trim()) e.first = 'Required to identify the order';
    if (f.dob && f.dob >= this.A.TODAY) e.dob = 'Enter a valid date of birth';
    if (!f.rph) e.rph = 'Select a pharmacist, or Unknown if not recorded';
    f.lines.forEach((l, i) => {
      const q = Number(l.qty), v = Number(l.vials);
      if (!l.drug || !l.conc || !l.size) le[i] = 'Choose drug, concentration and vial size';
      else if (l.qty === '' || !Number.isInteger(q) || q < 1) le[i] = 'Quantity must be a whole number of 1 or more';
      else if (l.vials === '' || !Number.isInteger(v) || v < 0) le[i] = 'Vial count must be a whole number of 0 or more';
      else if (v > q * 10) le[i] = 'Vial count looks too high for this quantity';
    });
    return { e, le, ok: !Object.keys(e).length && !le.some(Boolean) };
  }
  findDups(f) {
    const out = [];
    this.state.orders.forEach(o => {
      if (o.uid === f.editUid || out.length >= 3) return;
      let why = '';
      if (f.pomId && o.id && o.id.toLowerCase() === f.pomId.trim().toLowerCase()) why = 'Same Pomegranate order ID';
      else if (f.poid && o.poid && o.poid.toLowerCase() === f.poid.trim().toLowerCase()) why = 'Same provider order ID';
      else if (o.pharmacy === f.pharmacy && o.date === f.date && o.last.toLowerCase() === f.last.trim().toLowerCase() && o.lines.some(l => f.lines.some(x => x.drug === l.drug))) why = 'Same pharmacy, patient, date and medication';
      if (why) out.push({ why, label: (o.id || o.poid) + ' · ' + o.pharmacy + ' · ' + this.A.fD(o.date), open: () => this.setState({ modal: null, drawer: o.uid }) });
    });
    return out;
  }
  saveForm() {
    const A = this.A, f = this.state.form, rph = f.rph === 'unknown' ? null : A.RPH.find(r => r.id === f.rph) || null;
    const lines = f.lines.map(l => ({ drug: l.drug, conc: l.conc, size: l.size, qty: Number(l.qty), vials: Number(l.vials), supply: false, review: false, unit: 'Vial' }));
    if (f.editUid) {
      this.setState(s => ({ orders: s.orders.map(o => (o.uid === f.editUid ? A.finish({ ...o, pharmacy: f.pharmacy, provider: f.provider || f.pharmacy, id: f.pomId.trim(), poid: f.poid.trim(), date: f.date, reason: f.reason, first: f.first.trim(), last: f.last.trim(), dob: f.dob, rph, notes: f.notes, lines: lines.concat(o.lines.filter(l => l.supply)), modified: A.nowTs() }) : o)), modal: null, drawer: f.editUid }));
      this.log('Manual order edited', (f.pomId || f.poid || 'No ID') + ' · ' + f.pharmacy); this.toast('Changes saved');
    } else {
      const ts = A.nowTs(), o = A.finish({ uid: 'rec_m' + Date.now(), id: f.pomId.trim(), poid: f.poid.trim(), provider: f.provider || f.pharmacy, pharmacy: f.pharmacy, first: f.first.trim(), last: f.last.trim(), dob: f.dob, date: f.date, time: ts.slice(11), rph, source: 'Manual', manual: true, reason: f.reason, addedBy: A.USER, status: 'Active', lines, notes: f.notes, created: ts, modified: ts });
      this.setState(s => ({ orders: [...s.orders, o], modal: null }));
      this.log('Manual order created', (o.id || o.poid || 'No ID') + ' · ' + o.pharmacy); this.toast('Manual order added · ' + A.fN(o.vials) + (o.vials === 1 ? ' vial' : ' vials') + ' at ' + o.pharmacy);
    }
  }
  csvLoad(text, name) {
    const A = this.A, rows = A.parseCSV(text); if (rows.length < 2) { this.setState({ csv: { step: 'upload', err: 'That file has no data rows.' } }); return; }
    const headers = rows[0].map(h => h.trim()), map = {};
    A.CSV_FIELDS.forEach(f => { const i = headers.findIndex(h => f.m.some(m => h.toLowerCase().replace(/[\s-]/g, '_').includes(m))); map[f.k] = i; });
    this.setState({ csv: { step: 'map', name, headers, data: rows.slice(1), map } });
  }
  sampleCsv() {
    const A = this.A, c = this.CAT, ex = this.state.orders.find(o => o.pharmacy === 'Hallandale' && !o.manual);
    const f = (p, i) => c[p][i % c[p].length];
    const r = [['pharmacy', 'order_date', 'pomegranate_order_id', 'provider_order_id', 'patient_first', 'patient_last', 'patient_dob', 'drug', 'concentration', 'vial_size', 'quantity', 'vial_count', 'pharmacist_id', 'reason']];
    [['Hallandale', 0, '2026-10-09', 'HAL-3100421', 2], ['Empower', 0, '2026-10-10', 'EMP-3100977', 1], ['Millers', 1, '2026-10-11', 'MIL-3101210', 1], ['Reshape', 0, '2026-10-12', 'RSH-3101654', 3], ['NewLife', 1, '2026-10-12', 'NLF-3101802', 1]].forEach(([p, i, d, id, q]) => { const fm = f(p, i); r.push([p, d, '', id, 'Avery', 'Sample', '1984-03-18', fm[0], fm[1], fm[2], q, q, 'RPh-2112', 'No API integration']); });
    const fm = f('Hallandale', 0); r.push(['Hallandale', ex.date, ex.id, ex.poid, 'Riley', 'Demo', '1979-11-02', fm[0], fm[1], fm[2], 1, 1, 'RPh-2041', 'Missed from portal']);
    r.push(['Hyalo', '2026-10-13', '', 'HYA-3102200', 'Quinn', 'Example', '1990-06-21', f('Hyalo', 0)[0], f('Hyalo', 0)[1], f('Hyalo', 0)[2], -1, -1, '', 'Processed manually']);
    r.push(['Unknown Pharmacy Co', '2026-10-13', '', 'UNK-1', 'Harper', 'Specimen', '1988-01-09', 'Tirzepatide', '10 mg/mL', '1 mL', 1, 1, '', 'Operational exception']);
    return r.map(x => x.join(',')).join('\n');
  }
  csvCheck(c) {
    const A = this.A, phs = this.state.pharmacies.map(p => p.name), get = (row, k) => (c.map[k] >= 0 ? (row[c.map[k]] || '').trim() : '');
    const missing = A.CSV_FIELDS.filter(f => f.req && !(c.map[f.k] >= 0)).map(f => f.l);
    return { missing, rows: c.data.map(row => {
      const r = {}; A.CSV_FIELDS.forEach(f => { r[f.k] = get(row, f.k); });
      let status = 'Valid', note = '';
      const q = Number(r.qty), v = Number(r.vials);
      if (!phs.includes(r.pharmacy)) { status = 'Error'; note = 'Pharmacy not in directory'; }
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date) || r.date > A.TODAY) { status = 'Error'; note = 'Invalid order date'; }
      else if (!r.drug || !r.conc || !r.size) { status = 'Error'; note = 'Missing medication details'; }
      else if (!Number.isInteger(q) || q < 1 || !Number.isInteger(v) || v < 0) { status = 'Error'; note = 'Invalid quantity or vial count'; }
      else if (!r.last) { status = 'Error'; note = 'Missing patient last name'; }
      else { const d = this.findDups({ editUid: null, pomId: r.pomId, poid: r.poid, pharmacy: r.pharmacy, date: r.date, last: r.last, lines: [{ drug: r.drug }] }); if (d.length) { status = 'Duplicate'; note = d[0].why + ' as ' + d[0].label; } }
      return { r, status, note };
    }) };
  }
  modalVals() {
    const s = this.state, A = this.A;
    if (s.modal === 'manual' && s.form) {
      const f = s.form, e = s.fErr, cat = f.pharmacy && this.CAT[f.pharmacy] && this.CAT[f.pharmacy].length ? this.CAT[f.pharmacy] : A.FORMS;
      const opt = a => [{ v: '', l: 'Select' }, ...[...new Set(a)].map(x => ({ v: x, l: x }))];
      const keys = ['pharmacy', 'provider', 'pomId', 'poid', 'date', 'reason', 'first', 'last', 'dob', 'rph', 'notes'], fset = {}, fe = {}, fb = {};
      keys.forEach(k => { fset[k] = ev => this.setF(k, ev.target.value); fe[k] = e[k] || ''; fb[k] = e[k] ? '#A3203E' : '#E0D6C6'; });
      const rphObj = A.RPH.find(r => r.id === f.rph);
      const lines = f.lines.map((l, i) => ({ ...l, n: i + 1, err: s.lErr[i] || '', hasErr: !!s.lErr[i], bc: s.lErr[i] ? '#A3203E' : '#E0D6C6',
        drugOpts: opt(cat.map(x => x[0])), concOpts: opt(cat.filter(x => x[0] === l.drug).map(x => x[1])), sizeOpts: opt(cat.filter(x => x[0] === l.drug && x[1] === l.conc).map(x => x[2])),
        onDrug: ev => this.setL(i, 'drug', ev.target.value), onConc: ev => this.setL(i, 'conc', ev.target.value), onSize: ev => this.setL(i, 'size', ev.target.value),
        onQty: ev => this.setL(i, 'qty', ev.target.value), onVials: ev => this.setL(i, 'vials', ev.target.value),
        canRemove: f.lines.length > 1, remove: () => this.setState(st => ({ form: { ...st.form, lines: st.form.lines.filter((_, j) => j !== i) }, lErr: st.lErr.filter((_, j) => j !== i) })) }));
      const totalV = f.lines.reduce((t, l) => t + (Number(l.vials) || 0), 0);
      return {
        manualOpen: true, csvOpen: false, closeModal: () => this.setState({ modal: null }), form: f, fset, fe, fb, fLines: lines,
        mTitle: f.editUid ? 'Edit manual order' : 'Add manual order', mSaveLabel: f.editUid ? 'Save changes' : 'Create order',
        formPhOpts: [{ v: '', l: 'Select pharmacy' }, ...this.state.pharmacies.filter(p => p.active || p.name === f.pharmacy).map(p => ({ v: p.name, l: p.name }))],
        reasonOpts: [{ v: '', l: 'Select reason' }, ...A.REASONS.map(r => ({ v: r, l: r }))],
        formRphOpts: [{ v: '', l: 'Select pharmacist' }, ...A.RPH.map(r => ({ v: r.id, l: r.name })), { v: 'unknown', l: 'Unknown — not recorded' }],
        rphIdText: rphObj ? rphObj.id : f.rph === 'unknown' ? 'Not available' : '—',
        addLine: () => this.setState(st => ({ form: { ...st.form, lines: [...st.form.lines, { drug: '', conc: '', size: '', qty: '1', vials: '1', vEd: false }] } })),
        totalVials: A.fN(totalV) + (totalV === 1 ? ' vial' : ' vials'), entryTs: f.editUid ? 'Original entry kept · edit logged' : 'Set automatically on save', addedByText: A.USER + ' (you)',
        isEditStep: s.fStep === 'edit', isConfirmStep: s.fStep === 'confirm', maxDate: A.TODAY,
        reviewForm: () => { const r = this.validate(f); if (!r.ok) { this.setState({ fErr: r.e, lErr: r.le }); this.toast('Check the highlighted fields'); return; } this.setState({ fStep: 'confirm', dups: this.findDups(f) }); },
        backToEdit: () => this.setState({ fStep: 'edit' }), saveForm: () => this.saveForm(),
        hasDups: s.dups.length > 0, dups: s.dups,
        cSummary: [['Pharmacy', f.pharmacy], ['Order date', A.fD(f.date)], ['Pomegranate order ID', f.pomId || 'Not available'], ['Provider order ID', f.poid || 'Not available'], ['Reason', f.reason], ['Patient', this.canPHI() ? f.first + ' ' + f.last : 'Restricted'], ['Pharmacist', rphObj ? rphObj.name + ' · ' + rphObj.id : 'Unknown'], ['Record added by', A.USER]].map(([l, v]) => ({ l, v })),
        cLines: f.lines.map(l => ({ t: l.drug + ' · ' + l.conc + ' · ' + l.size, q: 'Qty ' + l.qty + ' · ' + l.vials + (l.vials === '1' ? ' vial' : ' vials') }))
      };
    }
    if (s.modal === 'csv' && s.csv) {
      const c = s.csv, base = { manualOpen: false, csvOpen: true, closeModal: () => this.setState({ modal: null, csv: null }), csvUpload: c.step === 'upload', csvMap: c.step === 'map', csvDone: c.step === 'done', csvErr: c.err || '', hasCsvErr: !!c.err };
      if (c.step === 'upload') return { ...base, onCsvFile: ev => { const file = ev.target.files && ev.target.files[0]; if (file) file.text().then(t => this.csvLoad(t, file.name)); }, useSample: () => this.csvLoad(this.sampleCsv(), 'sample-missing-orders.csv') };
      if (c.step === 'map') {
        const chk = this.csvCheck(c), C = A.C, cnt = k => chk.rows.filter(r => r.status === k).length;
        return { ...base, csvName: c.name, csvRowsText: A.fN(c.data.length) + ' rows',
          csvFields: A.CSV_FIELDS.map(f => ({ l: f.l + (f.req ? ' *' : ''), val: String(c.map[f.k]), opts: [{ v: '-1', l: '— Not mapped —' }, ...c.headers.map((h, i) => ({ v: String(i), l: h }))], onChange: ev => this.setState(st => ({ csv: { ...st.csv, map: { ...st.csv.map, [f.k]: Number(ev.target.value) } } })), bc: f.req && !(c.map[f.k] >= 0) ? '#A3203E' : '#E0D6C6' })),
          csvMissing: chk.missing.length > 0, csvMissingText: 'Map required fields: ' + chk.missing.join(', '),
          csvPreview: A.T(['Status', 'Pharmacy', 'Order date', 'Provider order ID', 'Medication', A.H('Qty', { align: 'right' }), A.H('Vials', { align: 'right' }), 'Note'], chk.rows.map(x => [C(x.status, { tag: true, tagBg: x.status === 'Valid' ? '#EDF3EE' : x.status === 'Duplicate' ? '#FCF1DF' : '#F8E9EC', tagFg: x.status === 'Valid' ? '#3F6E4E' : x.status === 'Duplicate' ? '#8A5A12' : '#8A1F36' }), C(x.r.pharmacy), C(x.r.date), C(x.r.poid), C(x.r.drug, { sub: [x.r.conc, x.r.size].filter(Boolean).join(' · ') }), C(x.r.qty, { align: 'right' }), C(x.r.vials, { align: 'right' }), C(x.note, { fg: '#6B6762' })]), undefined, '320px'),
          csvValid: cnt('Valid'), csvDup: cnt('Duplicate'), csvBad: cnt('Error'), csvImportLabel: 'Import ' + cnt('Valid') + ' valid record' + (cnt('Valid') === 1 ? '' : 's'), csvImportOp: chk.missing.length || !cnt('Valid') ? 0.4 : 1,
          csvBack: () => this.setState({ csv: { step: 'upload' } }),
          csvImport: () => {
            if (chk.missing.length || !cnt('Valid')) return; const ts = A.nowTs();
            const add = chk.rows.filter(x => x.status === 'Valid').map((x, i) => A.finish({ uid: 'rec_c' + Date.now() + i, id: x.r.pomId, poid: x.r.poid, provider: x.r.pharmacy, pharmacy: x.r.pharmacy, first: x.r.first, last: x.r.last, dob: x.r.dob, date: x.r.date, time: '12:00', rph: A.RPH.find(p => p.id === x.r.rph) || null, source: 'Manual', manual: true, reason: x.r.reason || 'Operational exception', addedBy: A.USER, status: 'Active', lines: [{ drug: x.r.drug, conc: x.r.conc, size: x.r.size, qty: Number(x.r.qty), vials: Number(x.r.vials), supply: false, review: false, unit: 'Vial' }], notes: 'Imported from ' + c.name, created: ts, modified: ts }));
            this.setState(st => ({ orders: [...st.orders, ...add], csv: { step: 'done', name: c.name, sum: { ok: add.length, dup: cnt('Duplicate'), bad: cnt('Error'), vials: add.reduce((t, o) => t + o.vials, 0) } } }));
            this.log('CSV import', c.name + ' · ' + add.length + ' imported, ' + cnt('Duplicate') + ' duplicates skipped, ' + cnt('Error') + ' errors');
          } };
      }
      return { ...base, sumOk: A.fN(c.sum.ok), sumDup: A.fN(c.sum.dup), sumBad: A.fN(c.sum.bad), sumVials: A.fN(c.sum.vials), csvName: c.name, csvFinish: () => this.setState({ modal: null, csv: null, page: 'manual' }) };
    }
    return { manualOpen: false, csvOpen: false };
  }
  renderVals() {
    const s = this.state;
    if (!s.ready) return { ready: false, notReady: true, contentOpacity: 0.4 };
    const A = this.A, [from, to] = this.range(), [pf, pt] = this.prevRange(from, to), canEdit = this.canEdit(), isAdmin = s.role === 'Administrator';
    const NAV = [['overview', 'Overview', A.I.overview], ['orders', 'All orders', A.I.orders], ['pharmacy', 'Pharmacy analytics', A.I.pharmacy], ['product', 'Product analytics', A.I.vial], ['pharmacist', 'Pharmacist analytics', A.I.pharmacist], ['manual', 'Manual orders', A.I.manual], ['reports', 'Reports & exports', A.I.reports]];
    if (isAdmin) NAV.push(['settings', 'Settings', A.I.settings]);
    const go = p => this.setState({ page: p, profileOpen: false, colsOpen: false });
    const v = {
      ready: true, page: s.page, notReady: false, contentOpacity: s.loading ? 0.5 : 1, loading: s.loading,
      collapsed: s.collapsed, showLabels: !s.collapsed, sideW: s.collapsed ? '76px' : '248px',
      toggleSide: () => this.setState({ collapsed: !s.collapsed }), collapseIcon: s.collapsed ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6',
      nav: NAV.map(([k, l, ic]) => ({ label: l, icon: ic, onClick: () => go(k), bg: s.page === k ? '#F6E9EC' : 'transparent', fg: s.page === k ? '#660C21' : '#4A4540', fw: s.page === k ? 500 : 400 })),
      crumb: (NAV.find(n => n[0] === s.page) || NAV[0])[1],
      q: s.q, onQ: e => this.setState({ q: e.target.value }), onQKey: e => { if (e.key === 'Enter') this.bump({ page: 'orders', ordQ: s.q, ordPage: 0 }); },
      presetOpts: [['today', 'Today'], ['yesterday', 'Yesterday'], ['7d', 'Last 7 days'], ['30d', 'Last 30 days'], ['month', 'This month'], ['lastmonth', 'Last month'], ['custom', 'Custom range']].map(([v, l]) => ({ v, l })),
      preset: s.preset, onPreset: e => { const p = e.target.value; if (p === 'custom') this.setState({ preset: p, cFrom: from, cTo: to }); else this.bump({ preset: p }); },
      isCustom: s.preset === 'custom', notCustom: s.preset !== 'custom', cFrom: s.cFrom, cTo: s.cTo, maxDate: A.TODAY,
      onCFrom: e => this.bump({ cFrom: e.target.value }), onCTo: e => this.bump({ cTo: e.target.value }),
      rangeText: A.rangeLabel(from, to),
      syncOk: !s.syncErr && !s.syncing, syncBad: s.syncErr && !s.syncing, syncBusy: s.syncing, lastSync: s.lastSync,
      onSync: () => { this.setState({ syncing: true }); setTimeout(() => { const d = new Date(); this.setState({ syncing: false, syncErr: false, lastSync: A.t12(A.pad(d.getHours()) + ':' + A.pad(d.getMinutes())) }); this.log('Portal sync', 'Manual sync · 0 new records'); this.toast('Synced with the order portal and Orders Dashboard'); }, 1100); },
      canEdit, isAdmin, addManual: () => this.openManual(null),
      roleLabel: s.role, userName: A.USER, initials: 'AR', profileOpen: s.profileOpen, toggleProfile: () => this.setState({ profileOpen: !s.profileOpen }),
      roleItems: ['Administrator', 'Pharmacy Operations', 'Read-only Management'].map(r => ({ l: r, on: r === s.role ? 1 : 0, fw: r === s.role ? 500 : 400, onClick: () => this.setRole(r) })),
      phOptsAll: this.phOpts(true), drugOpts: [{ v: 'all', l: 'All medications' }, ...this.drugList().map(d => ({ v: d, l: d }))], rphOptsAll: this.rphOpts(),
      srcOpts: [['all', 'All sources'], ['imported', 'Imported (all)'], ['Portal · API', 'Portal · API'], ['Portal · Batch', 'Portal · Batch'], ['manual', 'Manual']].map(([v, l]) => ({ v, l })),
      fPh: s.fPh, fDrug: s.fDrug, fRph: s.fRph, fSrc: s.fSrc,
      onFPh: e => this.bump({ fPh: e.target.value, ordPage: 0 }), onFDrug: e => this.bump({ fDrug: e.target.value, ordPage: 0 }), onFRph: e => this.bump({ fRph: e.target.value, ordPage: 0 }), onFSrc: e => this.bump({ fSrc: e.target.value, ordPage: 0 }),
      resetFilters: () => this.bump({ fPh: 'all', fDrug: 'all', fRph: 'all', fSrc: 'all', preset: '30d', ordQ: '', q: '', ordPage: 0 }),
      filtersActive: s.fPh !== 'all' || s.fDrug !== 'all' || s.fRph !== 'all' || s.fSrc !== 'all',
      showFilterBar: s.page === 'overview' || s.page === 'orders',
      toast: s.toast, hasToast: !!s.toast
    };
    ['overview', 'orders', 'pharmacy', 'product', 'pharmacist', 'manual', 'reports', 'settings'].forEach(p => { v['is_' + p] = s.page === p; });
    const fn = this['page_' + s.page]; if (fn) Object.assign(v, fn.call(this, from, to, pf, pt));
    Object.assign(v, this.drawerVals(), this.modalVals());
    return v;
  }
  render() { return <AppShell v={this.renderVals()} />; }
}
