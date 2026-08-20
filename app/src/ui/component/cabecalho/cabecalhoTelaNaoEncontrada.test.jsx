import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CabecalhoTelaNaoEncontrada } from './cabecalhoTelaNaoEncontrada.component.jsx';

describe('Componente: CabecalhoTelaNaoEncontrada', () => {
  it('Deve renderizar as informações da marca, subtítulo e painel do gerente', () => {
    render(<CabecalhoTelaNaoEncontrada />);

    expect(screen.getByRole('banner')).toBeInTheDocument();

    expect(screen.getByText('FlowPay')).toBeInTheDocument();
    expect(screen.getByText('Distribuição inteligente')).toBeInTheDocument();
    expect(screen.getByText('Painel do gerente')).toBeInTheDocument();
  });
});