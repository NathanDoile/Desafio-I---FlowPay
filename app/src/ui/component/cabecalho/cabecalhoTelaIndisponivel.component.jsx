import { ServerCrash } from "lucide-react";
import {BG_AZUL_ESCURO, BG_LARANJA, TEXTO_AZUL_BG_BRANCO, TEXTO_CINZA_BG_BRANCO} from '../../../constants/cores.constant.jsx';
import { useNavigate } from "react-router-dom";

export function CabecalhoTelaIndisponivel(){

    const navigate = useNavigate();

    return(
        <header className="flex items-center justify-between">
            <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer" aria-label="FlowPay">

                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${BG_AZUL_ESCURO} text-white`}>
                    <ServerCrash className="h-5 w-5" aria-hidden="true" />
                </span>

                <span className={`text-xl font-bold tracking-tight ${TEXTO_AZUL_BG_BRANCO}`}>
                    Flow<span className='text-[lab(78.8702_18.9326_41.9203)]'>Pay</span>
                </span>
            </button>
            
            <div className={`flex items-center gap-2 text-sm font-medium ${TEXTO_CINZA_BG_BRANCO}`}>
                {/* Bolinha piscando em laranja/vermelho indicando instabilidade */}
                <span className="relative flex h-2.5 w-2.5">
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${BG_LARANJA} opacity-75`} />
                    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500`} />
                </span>
                <span>Sistema instável</span>
            </div>
        </header>
    )
}