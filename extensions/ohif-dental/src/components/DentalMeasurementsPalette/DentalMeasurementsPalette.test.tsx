import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DentalMeasurementsPalette from './DentalMeasurementsPalette';

const mockActivate = jest.fn();

afterEach(() => jest.clearAllMocks());

it('renders Measurements button', () => {
  render(<DentalMeasurementsPalette onActivatePreset={mockActivate} />);
  expect(screen.getByRole('button', { name: /measurements/i })).toBeTruthy();
});

it('opens palette on button click', () => {
  render(<DentalMeasurementsPalette onActivatePreset={mockActivate} />);
  fireEvent.click(screen.getByRole('button', { name: /measurements/i }));
  expect(screen.getByText('PA length')).toBeTruthy();
  expect(screen.getByText('Canal angle')).toBeTruthy();
  expect(screen.getByText('Crown width')).toBeTruthy();
  expect(screen.getByText('Root length')).toBeTruthy();
});

it('calls onActivatePreset with the correct preset and closes palette', () => {
  render(<DentalMeasurementsPalette onActivatePreset={mockActivate} />);
  fireEvent.click(screen.getByRole('button', { name: /measurements/i }));
  fireEvent.click(screen.getByText('PA length'));
  expect(mockActivate).toHaveBeenCalledWith(expect.objectContaining({ type: 'paLength', label: 'PA length' }));
  expect(screen.queryByText('Canal angle')).toBeNull();
});
