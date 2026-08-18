import { describe, it, expect } from 'vitest';
import { converterDataParaSeletor, converterSeletorParaData } from './date'; // Ajuste o nome do arquivo

describe('Utilitários de Data (date.js)', () => {

    describe('Função: converterDataParaSeletor', () => {
        
        it('Deve converter o formato YYYY-MM-DD para "Mês de YYYY"', () => {
            expect(converterDataParaSeletor('2026-08-18')).toBe('Agosto de 2026');
            expect(converterDataParaSeletor('2025-01-05')).toBe('Janeiro de 2025');
            expect(converterDataParaSeletor('2024-12-31')).toBe('Dezembro de 2024');
        });

        it('Deve funcionar corretamente mesmo se receber apenas YYYY-MM', () => {
            // Como a função só olha pro índice 0 (ano) e 1 (mês), o dia é opcional!
            expect(converterDataParaSeletor('2026-05')).toBe('Maio de 2026');
        });

    });

    describe('Função: converterSeletorParaData', () => {

        it('Deve converter o formato "Mês de YYYY" para "YYYY-MM-01"', () => {
            expect(converterSeletorParaData('Agosto de 2026')).toBe('2026-08-01');
            expect(converterSeletorParaData('Janeiro de 2023')).toBe('2023-01-01');
            expect(converterSeletorParaData('Dezembro de 2024')).toBe('2024-12-01');
        });

        it('Deve garantir que o primeiro dia do mês (01) seja sempre concatenado no final', () => {
            const resultado = converterSeletorParaData('Fevereiro de 2026');
            // Verifica se os dois últimos caracteres são "01"
            expect(resultado.endsWith('01')).toBe(true); 
            expect(resultado).toBe('2026-02-01');
        });

    });

});