import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TelaIndisponivel } from './telaIndisponivel.screen.jsx'; // Ajuste o caminho da sua screen
import { useLocation } from 'react-router-dom';

const mockNavigate = vi.fn();
const mockLocationState = { tentativaAcesso: '/metricas' };

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: vi.fn().mockReturnValue({ state: { tentativaAcesso: '/metricas' } }),
}));

vi.mock('../../component/index', () => ({
    CabecalhoTelaIndisponivel: () => <div>Cabeçalho Tela Indisponível</div>,
}));

describe('Screen TelaIndisponivel', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('Deve renderizar as mensagens de erro 503 e o link de suporte', () => {
        render(<TelaIndisponivel />);

        expect(screen.getByText(/Interrupção temporária · Erro 503/i)).toBeInTheDocument();
        expect(screen.getByText(/A central de filas está/i)).toBeInTheDocument();
        
        const linkSuporte = screen.getByRole('link', { name: /falar com o suporte/i });
        expect(linkSuporte).toHaveAttribute('href', 'mailto:suporte@flowpay.com.br');
    });

    it('Deve exibir o estado de carregamento e redirecionar para a rota anterior após 700ms', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<TelaIndisponivel />);

        const botaoTentarNovamente = screen.getByRole('button', { name: /tentar novamente/i });

        await user.click(botaoTentarNovamente);

        expect(screen.getByText('Verificando conexão...')).toBeInTheDocument();
        expect(botaoTentarNovamente).toBeDisabled();

        vi.advanceTimersByTime(700);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/metricas');
    });

    it('Deve redirecionar para a raiz (/) se não houver rota anterior no location.state', async () => {

    vi.mocked(useLocation).mockReturnValue({ state: null });
    
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<TelaIndisponivel />);

    const botaoTentarNovamente = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(botaoTentarNovamente);

    expect(screen.getByText('Verificando conexão...')).toBeInTheDocument();
    expect(botaoTentarNovamente).toBeDisabled();
    
    vi.advanceTimersByTime(700);

    expect(mockNavigate).toHaveBeenCalledWith('/'); 
});
});