import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CabecalhoHome } from './cabecalhoHome.component';
import userEvent from '@testing-library/user-event';

import { useNavigate } from "react-router-dom";
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe('Componente CabecalhoHome', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve renderizar os dados e gerar as iniciais do gerente corretamente', () => {
        // Renderizamos com dados fictícios
        render(
            <CabecalhoHome 
                nomeGerente="Carlos Eduardo Silva" 
                data="Segunda-feira, 17 de agosto" 
            />
        );

        // Verifica se printou o nome e a data na tela
        expect(screen.getByText('Carlos Eduardo Silva')).toBeInTheDocument();
        expect(screen.getByText('Segunda-feira, 17 de agosto')).toBeInTheDocument();

        // Verifica se a nossa lógica de extrair iniciais funcionou ("C" de Carlos, "E" de Eduardo)
        expect(screen.getByText('CE')).toBeInTheDocument();
    });

    it('Deve navegar para a tela de métricas (/metricas) ao clicar no botão', async () => {
        const user = userEvent.setup();
        
        render(<CabecalhoHome nomeGerente="João Silva" data="Hoje" />);

        // O componente tem apenas um botão, então o robô consegue achar facilmente
        const botaoMetricas = screen.getByRole('button');
        
        // Clica no botão
        await user.click(botaoMetricas);

        // Verifica se avisou o Router para trocar a URL
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/metricas');
    });

});