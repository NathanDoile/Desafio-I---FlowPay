import { BarChart3, Users } from "lucide-react";
import {BG_AZUL_ESCURO, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO} from '../../../constants/cores.constant';

export function CabecalhoTelaNaoEncontrada(){

    return(
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5 lg:px-12">

            <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${BG_AZUL_ESCURO} text-white`}>
                    <BarChart3 className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
                </div>

                <div>
                    <p className={`font-mono text-[10px] font-bold uppercase tracking-[0.22em] ${TEXTO_CINZA_BG_BRANCO}`}>FlowPay</p>
                    <p className={`text-sm font-semibold tracking-tight ${TEXTO_PRETO_BG_BRANCO}`}>Distribuição inteligente</p>
                </div>
            </div>

            <div className={`hidden items-center gap-2 text-xs font-medium ${TEXTO_CINZA_BG_BRANCO} sm:flex`}>
                <Users className="h-4 w-4" aria-hidden="true" />
                <span>Painel do gerente</span>
            </div>

        </header>
    )
}