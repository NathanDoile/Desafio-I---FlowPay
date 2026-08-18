import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CabecalhoDetalheFila } from './cabecalhoDetalheFila.component';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe('Componente: CabecalhoDetalheFila', () => {

    const mockEquipePadrao = {
        quantidadeAtendentes: 5
    };

    it('Deve renderizar os dados principais e formatar o horário corretamente', () => {
        // Data local cravada às 10:30:00 para evitar conflitos de fuso horário
        const horarioFixo = new Date(2026, 7, 18, 10, 30, 0).getTime();

        render(
            <CabecalhoDetalheFila 
                nomeEquipe="CARTAO" 
                equipe={mockEquipePadrao} 
                horarioAtual={horarioFixo} 
                onSelecionarEquipe={vi.fn()} 
            />
        );

        expect(screen.getByText('CARTAO')).toBeInTheDocument();
        expect(screen.getByText('10:30:00')).toBeInTheDocument();
        expect(screen.getAllByText(/5/i).length).toBeGreaterThan(0);
    });

    it('Deve exibir os traços (--:--:--) caso o horarioAtual seja null ou undefined', () => {
        render(
            <CabecalhoDetalheFila 
                nomeEquipe="CARTAO" 
                equipe={mockEquipePadrao} 
                horarioAtual={null} 
                onSelecionarEquipe={vi.fn()} 
            />
        );

        expect(screen.getByText('--:--:--')).toBeInTheDocument();
    });

    it('Deve aplicar a classe de "Ativa" apenas no botão da equipe selecionada', () => {
        render(
            <CabecalhoDetalheFila 
                nomeEquipe="CARTAO" // Equipe ativa
                equipe={mockEquipePadrao} 
                horarioAtual={Date.now()} 
                onSelecionarEquipe={vi.fn()} 
            />
        );

        // O botão "Cartões" (ID: CARTAO) DEVE ter aria-current="page"
        const botaoCartoes = screen.getByRole('button', { name: /cartões/i });
        expect(botaoCartoes).toHaveAttribute('aria-current', 'page');

        // Os botões inativos NÃO DEVEM ter aria-current
        const botaoEmprestimos = screen.getByRole('button', { name: /empréstimos/i });
        expect(botaoEmprestimos).not.toHaveAttribute('aria-current');
    });

    it('Deve chamar o onSelecionarEquipe ao clicar no botão de uma equipe no Menu', async () => {
        const mockSelecionar = vi.fn();
        const user = userEvent.setup();

        render(
            <CabecalhoDetalheFila 
                nomeEquipe="CARTAO" 
                equipe={mockEquipePadrao} 
                horarioAtual={Date.now()} 
                onSelecionarEquipe={mockSelecionar} 
            />
        );

        const botaoEmprestimos = screen.getByRole('button', { name: /empréstimos/i });
        await user.click(botaoEmprestimos);

        expect(mockSelecionar).toHaveBeenCalledWith('EMPRESTIMOS');
    });

    it('Deve navegar para a tela Home (/) ao clicar no ícone do Headset', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <CabecalhoDetalheFila 
                nomeEquipe="CARTAO" 
                equipe={mockEquipePadrao} 
                horarioAtual={Date.now()} 
                onSelecionarEquipe={vi.fn()} 
            />
        );

        const iconeHeadset = container.querySelector('.lucide-headset') || container.querySelector('svg');
        await user.click(iconeHeadset);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

});