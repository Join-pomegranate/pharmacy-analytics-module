import React from 'react';
import { Kpis } from '../components/Kpis.jsx';
import { BarList } from '../components/BarList.jsx';
import { TrendChart } from '../components/TrendChart.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { Card, Seg, Btn, PageHead, PillSelect } from '../components/ui.jsx';

export function Product({ v }) {
  return (
    <>
      <PageHead title="Product analytics" sub="Formulations are tracked per pharmacy, concentration and vial size — never merged by name alone.">
        <PillSelect value={v.prDrug} onChange={v.onPrDrug} options={v.drugOpts} label="Medication" h={44} size={14} weight={500} minWidth={220} padL={18} />
      </PageHead>
      <Kpis kpis={v.prKpis} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(420px,1fr))', gap: 20 }}>
        <Card title="Top products" sub="Vials by medication · click to focus" gap={20}><BarList bars={v.prTopBars} /></Card>
        <Card title="Formulation breakdown" sub={`${v.prDrugLabel} · by concentration and vial size`} gap={20}><BarList bars={v.prFormBars} /></Card>
        <Card title="Distribution across pharmacies" sub={`${v.prDrugLabel} · vials · click to filter the table`} gap={20}><BarList bars={v.prPhBars} /></Card>
        <Card title="Product trend" actions={<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Seg items={v.segPrMet} px={12} /><Seg items={v.segPrGrp} px={12} /></div>}><TrendChart chart={v.prTrend} /></Card>
      </div>
      <Card title="Products by pharmacy" actions={
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <PillSelect value={v.prPh} onChange={v.onPrPh} options={v.phOptsAll} label="Pharmacy" h={38} size={13} />
          <Btn h={38} px={14} size={13} onClick={v.prExpCsv}>Export CSV</Btn>
          <Btn h={38} px={14} size={13} onClick={v.prExpXls}>Export Excel</Btn>
        </div>}>
        <DataTable table={v.prTable} />
      </Card>
    </>
  );
}
