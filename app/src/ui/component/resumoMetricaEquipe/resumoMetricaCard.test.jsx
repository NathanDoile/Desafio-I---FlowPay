import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResumoMetricaCard } from './resumoMetricaCard.component.jsx';

vi.mock('../../../utils/time.js', () => ({
  formatHumanDuration: vi.fn((segundos) => `${segundos}m`),
}));

describe('Componente: ResumoMetricaCard', () => {
  it('Deve renderizar os 4 cards de métricas da equipe com seus respectivos valores e descrições', () => {
    const mockEquipe = {
      tempoMedioAtendimento: 300,
      quantidadeAtendimentosConcluidos: 25,
      tempoMedioEspera: 120,
      quantidadeAtendimentosEmAndamento: 4,
      quantidadeAtendentes: 8,
    };

    render(<ResumoMetricaCard equipe={mockEquipe} />);

    expect(screen.getByText('Tempo médio')).toBeInTheDocument();
    expect(screen.getByText('300m')).toBeInTheDocument();
    expect(screen.getByText('Média por atendimento')).toBeInTheDocument();

    expect(screen.getByText('Concluídos hoje')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Atendimentos finalizados')).toBeInTheDocument();

    expect(screen.getByText('Espera média')).toBeInTheDocument();
    expect(screen.getByText('120m')).toBeInTheDocument();
    expect(screen.getByText('Tempo médio na fila')).toBeInTheDocument();

    expect(screen.getByText('Em atendimento')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('De 8 atendentes na equipe')).toBeInTheDocument();
  });
});