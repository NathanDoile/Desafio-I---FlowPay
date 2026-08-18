import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FilaEspera } from './FilaEspera.component';

// Mockamos os utilitários de tempo para não dependermos de matemática complexa no teste da tela
vi.mock('../../../utils/time.js', () => ({
    formatClock: vi.fn(() => '14:30:00'),
    formatDuration: vi.fn((segundos) => `Tempo: ${segundos}`),
    elapsedSeconds: vi.fn(() => 600), // Simula que sempre passaram 10 minutos
    elapsedFromMinsAgo: vi.fn((_, __, minutos) => minutos * 60) // Retorna os segundos totais
}));

describe('Componente FilaEspera', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve renderizar os dados da fila e os tickets em estado normal', () => {
        const mockEquipeNormal = {
            capacidadeFila: 10,
            tempoMedioEspera: 1200, // 20 minutos (1200s). O ticket tem 10min, então tá suave.
            fila: [
                { protocolo: '1234', assunto: 'Dúvida no App', dataHoraEntrouNaFila: '2026-08-17T14:30:00' }
            ]
        };

        render(<FilaEspera equipe={mockEquipeNormal} anchor={100} now={200} />);

        // Verifica se printou o título e a lotação da fila (1/10)
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('/10')).toBeInTheDocument();

        // Verifica se printou os dados do ticket mockado
        expect(screen.getByText('Dúvida no App')).toBeInTheDocument();
        expect(screen.getByText('Protocolo 1234')).toBeInTheDocument();
        expect(screen.getByText('Entrou às 14:30:00')).toBeInTheDocument(); // Veio do mock de tempo
    });

    it('Deve aplicar estilo de alerta (vermelho) quando a fila passar de 80% de capacidade', () => {
        const mockEquipeCheia = {
            capacidadeFila: 10,
            fila: [ 
                // Colocamos 8 tickets para atingir exatamente 80% (o array pode ter objetos vazios pro teste, só importa o tamanho)
                {}, {}, {}, {}, {}, {}, {}, {} 
            ]
        };

        render(<FilaEspera equipe={mockEquipeCheia} anchor={100} now={200} />);

        // O número "8" deve estar na tela. Para verificar a cor, pegamos o elemento pela classe text-red-600
        const textoCapacidade = screen.getByText('8');
        expect(textoCapacidade).toHaveClass('text-red-600');
    });

    it('Deve aplicar estilo de alerta (vermelho) no tempo de um ticket que esperou além da média', () => {
        const mockEquipeTicketAtrasado = {
            capacidadeFila: 10,
            tempoMedioEspera: 300, // A equipe resolve em 5 minutos (300s)
            fila: [
                // Mas o mock do elapsedFromMinsAgo tá retornando 10 minutos (600s). Ele estourou o tempo!
                { protocolo: '9999', assunto: 'Estou bravo' } 
            ]
        };

        render(<FilaEspera equipe={mockEquipeTicketAtrasado} anchor={100} now={200} />);

        // Nosso mock formatDuration retorna "Tempo: 600"
        const tempoExibido = screen.getByText('Tempo: 600');
        
        // Verifica se a regra de negócio coloriu o tempo de vermelho
        expect(tempoExibido).toHaveClass('text-red-600');
    });

});