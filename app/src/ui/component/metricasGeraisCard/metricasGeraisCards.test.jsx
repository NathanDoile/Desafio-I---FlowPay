import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MetricasGeraisCard } from './metricasGeraisCards.component'; // Ajuste o nome do arquivo

// 1. Mockamos os formatadores para termos controle do que sai na tela
vi.mock('../../../mocks/metricas.mock.js', () => ({
    formatMinutes: vi.fn((minutos) => `${minutos} minutos formatados`),
    formatNumber: vi.fn((numero) => `Numero: ${numero}`),
}));

describe('Componente MetricasGeraisCard', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve calcular os KPIs corretamente e renderizar os dados na tela', () => {
        const mockEmpresa = {
            tempoMedioAtendimento: 120, // Vai ser dividido por 60 (esperamos 2)
            tempoMedioEspera: 300,      // Vai ser dividido por 60 (esperamos 5)
            totalAtendimentos: 1500,
            totalTicketsRecusados: 45,
            taxaRecusa: 3.5,            // Esperamos 3.50%
            mediaTicketsRecusadosPorDia: 8
        };

        render(<MetricasGeraisCard empresa={mockEmpresa} />);

        // Verifica os títulos estáticos
        expect(screen.getByText('Tempo médio de atendimento')).toBeInTheDocument();
        
        // Verifica a matemática da divisão (120/60 = 2) passando pelo mock
        expect(screen.getByText('2 minutos formatados')).toBeInTheDocument();
        expect(screen.getByText('5 minutos formatados')).toBeInTheDocument(); // (300/60 = 5)

        // Verifica a formatação do toFixed(2)
        expect(screen.getByText('Taxa de recusa de 3.50%')).toBeInTheDocument();
        
        // Verifica a concatenação da média por dia
        expect(screen.getByText('8/dia')).toBeInTheDocument();
    });

    it('Deve tratar taxaRecusa nula ou ausente sem quebrar a tela (fallback para 0.00%)', () => {
        const mockEmpresaIncompleta = {
            tempoMedioAtendimento: 0,
            tempoMedioEspera: 0,
            // taxaRecusa não foi enviada pela API!
        };

        render(<MetricasGeraisCard empresa={mockEmpresaIncompleta} />);

        // O nosso Number(empresa?.taxaRecusa || 0).toFixed(2) deve salvar o dia
        expect(screen.getByText('Taxa de recusa de 0.00%')).toBeInTheDocument();
    });

});