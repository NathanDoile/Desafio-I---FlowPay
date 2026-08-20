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
      
