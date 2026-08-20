import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CabecalhoTelaIndisponivel } from './cabecalhoTelaIndisponivel.component.jsx'; // Ajuste o nome do arquivo

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

        const botaoLogo = screen.getByRole('button', { name: /FlowPay/i });
        expect(botaoLogo).toBeInTheDocument();

        expect(screen.getByText('Sistema instável')).toBeInTheDocument();
    });

    it('Deve navegar para a tela inicial (/) ao clicar no logo', async () => {
        const user = userEvent.setup();
        
        render(<CabecalhoTelaIndisponivel />);

        const botaoLogo = screen.getByRole('button', { name: /FlowPay/i });
        
        await user.click(botaoLogo);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

});