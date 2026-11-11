import React from 'react';
import { Kpis } from '../components/Kpis.jsx';
import { TrendChart } from '../components/TrendChart.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { Card, Seg, Btn, Eyebrow, Notice, PageHead, PillSelect, ICON } from '../components/ui.jsx';
import { SERIF } from '../lib/tokens.js';

export function Pharmacy({ v }) {
  return (
    <>
      <PageHead title="Pharmacy analytics" sub="Pick a pharmacy and billing period to check order and vial totals against its invoice.">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Btn onClick={v.paExpCsv}>CSV</Btn>
          <Btn variant="primary" px={18} icon={ICON.download} onClick={v.paExpXls}>Export pharmacy report</Btn>
        </div>
      </PageHead>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px', borderRadius: 20, background: '#fff', boxShadow: '0 0 0 1px #EAE0D1', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Eyebrow>PHARMACY</Eyebrow>
          <PillSelect value={v.paPh} onChange={v.onPaPh} options={v.phOpts} label="Pharmacy" h={46} bg="#F7F2EA" ring="none" font={SERIF} size={22} minWidth={220} padL={18} />
        </div>
        <div style={{ width: 1, alignSelf: 'stretch', background: '#EAE0D1' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Eyebrow>BILLING PERIOD</Eyebrow>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{v.rangeText}</span>
          <span style={{ fontSize: 12.5, color: '#8A847B' }}>Change it with the date range at the top · ET</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', textAlign: 'right' }}>
          <Eyebrow style={{ color: '#8A847B' }}>FOR INVOICE COMPARISON</Eyebrow>
          <span style={{ fontFamily: SERIF, fontSize: 26, lineHeight: '30px' }}>{v.paSummary}</span>
        </div>
      </div>
      <Kpis kpis={v.paKpis} />
      {v.paReview && <Notice>{v.paReviewText}</Notice>}
      <Card title={`Order trend · ${v.paPh}`} actions={<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Seg items={v.segPaMet} /><Seg items={v.segPaGrp} /></div>}><TrendChart chart={v.paTrend} /></Card>
      <Card title="Product breakdown" sub="By drug, concentration and vial size · supplies such as syringes aren’t counted as vials"><DataTable table={v.paProdTable} /></Card>
      <Card title={`${v.paPh} orders`} actions={<span style={{ fontSize: 13, color: '#6B6762' }}>{v.paOrderCount} orders</span>}><DataTable table={v.paOrdersTable} /></Card>
    </>
  );
}
