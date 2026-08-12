import { AlertTriangle } from "lucide-react";
import { elapsedFromSecsAgo, formatHumanDuration } from "../../../utils/time.js";
import { BG_VERMELHO_CLARO, TEXTO_CINZA_BG_VERMELHO_CLARO, TEXTO_PRETO_BG_VERMELHO_CLARO } from "../../../constants/cores.constant.jsx";

export function TicketsRecusadosCard({equipe, anchor, now}){

    const tempoDesdeUltimaRecusa = anchor === null || now === null 
        ? null 
        : elapsedFromSecsAgo(anchor, now, equipe.ultimoRecusadoSegundosAtras);

    const isRecente = tempoDesdeUltimaRecusa !== null && tempoDesdeUltimaRecusa < 120;

    return (
    <section
      aria-label="Tickets recusados por fila cheia"
      className={`rounded-xl border-2 border-red-200 ${BG_VERMELHO_CLARO} p-5`}
    >
      <div className="flex items-start gap-3">
        
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[lab(49.0747%_69.3434_49.6251)] text-[lab(98.84%_.0000298023_-.0000119209)]">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-red-700">
            Recusados — fila cheia
          </h2>
          <p className={`mt-1 text-xs ${TEXTO_CINZA_BG_VERMELHO_CLARO}`}>
            Capacidade da fila: {equipe.capacidadeFila} tickets
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className={`text-xs font-medium ${TEXTO_CINZA_BG_VERMELHO_CLARO}`}>Recusados hoje</p>
              <p className="font-mono text-3xl font-semibold tabular-nums text-red-700">
                {equipe.recusados}
              </p>
            </div>
            
            <div>
              <p className={`   text-xs font-medium ${TEXTO_CINZA_BG_VERMELHO_CLARO}`}>Última recusa</p>
              <p
                className={
                  isRecente
                    ? "font-mono text-3xl font-semibold tabular-nums text-red-700"
                    : `font-mono text-3xl font-semibold tabular-nums ${TEXTO_PRETO_BG_VERMELHO_CLARO}`
                }
              >
                {tempoDesdeUltimaRecusa === null ? "--" : formatHumanDuration(tempoDesdeUltimaRecusa)}
              </p>
              <p className={`text-xs ${TEXTO_CINZA_BG_VERMELHO_CLARO}`}>atrás</p>
            </div>
          </div>

          {isRecente ? (
            <p className="mt-4 flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white shadow-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden="true" />
                <span>Recusa recente — fila operando no limite</span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}