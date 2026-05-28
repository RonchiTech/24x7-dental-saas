import React, { createContext, useContext, useState, useEffect } from 'react';

type NumberingSystem = 'FDI' | 'Universal';

interface DentalContextValue {
  selectedTooth: string;
  setSelectedTooth: (tooth: string) => void;
  numberingSystem: NumberingSystem;
  setNumberingSystem: (system: NumberingSystem) => void;
  dentalModeActive: boolean;
  toggleDentalMode: () => void;
}

const DentalContext = createContext<DentalContextValue | null>(null);

export function DentalProvider({ children }: { children: React.ReactNode }) {
  const [selectedTooth, setSelectedTooth] = useState('');
  const [numberingSystem, setNumberingSystem] = useState<NumberingSystem>('FDI');
  const [dentalModeActive, setDentalModeActive] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-dental-mode', 'true');
  }, []);

  const toggleDentalMode = () => {
    setDentalModeActive(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.setAttribute('data-dental-mode', 'true');
      } else {
        document.documentElement.removeAttribute('data-dental-mode');
      }
      return next;
    });
  };

  return (
    <DentalContext.Provider
      value={{ selectedTooth, setSelectedTooth, numberingSystem, setNumberingSystem, dentalModeActive, toggleDentalMode }}
    >
      {children}
    </DentalContext.Provider>
  );
}

export function useDental(): DentalContextValue {
  const ctx = useContext(DentalContext);
  if (!ctx) throw new Error('useDental must be used inside DentalProvider');
  return ctx;
}
