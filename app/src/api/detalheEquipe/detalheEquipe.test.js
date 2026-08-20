import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obterDetalheEquipeApi } from './detalheEquipe.api'; // Ajuste o nome do arquivo
import { axiosInstance } from '../base/axiosInstance';

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
        const mockDadosAPI = { nome: 'Equipe de Cartões', fila: 10 };
        axiosInstance.get.mockResolvedValue({ data: mockDadosAPI });

        const resultado = await obterDetalheEquipeApi('CARTAO');

        expect(axiosInstance.get).toHaveBeenCalledWith('/relatorios/detalhe/CARTAO');
        expect(axiosInstance.get).toHaveBeenCalledTimes(1);
        
        expect(resultado).toEqual(mockDadosAPI);
    });

    it('Deve repassar o erro original caso seja um Timeout (ECONNABORTED)', async () => {
        const erroTimeout = { code: 'ECONNABORTED' };
        axiosInstance.get.mockRejectedValue(erroTimeout);

        await expect(obterDetalheEquipeApi('CARTAO')).rejects.toEqual(erroTimeout);
    });

    it('Deve repassar o erro original caso seja um erro de servidor 503', async () => {
        const erro503 = { response: { status: 503 } };
        axiosInstance.get.mockRejectedValue(erro503);

        await expect(obterDetalheEquipeApi('CARTAO')).rejects.toEqual(erro503);
    });

    it('Deve formatar uma nova mensagem de erro caso seja um erro genérico mapeado', async () => {
        const erroGenerico = {
            response: {
                status: 400,
                data: { message: 'Equipe não encontrada.' }
            }
        };
        axiosInstance.get.mockRejectedValue(erroGenerico);

        await expect(obterDetalheEquipeApi('CARTAO')).rejects.toThrowError('Equipe não encontrada.');
    });

    it('Deve exibir a mensagem padrão caso a API falhe sem enviar uma mensagem', async () => {
        const erroSemMensagem = {
            response: { status: 500, data: {} }
        };
        axiosInstance.get.mockRejectedValue(erroSemMensagem);

        await expect(obterDetalheEquipeApi('CARTAO')).rejects.toThrowError('Ocorreu um erro ao obter os dados da tela Home.');
    });

});