import { Headset } from "lucide-react"
import {equipesMock, listaEquipesMock} from '../../../mocks/equipes.mock.js';
import {formatClock} from '../../../utils/time.js';
import { BG_AZUL_ESCURO, BG_LARANJA, TEXTO_CINZA_BG_AZUL, TEXTO_PRETO_BG_LARANJA } from '../../../constants/cores.constant.jsx';
import { useNavigate } from "react-router-dom";

export function CabecalhoDetalheFila({equipeSelecionada, horarioAtual, onSelecionarEquipe}){

    const navigate = useNavigate();

    const equipe = equipesMock[equipeSelecionada];

    const atendentesAtivos = equipe.atendentes.filter((a) => a.status !== "pausa").length;

    const horarioFormatado = horarioAtual ? formatClock(horarioAtual) : "--:--:--";

    return (
    <header className={`${BG_AZUL_ESCURO} text-white`}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-6 md:px-8">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          
            <div className="flex items-center gap-3">

                <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${BG_LARANJA} ${TEXTO_PRETO_BG_LARANJA} cursor-pointer`}>
                    <Headset onClick={() => navigate('/')} className="h-6 w-6" aria-hidden="true" />
                </span>

                <div>
                    <p className={`text-xs font-medium uppercase tracking-widest ${TEXTO_CINZA_BG_AZUL}`}>
                        Detalhe da fila
                    </p>

                    <h1 className="text-2xl font-semibold leading-tight text-balance">
                        {equipe.nome}
                    </h1>
                </div>

            </div>

            <div className="flex items-center gap-6 text-right">
                <div>
                    <p className={`text-xs uppercase tracking-wide ${TEXTO_CINZA_BG_AZUL}`}>Atendentes ativos</p>
                    <p className="font-mono text-lg font-semibold">
                        {atendentesAtivos}
                        <span className={`${TEXTO_CINZA_BG_AZUL}`}>/{equipe.atendentes.length}</span>
                    </p>
                </div>

                <div>
                    <p className={`text-xs uppercase tracking-wide ${TEXTO_CINZA_BG_AZUL}`}>Horário</p>
                    <p className="font-mono text-lg font-semibold tabular-nums">
                        {horarioFormatado}
                    </p>
                </div>
            </div>
        </div>

        {/* Abas / Seletor de Equipe */}
        <nav aria-label="Equipes" className="flex flex-wrap gap-2">
          {listaEquipesMock.map((item) => {
            const isAtiva = item.id === equipe.id;
            
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelecionarEquipe(item.id)}
                aria-current={isAtiva ? "page" : undefined}
                className={
                  isAtiva
                    ? `rounded-md ${BG_LARANJA} px-4 py-2 text-sm font-semibold uppercase tracking-wide ${TEXTO_PRETO_BG_LARANJA} shadow-sm`
                    : `rounded-md bg-[lab(20.4125%_2.58298_-31.3537)] px-4 py-2 text-sm font-semibold uppercase tracking-wide ${TEXTO_CINZA_BG_AZUL} transition-colors hover:bg-white/20`
                }
              >
                {item.nome}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}