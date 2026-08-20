import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TabelaMetricas } from './tabelaMetricas.component.jsx';

// Mock dos utilitários de formatação importados do mock.js
vi.mock('../../../mocks/metricas.mock.js', () => ({
  formatMinutes: vi.fn((minutos) => `${minutos} min`),
  formatNumber: vi.fn((numero) => `${numero}`),
}));

describe('Componente: TabelaMetricas', () => {
  const mockEquipes = [
    {
      nome: 'Cartão',
      tempoMedioAtendimento: 300, // 5 min
      tempoMedioEspera: 120, // 2 min
      totalAtendimentos: 50,
      totalTicketsRecusados: 5,
      mediaTicketsRecusadosPorDia: 1,
    },
    {
      nome: 'Empréstimos',
      tempoMedioAtendimento: 600, // 10 min
      tempoMedioEspera: 180, // 3 min
      totalAtendimentos: 30,
      totalTicketsRecusados: 2,
      mediaTicketsRecusadosPorDia: 0.5,
    },
  ];

  const mockEmpresa = {
    tempoMedioAtendimento: 450, // 7.5 min
    tempoMedioEspera: 150, // 2.5 min
    totalAtendimentos: 80,
    totalTicketsRecusados: 7,
    mediaTicketsRecusadosPorDia: 1.5,
  };

  it('Deve renderizar os cabeçalhos da tabela e o título da seção', () => {
    render(<TabelaMetricas equipes={mockEquipes} empresa={mockEmpresa} />);

    // Título e subtítulo
    expect(screen.getByText('Detalhamento por equipe')).toBeInTheDocument();
    expect(screen.getByText('Comparativo completo das filas e da média geral da empresa')).toBeInTheDocument();

    // Cabeçalhos de coluna
    expect(screen.getByText('Equipe')).toBeInTheDocument();
    expect(screen.getByText('T. médio atend.')).toBeInTheDocument();
    expect(screen.getByText('T. médio espera')).toBeInTheDocument();
    expect(screen.getByText('Atendimentos')).toBeInTheDocument();
    expect(screen.getByText('Recusados')).toBeInTheDocument();
    expect(screen.getByText('Recusados/fila cheia')).toBeInTheDocument();
  });

  it('Deve renderizar as linhas de dados das equipes e a linha consolidada da empresa', () => {
    render(<TabelaMetricas equipes={mockEquipes} empresa={mockEmpresa} />);

    // Nomes das equipes nas linhas
    expect(screen.getByText('Cartão')).toBeInTheDocument();
    expect(screen.getByText('Empréstimos')).toBeInTheDocument();

    // Nome da empresa no totalizador
    expect(screen.getByText('FlowPay')).toBeInTheDocument();

    // Métricas formatadas e médias/dia
    expect(screen.getByText('1/dia')).toBeInTheDocument();
    expect(screen.getByText('0.5/dia')).toBeInTheDocument();
    expect(screen.getByText('1.5/dia')).toBeInTheDocument();
  });
});