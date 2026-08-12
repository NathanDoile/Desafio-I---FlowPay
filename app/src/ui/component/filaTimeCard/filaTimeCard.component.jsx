import { ArrowUpRight, Clock, Users } from "lucide-react"
import {BG_AZUL_ESCURO, BG_LARANJA, TEXTO_AZUL_BG_BRANCO, TEXTO_CINZA_BG_AZUL, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO, TEXTO_PRETO_BG_LARANJA} from '../../../constants/cores.constant.jsx';

export function FilaTimeCard({ equipe, onClick }){

    const Icon = equipe.icone;

    return(
        <article className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
         
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                
                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${BG_AZUL_ESCURO} text-white`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                        <h2 className={`text-sm font-semibold uppercase tracking-wide ${TEXTO_PRETO_BG_BRANCO}`}>{equipe.categoria}</h2>
                    </div>
                </div>
                
                <ArrowUpRight onClick={() => onClick(equipe.id)}
                    className={`h-5 w-5 ${TEXTO_CINZA_BG_BRANCO} transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
                    aria-hidden="true"
                />
            </div>

            <div className="mt-6 flex items-end justify-between">
                <div>
                    <p className={`text-xs font-medium uppercase tracking-wide ${TEXTO_CINZA_BG_BRANCO}`}>Tickets na fila</p>
                    <p className={`mt-1 text-5xl font-bold tabular-nums ${TEXTO_CINZA_BG_BRANCO}`}>{equipe.quantidadeEmFila}</p>
                </div>
                
                <span
                    className={`mb-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                        equipe.quantidadeEmFila === 0 ? `${BG_AZUL_ESCURO} ${TEXTO_CINZA_BG_AZUL}` : `${BG_LARANJA} ${TEXTO_PRETO_BG_LARANJA}`
                    }`}
                    aria-hidden={equipe.quantidadeEmFila === 0}
                    >
                    {equipe.quantidadeEmFila === 0 ? "Vazia" : "Aguardando"}
                </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2">

                    <Users className={`h-4 w-4 ${TEXTO_AZUL_BG_BRANCO}`} aria-hidden="true" />

                    <div>
                        <p className={`text-sm font-semibold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>{equipe.quantidadeAtendentes}</p>
                        <p className={`text-xs ${TEXTO_CINZA_BG_BRANCO}`}>Agentes online</p>
                    </div>

                </div>

                <div className="flex items-center gap-2">

                    <Clock className={`h-4 w-4 ${TEXTO_AZUL_BG_BRANCO}`} aria-hidden="true" />

                    <div>
                        <p className={`text-sm font-semibold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>{equipe.mediaTempoEspera} min</p>
                        <p className={`text-xs ${TEXTO_CINZA_BG_BRANCO}`}>Espera média</p>
                    </div>

                </div>
            </div>

        </article>        
    )
}