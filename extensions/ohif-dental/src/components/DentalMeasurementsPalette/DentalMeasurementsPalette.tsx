import React, { useState, useRef, useEffect } from 'react';
import { MEASUREMENT_PRESETS, MeasurementPreset } from './presets';

interface Props { onActivatePreset: (preset: MeasurementPreset) => void; }

export default function DentalMeasurementsPalette({ onActivatePreset }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        aria-label="Measurements"
        onClick={() => setOpen(o => !o)}
        style={{ background: 'var(--accent, #2c7a7b)', border: 'none', color: '#fff', padding: '4px 12px', fontSize: '12px', borderRadius: '3px', cursor: 'pointer' }}
      >
        Measurements
      </button>

      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '200px', zIndex: 1000 }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: '11px', fontWeight: 600, color: '#111' }}>Measurement Presets</div>
          {MEASUREMENT_PRESETS.map(preset => (
            <button
              key={preset.type}
              onClick={() => { onActivatePreset(preset); setOpen(false); }}
              style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '8px 12px', background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', textAlign: 'left' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#222' }}>{preset.label}</span>
              <span style={{ fontSize: '10px', color: '#888' }}>{preset.cornerstoneTool} tool · {preset.unit}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
