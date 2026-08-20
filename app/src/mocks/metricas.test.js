import { describe, it, expect } from 'vitest';
import { formatNumber, formatMinutes } from './metricas.mock'; // Ajuste o nome do arquivo

describe('Utilitários de Formatação', () => {

    describe('Função: formatNumber', () => {
        
        it('Deve formatar os milhares e decimais no padrão brasileiro (pt-BR)', () => {
            expect(formatNumber(1500)).toBe('1.500');
            expect(formatNumber(1000000)).toBe('1.000.000');
            
            expect(formatNumber(1234.56)).toBe('1.234,56');
            
            expect(formatNumber(0)).toBe('0');
        });

    });

    describe('Função: formatMinutes', () => {

        it('Deve retornar apenas os minutos se os segundos forem cravados em zero', () => {
            expect(formatMinutes(10)).toBe('10min');
            expect(formatMinutes(5.0)).toBe('5min');
            expect(formatMinutes(0)).toBe('0min');
        });

        it('Deve calcular os segundos corretamente a partir de frações decimais', () => {
            expect(formatMinutes(1.5)).toBe('1min 30s');
            
            expect(formatMinutes(2.25)).toBe('2min 15s');
        });

        it('Deve preencher os segundos com zero à esquerda (padStart) quando for menor que 10', () => {
            expect(formatMinutes(3.05)).toBe('3min 03s');
            expect(formatMinutes(1.016)).toBe('1min 01s'); // (0.016 * 60) ≈ 0.96 -> arredonda para 1
        });

        it('Deve funcionar corretamente para tempos menores que 1 minuto', () => {
            expect(formatMinutes(0.75)).toBe('0min 45s');
        });

    });

});