import React, { useState, useMemo } from 'react';

export interface MeasurementRow {
  id: string;
  tooth: string;
  type: string;
  label: string;
  value: number;
  unit: string;
}

type SortKey = 'tooth' | 'type' | 'value';

interface Props { measurements: MeasurementRow[]; onExport: () => void; }

export default function MeasurementsPanel({ measurements, onExport }: Props) {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('tooth');

  const displayed = useMemo(() => {
    const q = filter.toLowerCase();
    return [...measurements]
      .filter(m => m.label.toLowerCase().includes(q) || m.tooth.includes(q) || String(m.value).includes(q))
      .sort((a, b) => sortKey === 'value' ? a.value - b.value : String(a[sortKey]).localeCompare(String(b[sortKey])));
  }, [measurements, filter, sortKey]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-family, system-ui)', fontSize: '12px' }}>
      <div style={{ padding: '8px 10px', borderBottom: '1px solid #eee', fontWeight: 600, color: '#111' }}>Measurements</div>

      <div style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>
        <input placeholder="Filter..." value={filter} onChange={e => setFilter(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', fontSize: '11px', border: '1px solid #ddd', borderRadius: '3px', padding: '3px 6px' }} />
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          {(['tooth', 'type', 'value'] as SortKey[]).map(key => (
            <button key={key} aria-label={key} onClick={() => setSortKey(key)}
              style={{ flex: 1, background: sortKey === key ? '#e0e0e0' : '#f5f5f5', border: '1px solid #ddd', color: '#555', fontSize: '9px', padding: '2px 0', borderRadius: '2px', cursor: 'pointer', textTransform: 'capitalize' }}>
              {key}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {displayed.map(m => (
          <div key={m.id} data-testid="measurement-row" style={{ padding: '5px 10px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 600, color: '#222' }}>{m.label}</div>
            <div style={{ color: '#666', fontSize: '10px' }}>Tooth {m.tooth} · {m.value} {m.unit}</div>
          </div>
        ))}
        {displayed.length === 0 && <div style={{ padding: '10px', color: '#aaa', fontSize: '11px' }}>No measurements</div>}
      </div>

      <div style={{ padding: '8px', borderTop: '1px solid #eee' }}>
        <button aria-label="Export JSON" onClick={onExport}
          style={{ width: '100%', background: '#fff', border: '1px solid #ccc', color: '#333', padding: '5px 0', fontSize: '11px', borderRadius: '3px', cursor: 'pointer' }}>
          Export JSON
        </button>
      </div>
    </div>
  );
}
