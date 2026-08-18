import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SeletorPeriodo } from './seletorPeriodo.component.jsx';
import userEvent from '@testing-library/user-event';

import { useObterMesesMetricas } from "../../../hooks/index.js";
vi.mock("../../../hooks/index.js", () => ({
    useObterMesesMetricas: vi.fn(),
}))

import {converterDataParaSeletor,converterSeletorParaData} from '../../../utils/date.js';
vi.mock("../../../utils/date.js", () => ({
    converterDataParaSeletor: vi.fn((data) => {
        const dadosData = data.split("-");

        let dataFormatada = "";

        switch(dadosData[1]){
            case "01":
                dataFormatada += "Janeiro";
                break;
            case "02":
                dataFormatada += "Fevereiro";
                break;
            case "03":
                dataFormatada += "Março";
                break;
            case "04":
                dataFormatada += "Abril";
                break;
            case "05":
                dataFormatada += "Maio";
                break;
            case "06":
                dataFormatada += "Junho";
                break;
            case "07":
                dataFormatada += "Julho";
                break;
            case "08":
                dataFormatada += "Agosto";
                break;
            case "09":
                dataFormatada += "Setembro";
                break;
            case "10":
                dataFormatada += "Outubro";
                break;
            case "11":
                dataFormatada += "Novembro";
                break;
            case "12":
                dataFormatada += "Dezembro";
                break;
        }

        dataFormatada += " de "
        dataFormatada += dadosData[0];

        return dataFormatada;
    }),
    converterSeletorParaData: vi.fn((mesAno) => {
        const mesAnoArray = mesAno.split(" ");

        let dataFormatada = mesAnoArray[2];

        switch(mesAnoArray[0]){
            case "Janeiro":
                dataFormatada += "-01-";
                break;
            case "Fevereiro":
                dataFormatada += "-02-";
                break;
            case "Março":
                dataFormatada += "-03-";
                break;
            case "Abril":
                dataFormatada += "-04-";
                break;
            case "Maio":
                dataFormatada += "-05-";
                break;
            case "Junho":
                dataFormatada += "-06-";
                break;
            case "Julho":
                dataFormatada += "-07-";
                break;
            case "Agosto":
                dataFormatada += "-08-";
                break;
            case "Setembro":
                dataFormatada += "-09-";
                break;
            case "Outubro":
                dataFormatada += "-10-";
                break;
            case "Novembro":
                dataFormatada += "-11-";
                break;
            case "Dezembro":
                dataFormatada += "-12-";
                break;
        }

        dataFormatada += "01";

        return dataFormatada;
    })
}))

describe("Componente SeletorPeriodo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("Deve chamar a API e renderizar os meses na tela corretamente", async () => {
        const mockObterMeses = vi.fn().mockResolvedValue(['2026-07-01', '2026-08-01']);

        useObterMesesMetricas.mockReturnValue({obterMesesMetricas: mockObterMeses});

        render(<SeletorPeriodo value="" onChange={vi.fn()} />);

        expect(mockObterMeses).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(screen.getByText('Julho de 2026')).toBeInTheDocument();
            expect(screen.getByText('Agosto de 2026')).toBeInTheDocument();
        })

        const selectElement = screen.getByRole('combobox', {name: /Selecionar mês e ano da análise/i})

        expect(selectElement).toBeInTheDocument();
    })

    it("Deve disparar a função onChange ao selecionar um novo mês", async () => {
        const user = userEvent.setup();
        const mockOnChange = vi.fn();

        const mockObterMeses = vi.fn().mockResolvedValue(['2026-07-01', '2026-08-01']);
        useObterMesesMetricas.mockReturnValue({ obterMesesMetricas: mockObterMeses });

        render(<SeletorPeriodo value="Julho de 2026" onChange={mockOnChange} />);

        await waitFor(() => {
            expect(screen.getByText('Julho de 2026')).toBeInTheDocument();
            expect(screen.getByText('Agosto de 2026')).toBeInTheDocument();
        })

        const selectElement = screen.getByRole('combobox', { name: /mês e ano da análise/i });

        await user.selectOptions(selectElement, 'Agosto de 2026');

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith('2026-08-01');
    })
})