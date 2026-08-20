import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Home } from './home.screen.jsx';

// 1. Mock do React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// 2. Mock do Hook da API e do Smart Polling
const mockObterHome = vi.fn();
const mockUseSmartPolling = vi.fn();

vi.mock('../../../hooks/index.js', () => ({
    useObterHome: () => ({
        obterHome: mockObterHome,
    }),
    useSmartPolling: (callback, interval) => mockUseSmartPolling(callback, interval),
}));

// 3. Mock leve dos componentes filhos
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

        // Garante que o loading aparece de início
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

        // Aguarda a API responder e o loading sumir
        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Verifica os KPIs gerais
        expect(screen.getByText('42')).toBeInTheDocument(); // totalTickets
        expect(screen.getByText('10')).toBeInTheDocument(); // quantidadeAtendentes
        expect(screen.getByText('2')).toBeInTheDocument(); // equipes.length

        // Verifica se renderizou os cards das equipes
        expect(screen.getByText('Equipe: Cartão')).toBeInTheDocument();
        expect(screen.getByText('Equipe: Empréstimos')).toBeInTheDocument();
    });

    it('Deve navegar para /detalhes-fila com o state correto ao clicar em uma equipe', async () => {
        const user = userEvent.setup();
        render(<Home />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Clica no botão do card de Cartão
        const botaoCartao = screen.getByRole('button', { name: /ver detalhes cartão/i });
        await user.click(botaoCartao);

        // Confirma a navegação com parâmetro via state
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

        // Confirma se o Smart Polling foi registrado
        expect(mockUseSmartPolling).toHaveBeenCalled();

        // Extrai a função reatualizarDadosHome passada para o useSmartPolling
        const callbackPolling = mockUseSmartPolling.mock.calls[0][0];

        // Prepara o retorno atualizado da API
        const mockDadosAtualizados = {
            ...mockDadosHome,
            totalTickets: 50,
        };
        mockObterHome.mockResolvedValueOnce(mockDadosAtualizados);

        // Executa a callback do polling
        await callbackPolling();

        // Aguarda o React re-renderizar o estado no DOM com o valor 50
        await waitFor(() => {
            expect(screen.getByText('50')).toBeInTheDocument();
        });

        expect(mockObterHome).toHaveBeenCalled();
    });
});