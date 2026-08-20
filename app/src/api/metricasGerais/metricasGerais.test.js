import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obterMetricasGeraisApi } from './metricasGerais.api'; // Ajuste o nome do arquivo
import { axiosInstance } from '../base/axiosInstance';

vi.mock('../base/axiosInstance', () => ({
    axiosInstance: {
        get: vi.fn(),
    },
}));

describe('API: obterMetricasGeraisApi', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve chamar a URL correta com o parâmetro de data e retornar os dados', async () => {
        const mockDadosAPI = { totalAtendimentos: 1500, tempoMedio: 120 };
        axiosInstance.get.mockResolvedValue({ data: mockDadosAPI });

        const resultado = await obterMetricasGeraisApi('2026-08');

        expect(axiosInstance.get).toHaveBeenCalledWith('/relatorios/metricas-gerais?data=2026-08');
        expect(axiosInstance.get).toHaveBeenCalledTimes(1);
        
        expect(resultado).toEqual(mockDadosAPI);
    });

    it('Deve repassar o erro original caso seja um Timeout (ECONNABORTED)', async () => {
        const erroTimeout = { code: 'ECONNABORTED' };
        axiosInstance.get.mockRejectedValue(erroTimeout);

        await expect(obterMetricasGeraisApi('2026-08')).rejects.toEqual(erroTimeout);
    });

    it('Deve repassar o erro original caso seja um erro de servidor 503', async () => {
        const erro503 = { response: { status: 503 } };
        axiosInstance.get.mockRejectedValue(erro503);

        await expect(obterMetricasGeraisApi('2026-08')).rejects.toEqual(erro503);
    });

    it('Deve repassar o erro original caso falte a resposta (queda de internet)', async () => {
        const erroSemResposta = { message: 'Network Error' };
        axiosInstance.get.mockRejectedValue(erroSemResposta);

        await expect(obterMetricasGeraisApi('2026-08')).rejects.toEqual(erroSemResposta);
    });

    it('Deve formatar uma nova mensagem de erro genérico mapeado', async () => {
        const erroGenerico = {
            response: {
                status: 400,
                data: { message: 'Data inválida fornecida.' }
            }
        };
        axiosInstance.get.mockRejectedValue(erroGenerico);

        await expect(obterMetricasGeraisApi('2026-08')).rejects.toThrowError('Data inválida fornecida.');
    });

    it('Deve exibir a mensagem padrão caso a API falhe sem enviar uma mensagem', async () => {
        const erroSemMensagem = {
            response: { status: 500, data: {} }
        };
        axiosInstance.get.mockRejectedValue(erroSemMensagem);

        await expect(obterMetricasGeraisApi('2026-08')).rejects.toThrowError('Ocorreu um erro ao obter os dados da tela Home.');
    });

});