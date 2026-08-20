import { Inbox, Timer } from "lucide-react";
import { elapsedFromMinsAgo, formatClock, formatDuration, elapsedSeconds } from "../../../utils/time.js";
import { BG_AZUL_ESCURO, TEXTO_AZUL_BG_BRANCO, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO } from "../../../constants/cores.constant.jsx";

export function FilaEspera({ equipe, anchor, now }){
    
    const ocupacao = equipe?.fila?.length;
    const capacidade = equipe.capacidadeFila;
    const porcentagemPreenchida = Math.min(100, Math.round((ocupacao / capacidade) * 100));
    const quaseCheia = porcentagemPreenchida >= 80;

    return (
    <section aria-label="Tickets em fila" className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      
      <ul className="divide-y divide-gray-200">
        {equipe?.fila?.map((ticket) => {
          const esperou =
            anchor === null || now === null ? null : elapsedFromMinsAgo(anchor, now, (elapsedSeconds(ticket.dataHoraEntrouNaFila, now) / 60));
            
          const esperaLonga = esperou !== null && esperou > equipe.tempoMedioEspera;
          
          const horaQueEntrou = formatClock(ticket.dataHoraEntrouNaFila);
          
          return (
            <li key={ticket.protocolo} className="flex items-center justify-between gap-4 p-5 hover:bg-gray-50 transition-colors">
              
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`truncate text-sm font-medium ${TEXTO_PRETO_BG_BRANCO}`}>{ticket.assunto}</p>
                </div>
                
                <p className={`mt-0.5 font-mono text-xs ${TEXTO_CINZA_BG_BRANCO}`}>
                  Protocolo {ticket.protocolo}
                </p>
                <p className={`mt-0.5 text-xs ${TEXTO_CINZA_BG_BRANCO}`}>
                  Entrou às {horaQueEntrou ?? "--:--:--"}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className={`flex items-center justify-end gap-1 text-xs ${TEXTO_CINZA_BG_BRANCO}`}>
                  <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>esperando</span>
                </p>

                <p
                  className={
                    esperaLonga
                      ? "font-mono text-lg font-semibold tabular-nums text-red-600"
                      : `font-mono text-lg font-semibold tabular-nums ${TEXTO_AZUL_BG_BRANCO}`
                  }
                >
                  {esperou === null ? "--:--" : formatDuration(esperou)}
                </p>
              </div>
              
            </li>
          );
        })}

