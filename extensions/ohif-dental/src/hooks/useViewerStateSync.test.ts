import { renderHook, act } from '@testing-library/react';
import { useViewerStateSync } from './useViewerStateSync';

const mockFetch = jest.fn();
global.fetch = mockFetch as any;

beforeEach(() => {
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
  localStorage.setItem('dental_jwt', 'test-token');
  jest.useFakeTimers();
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  jest.useRealTimers();
});

it('does not call fetch immediately', () => {
  const { result } = renderHook(() => useViewerStateSync('1.2.3', 'http://localhost:4000'));
  act(() => { result.current.syncState({ viewports: [], activeTool: 'Zoom' }, []); });
  expect(mockFetch).not.toHaveBeenCalled();
});

it('calls PUT after debounce delay', () => {
  const { result } = renderHook(() => useViewerStateSync('1.2.3', 'http://localhost:4000'));
  act(() => { result.current.syncState({ viewports: [], activeTool: 'Zoom' }, []); });
  act(() => { jest.advanceTimersByTime(1100); });
  expect(mockFetch).toHaveBeenCalledWith(
    'http://localhost:4000/viewer-state/1.2.3',
    expect.objectContaining({ method: 'PUT' })
  );
});

it('does not call fetch when no JWT in localStorage', () => {
  localStorage.removeItem('dental_jwt');
  const { result } = renderHook(() => useViewerStateSync('1.2.3', 'http://localhost:4000'));
  act(() => { result.current.syncState({ viewports: [], activeTool: 'Zoom' }, []); });
  act(() => { jest.advanceTimersByTime(1100); });
  expect(mockFetch).not.toHaveBeenCalled();
});
