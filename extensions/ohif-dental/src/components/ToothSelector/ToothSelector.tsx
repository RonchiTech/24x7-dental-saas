import React from 'react';
import { useDental } from '../../context/DentalContext';
import { TEETH } from './toothData';

export default function ToothSelector() {
  const { selectedTooth, setSelectedTooth, numberingSystem, setNumberingSystem } = useDental();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <label htmlFor="tooth-select" style={{ fontSize: '11px', color: 'var(--header-text-secondary, #999)' }}>Tooth</label>
      <select
        id="tooth-select"
        aria-label="tooth"
        value={selectedTooth}
        onChange={e => setSelectedTooth(e.target.value)}
        style={{ fontSize: '11px', border: '1px solid #ccc', borderRadius: '3px', padding: '2px 4px' }}
      >
        <option value="">— select —</option>
        {TEETH.map(t => (
          <option key={t.fdi} value={t.fdi}>
            {numberingSystem === 'FDI' ? `${t.fdi} — ${t.label}` : `#${t.universal} — ${t.label}`}
          </option>
        ))}
      </select>
      <select
        aria-label="numbering"
        value={numberingSystem}
        onChange={e => setNumberingSystem(e.target.value as 'FDI' | 'Universal')}
        style={{ fontSize: '11px', border: '1px solid #ccc', borderRadius: '3px', padding: '2px 4px' }}
      >
        <option value="FDI">FDI</option>
        <option value="Universal">Universal</option>
      </select>
    </div>
  );
}
