import { describe, it, expect } from 'vitest';
import { converterDataParaSeletor, converterSeletorParaData } from './date';

describe('Utils: date.js', () => {
  describe('converterDataParaSeletor', () => {
    it('Deve converter corretamente uma data no formato "YYYY-MM-DD" para o formato extenso do seletor', () => {
      expect(converterDataParaSeletor('2026-08-18')).toBe('Agosto de 2026');
      expect(converterDataParaSeletor('2026-01-01')).toBe('Janeiro de 2026');
      expect(converterDataParaSeletor('2026-12-31')).toBe('Dezembro de 2026');
    });

    it('Deve retornar string vazia ao receber data nula, indefinida ou vazia', () => {
      expect(converterDataParaSeletor(null)).toBe('');
      expect(converterDataParaSeletor(undefined)).toBe('');
      expect(converterDataParaSeletor('')).toBe('');
    });

    it('Deve retornar o ano acompanhado de string vazia para mês inválido', () => {
      expect(converterDataParaSeletor('2026-15-01')).toBe(' de 2026');
    });
  });

  describe('converterSeletorParaData', () => {
    it('Deve converter corretamente a string por extenso para o formato "YYYY-MM-01"', () => {
      expect(converterSeletorParaData('Agosto de 2026')).toBe('2026-08-01');
      expect(converterSeletorParaData('Janeiro de 2026')).toBe('2026-01-01');
      expect(converterSeletorParaData('Dezembro de 2026')).toBe('2026-12-01');
    });

    it('Deve retornar string vazia ao receber valor nulo, indefinido ou vazio', () => {
      expect(converterSeletorParaData(null)).toBe('');
      expect(converterSeletorParaData(undefined)).toBe('');
      expect(converterSeletorParaData('')).toBe('');
    });

    it('Deve retornar string vazia quando o nome do mês não for encontrado', () => {
      expect(converterSeletorParaData('MesInexistente de 2026')).toBe('');
    });
  });
});