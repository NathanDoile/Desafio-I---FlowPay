import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TicketsRecusadosCard } from './ticketsRecusadosCard.component.jsx'; // Ajuste o caminho

// Mockamos os utilitários de tempo
vi.mock('../../../utils/time.js', () => ({
    formatHumanDuration: vi.fn((segundos) => `${segundos}s`),
    elapsedSeconds: vi.fn((data, now) => data), // Retorna o valor direto para facilitar o teste
}));

describe('Componente TicketsRecusadosCard', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve renderizar os dados e o banner de recusa recente quando o cancelamento for menor que 120s', () => {
        const mockEquipeRecente = {
            capacidadeFila: 15,
            quantidadeAtendimentosCancelados: 3,
            dataHoraUltimoCancelamento: 45, // Menor que 120 = Recente!
        };

        render(<TicketsRecusadosCard equipe={mockEquipeRecente} anchor={100} now={200} />);

        // Verifica os textos fixos e dados da equipe
        expect(screen.getByText('Capacidade da fila: 15 tickets')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();

        // Verifica a formatação da última recusa
        expect(screen.getByText('45s')).toBeInTheDocument();

        // Verifica se o banner vermelho de urgência apareceu na tela
        expect(screen.getByText('Recusa recente — fila operando no limite')).toBeInTheDocument();
    });

    it('Deve renderizar normalmente sem o banner de alerta quando a recusa for antiga (>= 120s)', () => {
        const mockEquipeAntiga = {
            capacidadeFila: 15,
            quantidadeAtendimentosCancelados: 1,
            dataHoraUltimoCancelamento: 300, // Maior que 120 = Não recente
        };

        render(<TicketsRecusadosCard equipe={mockEquipeAntiga} anchor={100} now={200} />);

        // O tempo deve ser formatado
        expect(screen.getByText('300s')).toBeInTheDocument();

        // O banner de recusa recente NÃO deve existir no DOM
        expect(screen.queryByText('Recusa recente — fila operando no limite')).not.toBeInTheDocument();
    });

    it('Deve exibir "--" quando não houver registros de cancelamento (null)', () => {
        const mockEquipeSemCancelamento = {
            capacidadeFila: 10,
            quantidadeAtendimentosCancelados: 0,
            dataHoraUltimoCancelamento: null,
        };

        render(<TicketsRecusadosCard equipe={mockEquipeSemCancelamento} anchor={100} now={200} />);

        // Deve exibir o fallback contido na regra
        expect(screen.getByText('--')).toBeInTheDocument();
        expect(screen.queryByText('Recusa recente — fila operando no limite')).not.toBeInTheDocument();
    });

});