import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TelaNaoEncontrada } from './telaNaoEncontrada.screen.jsx'; // Ajuste o caminho conforme sua estrutura

// Mock do useNavigate do React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock simples do cabeçalho
vi.mock('../../component/cabecalho/cabecalhoTelaNaoEncontrada.component', () => ({
    CabecalhoTelaNaoEncontrada: () => <div>Cabeçalho 404</div>,
}));

describe('Screen TelaNaoEncontrada', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Deve renderizar as mensagens do Erro 404 e o cabeçalho', () => {
        render(
            <MemoryRouter>
                <TelaNaoEncontrada />
            </MemoryRouter>
        );

        expect(screen.getByText(/Erro 404 \/ Rota indisponível/i)).toBeInTheDocument();
        expect(screen.getByText('Esta fila não está no mapa.')).toBeInTheDocument();
        expect(screen.getByText('Cabeçalho 404')).toBeInTheDocument();
    });

    it('Deve possuir um link que redireciona para a raiz (/)', () => {
        render(
            <MemoryRouter>
                <TelaNaoEncontrada />
            </MemoryRouter>
        );

        const linkHome = screen.getByRole('link', { name: /voltar ao painel/i });
        expect(linkHome).toBeInTheDocument();
        expect(linkHome).toHaveAttribute('href', '/');
    });

    it('Deve acionar o navigate(-1) ao clicar no botão de voltar à página anterior', async () => {
        const user = userEvent.setup();
        
        render(
            <MemoryRouter>
                <TelaNaoEncontrada />
            </MemoryRouter>
        );

        const botaoVoltar = screen.getByRole('button', { name: /voltar à página anterior/i });
        await user.click(botaoVoltar);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

});