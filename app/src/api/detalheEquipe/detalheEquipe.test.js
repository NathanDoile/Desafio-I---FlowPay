import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obterDetalheEquipeApi } from './detalheEquipe.api'; // Ajuste o nome do arquivo
import { axiosInstance } from '../base/axiosInstance';

// 1. "Sequestramos" o Axios!
// Substituímos a instância real por funções espiãs (vi.fn) para termos controle total.
vi.mock('../base/axiosInstance', () => ({
    axiosInstance: {
        get: vi.fn(),
    },
}));

describe('API: obterDetalheEquipeApi', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve chamar a URL correta e retornar os dados em caso de sucesso', async () => {
        // PREPARAÇÃO: Criamos um dado falso e dizemos pro Axios retornar ele.
        const mockDadosAPI = { nome: 'Equipe de Cartões', fila: 10 };
        axiosInstance.get.mockResolvedValue({ data: mockDadosAPI });

        // AÇÃO: Chamamos a sua função
        const resultado = await obterDetalheEquipeApi('CARTAO');

        // AFIRMAÇÃO:
        // 1. O Axios foi chamado com a URL certinha?
        expect(axiosInstance.get).toHaveBeenCalledWith('/relatorios/detalhe/CARTAO');
        expect(axiosInstance.get).toHaveBeenCalledTimes(1);
        
        // 2. A função desempacotou o response.data e entregou limpo?
        expect(resultado).toEqual(mockDadosAPI);
    });

    it('Deve repassar o erro original caso seja um Timeout (ECONNABORTED)', async () => {
        // PREPARAÇÃO: Simulamos o erro de Timeout do Axios
        const erroTimeout = { code: 'ECONNABORTED' };
        axiosInstance.get.mockRejectedValue(erroTimeout);

        // AÇÃO & AFIRMAÇÃO: Como a função vai "estourar" um erro, usamos reject.toThrow
        await expect(obterDetalheEquipeApi('CARTAO')).rejects.toEqual(erroTimeout);
    });

    it('Deve repassar o erro original caso seja um erro de servidor 503', async () => {
        // PREPARAÇÃO: Simulamos a API caindo e devolvendo 503
        const erro503 = { response: { status: 503 } };
        axiosInstance.get.mockRejectedValue(erro503);

        await expect(obterDetalheEquipeApi('CARTAO')).rejects.toEqual(erro503);
    });

    it('Deve formatar uma nova mensagem de erro caso seja um erro genérico mapeado', async () => {
        // PREPARAÇÃO: Simulamos um erro 400 com mensagem customizada vindo da API
        const erroGenerico = {
            response: {
                status: 400,
                data: { message: 'Equipe não encontrada.' }
            }
        };
        axiosInstance.get.mockRejectedValue(erroGenerico);

        // AÇÃO & AFIRMAÇÃO: Confirma se ele extraiu a mensagem de dentro do response.data.message
        await expect(obterDetalheEquipeApi('CARTAO')).rejects.toThrowError('Equipe não encontrada.');
    });

    it('Deve exibir a mensagem padrão caso a API falhe sem enviar uma mensagem', async () => {
        // PREPARAÇÃO: Simulamos um erro esquisito sem mensagem
        const erroSemMensagem = {
            response: { status: 500, data: {} }
        };
        axiosInstance.get.mockRejectedValue(erroSemMensagem);

        await expect(obterDetalheEquipeApi('CARTAO')).rejects.toThrowError('Ocorreu um erro ao obter os dados da tela Home.');
    });

});