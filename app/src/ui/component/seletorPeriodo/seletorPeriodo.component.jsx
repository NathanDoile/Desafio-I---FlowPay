import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { useObterMesesMetricas } from "../../../hooks/index.js";
import {converterDataParaSeletor,converterSeletorParaData} from '../../../utils/date.js';
 
export function SeletorPeriodo({ value, onChange }){

  const {obterMesesMetricas} = useObterMesesMetricas();
  
  const [dadosMeses, setDadosMeses] = useState([]);

  const [dadosMesesFormatados, setDadosMesesFormatados] = useState([]);
  
  async function atualizarDadosMeses(){
  
    const response = await obterMesesMetricas();
  
    setDadosMeses(response);
    console.log(response)

  }
  
  useEffect(() => {
    atualizarDadosMeses();
  }, []);

  useEffect(() =>{

    let meses = [];

    dadosMeses?.forEach(data => {
      meses.push(converterDataParaSeletor(data))
    })

    setDadosMesesFormatados(meses);

  }, [dadosMeses]);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-3 py-2">
      
      {/* Ícone de Calendário em Laranja */}
      <CalendarDays className="h-4 w-4 text-[lab(78.8933%_18.386_42.2808)]" aria-hidden="true" />
      
      <label htmlFor="periodo" className="sr-only">
        Mês e ano da análise
      </label>
      
      <select
        id="periodo"
        value={converterDataParaSeletor(value)}
        onChange={(event) => onChange(converterSeletorParaData(event.target.value))}
        // Fundo transparente no seletor principal, mas azul escuro nas <option> para não quebrar a leitura
        className="bg-transparent text-sm font-medium text-white outline-none cursor-pointer [&>option]:bg-[lab(20.6116_-0.0234246_-27.6176)] [&>option]:text-white"
        aria-label="Selecionar mês e ano da análise"
      >
        {dadosMesesFormatados.map((periodo) => (
          <option key={periodo} value={periodo}>
            {periodo}
          </option>
        ))}
      </select>
      
    </div>
  );
}