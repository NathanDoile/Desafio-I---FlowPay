import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useObterDetalheEquipe } from './useDetalheEquipe.hook'; // Ajuste o caminho do arquivo
import { obterDetalheEquipeApi } from '../../api';
import { toast } from 'react-toastify';

// 1. Mock do React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/detalhes-fila' }), // Simulamos que o usuário está nesta tela
}));

// 2. Mock da API base
vi.mock('../../api', () => ({
    obterDetalheEquipeApi: vi.fn(),
}));

// 3. Mock do Toast (Avisos na tela)
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
        // PREPARAÇÃO
        const mockDados = { nome: 'Equipe de Cartões' };
        obterDetalheEquipeApi.mockResolvedValue(mockDados);

        // AÇÃO: Renderizamos o hook
        const { result } = renderHook(() => useObterDetalheEquipe());
        const resposta = await result.current.obterDetalheEquipe('CARTAO');

        // AFIRMAÇÃO
        expect(resposta).toEqual(mockDados);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('Deve redirecionar para /indisponivel em caso de Timeout (ECONNABORTED)', async () => {
        const erroTimeout = { code: 'ECONNABORTED' };
        obterDetalheEquipeApi.mockRejectedValue(erroTimeout);

        const { result } = renderHook(() => useObterDetalheEquipe());
        await result.current.obterDetalheEquipe('CARTAO');

        // Verifica se chamou a tela de indisponibilidade salvando a rota anterior
        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/detalhes-fila' }
        });
        // Não deve mostrar toast!
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
        // Sem "response" e com "isAxiosError = true" = problema de rede nativo
        const erroSemInternet = { isAxiosError: true }; 
        obterDetalheEquipeApi.mockRejectedValue(erroSemInternet);

        const { result } = renderHook(() => useObterDetalheEquipe());
        await result.current.obterDetalheEquipe('CARTAO');

        expect(mockNavigate).toHaveBeenCalledWith('/indisponivel', {
            state: { tentativaAcesso: '/detalhes-fila' }
        });
    });

    it('Deve exibir um Toast de erro em caso de falhas genéricas (ex: 400)', async () => {
        // Erro normal que você já tratou na API jogando um "new Error()"
        const erroGenerico = new Error('Equipe não encontrada no sistema.');
        obterDetalheEquipeApi.mockRejectedValue(erroGenerico);

        const { result } = renderHook(() => useObterDetalheEquipe());
        await result.current.obterDetalheEquipe('CARTAO');

        // O navigate NÃO pode ser chamado
        expect(mockNavigate).not.toHaveBeenCalled();
        
        // O toast DEVE ser chamado com a mensagem formatada
        expect(toast.error).toHaveBeenCalledWith('Equipe não encontrada no sistema.');
    });

});