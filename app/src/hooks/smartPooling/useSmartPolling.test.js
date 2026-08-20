import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSmartPolling } from './useSmartPolling.hook';

describe('Hook: useSmartPolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('Deve executar o callback periodicamente quando a página estiver visível', () => {
    const callbackMock = vi.fn();
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });

    renderHook(() => useSmartPolling(callbackMock, 5000));

    // Avança o tempo em 5 segundos (1º disparo)
    vi.advanceTimersByTime(5000);
    expect(callbackMock).toHaveBeenCalledTimes(1);

    // Avança mais 5 segundos (2º disparo)
    vi.advanceTimersByTime(5000);
    expect(callbackMock).toHaveBeenCalledTimes(2);
  });

  it('Não deve executar o callback periodicamente se a aba estiver em segundo plano (hidden)', () => {
    const callbackMock = vi.fn();
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });

    renderHook(() => useSmartPolling(callbackMock, 5000));

    vi.advanceTimersByTime(15000);
    expect(callbackMock).not.toHaveBeenCalled();
  });

  it('Deve disparar o callback ao detectar o evento visibilitychange se a página se tornar visível', () => {
    const callbackMock = vi.fn();
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });

    renderHook(() => useSmartPolling(callbackMock, 10000));

    // Troca para visível e dispara o evento da API do DOM
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(callbackMock).toHaveBeenCalledTimes(1);
  });

  it('Deve manter a referência do callback atualizada sem reiniciar os timers', () => {
    const callbackOriginal = vi.fn();
    const callbackNovo = vi.fn();

    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });

    const { rerender } = renderHook(
      ({ cb }) => useSmartPolling(cb, 5000),
      { initialProps: { cb: callbackOriginal } }
    );

    // Atualiza a prop de callback no re-render
    rerender({ cb: callbackNovo });

    vi.advanceTimersByTime(5000);

    expect(callbackOriginal).not.toHaveBeenCalled();
    expect(callbackNovo).toHaveBeenCalledTimes(1);
  });

  it('Deve limpar o intervalo e o evento de visibilitychange ao desmontar', () => {
    const callbackMock = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useSmartPolling(callbackMock, 5000));

    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });
});