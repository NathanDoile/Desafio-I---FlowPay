import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CabecalhoDetalheFila } from './cabecalhoDetalheFila.component.jsx';
import userEvent from '@testing-library/user-event';

import {formatClock} from '../../../utils/time.js';
vi.mock('../../../utils/time.js', () => ({
    formatClock: vi.fn(() => '15:30:00'),
}));

import { useNavigate } from "react-router-dom";
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe('Componente CabecalhoDetalheFila', () => {
    
    const mockEquipeProps = {
        quantidadeAtendentes: 5
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve renderizar os dados e o horário formatado', () => {
        render(
            <CabecalhoDetalheFila 
                nomeEquipe="EQUIPE_A" 
                equipe={mockEquipeProps} 
                horarioAtual="2026-08-17T15:30:00" 
                onSelecionarEquipe={vi.fn()} 
            />
        );

        // Verifica se usou nosso mock de tempo e printou na tela
        expect(screen.getByText('15:30:00')).toBeInTheDocument();
        
        // Verifica se a quantidade de atendentes (5/5) apareceu
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('Deve navegar para a tela inicial (/) ao clicar no ícone de voltar', async () => {
        const user = userEvent.setup();
        
        // Renderizamos o componente
        const { container } = render(
            <CabecalhoDetalheFila 
                nomeEquipe="EQUIPE_A" 
                equipe={mockEquipeProps} 
                onSelecionarEquipe={vi.fn()} 
            />
        );

        // Como o onClick está num SVG (que não tem tag <button>), buscamos a classe dele
        // (Recomendo fortemente trocar aquele span por um button depois!)
        const iconeHeadset = container.querySelector('.lucide-headset');
        
        await user.click(iconeHeadset);

        // Verifica se o Router foi chamado mandando o usuário pra raiz
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('Deve disparar onSelecionarEquipe ao clicar em uma aba de equipe diferente', async () => {
        const user = userEvent.setup();
        const mockSelecionar = vi.fn();

        render(
            <CabecalhoDetalheFila 
                nomeEquipe="EQUIPE_A" // A equipe atual é a Alpha
                equipe={mockEquipeProps} 
                onSelecionarEquipe={mockSelecionar} 
            />
        );

        // O robô encontra o botão da outra equipe (Equipe Beta) na barra de navegação
        const botaoEquipeBeta = screen.getByRole('button', { name: /Empréstimos/i });

        // Clica na nova equipe
        await user.click(botaoEquipeBeta);

        // Verifica se a função foi chamada mandando o ID da Equipe Beta pra cima
        expect(mockSelecionar).toHaveBeenCalledTimes(1);
        expect(mockSelecionar).toHaveBeenCalledWith('EMPRESTIMOS');
    });

});