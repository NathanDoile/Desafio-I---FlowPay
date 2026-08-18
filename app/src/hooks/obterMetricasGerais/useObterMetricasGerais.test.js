import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useObterMetricasGerais } from './useObterMetricasGerais.hook'; // Ajuste o caminho
import { obterMetricasGeraisApi } from '../../api';
import { toast } from 'react-toastify';

// 1. Mock do React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/metricas' }), // Simulamos que o usuário está na tela de métricas
}));

// 2. Mock da API base
vi.mock('../../api', () => ({
    obterMetricasGeraisApi: vi.fn(),
}));

// 3. Mock do Toast (Avisos na tela)
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

describe('Hook: useObterMetricasGerais', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve repassar o parâmetro de data e retornar os dados em caso de sucesso', async () => {
        const mockDados = { totalAtendimentos: 1500 };
        const dataTeste = '2026-08';
        obterMetricasGeraisApi.mockResolvedValue(mockDados);

        const { result } = renderHook(() => useObterMetricasGerais());
        
        // Passamos o parâmetro de data aqui
        const resposta = await result.current.obterMetricasGerais(dataTeste);

        // Verifica se o hook repassou a data corretamente para a API
        expect(obterMetricasGeraisApi).toHaveBeenCalledWith(dataTeste);
        expect(resposta).toEqual(mockDados);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('Deve redirecionar para /indisponivel em caso de Timeout (ECONNABORTED)', async () => {
        const erroTimeout = { code: 'ECONNABORTED' };
        obterMetricasGeraisApi.mockRejectedValue(erroTimeout);

        const { result } = renderHook(() => useObterMetricasGerais());
        await result.current.obterMetricasGerais('2026-08');

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/metricas' }
        });
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('Deve redirecionar para /indisponivel em caso de Servidor Caído (503)', async () => {
        const erro503 = { response: { status: 503 } };
        obterMetricasGeraisApi.mockRejectedValue(erro503);

        const { result } = renderHook(() => useObterMetricasGerais());
        await result.current.obterMetricasGerais('2026-08');

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/metricas' }
        });
    });

    it('Deve redirecionar para /indisponivel em caso de Falta de Internet', async () => {
        const erroSemInternet = { isAxiosError: true }; 
        obterMetricasGeraisApi.mockRejectedValue(erroSemInternet);

        const { result } = renderHook(() => useObterMetricasGerais());
        await result.current.obterMetricasGerais('2026-08');

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/metricas' }
        });
    });

    it('Deve exibir um Toast de erro em caso de falhas genéricas (ex: 400)', async () => {
        const erroGenerico = new Error('Data de métricas inválida.');
        obterMetricasGeraisApi.mockRejectedValue(erroGenerico);

        const { result } = renderHook(() => useObterMetricasGerais());
        await result.current.obterMetricasGerais('2026-08');

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith('Data de métricas inválida.');
    });

});