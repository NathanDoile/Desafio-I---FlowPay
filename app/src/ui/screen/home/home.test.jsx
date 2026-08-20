import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Home } from './home.screen.jsx';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

const mockObterHome = vi.fn();
const mockUseSmartPolling = vi.fn();

vi.mock('../../../hooks/index.js', () => ({
    useObterHome: () => ({
        obterHome: mockObterHome,
    }),
    useSmartPolling: (callback, interval) => mockUseSmartPolling(callback, interval),
}));

vi.mock('../../component/index.js', () => ({
    Loading: () => <div data-testid="loading-spinner">Carregando...</div>,
    CabecalhoHome: ({ nomeGerente }) => <div>Cabeçalho: {nomeGerente}</div>,
    FilaTimeCard: ({ equipe, onClick }) => (
        <div>
            <span>Equipe: {equipe.nome}</span>
            <button onClick={() => onClick(equipe.categoria)}>
                Ver Detalhes {equipe.nome}
            </button>
        </div>
    ),
}));

describe('Screen Home', () => {
    const mockDadosHome = {
        totalTickets: 42,
        quantidadeAtendentes: 10,
        equipes: [
            { id: '1', nome: 'Cartão', categoria: 'CARTAO' },
            { id: '2', nome: 'Empréstimos', categoria: 'EMPRESTIMOS' },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockObterHome.mockResolvedValue(mockDadosHome);
    });

    it('Deve carregar e exibir os dados gerais e a lista de equipes', async () => {
        render(<Home />);

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        expect(screen.getByText('42')).toBeInTheDocument(); // totalTickets
        expect(screen.getByText('10')).toBeInTheDocument(); // quantidadeAtendentes
        expect(screen.getByText('2')).toBeInTheDocument(); // equipes.length

        expect(screen.getByText('Equipe: Cartão')).toBeInTheDocument();
        expect(screen.getByText('Equipe: Empréstimos')).toBeInTheDocument();
    });

    it('Deve navegar para /detalhes-fila com o state correto ao clicar em uma equipe', async () => {
        const user = userEvent.setup();
        render(<Home />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        const botaoCartao = screen.getByRole('button', { name: /ver detalhes cartão/i });
        await user.click(botaoCartao);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/detalhes-fila', {
            state: { equipeDesejada: 'CARTAO' },
        });
    });

    it('Deve registrar o useSmartPolling e recarregar os dados silenciosamente via reatualizarDadosHome', async () => {
        render(<Home />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        expect(mockUseSmartPolling).toHaveBeenCalled();

        const callbackPolling = mockUseSmartPolling.mock.calls[0][0];

        const mockDadosAtualizados = {
            ...mockDadosHome,
            totalTickets: 50,
        };
        mockObterHome.mockResolvedValueOnce(mockDadosAtualizados);

        await callbackPolling();

        await waitFor(() => {
            expect(screen.getByText('50')).toBeInTheDocument();
        });

        expect(mockObterHome).toHaveBeenCalled();
    });
});