import { describe, it, expect } from 'vitest';
import { 
    formatDuration, 
    formatHumanDuration, 
    elapsedSeconds, 
    formatClock, 
    formatClockMs, 
    elapsedFromMinsAgo, 
    elapsedFromSecsAgo 
} from './time'; // Ajuste o nome do seu arquivo

describe('Utilitários de Tempo e Duração', () => {

    describe('Função: formatDuration', () => {
        it('Deve formatar tempos menores que 1 minuto (MM:SS)', () => {
            expect(formatDuration(0)).toBe('00:00');
            expect(formatDuration(5)).toBe('00:05');
            expect(formatDuration(59)).toBe('00:59');
        });

        it('Deve formatar tempos maiores que 1 minuto (MM:SS)', () => {
            expect(formatDuration(60)).toBe('01:00');
            expect(formatDuration(125)).toBe('02:05'); // 2 minutos e 5 segundos
        });

        it('Deve exibir as horas quando o tempo ultrapassar 60 minutos (HH:MM:SS)', () => {
            expect(formatDuration(3600)).toBe('01:00:00'); // Exatamente 1 hora
            expect(formatDuration(3665)).toBe('01:01:05'); // 1 hora, 1 min, 5 seg
        });

        it('Não deve exibir tempo negativo (Math.max de proteção)', () => {
            // Se vier -10 da API, ele deve cravar em zero
            expect(formatDuration(-10)).toBe('00:00');
        });
    });

    describe('Função: formatHumanDuration', () => {
        it('Deve exibir apenas segundos se for menor que 1 minuto', () => {
            expect(formatHumanDuration(45)).toBe('45 s');
            expect(formatHumanDuration(0)).toBe('0 s');
        });

        it('Deve exibir "min e s" se for maior que 1 minuto, com os segundos preenchidos (padStart)', () => {
            expect(formatHumanDuration(60)).toBe('1 min 00 s');
            expect(formatHumanDuration(125)).toBe('2 min 05 s');
        });

        it('Deve exibir apenas "h e min" e descartar os segundos se ultrapassar 1 hora', () => {
            expect(formatHumanDuration(3600)).toBe('1 h 00 min');
            expect(formatHumanDuration(3665)).toBe('1 h 01 min'); 
            // Os 5 segundos são ocultados intencionalmente pela sua regra de negócio
        });
    });

    describe('Funções: formatClock e formatClockMs', () => {
        // Criamos uma data local fixa para evitar conflitos de fuso horário em servidores (CI/CD)
        const dataFixa = new Date(2026, 7, 18, 14, 5, 9); // 18/08/2026 às 14:05:09 local

        it('formatClock: Deve retornar o horário no formato HH:MM:SS a partir de uma data ISO', () => {
            const iso = dataFixa.toISOString();
            expect(formatClock(iso)).toBe('14:05:09');
        });

        it('formatClockMs: Deve retornar o horário no formato HH:MM:SS a partir de um timestamp', () => {
            const ms = dataFixa.getTime();
            expect(formatClockMs(ms)).toBe('14:05:09');
        });
    });

    describe('Cálculos de Decurso de Tempo (Elapsed)', () => {
        it('elapsedSeconds: Deve calcular a diferença exata em segundos', () => {
            // "isoDate" foi há 10 segundos atrás do nosso "now"
            const iso = new Date('2026-08-18T10:00:00.000Z');
            const now = new Date('2026-08-18T10:00:10.000Z').getTime();
            
            expect(elapsedSeconds(iso, now)).toBe(10);
        });

        it('elapsedFromMinsAgo: Deve somar o offset em minutos (convertido) com a diferença em segundos', () => {
            const anchorMs = 1000;
            const now = 6000; // Passaram 5 segundos da âncora
            const minsAgo = 2; // Offset inicial de 2 minutos (120 segundos)
            
            // Esperado: 120s (minsAgo) + 5s (diferença) = 125s
            expect(elapsedFromMinsAgo(anchorMs, now, minsAgo)).toBe(125);
        });

        it('elapsedFromSecsAgo: Deve somar o offset em segundos com a diferença em segundos', () => {
            const anchorMs = 1000;
            const now = 5000; // Passaram 4 segundos
            const secsAgo = 30; // Offset inicial de 30 segundos
            
            // Esperado: 30s + 4s = 34s
            expect(elapsedFromSecsAgo(anchorMs, now, secsAgo)).toBe(34);
        });
    });

});