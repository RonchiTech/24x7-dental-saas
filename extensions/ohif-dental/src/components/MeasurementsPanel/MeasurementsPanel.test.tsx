import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MeasurementsPanel from './MeasurementsPanel';

const measurements = [
  { id: '1', tooth: '14', type: 'paLength',   label: 'PA length',   value: 21.3, unit: 'mm' },
  { id: '2', tooth: '16', type: 'canalAngle', label: 'Canal angle', value: 12.4, unit: '°'  },
  { id: '3', tooth: '14', type: 'crownWidth', label: 'Crown width', value: 8.5,  unit: 'mm' },
];

it('lists all measurements', () => {
  render(<MeasurementsPanel measurements={measurements} onExport={() => {}} />);
  expect(screen.getByText('PA length')).toBeTruthy();
  expect(screen.getByText('Canal angle')).toBeTruthy();
  expect(screen.getByText('Crown width')).toBeTruthy();
});

it('filters measurements by label', () => {
  render(<MeasurementsPanel measurements={measurements} onExport={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText('Filter...'), { target: { value: 'canal' } });
  expect(screen.queryByText('PA length')).toBeNull();
  expect(screen.getByText('Canal angle')).toBeTruthy();
});

it('sorts by tooth ascending', () => {
  render(<MeasurementsPanel measurements={measurements} onExport={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: /tooth/i }));
  const rows = screen.getAllByTestId('measurement-row');
  expect(rows[0].textContent).toContain('14');
  expect(rows[2].textContent).toContain('16');
});

it('calls onExport when Export JSON is clicked', () => {
  const onExport = jest.fn();
  render(<MeasurementsPanel measurements={measurements} onExport={onExport} />);
  fireEvent.click(screen.getByRole('button', { name: /export json/i }));
  expect(onExport).toHaveBeenCalled();
});
