import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MetricasFilas } from './metricasFilas.screen.jsx';

const mockObterMetricasGerais = vi.fn();
const mockUseSmartPolling = vi.fn();

vi.mock('../../../hooks/index.js', () => ({
    useObterMetricasGerais: () => ({
        obterMetricasGerais: mockObterMetricasGerais,
    }),
    useSmartPolling: (callback, interval) => mockUseSmartPolling(callback, interval),
}));

vi.mock('../../../utils/date.js', () => ({
    converterDataParaSeletor: vi.fn((data) => `Mês Formatado (${data})`),
}));

vi.mock('../../component/index.js', () => ({
    Loading: () => <div data-testid="loading-spinner">Carregando...</div>,
    CabecalhoMetricas: ({ periodoSelecionado, setPeriodoSelecionado }) => (
        <div>
            <span>Cabeçalho Período: {periodoSelecionado}</span>
            <button onClick={() => setPeriodoSelecionado('2026-09-01')}>
                Trocar Período
            </button>
        </div>
    ),
    MetricasGeraisCard: () => <div>Metricas Gerais Card</div>,
    Graficos: () => <div>Gráficos de Métricas</div>,
    TabelaMetricas: () => <div>Tabela de Métricas</div>,
}));

describe('Screen MetricasFilas', () => {
    const mockDadosMetricas = {
        totalTickets: 120,
        equipe: [{ id: '1', nome: 'Cartão' }],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockObterMetricasGerais.mockResolvedValue(mockDadosMetricas);
    });

    it('Deve carregar e renderizar os dados de métricas com a data atual por padrão', async () => {
        render(<MetricasFilas />);

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        expect(mockObterMetricasGerais).toHaveBeenCalledTimes(1);

        expect(screen.getByText(/Mês Formatado/i)).toBeInTheDocument();

        expect(screen.getByText('Metricas Gerais Card')).toBeInTheDocument();
        expect(screen.getByText('Gráficos de Métricas')).toBeInTheDocument();
        expect(screen.getByText('Tabela de Métricas')).toBeInTheDocument();
    });

    it('Deve buscar novos dados de métricas quando o período selecionado for alterado', async () => {
        const user = userEvent.setup();
        render(<MetricasFilas />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        const botaoTrocarPeriodo = screen.getByRole('button', { name: /trocar período/i });
        await user.click(botaoTrocarPeriodo);

        expect(mockObterMetricasGerais).toHaveBeenCalledWith('2026-09-01');
    });

    it('Deve registrar o useSmartPolling e recarregar os dados silenciosamente quando o polling for acionado', async () => {
        render(<MetricasFilas />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        expect(mockUseSmartPolling).toHaveBeenCalled();

        const callbackPolling = mockUseSmartPolling.mock.calls[0][0];

        const mockDadosAtualizados = {
            totalTickets: 200,
            equipe: [{ id: '1', nome: 'Cartão' }],
        };
        mockObterMetricasGerais.mockResolvedValueOnce(mockDadosAtualizados);

        await callbackPolling();

        expect(mockObterMetricasGerais).toHaveBeenCalled();
    });
});