import { useState } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import {CabecalhoTelaIndisponivel} from '../../component/index';
import { BG_LARANJA, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO } from "../../../constants/cores.constant";
import { useLocation, useNavigate } from "react-router-dom";

export function TelaIndisponivel(){

    const navigate = useNavigate();

    const location = useLocation();

    const rotaAnterior = location.state?.tentativaAcesso || '/';

    const [isLoading, setIsLoading] = useState(false);

    function handleRetry() {
        setIsLoading(true);

        window.setTimeout(() => {
            navigate(rotaAnterior);
        }, 700);
    }

    return (
    <main className="flex min-h-screen flex-col bg-gray-50 p-6 sm:p-8">
      
      <CabecalhoTelaIndisponivel />

      <section 
        className="mx-auto flex w-full max-w-2xl flex-grow flex-col items-center justify-center text-center" 
        aria-labelledby="error-title"
      >
        <div className="relative mb-8 flex flex-col items-center">
