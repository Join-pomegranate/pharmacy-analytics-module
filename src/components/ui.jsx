import React from 'react';
import { SERIF, RING, CARD_SHADOW } from '../lib/tokens.js';

export const Icon = ({ d, size = 16, sw = 1.8, color = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, ...style }}><path d={d} /></svg>
);
export const ICON = {
  plus: 'M12 5v14M5 12h14', download: 'M12 3v12M7 10l5 5 5-5M5 21h14', upload: 'M12 15V3M7 8l5-5 5 5M5 21h14', check: 'M20 6 9 17l-5-5',
  chevDown: 'm6 9 6 6 6-6', search: 'M20 20l-3.5-3.5M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', columns: 'M4 6h16M4 12h16M4 18h16M9 3v18',
  alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  calendar: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M8 3v4M16 3v4',
};

export const PageTitle = ({ title, sub }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <h1 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 34, lineHeight: '40px', letterSpacing: '-0.6px' }}>{title}</h1>
    <span style={{ fontSize: 14.5, color: '#6B6762' }}>{sub}</span>
  </div>
);
export const PageHead = ({ title, sub, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
    <PageTitle title={title} sub={sub} />
    {children}
  </div>
);

export const Card = ({ title, sub, actions, gap = 16, children, style, label }) => (
  <section data-screen-label={label} style={{ background: '#fff', borderRadius: 20, boxShadow: CARD_SHADOW, padding: 24, display: 'flex', flexDirection: 'column', gap, minWidth: 0, ...style }}>
    {(title || actions) && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 500 }}>{title}</span>
          {sub && <span style={{ fontSize: 12.5, color: '#8A847B' }}>{sub}</span>}
        </div>
        {actions}
      </div>
    )}
    {children}
  </section>
);

const BTN = { border: 'none', borderRadius: 999, cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' };
export const Btn = ({ variant = 'outline', h = 40, px = 16, size = 13.5, icon, children, style, ...rest }) => {
  const base = { ...BTN, height: h, padding: `0 ${px}px`, fontSize: size, display: 'inline-flex', alignItems: 'center', gap: 8 };
  if (variant === 'primary') return <button type="button" className="h-brand" style={{ ...base, background: '#660C21', color: '#fff', ...style }} {...rest}>{icon && <Icon d={icon} sw={2.2} />}{children}</button>;
  if (variant === 'ghost') return <button type="button" className="h-white" style={{ ...base, background: 'transparent', color: '#660C21', ...style }} {...rest}>{children}</button>;
  return <button type="button" className="h-tint" style={{ ...base, background: '#fff', boxShadow: RING, color: '#24040B', ...style }} {...rest}>{icon && <Icon d={icon} />}{children}</button>;
};
export const LinkBtn = ({ children, style, ...rest }) => (
  <button type="button" style={{ border: 'none', background: 'none', padding: 0, fontSize: 13, fontWeight: 500, color: '#660C21', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, ...style }} {...rest}>{children}</button>
);
export const CloseX = ({ onClick }) => (
  <button type="button" onClick={onClick} aria-label="Close" style={{ flexShrink: 0, width: 36, height: 36, border: 'none', borderRadius: '50%', background: '#F7F2EA', color: '#24040B', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
);

/** Pill select with chevron. */
export const PillSelect = ({ value, onChange, options, label, h = 40, size = 13.5, weight = 400, minWidth, bg = '#fff', ring = RING, font, padL = 16 }) => (
  <div style={{ position: 'relative', display: 'flex' }}>
    <select value={value} onChange={onChange} aria-label={label} style={{ appearance: 'none', WebkitAppearance: 'none', height: h, padding: `0 ${h > 42 ? 40 : 36}px 0 ${padL}px`, border: 'none', borderRadius: 999, background: bg, boxShadow: ring, fontSize: size, fontWeight: weight, fontFamily: font, color: '#24040B', cursor: 'pointer', minWidth }}>
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
    <Icon d={ICON.chevDown} size={12} sw={2.6} color="#6B6762" style={{ position: 'absolute', right: 14, top: '50%', marginTop: -6, pointerEvents: 'none' }} />
  </div>
);

/** Segmented toggle. items: [{l,bg,fg,sh,onClick}] as produced by Controller.seg */
export const Seg = ({ items, pad = 3, h = 30, track = '#F3ECE2', px = 14 }) => (
  <div style={{ display: 'flex', gap: 2, padding: pad, borderRadius: 999, background: track }}>
    {items.map(s => <button key={s.l} type="button" onClick={s.onClick} aria-pressed={s.bg !== 'transparent'} style={{ height: h, padding: `0 ${px}px`, border: 'none', borderRadius: 999, fontSize: h > 30 ? 13 : 12.5, fontWeight: 500, cursor: 'pointer', background: s.bg, color: s.fg, boxShadow: s.sh }}>{s.l}</button>)}
  </div>
);

export const Field = ({ label, children, error }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
    <span style={{ fontSize: 12.5, fontWeight: 500, color: '#4A4540' }}>{label}</span>
    {children}
    {error ? <span style={{ fontSize: 12, color: '#A3203E' }}>{error}</span> : null}
  </label>
);
export const inputStyle = (ring = '#E0D6C6', h = 44, r = 12, size = 14) => ({ height: h, padding: '0 14px', border: 'none', borderRadius: r, background: '#fff', boxShadow: `inset 0 0 0 1.5px ${ring}`, fontSize: size, color: '#24040B' });

export const Eyebrow = ({ children, style }) => <span style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#660C21', fontWeight: 500, ...style }}>{children}</span>;
export const Notice = ({ tone = 'amber', children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 14, background: tone === 'amber' ? '#FCF1DF' : '#F8E9EC', color: tone === 'amber' ? '#6E4810' : '#8A1F36', fontSize: 13, flexWrap: 'wrap' }}>{children}</div>
);
export const Pill = ({ bg = '#F3ECE2', fg = '#4A4540', children }) => <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: bg, color: fg }}>{children}</span>;
