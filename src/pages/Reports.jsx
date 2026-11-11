import React from 'react';
import { DataTable } from '../components/DataTable.jsx';
import { Card, Btn, Eyebrow, Field, inputStyle, PageTitle, LinkBtn } from '../components/ui.jsx';
import { SERIF } from '../lib/tokens.js';

const sel = inputStyle('#E0D6C6', 42, 12, 13.5);
const Sel = ({ label, value, onChange, options }) => (
  <Field label={label}><select value={value} onChange={onChange} style={{ ...sel, padding: '0 12px' }}>{options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select></Field>
);

export function Reports({ v }) {
  return (
    <>
      <PageTitle title="Reports & exports" sub="Download a report, then compare it with the pharmacy’s invoice outside the dashboard." />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,320px) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Eyebrow style={{ padding: '0 4px' }}>REPORT TYPE</Eyebrow>
          {v.repTypes.map(t => (
            <button key={t.l} type="button" onClick={t.onClick} aria-pressed={t.dot !== '#FFFFFF'} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 18px', border: 'none', borderRadius: 16, background: t.bg, boxShadow: t.sh, cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ flexShrink: 0, marginTop: 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: t.ring }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}><span style={{ fontSize: 14, fontWeight: 500, color: '#24040B' }}>{t.l}</span><span style={{ fontSize: 12.5, lineHeight: '17px', color: '#6B6762' }}>{t.d}</span></span>
            </button>
          ))}
          <div style={{ padding: '14px 16px', borderRadius: 14, background: '#F3ECE2', fontSize: 12.5, lineHeight: '18px', color: '#4A4540' }}>Invoice upload and automatic matching aren’t part of Version 1. Exports include the date range, filters and a generation timestamp.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <Card title="Filters" gap={18} actions={<LinkBtn onClick={v.repReset} style={{ textDecoration: 'none' }}>Reset</LinkBtn>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 14 }}>
              <Field label="Start date"><input type="date" value={v.repFrom} max={v.maxDate} onChange={v.onRepFrom} style={{ ...sel, padding: '0 14px' }} /></Field>
              <Field label="End date"><input type="date" value={v.repTo} max={v.maxDate} onChange={v.onRepTo} style={{ ...sel, padding: '0 14px' }} /></Field>
              <Sel label="Pharmacy" value={v.repPh} onChange={v.onRepPh} options={v.phOptsAll} />
              <Sel label="Medication" value={v.repDrug} onChange={v.onRepDrug} options={v.drugOpts} />
              <Sel label="Concentration" value={v.repConc} onChange={v.onRepConc} options={v.concOpts} />
              <Sel label="Vial size" value={v.repSize} onChange={v.onRepSize} options={v.sizeOpts} />
              <Sel label="Pharmacist" value={v.repRph} onChange={v.onRepRph} options={v.rphOptsAll} />
              <Sel label="Order source" value={v.repSrc} onChange={v.onRepSrc} options={v.srcOpts} />
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontFamily: SERIF, fontSize: 22, lineHeight: '28px' }}>{v.repTitle}</span><span style={{ fontSize: 12.5, color: '#8A847B' }}>{v.repMeta}</span></div>
              <div style={{ display: 'flex', gap: 10 }}><Btn onClick={v.repCsv}>Export CSV</Btn><Btn variant="primary" px={18} onClick={v.repXls}>Export Excel</Btn></div>
            </div>
            <DataTable table={v.repPreview} />
            {v.repMore && <span style={{ fontSize: 12.5, color: '#8A847B' }}>{v.repMoreText}</span>}
          </Card>
        </div>
      </div>
    </>
  );
}
