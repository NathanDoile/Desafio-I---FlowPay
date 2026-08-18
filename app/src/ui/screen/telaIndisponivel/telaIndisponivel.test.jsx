import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TelaIndisponivel } from './telaIndisponivel.screen.jsx'; // Ajuste o caminho da sua screen
import { useLocation } from 'react-router-dom';

// 1. Mock do React Router
const mockNavigate = vi.fn();
const mockLocationState = { tentativaAcesso: '/metricas' };

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: vi.fn().mockReturnValue({ state: { tentativaAcesso: '/metricas' } }),
}));

// 2. Mock do cabeçalho
vi.mock('../../component/index', () => ({
    CabecalhoTelaIndisponivel: () => <div>Cabeçalho Tela Indisponível</div>,
}));

describe('Screen TelaIndisponivel', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Ativa os timers falsos para podermos controlar o tempo (setTimeout) instantaneamente
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        // Restaura os timers reais após cada teste
        vi.useRealTimers();
    });

    it('Deve renderizar as mensagens de erro 503 e o link de suporte', () => {
        render(<TelaIndisponivel />);

        expect(screen.getByText(/Interrupção temporária · Erro 503/i)).toBeInTheDocument();
        expect(screen.getByText(/A central de filas está/i)).toBeInTheDocument();
        
        // Verifica o link de suporte por email
        const linkSuporte = screen.getByRole('link', { name: /falar com o suporte/i });
        expect(linkSuporte).toHaveAttribute('href', 'mailto:suporte@flowpay.com.br');
    });

    it('Deve exibir o estado de carregamento e redirecionar para a rota anterior após 700ms', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<TelaIndisponivel />);

        const botaoTentarNovamente = screen.getByRole('button', { name: /tentar novamente/i });

        // Clica no botão de tentar novamente
        await user.click(botaoTentarNovamente);

        // Verifica se o estado mudou para loading e desabilitou o botão
        expect(screen.getByText('Verificando conexão...')).toBeInTheDocument();
        expect(botaoTentarNovamente).toBeDisabled();

        // Avança o relógio do teste em 700ms instantaneamente
        vi.advanceTimersByTime(700);

        // Confirma que navegou de volta para a rota contida em location.state ('/metricas')
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/metricas');
    });

    it('Deve redirecionar para a raiz (/) se não houver rota anterior no location.state', async () => {

    // 1. PREPARAÇÃO (Sempre ANTES do render!)
    vi.mocked(useLocation).mockReturnValue({ state: null });
    
    // 2. AÇÃO (Renderização e interação do usuário)
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TelaIndisponivel />);

    const botaoTentarNovamente = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(botaoTentarNovamente);

    // 3. ASSERÇÕES E PASSAGEM DO TEMPO
    expect(screen.getByText('Verificando conexão...')).toBeInTheDocument();
    expect(botaoTentarNovamente).toBeDisabled();
    
    // Avança o relógio em 700ms
    vi.advanceTimersByTime(700);

    // Confirma se caiu no fallback!
    expect(mockNavigate).toHaveBeenCalledWith('/'); 
});
});