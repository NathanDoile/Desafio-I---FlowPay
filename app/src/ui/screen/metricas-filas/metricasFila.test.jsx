import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MetricasFilas } from './metricasFilas.screen.jsx'; // Ajuste o caminho da sua screen

// 1. Mock do Hook da API
const mockObterMetricasGerais = vi.fn();
vi.mock('../../../hooks/index.js', () => ({
    useObterMetricasGerais: () => ({
        obterMetricasGerais: mockObterMetricasGerais,
    }),
}));

// 2. Mock dos Utilitários
vi.mock('../../../utils/date.js', () => ({
    converterDataParaSeletor: vi.fn((data) => `Mês Formatado (${data})`),
}));

// 3. Mock leve dos componentes filhos
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

        // Exibe spinner de loading na montagem
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

        // Aguarda a resolução da API
        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Confirma que a API foi chamada
        expect(mockObterMetricasGerais).toHaveBeenCalledTimes(1);

        // Confirma renderização do mês formatado via converterDataParaSeletor
        expect(screen.getByText(/Mês Formatado/i)).toBeInTheDocument();

        // Confirma que os componentes de métricas foram renderizados
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

        // Simula a mudança de período no cabeçalho
        const botaoTrocarPeriodo = screen.getByRole('button', { name: /trocar período/i });
        await user.click(botaoTrocarPeriodo);

        // Verifica se a API buscou novamente os dados com o novo período ('2026-09-01')
        expect(mockObterMetricasGerais).toHaveBeenCalledWith('2026-09-01');
    });
});