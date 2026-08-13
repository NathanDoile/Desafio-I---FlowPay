import { LayoutGrid } from "lucide-react";
import {BG_LARANJA, TEXTO_PRETO_BG_LARANJA, TEXTO_CINZA_BG_AZUL, BG_AZUL_ESCURO} from '../../../constants/cores.constant.jsx';
import { useNavigate } from "react-router-dom";

export function CabecalhoHome({nomeGerente, data}){

    const navigate = useNavigate();

    return (
        <header className={`${BG_AZUL_ESCURO} text-white shadow-md`}>
            
            <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <div onClick={() => navigate('/metricas')} className={`flex h-11 w-11 items-center justify-center rounded-lg ${BG_LARANJA} ${TEXTO_PRETO_BG_LARANJA} cursor-pointer`}>
                        <LayoutGrid className="h-6 w-6" aria-hidden="true" />
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold leading-tight text-balance">Painel de Filas</h1>
                        <p className={`text-sm ${TEXTO_CINZA_BG_AZUL}`}>Gestão de atendimento por equipe</p>
                    </div>

                </div>

                <div className="flex items-center gap-3 sm:text-right">

                    <div className={`sm:order-last flex h-10 w-10 items-center justify-center rounded-full ${BG_LARANJA} text-sm font-semibold ${TEXTO_PRETO_BG_LARANJA}`}>
                        {nomeGerente
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div>
                        <p className="text-sm font-medium leading-tight">{nomeGerente}</p>
                        <p className={`text-xs ${TEXTO_CINZA_BG_AZUL} capitalize`}>{data}</p>
                    </div>
                </div>

            </div>

        </header>
    )
}