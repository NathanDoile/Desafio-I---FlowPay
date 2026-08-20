import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CabecalhoMetricas } from './cabecalhoMetricas.component.jsx'; // Ajuste o caminho

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../seletorPeriodo/seletorPeriodo.component', () => ({
    SeletorPeriodo: ({ value, onChange }) => (
        <div data-testid="mock-seletor-periodo">
            <span data-testid="valor-recebido">{value}</span>
            <button 
                data-testid="botao-mudar-periodo" 
                onClick={() => onChange('2026-09-01')}
            >
                Simular Mudança
            </button>
        </div>
    )
}));

describe('Componente CabecalhoMetricas', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve renderizar os textos e passar o valor atual para o SeletorPeriodo', () => {
        render(
            <CabecalhoMetricas 
                periodoSelecionado="2026-08-01" 
                setPeriodoSelecionado={vi.fn()} 
            />
        );

        expect(screen.getByText('Métricas de Filas de Distribuição')).toBeInTheDocument();

        expect(screen.getByTestId('mock-seletor-periodo')).toBeInTheDocument();
        expect(screen.getByTestId('valor-recebido')).toHaveTextContent('2026-08-01');
    });

    it('Deve navegar para a raiz (/) ao clicar no botão de voltar', async () => {
        const user = userEvent.setup();
        
        render(
            <CabecalhoMetricas 
                periodoSelecionado="2026-08-01" 
                setPeriodoSelecionado={vi.fn()} 
            />
        );

        const botoes = screen.getAllByRole('button');
        await user.click(botoes[0]);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('Deve repassar a função setPeriodoSelecionado para o filho', async () => {
        const user = userEvent.setup();
        const mockSetPeriodo = vi.fn();
        
        render(
            <CabecalhoMetricas 
                periodoSelecionado="2026-08-01" 
                setPeriodoSelecionado={mockSetPeriodo} 
            />
        );

        const botaoMudarPeriodo = screen.getByTestId('botao-mudar-periodo');
        await user.click(botaoMudarPeriodo);

        expect(mockSetPeriodo).toHaveBeenCalledTimes(1);
        expect(mockSetPeriodo).toHaveBeenCalledWith('2026-09-01');
    });

});