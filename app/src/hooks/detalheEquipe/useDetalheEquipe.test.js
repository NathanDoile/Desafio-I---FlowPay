import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useObterDetalheEquipe } from './useDetalheEquipe.hook'; // Ajuste o caminho do arquivo
import { obterDetalheEquipeApi } from '../../api';
import { toast } from 'react-toastify';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/detalhes-fila' }), // Simulamos que o usuário está nesta tela
}));

vi.mock('../../api', () => ({
    obterDetalheEquipeApi: vi.fn(),
}));

vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

describe('Hook: useObterDetalheEquipe', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve retornar os dados corretamente em caso de sucesso na API', async () => {
        const mockDados = { nome: 'Equipe de Cartões' };
        obterDetalheEquipeApi.mockResolvedValue(mockDados);

        const { result } = renderHook(() => useObterDetalheEquipe());
        const resposta = await result.current.obterDetalheEquipe('CARTAO');

        expect(resposta).toEqual(mockDados);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('Deve redirecionar para /indisponivel em caso de Timeout (ECONNABORTED)', async () => {
        const erroTimeout = { code: 'ECONNABORTED' };
        obterDetalheEquipeApi.mockRejectedValue(erroTimeout);

        const { result } = renderHook(() => useObterDetalheEquipe());
        await result.current.obterDetalheEquipe('CARTAO');

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/detalhes-fila' }
        });
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('Deve redirecionar para /indisponivel em caso de Servidor Caído (503)', async () => {
        const erro503 = { response: { status: 503 } };
        obterDetalheEquipeApi.mockRejectedValue(erro503);

        const { result } = renderHook(() => useObterDetalheEquipe());
        await result.current.obterDetalheEquipe('CARTAO');

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/detalhes-fila' }
        });
    });

    it('Deve redirecionar para /indisponivel em caso de Falta de Internet', async () => {
        const erroSemInternet = { isAxiosError: true }; 
        obterDetalheEquipeApi.mockRejectedValue(erroSemInternet);

        const { result } = renderHook(() => useObterDetalheEquipe());
        await result.current.obterDetalheEquipe('CARTAO');

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/detalhes-fila' }
        });
    });

    it('Deve exibir um Toast de erro em caso de falhas genéricas (ex: 400)', async () => {
        const erroGenerico = new Error('Equipe não encontrada no sistema.');
        obterDetalheEquipeApi.mockRejectedValue(erroGenerico);

        const { result } = renderHook(() => useObterDetalheEquipe());
        await result.current.obterDetalheEquipe('CARTAO');

        expect(mockNavigate).not.toHaveBeenCalled();
        
        expect(toast.error).toHaveBeenCalledWith('Equipe não encontrada no sistema.');
    });

    it('Deve exibir a mensagem padrão caso a API falhe sem fornecer um error.message', async () => {
        const erroSemMessage = new Error(); 
        erroSemMessage.message = undefined; 
        obterDetalheEquipeApi.mockRejectedValue(erroSemMessage);

        const { result } = renderHook(() => useObterDetalheEquipe());
        await result.current.obterDetalheEquipe();

        expect(toast.error).toHaveBeenCalledWith('Não foi possível carregar os dados da Home.');
    });
});