import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useClock } from './useClock';

describe('Hook: useClock', () => {

    beforeEach(() => {
        // "Congelamos" o relógio do sistema em uma data exata
        const dataFixa = new Date('2026-08-18T10:00:00.000Z');
        vi.useFakeTimers();
        vi.setSystemTime(dataFixa);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Deve inicializar o anchor e o now com o mesmo tempo exato', () => {
        const { result } = renderHook(() => useClock());

        const tempoInicial = Date.now();
        expect(result.current.anchor).toBe(tempoInicial);
        expect(result.current.now).toBe(tempoInicial);
    });

    it('Deve atualizar o now a cada segundo, mantendo o anchor intacto', () => {
        const { result } = renderHook(() => useClock());
        const tempoInicial = result.current.anchor;

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.now).toBe(tempoInicial + 1000);
        expect(result.current.anchor).toBe(tempoInicial);

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        expect(result.current.now).toBe(tempoInicial + 6000);
        expect(result.current.anchor).toBe(tempoInicial);
    });

    it('Deve recalibrar o anchor e o now ao chamar a função resetAnchor', () => {
        const { result } = renderHook(() => useClock());
        const tempoInicial = result.current.anchor;

        // Avançamos o tempo em 10 segundos
        act(() => {
            vi.advanceTimersByTime(10000);
        });

        expect(result.current.anchor).toBe(tempoInicial);
        expect(result.current.now).toBe(tempoInicial + 10000);

        // Disparamos a recalibração da âncora
        act(() => {
            result.current.resetAnchor();
        });

        // Agora tanto o anchor quanto o now devem assumir o tempo atual (tempoInicial + 10000)
        expect(result.current.anchor).toBe(tempoInicial + 10000);
        expect(result.current.now).toBe(tempoInicial + 10000);
    });

    it('Deve respeitar um intervalMs customizado', () => {
        const { result } = renderHook(() => useClock(5000));
        const tempoInicial = result.current.anchor;

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.now).toBe(tempoInicial);

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(result.current.now).toBe(tempoInicial + 5000);
    });

    it('Deve limpar o intervalo (clearInterval) quando o componente for desmontado', () => {
        const { unmount } = renderHook(() => useClock());

        expect(vi.getTimerCount()).toBe(1);

        unmount();

        expect(vi.getTimerCount()).toBe(0);
    });

});