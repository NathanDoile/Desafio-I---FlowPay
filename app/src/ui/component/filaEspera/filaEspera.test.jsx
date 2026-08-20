import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FilaEspera } from './filaEspera.component.jsx';

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

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('/10')).toBeInTheDocument();

        expect(screen.getByText('Dúvida no App')).toBeInTheDocument();
        expect(screen.getByText('Protocolo 1234')).toBeInTheDocument();
        expect(screen.getByText('Entrou às 14:30:00')).toBeInTheDocument(); // Veio do mock de tempo
    });

    it('Deve aplicar estilo de alerta (vermelho) quando a fila passar de 80% de capacidade', () => {
        const mockEquipeCheia = {
            capacidadeFila: 10,
            fila: [ 
                {}, {}, {}, {}, {}, {}, {}, {} 
            ]
        };

        render(<FilaEspera equipe={mockEquipeCheia} anchor={100} now={200} />);

        const textoCapacidade = screen.getByText('8');
        expect(textoCapacidade).toHaveClass('text-red-600');
    });

    it('Deve aplicar estilo de alerta (vermelho) no tempo de um ticket que esperou além da média', () => {
        const mockEquipeTicketAtrasado = {
            capacidadeFila: 10,
            tempoMedioEspera: 300, // A equipe resolve em 5 minutos (300s)
            fila: [
                { protocolo: '9999', assunto: 'Estou bravo' } 
            ]
        };

        render(<FilaEspera equipe={mockEquipeTicketAtrasado} anchor={100} now={200} />);

        const tempoExibido = screen.getByText('Tempo: 600');
        
        expect(tempoExibido).toHaveClass('text-red-600');
    });

    it('Deve renderizar a fila normalmente com ocupação baixa (Barra e texto normais)', () => {
        const mockEquipe = {
            capacidadeFila: 10,
            tempoMedioEspera: 600, // 10 minutos
            fila: [
                { protocolo: '123', assunto: 'Dúvida', dataHoraEntrouNaFila: new Date().toISOString() }
            ],
            tickets: [{}] // Tem ticket, não deve mostrar mensagem de vazia
        };

        render(<FilaEspera equipe={mockEquipe} anchor={Date.now()} now={Date.now()} />);

        const spanOcupacao = screen.getByText('1');
        expect(spanOcupacao).not.toHaveClass('text-red-600');
    });

    it('Deve alertar visualmente (Quase Cheia) quando a ocupação atingir 80% ou mais', () => {
        const mockEquipe = {
            capacidadeFila: 10,
            tempoMedioEspera: 600,
            fila: Array.from({ length: 8 }).map((_, i) => ({
                protocolo: `PTK-${i}`,
                assunto: 'Assunto',
                dataHoraEntrouNaFila: new Date().toISOString()
            })),
            tickets: [{}]
        };

        render(<FilaEspera equipe={mockEquipe} anchor={Date.now()} now={Date.now()} />);

        const spanOcupacao = screen.getByText('8');
        expect(spanOcupacao).toHaveClass('text-red-600');
    });

    it('Deve exibir "--:--" quando o relógio (anchor ou now) for null', () => {
        const mockEquipe = {
            capacidadeFila: 10,
            fila: [
                { protocolo: '123', assunto: 'Problema', dataHoraEntrouNaFila: new Date().toISOString() }
            ],
            tickets: [{}]
        };

        render(<FilaEspera equipe={mockEquipe} anchor={null} now={null} />);

        expect(screen.getByText('--:--')).toBeInTheDocument();
    });

    it('Deve destacar o cronômetro de espera em vermelho quando o ticket ultrapassar o tempo médio da equipe', () => {
        const agora = new Date('2026-08-18T10:00:00.000Z').getTime();
        const vinteMinutosAtras = new Date(agora - 20 * 60 * 1000).toISOString();

        const mockEquipe = {
            capacidadeFila: 10,
            tempoMedioEspera: 300, // 5 minutos
            fila: [
                { protocolo: '999', assunto: 'Reclamação', dataHoraEntrouNaFila: vinteMinutosAtras }
            ],
            tickets: [{}]
        };

        render(<FilaEspera equipe={mockEquipe} anchor={agora} now={agora} />);

        const cronometro = screen.getByText(/10:00|20:00|600/i);
        expect(cronometro).toHaveClass('text-red-600');
    });

    it('Deve exibir a mensagem de "tempo livre" quando a equipe não tiver tickets', () => {
        const mockEquipe = {
            capacidadeFila: 10,
            fila: [], // Fila vazia
            tickets: [] // <-- Esta é a variável que o seu componente avalia na linha 100
        };

        render(<FilaEspera equipe={mockEquipe} anchor={Date.now()} now={Date.now()} />);

        expect(screen.getByText('Nenhum ticket em fila. A equipe está com tempo livre!')).toBeInTheDocument();
    });

    it('Deve retornar null na esperou quando apenas um dos relógios (anchor ou now) for null', () => {
        const mockEquipe = {
            capacidadeFila: 10,
            fila: [{ protocolo: '123', assunto: 'Teste', dataHoraEntrouNaFila: new Date().toISOString() }],
            tickets: [{}]
        };

        render(<FilaEspera equipe={mockEquipe} anchor={1000} now={null} />);

        expect(screen.getByText('--:--')).toBeInTheDocument();
    });

    it('Deve retornar null na esperou quando anchor for null e now for preenchido', () => {
        const mockEquipe = {
            capacidadeFila: 10,
            fila: [{ protocolo: '123', assunto: 'Teste', dataHoraEntrouNaFila: new Date().toISOString() }],
            tickets: [{}]
        };

        render(<FilaEspera equipe={mockEquipe} anchor={null} now={1000} />);

        expect(screen.getByText('--:--')).toBeInTheDocument();
    });

    it('Deve exibir "--:--:--" caso formatClock retorne null ou undefined para a hora de entrada', async () => {
        const { formatClock } = vi.mocked(await import('../../../utils/time.js'));
        formatClock.mockReturnValueOnce(null);

        const mockEquipe = {
            capacidadeFila: 10,
            fila: [{ protocolo: '123', assunto: 'Teste', dataHoraEntrouNaFila: null }],
            tickets: [{}]
        };

        render(<FilaEspera equipe={mockEquipe} anchor={1000} now={2000} />);

        expect(screen.getByText('Entrou às --:--:--')).toBeInTheDocument();
    });
});