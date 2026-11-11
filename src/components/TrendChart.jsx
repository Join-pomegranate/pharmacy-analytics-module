import React from 'react';

export function TrendChart({ chart }) {
  const tip = chart.tip;
  return (
    <div style={{ position: 'relative', paddingTop: 8 }}>
      <div onMouseLeave={chart.off} style={{ position: 'relative', height: 250, marginLeft: 46 }}>
        {chart.ticks.map((t, i) => (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: t.top, borderTop: '1px dashed #EFE7DA' }} />
            <span style={{ position: 'absolute', left: -46, width: 38, top: t.top, transform: 'translateY(-50%)', fontSize: 11.5, color: '#8A847B', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{t.label}</span>
          </React.Fragment>
        ))}
        <svg viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          <path d={chart.area} fill="rgba(102,12,33,0.07)" />
          <path d={chart.line} fill="none" stroke="#660C21" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        {chart.hits.map((h, i) => <div key={i} onMouseEnter={h.on} style={{ position: 'absolute', top: 0, bottom: 0, left: h.left, width: h.w }} />)}
        {tip.show && (
          <>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: tip.left, borderLeft: '1px solid rgba(102,12,33,0.28)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: tip.left, top: tip.top, width: 10, height: 10, margin: '-5px 0 0 -5px', borderRadius: '50%', background: '#660C21', boxShadow: '0 0 0 3px #fff', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: tip.left, top: tip.top, transform: `translate(${tip.tx}, calc(-100% - 14px))`, background: '#24040B', color: '#fff', padding: '8px 12px', borderRadius: 10, whiteSpace: 'nowrap', pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 11.5, color: '#D9C9CC' }}>{tip.label}</span>
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>{tip.value}</span>
            </div>
          </>
        )}
        {chart.isEmpty && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13.5, color: '#8A847B', pointerEvents: 'none' }}>No orders in this range.</div>}
      </div>
      <div style={{ position: 'relative', height: 26, marginLeft: 46, marginTop: 8 }}>
        {chart.xl.map(x => <span key={x.i} style={{ position: 'absolute', left: x.left, transform: `translateX(${x.tx})`, fontSize: 11.5, color: '#8A847B', whiteSpace: 'nowrap' }}>{x.label}</span>)}
      </div>
    </div>
  );
}
