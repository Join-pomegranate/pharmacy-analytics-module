import React from 'react';
import { Kpis } from '../components/Kpis.jsx';
import { TrendChart } from '../components/TrendChart.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { Card, Seg, Btn, PageHead, PillSelect } from '../components/ui.jsx';

export function Pharmacist({ v }) {
  return (
    <>
      <PageHead title="Pharmacist analytics" sub="“Order created by” comes from the Orders Dashboard. This is for operational visibility, not performance review.">
        <PillSelect value={v.rpPh} onChange={v.onRpPh} options={v.phOptsAll} label="Pharmacy" h={44} size={14} weight={500} minWidth={200} padL={18} />
      </PageHead>
      <Kpis kpis={v.rpKpis} />
      <Card title="Attributed order volume" sub="Orders with a recorded pharmacist" actions={<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Seg items={v.segRpMet} /><Seg items={v.segRpGrp} /></div>}><TrendChart chart={v.rpTrend} /></Card>
      <Card title="Pharmacist activity" sub="Select a pharmacist to see their orders"><DataTable table={v.rpTable} /></Card>
      {v.hasRphSel && (
        <Card title={`Orders created by ${v.rphSelName}`} sub={v.rphSelCount} actions={<Btn h={34} px={14} size={13} onClick={v.clearRph}>Close</Btn>}><DataTable table={v.rphOrdersTable} /></Card>
      )}
    </>
  );
}
