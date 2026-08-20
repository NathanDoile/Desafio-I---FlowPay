import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FilaTimeCard } from './filaTimeCard.component.jsx'; // Ajuste o nome do arquivo

describe('Componente FilaTimeCard', () => {

    const mockEquipePadrao = {
        nome: 'CARTAO',
        quantidadeTicketsEmFila: 5,
        quantidadeAtendentes: 3,
        mediaTempoEsperaEmSegundos: 150 // 2.5 minutos
    };

    it('Deve renderizar os dados corretamente e calcular os minutos arredondados', () => {
        render(<FilaTimeCard equipe={mockEquipePadrao} onClick={vi.fn()} />);

        expect(screen.getByText('CARTAO')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // Tickets
        expect(screen.getByText('3')).toBeInTheDocument(); // Atendentes

        expect(screen.getByText('2 min')).toBeInTheDocument();
    });

    it('Deve mostrar status "Aguardando" quando a fila tiver tickets', () => {
        render(<FilaTimeCard equipe={mockEquipePadrao} onClick={vi.fn()} />);
        
        expect(screen.getByText('Aguardando')).toBeInTheDocument();
        expect(screen.queryByText('Vazia')).not.toBeInTheDocument();
    });

    it('Deve mostrar status "Vazia" quando a fila tiver 0 tickets', () => {
        const equipeVazia = { ...mockEquipePadrao, quantidadeTicketsEmFila: 0 };
        
        render(<FilaTimeCard equipe={equipeVazia} onClick={vi.fn()} />);
        
        expect(screen.getByText('Vazia')).toBeInTheDocument();
        expect(screen.queryByText('Aguardando')).not.toBeInTheDocument();
    });

    it('Deve disparar a função onClick enviando o nome da equipe ao clicar na seta', async () => {
        const user = userEvent.setup();
        const mockOnClick = vi.fn();

        const { container } = render(
            <FilaTimeCard equipe={mockEquipePadrao} onClick={mockOnClick} />
        );

        const iconeSeta = container.querySelector('.lucide-arrow-up-right');
        
        await user.click(iconeSeta);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledWith('CARTAO');
    });

    it('Deve renderizar os dados corretamente com o ícone de CARTAO e pílula "Aguardando"', () => {
        const mockEquipe = {
            nome: 'CARTAO',
            quantidadeTicketsEmFila: 5, // Maior que zero = "Aguardando"
            quantidadeAtendentes: 3,
            mediaTempoEsperaEmSegundos: 120 // 2 minutos
        };

        render(<FilaTimeCard equipe={mockEquipe} onClick={vi.fn()} />);

        expect(screen.getByText('CARTAO')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // Tickets na fila
        expect(screen.getByText('3')).toBeInTheDocument(); // Agentes online
        expect(screen.getByText('2 min')).toBeInTheDocument(); // Espera convertida
        
        expect(screen.getByText('Aguardando')).toBeInTheDocument();
    });

    it('Deve renderizar o ícone de EMPRESTIMOS e pílula "Vazia" quando fila for zero', () => {
        const mockEquipe = {
            nome: 'EMPRESTIMOS', // Vai cair no "else if"
            quantidadeTicketsEmFila: 0, // Fila zero = "Vazia"
            quantidadeAtendentes: 5,
            mediaTempoEsperaEmSegundos: 0
        };

        render(<FilaTimeCard equipe={mockEquipe} onClick={vi.fn()} />);

        expect(screen.getByText('EMPRESTIMOS')).toBeInTheDocument();
        expect(screen.getByText('Vazia')).toBeInTheDocument();
    });

    it('Deve usar o ícone genérico (else) se a equipe tiver um nome desconhecido', () => {
        const mockEquipe = {
            nome: 'SUPORTE_TECNICO', // Não é cartão nem empréstimos, vai pro "else" genérico
            quantidadeTicketsEmFila: 1,
            quantidadeAtendentes: 2,
            mediaTempoEsperaEmSegundos: 60
        };

        render(<FilaTimeCard equipe={mockEquipe} onClick={vi.fn()} />);

        expect(screen.getByText('SUPORTE_TECNICO')).toBeInTheDocument();
    });

    it('Deve chamar a função onClick passando o nome da equipe ao clicar na seta', async () => {
        const mockOnClick = vi.fn();
        const user = userEvent.setup();
        const mockEquipe = {
            nome: 'CARTAO',
            quantidadeTicketsEmFila: 0,
            quantidadeAtendentes: 1,
            mediaTempoEsperaEmSegundos: 0
        };

        const { container } = render(<FilaTimeCard equipe={mockEquipe} onClick={mockOnClick} />);

        const iconeSeta = container.querySelector('.cursor-pointer'); 
        
        await user.click(iconeSeta);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledWith('CARTAO');
    });

});