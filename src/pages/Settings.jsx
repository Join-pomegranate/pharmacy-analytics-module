import React from 'react';
import { DataTable } from '../components/DataTable.jsx';
import { Card, PageHead, Btn, inputStyle } from '../components/ui.jsx';
import { RING } from '../lib/tokens.js';

const ROLE_CARDS = [
  ['Administrator', 'All analytics, patient details, manual orders, exports, pharmacy and product settings, permissions and audit log.'],
  ['Pharmacy Operations', 'Analytics and filters, patient details for order identification, add and edit manual orders, operational exports.'],
  ['Read-only Management', 'View analytics and reports, export summaries. Can’t edit orders. Patient details hidden.'],
];
const list = { display: 'flex', flexDirection: 'column', borderRadius: 14, boxShadow: 'inset 0 0 0 1px #EAE0D1', overflow: 'hidden' };

export function Settings({ v }) {
  return (
    <>
      <PageHead title="Settings" sub="Pharmacy directory, product mappings, permissions and audit history. Administrators only.">
        <div role="tablist" style={{ display: 'flex', gap: 2, padding: 4, borderRadius: 999, background: '#EFE7DA' }}>
          {v.setTabs.map(s => <button key={s.l} type="button" role="tab" aria-selected={s.bg !== 'transparent'} onClick={s.onClick} style={{ height: 34, padding: '0 16px', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: s.bg, color: s.fg, boxShadow: s.sh }}>{s.l}</button>)}
        </div>
      </PageHead>
      {v.tabPh && (
        <Card title="Pharmacy directory" sub="Renames apply to existing orders. Inactive pharmacies stay in reports but can’t receive new manual orders."
          actions={<div style={{ display: 'flex', gap: 8 }}><input value={v.newPh} onChange={v.onNewPh} placeholder="New pharmacy name" aria-label="New pharmacy name" style={{ ...inputStyle('#E0D6C6', 40, 999, 13.5), width: 220, padding: '0 16px' }} /><Btn variant="primary" px={18} onClick={v.addPh}>Add pharmacy</Btn></div>}>
          <div style={list}>
            {v.phRows.map(p => (
              <div key={p.name} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 120px 100px auto', alignItems: 'center', gap: 16, padding: '10px 16px', borderBottom: '1px solid #F1EADF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <input value={p.edit} onChange={p.onEdit} aria-label="Pharmacy name" style={{ height: 36, padding: '0 12px', border: 'none', borderRadius: 10, background: '#FBF8F3', fontSize: 14, fontWeight: 500, color: '#24040B', width: '100%', maxWidth: 280 }} />
                  {p.dirty && <Btn variant="primary" h={32} px={12} size={12.5} onClick={p.onSave}>Save</Btn>}
                </div>
                <span style={{ fontSize: 13, color: '#6B6762' }}>{p.count}</span>
                <span style={{ justifySelf: 'start', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: p.sBg, color: p.sFg }}>{p.status}</span>
                <Btn h={32} px={14} size={12.5} onClick={p.onToggle}>{p.togLabel}</Btn>
              </div>
            ))}
          </div>
        </Card>
      )}
      {v.tabCat && <Card title="Product catalog & vial mapping" sub="Pharmacy-specific formulations from order data. Items without a confident vial rule are flagged for review instead of guessed."><DataTable table={v.catTable} /></Card>}
      {v.tabUsers && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
            {ROLE_CARDS.map(([t, d]) => <div key={t} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 0 0 1px #EAE0D1', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 14, fontWeight: 500 }}>{t}</span><span style={{ fontSize: 13, lineHeight: '20px', color: '#6B6762' }}>{d}</span></div>)}
          </div>
          <Card title="Users" gap={12}>
            <div style={list}>
              {v.userRows.map(u => (
                <div key={u.email} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.3fr) 230px 90px', alignItems: 'center', gap: 16, padding: '12px 16px', borderBottom: '1px solid #F1EADF' }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{u.name}</span>
                  <span style={{ fontSize: 13, color: '#6B6762', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</span>
                  <select value={u.role} onChange={u.onRole} aria-label="Role" style={{ height: 36, padding: '0 10px', border: 'none', borderRadius: 10, background: '#FBF8F3', boxShadow: 'inset 0 0 0 1px #EAE0D1', fontSize: 13, color: '#24040B' }}>{v.roleOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
                  <span style={{ fontSize: 12.5, color: '#8A847B', textAlign: 'right' }}>{u.last}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      {v.tabAudit && <Card title="Audit log" sub="Manual entries, edits, voids, imports, exports and permission changes · latest 60"><DataTable table={v.auditTable} /></Card>}
    </>
  );
}
