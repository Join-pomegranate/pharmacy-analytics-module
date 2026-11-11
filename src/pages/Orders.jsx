import React from 'react';
import { DataTable } from '../components/DataTable.jsx';
import { Btn, Icon, ICON, PageHead } from '../components/ui.jsx';
import { FilterBar } from './Overview.jsx';
import { RING } from '../lib/tokens.js';

const Toggle = ({ t, onClick, children }) => (
  <button type="button" onClick={onClick} aria-pressed={t.tick === 1} style={{ height: 36, padding: '0 14px', border: 'none', borderRadius: 999, background: t.bg, color: t.fg, boxShadow: t.sh, fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}>{children}</button>
);

export function Orders({ v }) {
  return (
    <>
      <PageHead title="All orders" sub="Synced from the order portal and Orders Dashboard, plus manual entries.">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#6B6762' }}>{v.ordCount} orders · {v.ordVials} vials</span>
          <Btn onClick={v.expCsv}>Export CSV</Btn>
          <Btn onClick={v.expXls}>Export Excel</Btn>
        </div>
      </PageHead>
      <FilterBar v={v}>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Toggle t={v.reviewTog} onClick={v.toggleReview}>Needs vial review</Toggle>
          <Toggle t={v.voidTog} onClick={v.toggleVoided}>Include voided</Toggle>
        </div>
      </FilterBar>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 42, padding: '0 16px', borderRadius: 999, background: '#fff', boxShadow: RING, flex: '1 1 360px', maxWidth: 520 }}>
          <Icon d={ICON.search} size={16} color="#8A847B" sw={2} />
          <input value={v.ordQ} onChange={v.onOrdQ} placeholder={v.searchPh} aria-label="Search orders" style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', fontSize: 13.5, color: '#24040B' }} />
          {v.hasOrdQ && <button type="button" onClick={v.clearOrdQ} aria-label="Clear search" style={{ border: 'none', background: 'none', padding: 0, color: '#8A847B', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>}
        </div>
        <div style={{ position: 'relative', marginLeft: 'auto' }}>
          <Btn onClick={v.toggleCols} icon={ICON.columns}>Columns</Btn>
          {v.colsOpen && (
            <div style={{ position: 'absolute', right: 0, top: 48, width: 260, maxHeight: 420, overflow: 'auto', background: '#fff', borderRadius: 16, boxShadow: '0 0 0 1px #EAE0D1, 0 12px 32px rgba(36,4,11,0.12)', padding: 8, zIndex: 20, display: 'flex', flexDirection: 'column' }}>
              {v.colItems.map(c => (
                <button key={c.l} type="button" onClick={c.onClick} className="h-bg" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, padding: '0 10px', border: 'none', borderRadius: 8, background: 'transparent', fontSize: 13, color: '#24040B', cursor: 'pointer', textAlign: 'left', opacity: c.op }}>
                  <span style={{ width: 18, height: 18, borderRadius: 5, background: c.bg, boxShadow: 'inset 0 0 0 1.5px #CFC3B1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon d={ICON.check} size={12} sw={3.2} color="#fff" style={{ opacity: c.on }} /></span>{c.l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <DataTable table={v.ordersTable} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: '#6B6762' }}>{v.pageText} · times in ET</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Btn h={36} px={14} size={13} onClick={v.prevPage} style={{ opacity: v.prevOp }}>Previous</Btn>
          <span style={{ fontSize: 13, color: '#6B6762', minWidth: 90, textAlign: 'center' }}>{v.pgLabel}</span>
          <Btn h={36} px={14} size={13} onClick={v.nextPage} style={{ opacity: v.nextOp }}>Next</Btn>
        </div>
      </div>
    </>
  );
}
