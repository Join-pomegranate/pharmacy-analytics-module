import React from 'react';
import { Kpis } from '../components/Kpis.jsx';
import { BarList } from '../components/BarList.jsx';
import { TrendChart } from '../components/TrendChart.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { Card, Seg, Btn, LinkBtn, PageTitle, PillSelect, Icon, ICON } from '../components/ui.jsx';
import { SERIF, CARD_SHADOW } from '../lib/tokens.js';

export function Overview({ v }) {
  return (
    <>
      <PageTitle title="Overview" sub={`Order activity across all pharmacies for ${v.rangeText}.`} />
      <FilterBar v={v} />
      {v.syncBanner && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 16, background: '#F8E9EC', color: '#8A1F36', flexWrap: 'wrap' }}>
          <Icon d={ICON.alert} size={20} />
          <span style={{ flex: 1, minWidth: 240, fontSize: 13.5, lineHeight: '20px' }}><strong style={{ fontWeight: 500 }}>Couldn’t reach the order portal.</strong> Showing data from the last successful sync at {v.lastSync} ET. New portal orders may be missing.</span>
          <Btn variant="primary" h={36} size={13} onClick={v.onSync}>Retry sync</Btn>
        </div>
      )}
      <Kpis kpis={v.kpis} />
      {v.hasReview && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 14, background: '#FCF1DF', color: '#6E4810', fontSize: 13, flexWrap: 'wrap' }}>
          <span style={{ flex: 1, minWidth: 240 }}>{v.reviewText}</span>
          <LinkBtn onClick={v.openReview}>Review lines</LinkBtn>
        </div>
      )}
      {v.ovEmpty && (
        <div style={{ padding: 28, borderRadius: 20, background: '#fff', boxShadow: '0 0 0 1px #EAE0D1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontSize: 15, fontWeight: 500 }}>No orders match these filters</span><span style={{ fontSize: 13.5, color: '#6B6762' }}>Try a wider date range or reset the filters.</span></div>
          <Btn variant="primary" onClick={v.resetFilters} px={18}>Reset filters</Btn>
        </div>
      )}
      <Card label="Order volume" title="Order volume over time" sub="Active orders · voided records excluded"
        actions={<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><Seg items={v.segOvMet} /><Seg items={v.segOvGrp} /></div>}>
        <TrendChart chart={v.trend} />
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(420px,1fr))', gap: 20 }}>
        <Card title="Orders by pharmacy" sub="Click a pharmacy to see its orders" gap={20} actions={<Seg items={v.segBarMet} />}><BarList bars={v.phBars} /></Card>
        <Card title="Top ordered products" sub="By vials · grouped by drug, concentration and vial size" gap={20}><BarList bars={v.prodBars} /></Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,1fr) minmax(0,2.2fr)', gap: 20 }}>
        <Card title="Orders by source" sub="Imported vs. manually added" gap={20}>
          <div style={{ position: 'relative', width: 180, height: 180, alignSelf: 'center' }}>
            <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-label="Orders by source">
              <circle cx="90" cy="90" r="70" fill="none" stroke="#F3ECE2" strokeWidth="22" />
              {v.donut.map(d => <circle key={d.label} cx="90" cy="90" r="70" fill="none" stroke={d.color} strokeWidth="22" strokeDasharray={d.dash} strokeDashoffset={d.off} transform="rotate(-90 90 90)" onClick={d.onClick} style={{ cursor: 'pointer' }} />)}
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontFamily: SERIF, fontSize: 30, lineHeight: 1 }}>{v.donutTotal}</span><span style={{ fontSize: 12, color: '#8A847B' }}>orders</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {v.donut.map(d => (
              <button key={d.label} type="button" onClick={d.onClick} className="h-tint" style={{ display: 'grid', gridTemplateColumns: '12px 1fr auto auto', alignItems: 'center', gap: 10, height: 36, padding: '0 8px', border: 'none', borderRadius: 10, background: 'transparent', fontSize: 13.5, color: '#24040B', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} /><span>{d.label}</span>
                <span style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{d.value}</span><span style={{ width: 48, textAlign: 'right', color: '#8A847B', fontVariantNumeric: 'tabular-nums' }}>{d.pct}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title="Recent orders" actions={<Btn h={34} px={14} size={13} onClick={v.viewAll}>View all orders</Btn>}><DataTable table={v.recentTable} /></Card>
      </div>
    </>
  );
}

export function FilterBar({ v, children }) {
  const Sel = (value, onChange, options, label) => <PillSelect value={value} onChange={onChange} options={options} label={label} />;
  return (
    <div data-screen-label="Filters" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      {Sel(v.fPh, v.onFPh, v.phOptsAll, 'Pharmacy')}
      {Sel(v.fDrug, v.onFDrug, v.drugOpts, 'Medication')}
      {Sel(v.fRph, v.onFRph, v.rphOptsAll, 'Pharmacist')}
      {Sel(v.fSrc, v.onFSrc, v.srcOpts, 'Order source')}
      <Btn variant="ghost" px={14} onClick={v.resetFilters}>Reset filters</Btn>
      {children}
    </div>
  );
}
