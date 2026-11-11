import React from 'react';
import { Btn, Eyebrow, Icon, ICON, Pill, inputStyle } from './ui.jsx';
import { Modal, ModalBody, ModalFooter } from './ManualOrderModal.jsx';
import { DataTable } from './DataTable.jsx';
import { SERIF } from '../lib/tokens.js';

export function CsvImportModal({ v }) {
  return (
    <Modal label="CSV import" title="Import missing orders" sub="Upload → map columns → validate → import" onClose={v.closeModal} maxWidth={980}>
      {v.csvUpload && (
        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '48px 24px', borderRadius: 18, background: '#fff', boxShadow: 'inset 0 0 0 1.5px #E0D6C6', cursor: 'pointer', textAlign: 'center' }}>
            <Icon d={ICON.upload} size={32} sw={1.6} color="#660C21" />
            <span style={{ fontSize: 15, fontWeight: 500 }}>Choose a CSV file</span>
            <span style={{ fontSize: 13, color: '#6B6762' }}>One row per medication line · dates as YYYY-MM-DD</span>
            <input type="file" accept=".csv,text/csv" onChange={v.onCsvFile} style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} />
          </label>
          {v.hasCsvErr && <span style={{ fontSize: 13, color: '#A3203E' }}>{v.csvErr}</span>}
          <div style={{ display: 'flex', justifyContent: 'center' }}><Btn onClick={v.useSample} px={18} style={{ color: '#660C21' }}>Use sample file instead</Btn></div>
        </div>
      )}
      {v.csvMap && (
        <>
          <ModalBody gap={16}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontSize: 13.5 }}>
              <span><strong style={{ fontWeight: 500 }}>{v.csvName}</strong> · {v.csvRowsText}</span>
              <span style={{ display: 'flex', gap: 8 }}><Pill bg="#EDF3EE" fg="#3F6E4E">{v.csvValid} valid</Pill><Pill bg="#FCF1DF" fg="#8A5A12">{v.csvDup} duplicates</Pill><Pill bg="#F8E9EC" fg="#8A1F36">{v.csvBad} errors</Pill></span>
            </div>
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 0 0 1px #EAE0D1', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Eyebrow>MAP COLUMNS</Eyebrow>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                {v.csvFields.map(f => (
                  <label key={f.l} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#4A4540' }}>{f.l}</span>
                    <select value={f.val} onChange={f.onChange} style={{ ...inputStyle(f.bc, 38, 10, 13), padding: '0 10px' }}>{f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
                  </label>
                ))}
              </div>
              {v.csvMissing && <span style={{ fontSize: 12.5, color: '#A3203E' }}>{v.csvMissingText}</span>}
            </div>
            <DataTable table={v.csvPreview} />
          </ModalBody>
          <ModalFooter between>
            <span style={{ fontSize: 12.5, color: '#8A847B' }}>Duplicates and errors are skipped. Valid rows are tagged Manual.</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn h={44} px={18} size={14} onClick={v.csvBack}>Choose another file</Btn>
              <Btn variant="primary" h={44} px={22} size={14} onClick={v.csvImport} style={{ opacity: v.csvImportOp }}>{v.csvImportLabel}</Btn>
            </div>
          </ModalFooter>
        </>
      )}
      {v.csvDone && (
        <div style={{ padding: '36px 28px', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center' }}>
          <span style={{ width: 56, height: 56, borderRadius: '50%', background: '#660C21', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={ICON.check} size={26} sw={2.4} /></span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontFamily: SERIF, fontSize: 26 }}>Import complete</span><span style={{ fontSize: 13.5, color: '#6B6762' }}>{v.csvName}</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,140px))', gap: 12 }}>
            {[[v.sumOk, 'imported'], [v.sumVials, 'vials added'], [v.sumDup, 'duplicates skipped'], [v.sumBad, 'errors skipped']].map(([n, l]) => (
              <div key={l} style={{ padding: 16, borderRadius: 16, background: '#fff', boxShadow: '0 0 0 1px #EAE0D1', display: 'flex', flexDirection: 'column', gap: 4 }}><span style={{ fontFamily: SERIF, fontSize: 28 }}>{n}</span><span style={{ fontSize: 12.5, color: '#6B6762' }}>{l}</span></div>
            ))}
          </div>
          <Btn variant="primary" h={44} px={22} size={14} onClick={v.csvFinish}>View manual orders</Btn>
        </div>
      )}
    </Modal>
  );
}
