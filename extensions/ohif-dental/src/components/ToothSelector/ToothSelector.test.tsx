import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToothSelector from './ToothSelector';
import { DentalProvider } from '../../context/DentalContext';

function Wrapped() {
  return <DentalProvider><ToothSelector /></DentalProvider>;
}

it('renders a tooth dropdown and a numbering system selector', () => {
  render(<Wrapped />);
  expect(screen.getByRole('combobox', { name: /tooth/i })).toBeTruthy();
  expect(screen.getByRole('combobox', { name: /numbering/i })).toBeTruthy();
});

it('shows FDI numbers by default', () => {
  render(<Wrapped />);
  const toothSelect = screen.getByRole('combobox', { name: /tooth/i }) as HTMLSelectElement;
  expect(toothSelect.options[1].text).toContain('11');
});

it('switches to Universal numbering', () => {
  render(<Wrapped />);
  fireEvent.change(screen.getByRole('combobox', { name: /numbering/i }), { target: { value: 'Universal' } });
  const toothSelect = screen.getByRole('combobox', { name: /tooth/i }) as HTMLSelectElement;
  expect(toothSelect.options[1].text).toContain('#8');
});
