import { CalendarDays } from "lucide-react";
import { periodosDisponiveis } from "../../../mocks/metricas.mock.js";

export function SeletorPeriodo({ value, onChange }){

    return (
    <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-3 py-2">
      
      {/* Ícone de Calendário em Laranja */}
      <CalendarDays className="h-4 w-4 text-[lab(78.8933%_18.386_42.2808)]" aria-hidden="true" />
      
      <label htmlFor="periodo" className="sr-only">
        Mês e ano da análise
      </label>
      
      <select
        id="periodo"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        // Fundo transparente no seletor principal, mas azul escuro nas <option> para não quebrar a leitura
        className="bg-transparent text-sm font-medium text-white outline-none cursor-pointer [&>option]:bg-[lab(20.6116_-0.0234246_-27.6176)] [&>option]:text-white"
        aria-label="Selecionar mês e ano da análise"
      >
        {periodosDisponiveis.map((periodo) => (
          <option key={periodo.value} value={periodo.value}>
            {periodo.label}
          </option>
        ))}
      </select>
      
    </div>
  );
}