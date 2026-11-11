import React from 'react';

export function DataTable({ table }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%', overflow: 'auto', maxHeight: table.maxH, borderRadius: 14, boxShadow: 'inset 0 0 0 1px #EAE0D1' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13.5 }}>
          <thead>
            <tr>
              {table.head.map((h, i) => (
                <th key={i} onClick={h.onClick || undefined} aria-sort={h.arrow ? (h.arrow === '↑' ? 'ascending' : 'descending') : undefined} style={{ position: 'sticky', top: 0, zIndex: 1, background: '#FBF8F3', textAlign: h.align, padding: '0 14px', height: 42, fontWeight: 500, fontSize: 12, letterSpacing: 0.3, color: '#6B6762', whiteSpace: 'nowrap', borderBottom: '1px solid #EAE0D1', cursor: h.cursor, userSelect: 'none' }}>
                  {h.l}<span style={{ color: '#660C21', marginLeft: 5 }}>{h.arrow}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, ri) => (
              <tr key={ri} className="h-tint" style={{ background: r.bg }}>
                {r.cells.map((c, ci) => (
                  <td key={ci} style={{ padding: '0 14px', height: 48, borderBottom: '1px solid #F1EADF', whiteSpace: 'nowrap', textAlign: c.align, color: c.fg, fontWeight: c.fw, fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      {c.link && <button type="button" onClick={c.onClick} style={{ border: 'none', background: 'none', padding: 0, font: 'inherit', fontWeight: 500, color: '#660C21', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'rgba(102,12,33,0.3)' }}>{c.v}</button>}
                      {c.plain && <span>{c.v}</span>}
                      {c.tag && <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: c.tagBg, color: c.tagFg }}>{c.v}</span>}
                      {c.hasBadge && <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: c.badgeBg, color: c.badgeFg }}>{c.badge}</span>}
                      {c.hasSub && <span style={{ color: '#8A847B', fontSize: 12.5, fontWeight: 400 }}>{c.sub}</span>}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {table.isEmpty && (
          <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 14.5, fontWeight: 500 }}>Nothing to show</span>
            <span style={{ fontSize: 13, color: '#8A847B' }}>{table.emptyText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
