import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DetalheFila } from './detalheFila.screen.jsx';
import { useLocation } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(),
}));

const mockObterDetalheEquipe = vi.fn();
const mockUseSmartPolling = vi.fn();

vi.mock('../../../hooks/index.js', () => ({
    useObterDetalheEquipe: () => ({
        obterDetalheEquipe: mockObterDetalheEquipe,
    }),
    useSmartPolling: (callback, interval) => mockUseSmartPolling(callback, interval),
}));

const mockResetAnchor = vi.fn();
vi.mock('../../../hooks/useClock.js', () => ({
    useClock: () => ({ anchor: 1000, now: 2000, resetAnchor: mockResetAnchor }),
}));

vi.mock('../../component/index.js', () => ({
    Loading: () => <div data-testid="loading-spinner">Carregando...</div>,
    CabecalhoDetalheFila: ({ nomeEquipe, onSelecionarEquipe }) => (
        <div>
            <h1>Cabeçalho: {nomeEquipe}</h1>
            <button onClick={() => onSelecionarEquipe('CARTAO')}>
                Trocar para Cartão
            </button>
        </div>
    ),
    ResumoMetricaCard: () => <div>Resumo Metrica Card</div>,
    TicketsRecusadosCard: () => <div>Tickets Recusados Card</div>,
    FilaEspera: () => <div>Fila Espera</div>,
    AtendentesEquipe: () => <div>Atendentes Equipe</div>,
}));

describe('Screen DetalheFila', () => {
    const mockDadosEquipe = {
        nome: 'EMPRESTIMOS',
        capacidadeFila: 10,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockObterDetalheEquipe.mockResolvedValue(mockDadosEquipe);
    });

    it('Deve buscar os dados da equipe informada via location state e renderizar o conteúdo após o carregamento', async () => {
        vi.mocked(useLocation).mockReturnValue({ state: { equipeDesejada: 'EMPRESTIMOS' } });
        
        render(<DetalheFila />);

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        expect(mockObterDetalheEquipe).toHaveBeenCalledWith('EMPRESTIMOS');
        expect(screen.getByText('Resumo Metrica Card')).toBeInTheDocument();
        expect(screen.getByText('Fila Espera')).toBeInTheDocument();
    });

    it('Deve recarregar os dados quando o usuário selecionar outra equipe no cabeçalho', async () => {
        const user = userEvent.setup();
        vi.mocked(useLocation).mockReturnValue({ state: { equipeDesejada: 'EMPRESTIMOS' } });

        render(<DetalheFila />);

        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        const botaoTrocar = screen.getByRole('button', { name: /trocar para cartão/i });
        await user.click(botaoTrocar);

        expect(mockObterDetalheEquipe).toHaveBeenCalledWith('CARTAO');
    });

    it('Deve usar "CARTAO" como equipe padrão se acessar a tela sem state no location', async () => {
        vi.mocked(useLocation).mockReturnValue({ state: null });
        
        render(<DetalheFila />);

        expect(mockObterDetalheEquipe).toHaveBeenCalledWith('CARTAO');
    });

    it('Deve registrar o polling com useSmartPolling e recarregar dados + resetAnchor quando o polling for acionado', async () => {
        vi.mocked(useLocation).mockReturnValue({ state: { equipeDesejada: 'EMPRESTIMOS' } });

        render(<DetalheFila />);

        expect(mockUseSmartPolling).toHaveBeenCalled();

        const callbackPolling = mockUseSmartPolling.mock.calls[0][0];

        await callbackPolling();

        expect(mockObterDetalheEquipe).toHaveBeenCalledWith('EMPRESTIMOS');
        expect(mockResetAnchor).toHaveBeenCalled();
    });
});