import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DetalheFila } from './DetalheFila.screen'; // Ajuste o caminho conforme sua estrutura

// 1. Mock do React Router
const mockLocationState = { equipeDesejada: 'EMPRESTIMOS' };
vi.mock('react-router-dom', () => ({
    useLocation: () => ({ state: mockLocationState }),
    useNavigate: () => vi.fn(),
}));

// 2. Mock dos Hooks Customizados
const mockObterDetalheEquipe = vi.fn();
vi.mock('../../../hooks/index.js', () => ({
    useObterDetalheEquipe: () => ({
        obterDetalheEquipe: mockObterDetalheEquipe,
    }),
}));

vi.mock('../../../hooks/useClock.js', () => ({
    useClock: () => ({ anchor: 1000, now: 2000 }),
}));

// 3. Mock simples dos componentes visuais filhos para manter o teste focado na orquestração
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
        render(<DetalheFila />);

        // Verifica se exibiu a tela de carregamento inicialmente
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

        // Aguarda o término da busca da API
        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Confirma se a API foi chamada com o parâmetro vindo de location.state ('EMPRESTIMOS')
        expect(mockObterDetalheEquipe).toHaveBeenCalledWith('EMPRESTIMOS');

        // Confirma a renderização dos elementos do conteúdo principal
        expect(screen.getByText('Resumo Metrica Card')).toBeInTheDocument();
        expect(screen.getByText('Fila Espera')).toBeInTheDocument();
    });

    it('Deve recarregar os dados quando o usuário selecionar outra equipe no cabeçalho', async () => {
        const user = userEvent.setup();
        render(<DetalheFila />);

        // Aguarda o primeiro carregamento
        await waitFor(() => {
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        // Simula o clique no botão do cabeçalho mockado para trocar a equipe
        const botaoTrocar = screen.getByRole('button', { name: /trocar para cartão/i });
        await user.click(botaoTrocar);

        // Verifica se a API foi consultada novamente com a nova equipe selecionada
        expect(mockObterDetalheEquipe).toHaveBeenCalledWith('CARTAO');
    });
});