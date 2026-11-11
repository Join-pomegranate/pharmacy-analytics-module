import React from 'react';
import { Kpis } from '../components/Kpis.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { Card, Btn, LinkBtn, PageHead, ICON } from '../components/ui.jsx';

export function Manual({ v }) {
  return (
    <>
      <PageHead title="Manual orders" sub="Orders added by staff when they aren’t in the portal. Records are voided, never deleted.">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Btn onClick={v.mExpCsv}>Export</Btn>
          {v.canEdit && <>
            <Btn icon={ICON.upload} onClick={v.openCsv}>Import CSV</Btn>
            <Btn variant="primary" px={18} icon={ICON.plus} onClick={v.addManual}>Add order</Btn>
          </>}
        </div>
      </PageHead>
      <Kpis kpis={v.mKpis} />
      <Card title="Manually entered orders" sub="Includes voided records for audit · open an order to edit or void it" actions={<LinkBtn onClick={v.dlTemplate}>Download CSV template</LinkBtn>}>
        <DataTable table={v.manualTable} />
      </Card>
    </>
  );
}
