import React from 'react';
import { useDental } from '../../context/DentalContext';
import ToothSelector from '../ToothSelector/ToothSelector';

interface PatientInfo { name: string; dob: string; mrn: string; }
interface PracticeHeaderProps { practiceName: string; patient: PatientInfo; }

function ToothIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.5 2 6 5 6 8c0 2 .5 3.5 1 5 .8 2.5 1.5 5 1.5 7h7c0-2 .7-4.5 1.5-7 .5-1.5 1-3 1-5 0-3-2.5-6-6-6z" />
    </svg>
  );
}

export default function PracticeHeader({ practiceName, patient }: PracticeHeaderProps) {
  const { dentalModeActive, toggleDentalMode } = useDental();

  return (
    <header className="ohif-header" style={{ background: 'var(--header-bg, #1c1c1c)', borderBottom: '1px solid var(--header-border, transparent)', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'var(--font-family, system-ui)' }}>
      <span style={{ color: 'var(--accent, #2c7a7b)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ToothIcon />
        <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--header-text, #fff)' }}>{practiceName}</span>
      </span>

      <div style={{ width: '1px', height: '16px', background: 'var(--header-border, #444)' }} />
      <span style={{ fontSize: '12px', color: 'var(--header-text, #fff)' }}>{patient.name}</span>
      <span style={{ fontSize: '11px', color: 'var(--header-text-secondary, #999)' }}>{patient.dob}</span>
      <span style={{ fontSize: '11px', color: 'var(--header-text-secondary, #999)' }}>MRN {patient.mrn}</span>
      <div style={{ width: '1px', height: '16px', background: 'var(--header-border, #444)' }} />

      <ToothSelector />

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: 'var(--header-text-secondary, #999)' }}>Dental Mode</span>
        <button
          role="switch"
          aria-checked={dentalModeActive}
          aria-label="Dental Mode"
          onClick={toggleDentalMode}
          style={{ width: '34px', height: '18px', background: dentalModeActive ? 'var(--accent, #2c7a7b)' : '#666', border: 'none', borderRadius: '9px', position: 'relative', cursor: 'pointer', padding: 0 }}
        >
          <span style={{ display: 'block', width: '13px', height: '13px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2.5px', left: dentalModeActive ? 'calc(100% - 15.5px)' : '2.5px', transition: 'left 0.15s' }} />
        </button>
      </div>
    </header>
  );
}
