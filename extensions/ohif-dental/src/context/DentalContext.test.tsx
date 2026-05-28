import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DentalProvider, useDental } from './DentalContext';

function TestConsumer() {
  const { selectedTooth, setSelectedTooth, numberingSystem, setNumberingSystem, dentalModeActive, toggleDentalMode } = useDental();
  return (
    <div>
      <span data-testid="tooth">{selectedTooth}</span>
      <span data-testid="system">{numberingSystem}</span>
      <span data-testid="active">{String(dentalModeActive)}</span>
      <button onClick={() => setSelectedTooth('22')}>select 22</button>
      <button onClick={() => setNumberingSystem('Universal')}>use universal</button>
      <button onClick={toggleDentalMode}>toggle</button>
    </div>
  );
}

it('provides default tooth state', () => {
  render(<DentalProvider><TestConsumer /></DentalProvider>);
  expect(screen.getByTestId('tooth').textContent).toBe('');
  expect(screen.getByTestId('system').textContent).toBe('FDI');
  expect(screen.getByTestId('active').textContent).toBe('true');
});

it('updates selected tooth', () => {
  render(<DentalProvider><TestConsumer /></DentalProvider>);
  fireEvent.click(screen.getByText('select 22'));
  expect(screen.getByTestId('tooth').textContent).toBe('22');
});

it('toggles dental mode', () => {
  render(<DentalProvider><TestConsumer /></DentalProvider>);
  fireEvent.click(screen.getByText('toggle'));
  expect(screen.getByTestId('active').textContent).toBe('false');
});
