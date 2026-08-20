import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loading } from './loading.component.jsx';

describe('Componente: Loading', () => {
  it('Deve renderizar a mensagem de carregamento e o ícone de spinner', () => {
    render(<Loading />);

    // Verifica o texto de carregamento
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});