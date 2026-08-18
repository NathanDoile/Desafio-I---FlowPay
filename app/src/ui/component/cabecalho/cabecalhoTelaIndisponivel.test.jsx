import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CabecalhoTelaIndisponivel } from './CabecalhoTelaIndisponivel.component'; // Ajuste o nome do arquivo

// 1. Mock do React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe('Componente CabecalhoTelaIndisponivel', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve renderizar o logo do FlowPay e o alerta de instabilidade', () => {
        render(<CabecalhoTelaIndisponivel />);

        // O texto 'FlowPay' está dividido em dois <span> (Flow + Pay), 
        // mas o Testing Library consegue ler o texto completo do botão graças ao aria-label!
        const botaoLogo = screen.getByRole('button', { name: /FlowPay/i });
        expect(botaoLogo).toBeInTheDocument();

        // Verifica se a mensagem de erro está na tela
        expect(screen.getByText('Sistema instável')).toBeInTheDocument();
    });

    it('Deve navegar para a tela inicial (/) ao clicar no logo', async () => {
        const user = userEvent.setup();
        
        render(<CabecalhoTelaIndisponivel />);

        const botaoLogo = screen.getByRole('button', { name: /FlowPay/i });
        
        // Simula o clique do usuário querendo voltar pra Home
        await user.click(botaoLogo);

        // Verifica se o Router foi chamado
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

});