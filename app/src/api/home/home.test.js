import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obterHomeApi } from './home.api'; // Ajuste o nome do arquivo importado
import { axiosInstance } from '../base/axiosInstance';

vi.mock('../base/axiosInstance', () => ({
    axiosInstance: {
        get: vi.fn(),
    },
}));

describe('API: obterHomeApi', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve chamar a URL correta e retornar os dados em caso de sucesso', async () => {
        const mockDadosAPI = { totalTickets: 42, equipes: [] };
        axiosInstance.get.mockResolvedValue({ data: mockDadosAPI });

        const resultado = await obterHomeApi();

        expect(axiosInstance.get).toHaveBeenCalledWith('/relatorios/home');
        expect(axiosInstance.get).toHaveBeenCalledTimes(1);
        
        expect(resultado).toEqual(mockDadosAPI);
    });

    it('Deve repassar o erro original caso seja um Timeout (ECONNABORTED)', async () => {
        const erroTimeout = { code: 'ECONNABORTED' };
        axiosInstance.get.mockRejectedValue(erroTimeout);

        await expect(obterHomeApi()).rejects.toEqual(erroTimeout);
    });

    it('Deve repassar o erro original caso seja um erro de servidor 503', async () => {
        const erro503 = { response: { status: 503 } };
        axiosInstance.get.mockRejectedValue(erro503);

        await expect(obterHomeApi()).rejects.toEqual(erro503);
    });

    it('Deve repassar o erro original caso falte a resposta (queda de internet)', async () => {
        const erroSemResposta = { message: 'Network Error' }; // Erro sem a chave "response"
        axiosInstance.get.mockRejectedValue(erroSemResposta);

        await expect(obterHomeApi()).rejects.toEqual(erroSemResposta);
    });

    it('Deve formatar uma nova mensagem de erro genérico mapeado', async () => {
        const erroGenerico = {
            response: {
                status: 400,
                data: { message: 'Token de acesso inválido.' }
            }
        };
        axiosInstance.get.mockRejectedValue(erroGenerico);

        await expect(obterHomeApi()).rejects.toThrowError('Token de acesso inválido.');
    });

    it('Deve exibir a mensagem padrão caso a API falhe sem enviar uma mensagem', async () => {
        const erroSemMensagem = {
            response: { status: 500, data: {} }
        };
        axiosInstance.get.mockRejectedValue(erroSemMensagem);

        await expect(obterHomeApi()).rejects.toThrowError('Ocorreu um erro ao obter os dados da tela Home.');
    });

});