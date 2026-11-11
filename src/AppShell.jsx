import React from 'react';
import { Overview } from './pages/Overview.jsx';
import { Orders } from './pages/Orders.jsx';
import { Pharmacy } from './pages/Pharmacy.jsx';
import { Product } from './pages/Product.jsx';
import { Pharmacist } from './pages/Pharmacist.jsx';
import { Manual } from './pages/Manual.jsx';
import { Reports } from './pages/Reports.jsx';
import { Settings } from './pages/Settings.jsx';
import { OrderDrawer } from './components/OrderDrawer.jsx';
import { ManualOrderModal } from './components/ManualOrderModal.jsx';
import { CsvImportModal } from './components/CsvImportModal.jsx';
import { Icon, ICON } from './components/ui.jsx';
import { SERIF, RING } from './lib/tokens.js';

const PAGES = { overview: Overview, orders: Orders, pharmacy: Pharmacy, product: Product, pharmacist: Pharmacist, manual: Manual, reports: Reports, settings: Settings };

function Sidebar({ v }) {
  return (
    <aside data-screen-label="Sidebar" style={{ flexShrink: 0, width: v.sideW, position: 'sticky', top: 0, height: '100vh', background: '#fff', borderRight: '1px solid #EAE0D1', display: 'flex', flexDirection: 'column', padding: '20px 14px', gap: 24, transition: 'width 0.2s', zIndex: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px', minHeight: 40 }}>
        <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 10, background: '#660C21', color: '#FBF6EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 19, lineHeight: 1 }}>p</span>
        {v.showLabels && <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}><span style={{ fontFamily: SERIF, fontSize: 21, lineHeight: '22px', letterSpacing: '-0.3px' }}>pomegranate</span><span style={{ fontSize: 11.5, color: '#8A847B', letterSpacing: 0.2 }}>Pharmacy analytics</span></div>}
      </div>
      <nav aria-label="Primary" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {v.nav.map(n => (
          <button key={n.label} type="button" onClick={n.onClick} title={n.label} aria-label={n.label} aria-current={n.fw === 500 ? 'page' : undefined} className="h-bg" style={{ display: 'flex', alignItems: 'center', gap: 12, height: 42, padding: '0 13px', border: 'none', borderRadius: 12, background: n.bg, color: n.fg, fontSize: 14, fontWeight: n.fw, cursor: 'pointer', textAlign: 'left', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Icon d={n.icon} size={20} sw={1.7} />{v.showLabels && <span>{n.label}</span>}
          </button>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {v.showLabels && <div style={{ padding: '12px 14px', borderRadius: 14, background: '#F7F2EA', display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 12, fontWeight: 500, color: '#660C21' }}>Sample data</span><span style={{ fontSize: 12, lineHeight: '17px', color: '#6B6762' }}>Prototype records only — no real patient information.</span></div>}
        <button type="button" onClick={v.toggleSide} aria-label={v.collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="h-bg" style={{ display: 'flex', alignItems: 'center', gap: 12, height: 40, padding: '0 13px', border: 'none', borderRadius: 12, background: 'transparent', color: '#6B6762', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          <Icon d={v.collapseIcon} size={20} />{v.showLabels && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

function Header({ v }) {
  return (
    <header data-screen-label="Header" style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(247,242,234,0.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid #EAE0D1' }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', padding: '12px 40px', minHeight: 68, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#6B6762', whiteSpace: 'nowrap', marginRight: 'auto' }}>
          <span>Pharmacy analytics</span><span style={{ color: '#CFC3B1' }}>/</span><span style={{ color: '#24040B', fontWeight: 500 }}>{v.crumb}</span>
          {v.loading && <span style={{ marginLeft: 6, padding: '3px 10px', borderRadius: 999, background: '#fff', boxShadow: 'inset 0 0 0 1px #EAE0D1', fontSize: 12, color: '#6B6762' }}>Updating…</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 16px', borderRadius: 999, background: '#fff', boxShadow: 'inset 0 0 0 1.5px #E0D6C6', flex: '0 1 280px', minWidth: 180 }}>
          <Icon d={ICON.search} size={16} sw={2} color="#8A847B" />
          <input value={v.q} onChange={v.onQ} onKeyDown={v.onQKey} aria-label="Search orders" placeholder="Search orders — press Enter" style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', fontSize: 13.5, color: '#24040B' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 6px 0 14px', borderRadius: 999, background: '#fff', boxShadow: 'inset 0 0 0 1.5px #E0D6C6' }}>
          <Icon d={ICON.calendar} size={16} color="#660C21" />
          <select value={v.preset} onChange={v.onPreset} aria-label="Date range" style={{ appearance: 'none', WebkitAppearance: 'none', border: 'none', background: 'transparent', fontSize: 13.5, fontWeight: 500, color: '#24040B', cursor: 'pointer', padding: '0 4px' }}>
            {v.presetOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
          {v.notCustom && <span style={{ fontSize: 13, color: '#6B6762', whiteSpace: 'nowrap', paddingRight: 10 }}>{v.rangeText}</span>}
          {v.isCustom && (
            <>
              <input type="date" value={v.cFrom} max={v.maxDate} onChange={v.onCFrom} aria-label="Start date" style={{ border: 'none', background: '#F7F2EA', borderRadius: 999, height: 30, padding: '0 10px', fontSize: 12.5, color: '#24040B' }} />
              <span style={{ color: '#8A847B' }}>–</span>
              <input type="date" value={v.cTo} max={v.maxDate} onChange={v.onCTo} aria-label="End date" style={{ border: 'none', background: '#F7F2EA', borderRadius: 999, height: 30, padding: '0 10px', fontSize: 12.5, color: '#24040B' }} />
            </>
          )}
          <span style={{ fontSize: 11, color: '#8A847B', padding: '0 8px 0 2px' }}>ET</span>
        </div>
        {v.syncOk && <button type="button" onClick={v.onSync} title="Sync now" className="h-white" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', border: 'none', borderRadius: 999, background: 'transparent', fontSize: 12.5, color: '#6B6762', cursor: 'pointer', whiteSpace: 'nowrap' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4F8560' }} />Synced {v.lastSync}</button>}
        {v.syncBusy && <span style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', fontSize: 12.5, color: '#6B6762', whiteSpace: 'nowrap' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C9A227' }} />Syncing…</span>}
        {v.syncBad && <button type="button" onClick={v.onSync} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', border: 'none', borderRadius: 999, background: '#F8E9EC', fontSize: 12.5, fontWeight: 500, color: '#8A1F36', cursor: 'pointer', whiteSpace: 'nowrap' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#A3203E' }} />Sync failed · Retry</button>}
        {v.canEdit && <button type="button" onClick={v.addManual} className="h-brand" style={{ height: 40, padding: '0 18px', border: 'none', borderRadius: 999, background: '#660C21', color: '#fff', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}><Icon d={ICON.plus} sw={2.2} />Add manual order</button>}
        <div style={{ position: 'relative' }}>
          <button type="button" onClick={v.toggleProfile} aria-haspopup="menu" aria-expanded={v.profileOpen} className="h-tint" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 12px 0 4px', border: 'none', borderRadius: 999, background: '#fff', boxShadow: RING, cursor: 'pointer' }}>
            <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#F6E9EC', color: '#660C21', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>{v.initials}</span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '15px' }}><span style={{ fontSize: 13, fontWeight: 500, color: '#24040B' }}>{v.userName}</span><span style={{ fontSize: 11.5, color: '#8A847B' }}>{v.roleLabel}</span></span>
          </button>
          {v.profileOpen && (
            <div role="menu" style={{ position: 'absolute', right: 0, top: 48, width: 270, background: '#fff', borderRadius: 16, boxShadow: '0 0 0 1px #EAE0D1, 0 12px 32px rgba(36,4,11,0.12)', padding: 8, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 60 }}>
              <span style={{ padding: '8px 10px 6px', fontSize: 11.5, letterSpacing: 1.2, color: '#8A847B', fontWeight: 500 }}>VIEW AS ROLE · PROTOTYPE</span>
              {v.roleItems.map(r => (
                <button key={r.l} type="button" role="menuitemradio" aria-checked={r.on === 1} onClick={r.onClick} className="h-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, height: 40, padding: '0 10px', border: 'none', borderRadius: 10, background: 'transparent', fontSize: 13.5, fontWeight: r.fw, color: '#24040B', cursor: 'pointer', textAlign: 'left' }}>
                  {r.l}<Icon d={ICON.check} size={16} sw={2.4} color="#660C21" style={{ opacity: r.on }} />
                </button>
              ))}
              <div style={{ height: 1, background: '#F1EADF', margin: '4px 0' }} />
              <span style={{ padding: '6px 10px 8px', fontSize: 12, lineHeight: '17px', color: '#8A847B' }}>Signed in with a Pomegranate company account. Patient details are hidden for read-only roles.</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function AppShell({ v }) {
  const Page = PAGES[v.page];
  return (
    <div style={{ minHeight: '100vh', background: '#F7F2EA', display: 'flex' }}>
      {v.ready && <Sidebar v={v} />}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {v.ready && <Header v={v} />}
        <main style={{ flex: 1, width: '100%', maxWidth: 1480, margin: '0 auto', padding: '32px 40px 72px', display: 'flex', flexDirection: 'column', gap: 24, opacity: v.contentOpacity, transition: 'opacity 0.2s' }}>
          {v.notReady && <div style={{ padding: '120px 0', textAlign: 'center', fontSize: 14, color: '#8A847B' }}>Loading order data…</div>}
          {v.ready && Page && <Page v={v} />}
        </main>
      </div>
      {v.ready && <OrderDrawer v={v} />}
      {v.manualOpen && <ManualOrderModal v={v} />}
      {v.csvOpen && <CsvImportModal v={v} />}
      {v.hasToast && <div role="status" style={{ position: 'fixed', left: '50%', bottom: 28, transform: 'translateX(-50%)', zIndex: 120, padding: '12px 20px', borderRadius: 999, background: '#24040B', color: '#fff', fontSize: 13.5, boxShadow: '0 10px 30px rgba(36,4,11,0.3)', maxWidth: 'calc(100vw - 48px)' }}>{v.toast}</div>}
    </div>
  );
}
