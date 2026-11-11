import React from 'react';
import { Btn, CloseX, Eyebrow, Field, Icon, ICON, inputStyle } from './ui.jsx';
import { SERIF } from '../lib/tokens.js';

const Panel = ({ title, aside, children }) => (
  <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 0 0 1px #EAE0D1', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}><Eyebrow>{title}</Eyebrow>{aside}</div>
    {children}
  </div>
);
const grid = min => ({ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: 14 });
const Sel = ({ value, onChange, options, ring }) => <select value={value} onChange={onChange} style={{ ...inputStyle(ring), padding: '0 12px' }}>{options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select>;
const Row = ({ l, children }) => <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: '#6B6762' }}>{l}</span><span style={{ fontWeight: 500 }}>{children}</span></div>;

export function Modal({ label, title, sub, onClose, maxWidth = 920, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(36,4,11,0.34)', zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div data-screen-label={label} role="dialog" aria-modal="true" aria-label={title} style={{ width: '100%', maxWidth, maxHeight: 'calc(100vh - 48px)', background: '#F7F2EA', borderRadius: 24, boxShadow: '0 24px 64px rgba(36,4,11,0.24)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '22px 28px', background: '#fff', borderBottom: '1px solid #EAE0D1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style={{ fontFamily: SERIF, fontSize: 26, lineHeight: '30px' }}>{title}</span><span style={{ fontSize: 13, color: '#6B6762' }}>{sub}</span></div>
          <CloseX onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}
export const ModalFooter = ({ children, between }) => <div style={{ padding: '16px 28px', background: '#fff', borderTop: '1px solid #EAE0D1', display: 'flex', justifyContent: between ? 'space-between' : 'flex-end', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>;
export const ModalBody = ({ children, gap = 18 }) => <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap }}>{children}</div>;

export function ManualOrderModal({ v }) {
  const { form, fset, fe, fb } = v;
  return (
    <Modal label="Manual order form" title={v.mTitle} sub="For orders not captured by the portal. Fields marked * are required." onClose={v.closeModal}>
      {v.isEditStep && (
        <>
          <ModalBody>
            <Panel title="A · PHARMACY">
              <div style={grid(220)}>
                <Field label="Pharmacy *" error={fe.pharmacy}><Sel value={form.pharmacy} onChange={fset.pharmacy} options={v.formPhOpts} ring={fb.pharmacy} /></Field>
                <Field label="Provider"><input value={form.provider} onChange={fset.provider} placeholder="Defaults to pharmacy" style={inputStyle()} /></Field>
              </div>
            </Panel>
            <Panel title="B · ORDER IDENTIFICATION">
              <div style={grid(200)}>
                <Field label="Pomegranate order ID"><input value={form.pomId} onChange={fset.pomId} placeholder="Optional · PG-…" style={inputStyle()} /></Field>
                <Field label="Provider order ID"><input value={form.poid} onChange={fset.poid} placeholder="Optional" style={inputStyle()} /></Field>
                <Field label="Order date *" error={fe.date}><input type="date" value={form.date} max={v.maxDate} onChange={fset.date} style={inputStyle(fb.date)} /></Field>
                <Field label="Reason for manual entry *" error={fe.reason}><Sel value={form.reason} onChange={fset.reason} options={v.reasonOpts} ring={fb.reason} /></Field>
              </div>
            </Panel>
            <Panel title="C · PATIENT" aside={<span style={{ fontSize: 12, color: '#8A847B' }}>Only for order identification · access-controlled</span>}>
              <div style={grid(200)}>
                <Field label="First name *" error={fe.first}><input value={form.first} onChange={fset.first} style={inputStyle(fb.first)} /></Field>
                <Field label="Last name *" error={fe.last}><input value={form.last} onChange={fset.last} style={inputStyle(fb.last)} /></Field>
                <Field label="Date of birth" error={fe.dob}><input type="date" value={form.dob} max={v.maxDate} onChange={fset.dob} style={inputStyle(fb.dob)} /></Field>
              </div>
            </Panel>
            <Panel title="D · MEDICATIONS" aside={<span style={{ fontSize: 12.5, fontWeight: 500 }}>{v.totalVials} total</span>}>
              {v.fLines.map((l, i) => {
                const s = { ...inputStyle(l.bc, 42, 10, 13.5), padding: '0 10px', minWidth: 0 };
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 14, borderRadius: 14, background: '#FBF8F3' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr) minmax(0,0.9fr) 80px 92px 36px', gap: 10, alignItems: 'end' }}>
                      <Field label="Drug *"><select value={l.drug} onChange={l.onDrug} style={s}>{l.drugOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select></Field>
                      <Field label="Concentration *"><select value={l.conc} onChange={l.onConc} style={s}>{l.concOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select></Field>
                      <Field label="Vial size *"><select value={l.size} onChange={l.onSize} style={s}>{l.sizeOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select></Field>
                      <Field label="Qty *"><input type="number" min="1" step="1" value={l.qty} onChange={l.onQty} style={{ ...s, width: '100%' }} /></Field>
                      <Field label="Vial count *"><input type="number" min="0" step="1" value={l.vials} onChange={l.onVials} style={{ ...s, width: '100%' }} /></Field>
                      {l.canRemove ? <button type="button" onClick={l.remove} aria-label="Remove medication" className="h-track" style={{ height: 42, width: 36, border: 'none', borderRadius: 10, background: 'transparent', color: '#8A847B', cursor: 'pointer', fontSize: 20 }}>×</button> : <span />}
                    </div>
                    {l.hasErr && <span style={{ fontSize: 12, color: '#A3203E' }}>{l.err}</span>}
                  </div>
                );
              })}
              <Btn h={38} px={16} size={13} icon={ICON.plus} onClick={v.addLine} style={{ alignSelf: 'flex-start', color: '#660C21' }}>Add another medication</Btn>
              <span style={{ fontSize: 12, color: '#8A847B' }}>Vial count defaults to quantity — change it if a unit isn’t one vial. Supplies like syringes don’t count as vials.</span>
            </Panel>
            <div style={grid(320)}>
              <Panel title="E · PHARMACIST">
                <Field label="Order created by *" error={fe.rph}><Sel value={form.rph} onChange={fset.rph} options={v.formRphOpts} ring={fb.rph} /></Field>
                <Row l="Pharmacist ID">{v.rphIdText}</Row>
                <span style={{ fontSize: 12, lineHeight: '17px', color: '#8A847B' }}>The pharmacist who created the order — not the person entering this record.</span>
              </Panel>
              <Panel title="F · INTERNAL">
                <Field label="Notes"><textarea value={form.notes} onChange={fset.notes} rows={2} placeholder="Context for the team" style={{ ...inputStyle(), height: 'auto', padding: '10px 14px', resize: 'vertical' }} /></Field>
                <Row l="Record added by">{v.addedByText}</Row>
                <Row l="Entry timestamp">{v.entryTs}</Row>
              </Panel>
            </div>
          </ModalBody>
          <ModalFooter>
            <Btn h={44} px={18} size={14} onClick={v.closeModal}>Cancel</Btn>
            <Btn variant="primary" h={44} px={22} size={14} onClick={v.reviewForm}>Review order</Btn>
          </ModalFooter>
        </>
      )}
      {v.isConfirmStep && (
        <>
          <ModalBody gap={16}>
            {v.hasDups && (
              <div style={{ padding: '16px 18px', borderRadius: 16, background: '#FCF1DF', color: '#6E4810', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Possible duplicate — check before saving</span>
                {v.dups.map((d, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 13, flexWrap: 'wrap' }}><span>{d.why}: <strong style={{ fontWeight: 500 }}>{d.label}</strong></span><button type="button" onClick={d.open} style={{ border: 'none', background: 'none', padding: 0, fontSize: 13, fontWeight: 500, color: '#660C21', cursor: 'pointer', textDecoration: 'underline' }}>Open existing</button></div>)}
              </div>
            )}
            <Panel title="CONFIRM DETAILS">
              {v.cSummary.map(c => <div key={c.l} style={{ display: 'grid', gridTemplateColumns: '180px minmax(0,1fr)', gap: 12, fontSize: 13.5 }}><span style={{ color: '#6B6762' }}>{c.l}</span><span style={{ fontWeight: 500 }}>{c.v}</span></div>)}
            </Panel>
            <Panel title="MEDICATIONS" aside={<span style={{ fontSize: 13, fontWeight: 500 }}>{v.totalVials}</span>}>
              {v.cLines.map((l, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 10, background: '#FBF8F3', fontSize: 13.5 }}><span style={{ fontWeight: 500 }}>{l.t}</span><span style={{ color: '#6B6762' }}>{l.q}</span></div>)}
            </Panel>
            <span style={{ fontSize: 12.5, color: '#8A847B' }}>This record will be tagged Manual and logged in the audit trail.</span>
          </ModalBody>
          <ModalFooter>
            <Btn h={44} px={18} size={14} onClick={v.backToEdit}>Back to edit</Btn>
            <Btn variant="primary" h={44} px={22} size={14} onClick={v.saveForm}>{v.mSaveLabel}</Btn>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
