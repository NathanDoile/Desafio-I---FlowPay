import { describe, it, expect } from 'vitest';
import { formatNumber, formatMinutes } from './metricas.mock'; // Ajuste o nome do arquivo

describe('Utilitários de Formatação', () => {

    describe('Função: formatNumber', () => {
        
        it('Deve formatar os milhares e decimais no padrão brasileiro (pt-BR)', () => {
            // Milhares com ponto
            expect(formatNumber(1500)).toBe('1.500');
            expect(formatNumber(1000000)).toBe('1.000.000');
            
            // Decimais com vírgula
            expect(formatNumber(1234.56)).toBe('1.234,56');
            
            // Zero absoluto
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
            // 1.5 minutos = 1 minuto e (0.5 * 60) segundos = 30 segundos
            expect(formatMinutes(1.5)).toBe('1min 30s');
            
            // 2.25 minutos = 2 minutos e (0.25 * 60) segundos = 15 segundos
            expect(formatMinutes(2.25)).toBe('2min 15s');
        });

        it('Deve preencher os segundos com zero à esquerda (padStart) quando for menor que 10', () => {
            // 3.05 minutos = 3 minutos e (0.05 * 60) segundos = 3 segundos
            // O esperado é "03s" e não "3s"
            expect(formatMinutes(3.05)).toBe('3min 03s');
            expect(formatMinutes(1.016)).toBe('1min 01s'); // (0.016 * 60) ≈ 0.96 -> arredonda para 1
        });

        it('Deve funcionar corretamente para tempos menores que 1 minuto', () => {
            // 0.75 minutos = 0 minutos e (0.75 * 60) segundos = 45 segundos
            expect(formatMinutes(0.75)).toBe('0min 45s');
        });

    });

});