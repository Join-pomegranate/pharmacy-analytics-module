import React from 'react';

export function BarList({ bars }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {bars.items.map(b => (
        <div key={b.label + b.sub} onClick={b.onClick || undefined} title={b.title} className="h-tint" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,190px) minmax(0,1fr) 72px', alignItems: 'center', gap: 14, cursor: b.cursor, borderRadius: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 13.5, lineHeight: '18px', fontWeight: b.fw, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.label}</span>
            {b.hasSub && <span style={{ fontSize: 12, lineHeight: '16px', color: '#8A847B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.sub}</span>}
          </div>
          <div style={{ height: 10, borderRadius: 999, background: '#F3ECE2', overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 999, width: b.w, background: b.color, transition: 'width 0.45s cubic-bezier(0.22,0.8,0.28,1)' }} /></div>
          <span style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{b.value}</span>
        </div>
      ))}
      {bars.isEmpty && <div style={{ padding: '36px 0', textAlign: 'center', fontSize: 13.5, color: '#8A847B' }}>No orders match these filters.</div>}
    </div>
  );
}
