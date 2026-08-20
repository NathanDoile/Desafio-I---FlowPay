import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AtendentesEquipe } from './atendentesEquipe.component.jsx';

vi.mock('../../../utils/time.js', () => ({
  formatHumanDuration: vi.fn((tempo) => `${tempo}m`),
  formatDuration: vi.fn(() => '05:00'),
  elapsedFromMinsAgo: vi.fn(() => 300),
  elapsedSeconds: vi.fn(() => 300),
}));

describe('Componente: AtendentesEquipe', () => {
  const mockAnchor = 1000;
  const mockNow = 2000;

  it('Deve renderizar o título, contador total e iniciais do nome do atendente', () => {
    const mockEquipe = {
      atendentes: [
        {
          nome: 'Carlos Eduardo Silva',
          quantidadeAtendimentosConcluidos: 12,
          tempoMedioAtendimento: 5,
          solicitacoes: [],
        },
      ],
    };

    render(<AtendentesEquipe equipe={mockEquipe} anchor={mockAnchor} now={mockNow} />);

    expect(screen.getByRole('heading', { name: /atendentes/i })).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    expect(screen.getByText('Carlos Eduardo Silva')).toBeInTheDocument();
    expect(screen.getByText(/12 concluídos · média 5m/i)).toBeInTheDocument();

    expect(screen.getByText('CE')).toBeInTheDocument();
  });

  it('Deve renderizar o agente no status "Disponível" quando não houver solicitações ativas', () => {
    const mockEquipe = {
      atendentes: [
        {
          nome: 'Ana Maria',
          quantidadeAtendimentosConcluidos: 3,
          tempoMedioAtendimento: 4,
          solicitacoes: [],
        },
      ],
    };

    render(<AtendentesEquipe equipe={mockEquipe} anchor={mockAnchor} now={mockNow} />);

    expect(screen.getByText('Disponível')).toBeInTheDocument();
    
    expect(screen.getByText('Aguardando próximo ticket da fila...')).toBeInTheDocument();
  });

  it('Deve renderizar o agente "Em atendimento" e os detalhes do ticket ativo', () => {
    const mockEquipe = {
      atendentes: [
        {
          nome: 'João Souza',
          quantidadeAtendimentosConcluidos: 8,
          tempoMedioAtendimento: 6,
          solicitacoes: [
            {
              protocolo: 'TK-12345',
              assunto: 'Dúvida sobre limite do cartão',
              dataHoraEntrouEmAtendimento: '2026-08-18T10:00:00Z',
            },
          ],
        },
      ],
    };

    render(<AtendentesEquipe equipe={mockEquipe} anchor={mockAnchor} now={mockNow} />);

    expect(screen.getByText('Em atendimento')).toBeInTheDocument();

    expect(screen.getByText('Dúvida sobre limite do cartão')).toBeInTheDocument();
    expect(screen.getByText('Protocolo TK-12345')).toBeInTheDocument();

    expect(screen.getByText('Em atendimento há')).toBeInTheDocument();
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('Deve exibir a mensagem "Fora de atendimento no momento." quando solicitacoes for indefinido/nulo', () => {
    const mockEquipe = {
      atendentes: [
        {
          nome: 'Beatriz Lima',
          quantidadeAtendimentosConcluidos: 0,
          tempoMedioAtendimento: 0,
          solicitacoes: null,
        },
      ],
    };

    render(<AtendentesEquipe equipe={mockEquipe} anchor={mockAnchor} now={mockNow} />);

    expect(screen.getByText('Fora de atendimento no momento.')).toBeInTheDocument();
  });
});