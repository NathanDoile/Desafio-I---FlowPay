import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useObterMesesMetricas } from './useObterMesesMetricas.hook'; // Ajuste o caminho
import { obterMesesMetricasApi } from '../../api';
import { toast } from 'react-toastify';

// 1. Mock do React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/metricas' }), // Simulamos que o usuário está na tela de métricas
}));

// 2. Mock da API base
vi.mock('../../api', () => ({
    obterMesesMetricasApi: vi.fn(),
}));

// 3. Mock do Toast (Avisos na tela)
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

describe('Hook: useObterMesesMetricas', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve retornar os dados corretamente em caso de sucesso na API', async () => {
        const mockDados = ['2026-08', '2026-07'];
        obterMesesMetricasApi.mockResolvedValue(mockDados);

        const { result } = renderHook(() => useObterMesesMetricas());
        const resposta = await result.current.obterMesesMetricas();

        expect(resposta).toEqual(mockDados);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('Deve redirecionar para /indisponivel em caso de Timeout (ECONNABORTED)', async () => {
        const erroTimeout = { code: 'ECONNABORTED' };
        obterMesesMetricasApi.mockRejectedValue(erroTimeout);

        const { result } = renderHook(() => useObterMesesMetricas());
        await result.current.obterMesesMetricas();

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/metricas' }
        });
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('Deve redirecionar para /indisponivel em caso de Servidor Caído (503)', async () => {
        const erro503 = { response: { status: 503 } };
        obterMesesMetricasApi.mockRejectedValue(erro503);

        const { result } = renderHook(() => useObterMesesMetricas());
        await result.current.obterMesesMetricas();

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/metricas' }
        });
    });

    it('Deve redirecionar para /indisponivel em caso de Falta de Internet', async () => {
        const erroSemInternet = { isAxiosError: true }; 
        obterMesesMetricasApi.mockRejectedValue(erroSemInternet);

        const { result } = renderHook(() => useObterMesesMetricas());
        await result.current.obterMesesMetricas();

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/metricas' }
        });
    });

    it('Deve exibir um Toast de erro em caso de falhas genéricas (ex: 400)', async () => {
        const erroGenerico = new Error('Falha ao buscar meses.');
        obterMesesMetricasApi.mockRejectedValue(erroGenerico);

        const { result } = renderHook(() => useObterMesesMetricas());
        await result.current.obterMesesMetricas();

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith('Falha ao buscar meses.');
    });

    it('Deve exibir a mensagem padrão caso a API falhe sem fornecer um error.message', async () => {
        // Simulamos um erro vazio, sem a propriedade "message"
        const erroSemMessage = new Error(); 
        erroSemMessage.message = undefined; 
        obterMesesMetricasApi.mockRejectedValue(erroSemMessage);

        const { result } = renderHook(() => useObterMesesMetricas());
        await result.current.obterMesesMetricas();

        // Confirma se o Toast usou a string de fallback
        expect(toast.error).toHaveBeenCalledWith('Não foi possível carregar os dados da Home.');
    });
});