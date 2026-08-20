import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricCard } from './metricaCard.component.jsx';

describe('Componente: MetricCard', () => {
  it('Deve renderizar o ícone, título, valor e a descrição quando informados', () => {
    const mockIcone = <span data-testid="mock-icon">Icon</span>;

    render(
      <MetricCard
        icone={mockIcone}
        titulo="Total de Tickets"
        valor="150"
        descricao="Aumento de 10% em relação ao mês anterior"
      />
    );

    // Valida ícone, título e valor
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('Total de Tickets')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();

    // Valida descrição opcional
    expect(
      screen.getByText('Aumento de 10% em relação ao mês anterior')
    ).toBeInTheDocument();
  });

  it('Não deve renderizar a descrição se ela não for fornecida', () => {
    render(
      <MetricCard
        icone={null}
        titulo="Agentes Online"
        valor="8"
      />
    );

    expect(screen.getByText('Agentes Online')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    
    // Confirma que não há parágrafo extra de descrição
    expect(screen.queryByText('Aumento de 10% em relação ao mês anterior')).not.toBeInTheDocument();
  });
});