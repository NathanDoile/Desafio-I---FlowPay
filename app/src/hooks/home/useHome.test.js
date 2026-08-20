import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useObterHome } from './useHome.hook'; // Ajuste o caminho
import { obterHomeApi } from '../../api';
import { toast } from 'react-toastify';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }), // Simulamos que o usuário está na Home
}));

vi.mock('../../api', () => ({
    obterHomeApi: vi.fn(),
}));

vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

describe('Hook: useObterHome', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve retornar os dados corretamente em caso de sucesso na API', async () => {
        const mockDados = { totalTickets: 42 };
        obterHomeApi.mockResolvedValue(mockDados);

        const { result } = renderHook(() => useObterHome());
        const resposta = await result.current.obterHome();

        expect(resposta).toEqual(mockDados);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('Deve redirecionar para /indisponivel em caso de Timeout (ECONNABORTED)', async () => {
        const erroTimeout = { code: 'ECONNABORTED' };
        obterHomeApi.mockRejectedValue(erroTimeout);

        const { result } = renderHook(() => useObterHome());
        await result.current.obterHome();

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/' }
        });
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('Deve redirecionar para /indisponivel em caso de Servidor Caído (503)', async () => {
        const erro503 = { response: { status: 503 } };
        obterHomeApi.mockRejectedValue(erro503);

        const { result } = renderHook(() => useObterHome());
        await result.current.obterHome();

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/' }
        });
    });

    it('Deve redirecionar para /indisponivel em caso de Falta de Internet', async () => {
        const erroSemInternet = { isAxiosError: true }; 
        obterHomeApi.mockRejectedValue(erroSemInternet);

        const { result } = renderHook(() => useObterHome());
        await result.current.obterHome();

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/' }
        });
    });

    it('Deve exibir um Toast de erro em caso de falhas genéricas (ex: 400)', async () => {
        const erroGenerico = new Error('Token expirado.');
        obterHomeApi.mockRejectedValue(erroGenerico);

        const { result } = renderHook(() => useObterHome());
        await result.current.obterHome();

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith('Token expirado.');
    });

    it('Deve exibir a mensagem padrão caso a API falhe sem fornecer um error.message', async () => {
        const erroSemMessage = new Error(); 
        erroSemMessage.message = undefined; 
        obterHomeApi.mockRejectedValue(erroSemMessage);

        const { result } = renderHook(() => useObterHome());
        await result.current.obterHome();

        expect(toast.error).toHaveBeenCalledWith('Não foi possível carregar os dados da Home.');
    });
});