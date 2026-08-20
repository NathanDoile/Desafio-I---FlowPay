import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obterMesesMetricasApi } from './mesesMetricas.api'; // Ajuste o caminho se necessário
import { axiosInstance } from '../base/axiosInstance';

vi.mock('../base/axiosInstance', () => ({
    axiosInstance: {
        get: vi.fn(),
    },
}));

describe('API: obterMesesMetricasApi', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve chamar a URL correta e retornar os dados em caso de sucesso', async () => {
        const mockDadosAPI = ['2026-08', '2026-07', '2026-06'];
        axiosInstance.get.mockResolvedValue({ data: mockDadosAPI });

        const resultado = await obterMesesMetricasApi();

        expect(axiosInstance.get).toHaveBeenCalledWith('/relatorios/meses-metricas');
        expect(axiosInstance.get).toHaveBeenCalledTimes(1);
        
        expect(resultado).toEqual(mockDadosAPI);
    });

    it('Deve repassar o erro original caso seja um Timeout (ECONNABORTED)', async () => {
        const erroTimeout = { code: 'ECONNABORTED' };
        axiosInstance.get.mockRejectedValue(erroTimeout);

        await expect(obterMesesMetricasApi()).rejects.toEqual(erroTimeout);
    });

    it('Deve repassar o erro original caso seja um erro de servidor 503', async () => {
        const erro503 = { response: { status: 503 } };
        axiosInstance.get.mockRejectedValue(erro503);

        await expect(obterMesesMetricasApi()).rejects.toEqual(erro503);
    });

    it('Deve repassar o erro original caso falte a resposta (queda de internet)', async () => {
        const erroSemResposta = { message: 'Network Error' };
        axiosInstance.get.mockRejectedValue(erroSemResposta);

        await expect(obterMesesMetricasApi()).rejects.toEqual(erroSemResposta);
    });

    it('Deve formatar uma nova mensagem de erro genérico mapeado', async () => {
        const erroGenerico = {
            response: {
                status: 400,
                data: { message: 'Nenhum mês de métrica encontrado.' }
            }
        };
        axiosInstance.get.mockRejectedValue(erroGenerico);

        await expect(obterMesesMetricasApi()).rejects.toThrowError('Nenhum mês de métrica encontrado.');
    });

    it('Deve exibir a mensagem padrão caso a API falhe sem enviar uma mensagem', async () => {
        const erroSemMensagem = {
            response: { status: 500, data: {} }
        };
        axiosInstance.get.mockRejectedValue(erroSemMensagem);

        await expect(obterMesesMetricasApi()).rejects.toThrowError('Ocorreu um erro ao obter os dados da tela Home.');
    });

});