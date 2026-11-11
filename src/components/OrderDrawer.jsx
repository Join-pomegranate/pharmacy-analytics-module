import React from 'react';
import { Btn, CloseX, Eyebrow, Pill } from './ui.jsx';
import { SERIF } from '../lib/tokens.js';

const Section = ({ sec }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 0', borderBottom: '1px solid #F1EADF' }}>
    <Eyebrow>{sec.title.toUpperCase()}</Eyebrow>
    {sec.items.map(it => <div key={it.l} style={{ display: 'grid', gridTemplateColumns: '150px minmax(0,1fr)', gap: 12, fontSize: 13.5 }}><span style={{ color: '#6B6762' }}>{it.l}</span><span style={{ fontWeight: 500, overflowWrap: 'anywhere' }}>{it.v}</span></div>)}
  </div>
);

export function OrderDrawer({ v }) {
  if (!v.drawerOpen) return null;
  return (
    <>
      <div onClick={v.closeDrawer} style={{ position: 'fixed', inset: 0, background: 'rgba(36,4,11,0.28)', zIndex: 80 }} />
      <div data-screen-label="Order drawer" role="dialog" aria-label="Order details" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(480px,100vw)', background: '#fff', zIndex: 81, boxShadow: '-12px 0 40px rgba(36,4,11,0.14)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #EAE0D1', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}><span style={{ fontFamily: SERIF, fontSize: 28, lineHeight: '32px' }}>{v.dTitle}</span><span style={{ fontSize: 13, color: '#6B6762' }}>{v.dSub}</span></div>
            <CloseX onClick={v.closeDrawer} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {v.dManual && <Pill bg="#F8E9EC" fg="#660C21">Manual</Pill>}
            {v.dVoided && <Pill bg="#EEE9E2" fg="#6B6762">Voided · excluded from metrics</Pill>}
            {v.dReview && <Pill bg="#FCF1DF" fg="#8A5A12">Vial count needs review</Pill>}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 28px 28px', display: 'flex', flexDirection: 'column' }}>
          {v.dSecA.map(s => <Section key={s.title} sec={s} />)}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 0', borderBottom: '1px solid #F1EADF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Eyebrow>MEDICATION</Eyebrow><span style={{ fontSize: 13, fontWeight: 500 }}>{v.dVials} counted</span></div>
            {v.dLines.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', borderRadius: 12, background: '#FBF8F3' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}><span style={{ fontSize: 13.5, fontWeight: 500 }}>{l.drug}</span><span style={{ fontSize: 12.5, color: '#8A847B' }}>{l.meta} · {l.qty}</span></div>
                <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 500, color: l.vfg }}>{l.vials}</span>
              </div>
            ))}
          </div>
          {v.dSecB.map(s => <Section key={s.title} sec={s} />)}
          {v.dHasNotes && <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 0' }}><Eyebrow>NOTES</Eyebrow><span style={{ fontSize: 13.5, lineHeight: '20px' }}>{v.dNotes}</span></div>}
        </div>
        {v.dCanEdit && (
          <div style={{ padding: '16px 28px', borderTop: '1px solid #EAE0D1', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn onClick={v.dVoid}>{v.dVoidLabel}</Btn>
            <Btn variant="primary" px={18} onClick={v.dEdit}>Edit order</Btn>
          </div>
        )}
      </div>
    </>
  );
}
