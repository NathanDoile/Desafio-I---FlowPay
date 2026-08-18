import { describe, it, expect } from 'vitest';
import { converterDataParaSeletor, converterSeletorParaData } from './date'; // Ajuste o nome do arquivo

describe('Utilitários de Data (date.js)', () => {

    describe('Função: converterDataParaSeletor', () => {
        
        it('Deve converter o formato YYYY-MM-DD para "Mês de YYYY"', () => {
            expect(converterDataParaSeletor('2026-08-18')).toBe('Agosto de 2026');
            expect(converterDataParaSeletor('2025-01-05')).toBe('Janeiro de 2025');
            expect(converterDataParaSeletor('2024-12-31')).toBe('Dezembro de 2024');
            expect(converterDataParaSeletor('2026-02-18')).toBe('Fevereiro de 2026');
            expect(converterDataParaSeletor('2026-03-18')).toBe('Março de 2026');
            expect(converterDataParaSeletor('2026-04-18')).toBe('Abril de 2026');
            expect(converterDataParaSeletor('2026-05-18')).toBe('Maio de 2026');
            expect(converterDataParaSeletor('2026-06-18')).toBe('Junho de 2026');
            expect(converterDataParaSeletor('2026-07-18')).toBe('Julho de 2026');
            expect(converterDataParaSeletor('2026-09-18')).toBe('Setembro de 2026');
            expect(converterDataParaSeletor('2026-10-18')).toBe('Outubro de 2026');
            expect(converterDataParaSeletor('2026-11-18')).toBe('Novembro de 2026');
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
            expect(converterSeletorParaData('Fevereiro de 2026')).toBe('2026-02-01');
            expect(converterSeletorParaData('Março de 2026')).toBe('2026-03-01');
            expect(converterSeletorParaData('Abril de 2026')).toBe('2026-04-01');
            expect(converterSeletorParaData('Maio de 2026')).toBe('2026-05-01');
            expect(converterSeletorParaData('Junho de 2026')).toBe('2026-06-01');
            expect(converterSeletorParaData('Julho de 2026')).toBe('2026-07-01');
            expect(converterSeletorParaData('Setembro de 2026')).toBe('2026-09-01');
            expect(converterSeletorParaData('Outubro de 2026')).toBe('2026-10-01');
            expect(converterSeletorParaData('Novembro de 2026')).toBe('2026-11-01');
        });

        it('Deve garantir que o primeiro dia do mês (01) seja sempre concatenado no final', () => {
            const resultado = converterSeletorParaData('Fevereiro de 2026');
            // Verifica se os dois últimos caracteres são "01"
            expect(resultado.endsWith('01')).toBe(true); 
            expect(resultado).toBe('2026-02-01');
        });

    });

});