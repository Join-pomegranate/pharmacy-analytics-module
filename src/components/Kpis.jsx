import React from 'react';
import { SERIF, CARD_SHADOW } from '../lib/tokens.js';
import { Icon } from './ui.jsx';

export function Kpis({ kpis }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16 }}>
      {kpis.map(k => (
        <div key={k.label} style={{ background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#6B6762' }}>{k.label}</span>
            <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, background: '#F7F2EA', color: '#660C21', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={k.icon} size={18} /></span>
          </div>
          <span style={{ fontFamily: SERIF, fontWeight: 400, fontSize: k.vSize, lineHeight: 1.1, letterSpacing: '-0.5px', color: '#24040B', fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>{k.value}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {k.hasDelta && <span style={{ padding: '3px 9px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: k.dBg, color: k.dFg }}>{k.delta}</span>}
            <span style={{ fontSize: 12.5, color: '#8A847B' }}>{k.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
