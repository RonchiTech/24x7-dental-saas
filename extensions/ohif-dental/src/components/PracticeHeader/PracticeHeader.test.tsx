import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PracticeHeader from './PracticeHeader';
import { DentalProvider } from '../../context/DentalContext';

const patient = { name: 'Jane Doe', dob: '04/12/1982', mrn: '00423' };

function Wrapped() {
  return <DentalProvider><PracticeHeader practiceName="Westside Dental" patient={patient} /></DentalProvider>;
}

it('renders practice name and patient info', () => {
  render(<Wrapped />);
  expect(screen.getByText('Westside Dental')).toBeTruthy();
  expect(screen.getByText('Jane Doe')).toBeTruthy();
  expect(screen.getByText('04/12/1982')).toBeTruthy();
});

it('renders the Dental Mode toggle', () => {
  render(<Wrapped />);
  expect(screen.getByRole('switch', { name: /dental mode/i })).toBeTruthy();
});

it('toggle changes aria-checked state', () => {
  render(<Wrapped />);
  const toggle = screen.getByRole('switch', { name: /dental mode/i });
  expect(toggle.getAttribute('aria-checked')).toBe('true');
  fireEvent.click(toggle);
  expect(toggle.getAttribute('aria-checked')).toBe('false');
});
