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
          {/* Número 503 gigante como marca d'água de fundo */}
          <div className="absolute -top-16 text-[10rem] font-extrabold text-gray-200/50" aria-hidden="true">
            503
          </div>
          
          <div className="relative z-10 flex items-center justify-center gap-2 text-sm font-bold tracking-widest text-[lab(78.8702_18.9326_41.9203)] uppercase">
            <AlertCircle className="h-4 w-4" />
            <span>Interrupção temporária · Erro 503</span>
          </div>
        </div>

        <h1 id="error-title" className={`z-10 text-4xl font-extrabold tracking-tight ${TEXTO_PRETO_BG_BRANCO} sm:text-5xl`}>
          A central de filas está <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[lab(78.8702_18.9326_41.9203)] to-[lab(78.8702_18.9326_41.9203)]">
            em pausa.
          </span>
        </h1>
        
        <p className={`z-10 mt-6 max-w-xl text-base leading-relaxed ${TEXTO_CINZA_BG_BRANCO}`}>
          O painel de distribuição por equipe está indisponível no momento. 
          Seus dados estão seguros e nossa engenharia já está trabalhando para restabelecer o acesso.
        </p>

        <div className="z-10 mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button 
            type="button" 
            onClick={handleRetry} 
            disabled={isLoading}
            className={`cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl ${BG_LARANJA} px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Verificando conexão...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Tentar novamente
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
          </button>
          
          <a 
            href="mailto:suporte@flowpay.com.br"
            className={`text-sm font-medium ${TEXTO_PRETO_BG_BRANCO} underline-offset-4 hover:underline`}
          >
            Falar com o suporte
          </a>
        </div>
      </section>

      <footer className={`mt-auto flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-xs font-medium tracking-wide ${TEXTO_CINZA_BG_BRANCO} sm:flex-row`}>
        <span>FLOWPAY / MONITORAMENTO DE OPERAÇÕES</span>
        <span>REF. 503 — SERVIÇO INDISPONÍVEL</span>
      </footer>
      
    </main>
  );
}