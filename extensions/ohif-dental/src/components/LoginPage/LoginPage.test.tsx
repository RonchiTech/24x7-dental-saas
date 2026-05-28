import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';

const mockFetch = jest.fn();
global.fetch = mockFetch as any;

afterEach(() => { jest.clearAllMocks(); localStorage.clear(); });

it('renders email and password fields', () => {
  render(<LoginPage apiBase="http://localhost:4000" onSuccess={() => {}} />);
  expect(screen.getByLabelText(/email/i)).toBeTruthy();
  expect(screen.getByLabelText(/password/i)).toBeTruthy();
});

it('stores JWT and calls onSuccess after successful login', async () => {
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({ token: 'jwt-123' }) });
  const onSuccess = jest.fn();
  render(<LoginPage apiBase="http://localhost:4000" onSuccess={onSuccess} />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  expect(localStorage.getItem('dental_jwt')).toBe('jwt-123');
});

it('shows error message on failed login', async () => {
  mockFetch.mockResolvedValue({ ok: false, json: async () => ({ error: 'Invalid credentials' }) });
  render(<LoginPage apiBase="http://localhost:4000" onSuccess={() => {}} />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeTruthy());
});
