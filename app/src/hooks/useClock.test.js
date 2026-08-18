import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useClock } from './useClock'; // Ajuste o caminho do seu hook

describe('Hook: useClock', () => {

    beforeEach(() => {
        // "Congelamos" o relógio do sistema em uma data exata
        // Assim, Date.now() sempre retornará o valor desta data no momento zero
        const dataFixa = new Date('2026-08-18T10:00:00.000Z');
        vi.useFakeTimers();
        vi.setSystemTime(dataFixa);
    });

    afterEach(() => {
        // Devolvemos o relógio ao normal após cada teste
        vi.useRealTimers();
    });

    it('Deve inicializar o anchor e o now com o mesmo tempo exato', () => {
        const { result } = renderHook(() => useClock());

        // No instante zero, anchor e now devem ser idênticos ao Date.now() atual
        const tempoInicial = Date.now();
        expect(result.current.anchor).toBe(tempoInicial);
        expect(result.current.now).toBe(tempoInicial);
    });

    it('Deve atualizar o now a cada segundo, mantendo o anchor intacto', () => {
        const { result } = renderHook(() => useClock());
        const tempoInicial = result.current.anchor;

        // Simulamos a passagem de 1 segundo (1000ms).
        // Usamos act() porque essa passagem do tempo vai disparar o setNow do hook.
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // O 'now' deve ter subido 1 segundo, mas o 'anchor' fica travado no tempo inicial
        expect(result.current.now).toBe(tempoInicial + 1000);
        expect(result.current.anchor).toBe(tempoInicial);

        // Simulamos a passagem de mais 5 segundos
        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // O 'now' deve ser tempo inicial + 6 segundos totais
        expect(result.current.now).toBe(tempoInicial + 6000);
        expect(result.current.anchor).toBe(tempoInicial);
    });

    it('Deve respeitar um intervalMs customizado', () => {
        // Renderizamos o hook passando 5000ms (5 segundos) como intervalo
        const { result } = renderHook(() => useClock(5000));
        const tempoInicial = result.current.anchor;

        // Avançamos apenas 1 segundo
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // Como o intervalo é de 5s, o 'now' NÃO deve ter sido atualizado ainda
        expect(result.current.now).toBe(tempoInicial);

        // Avançamos mais 4 segundos (totalizando 5s)
        act(() => {
            vi.advanceTimersByTime(4000);
        });

        // Agora sim o 'now' deve ter atualizado!
        expect(result.current.now).toBe(tempoInicial + 5000);
    });

    it('Deve limpar o intervalo (clearInterval) quando o componente for desmontado', () => {
        const { unmount } = renderHook(() => useClock());

        // O Vitest permite checar quantos "timers" (como setInterval) estão rodando
        expect(vi.getTimerCount()).toBe(1);

        // Desmontamos o hook (simulando a saída do usuário da tela)
        unmount();

        // O clearInterval deve ter sido chamado dentro do return do useEffect
        expect(vi.getTimerCount()).toBe(0);
    });

});