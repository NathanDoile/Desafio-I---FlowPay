import { ArrowLeft, Home, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import{ CabecalhoTelaNaoEncontrada } from '../../component/cabecalho/cabecalhoTelaNaoEncontrada.component';
import { BG_LARANJA, TEXTO_AZUL_BG_BRANCO, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO } from "../../../constants/cores.constant";

export function TelaNaoEncontrada(){

    const navigate = useNavigate();

    return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      
      <CabecalhoTelaNaoEncontrada />

