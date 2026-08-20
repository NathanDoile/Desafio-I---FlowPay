import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Graficos } from './graficos.component.jsx';

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    BarChart: ({ children }) => {
      const tooltipChild = React.Children.toArray(children).find(
        (child) => child && child.type && child.type.name === 'Tooltip'
      );

      let activeTooltipRender = null;
      let inactiveTooltipRender = null;

      if (tooltipChild && tooltipChild.props && tooltipChild.props.content) {
        const content = tooltipChild.props.content;
        if (React.isValidElement(content)) {
          activeTooltipRender = React.cloneElement(content, {
            active: true,
            label: 'Empréstimos',
            payload: [
              { name: 'Tempo de atendimento', value: 12.345, color: '#000' },
              { name: 'Tempo em fila', value: 5.0, fill: '#fff' },
            ],
          });

          inactiveTooltipRender = React.cloneElement(content, {
            active: false,
            payload: [],
          });
        }
      }

      return (
        <div data-testid="barchart-mock">
          {children}
          {activeTooltipRender}
          {inactiveTooltipRender}
        </div>
      );
    },
  };
});

describe('Componente: Graficos', () => {
  const mockEquipes = [
    {
      nome: 'Cartão',
      tempoMedioAtendimento: 300,
      tempoMedioEspera: 120,
      totalAtendimentos: 50,
      totalTicketsRecusados: 5,
      mediaTicketsRecusadosPorDia: 1.2,
    },
    {
      nome: 'Empréstimos',
      tempoMedioAtendimento: 600,
      tempoMedioEspera: 180,
      totalAtendimentos: 30,
      totalTicketsRecusados: 2,
      mediaTicketsRecusadosPorDia: 0.5,
    },
  ];

  const mockEmpresa = {
    totalAtendimentos: 80,
  };

  it('Deve renderizar os 3 títulos e subtítulos dos gráficos comparativos', () => {
    render(<Graficos equipes={mockEquipes} empresa={mockEmpresa} />);

    expect(screen.getByRole('heading', { name: /tempos médios por equipe/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /total de atendimentos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /tickets recusados por equipe/i })).toBeInTheDocument();

    expect(screen.getByText('Atendimento x espera em fila (minutos)')).toBeInTheDocument();
    expect(screen.getByText('Quantidade por equipe e total da empresa')).toBeInTheDocument();
    expect(screen.getByText('Total recusado no período x média diária por fila cheia')).toBeInTheDocument();
  });

  it('Deve renderizar o CustomTooltip do gráfico e formatar os números substituindo ponto por vírgula', () => {
    render(<Graficos equipes={mockEquipes} empresa={mockEmpresa} />);

    expect(screen.getAllByText('Empréstimos').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tempo de atendimento').length).toBeGreaterThan(0);
    expect(screen.getAllByText('12,35').length).toBeGreaterThan(0);
  });

  it('Deve renderizar sem quebrar caso equipes e empresa sejam indefinidos', () => {
    render(<Graficos equipes={undefined} empresa={undefined} />);

    expect(screen.getAllByTestId('responsive-container')).toHaveLength(3);
  });
});