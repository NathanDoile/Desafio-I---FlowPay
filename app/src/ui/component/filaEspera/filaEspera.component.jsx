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
      
      {/* Cabeçalho da Tabela */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-5">

        <div className="flex items-center gap-2">
          
          <span className={`flex h-8 w-8 items-center justify-center rounded-md ${BG_AZUL_ESCURO} text-white`}>
            <Inbox className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className={`text-base font-semibold ${TEXTO_PRETO_BG_BRANCO}`}>Fila de espera</h2>

        </div>
        
        <div className="text-right">
            <p className="font-mono text-sm font-semibold tabular-nums">
                
                <span className={quaseCheia ? "text-red-600" : `${TEXTO_PRETO_BG_BRANCO}`}>{ocupacao}</span>
                <span className={`${TEXTO_CINZA_BG_BRANCO}`}>/{capacidade}</span>

            </p>
            <p className={`text-xs ${TEXTO_CINZA_BG_BRANCO}`}>na fila</p>
        </div>
      </div>

      <div className="px-5 pt-4">

        <div className="h-2 w-full overflow-hidden rounded-full bg-[lab(94.1797%_-.807792_-3.6664)]">
            <div
                className={quaseCheia ? "h-full rounded-full bg-red-500" : "h-full rounded-full bg-[lab(78.9046%_19.1698_47.5514)]"}
                style={{ width: `${porcentagemPreenchida}%` }}
            />
        </div>

      </div>

      {/* Lista de Tickets */}
      <ul className="divide-y divide-gray-200">
        {equipe?.fila?.map((ticket) => {
          // Calcula o tempo de espera real baseado na âncora do useClock
          const esperou =
            anchor === null || now === null ? null : elapsedFromMinsAgo(anchor, now, (elapsedSeconds(ticket.dataHoraEntrouNaFila, now) / 60));
            
          // Verifica se o cliente já passou da média de espera da fila
          const esperaLonga = esperou !== null && esperou > equipe.tempoMedioEspera;
          
          // Calcula a hora exata que ele entrou
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

        {/* Mensagem caso a fila esteja vazia */}
        {equipe?.tickets?.length === 0 ? (
          <li className={`p-8 text-center text-sm ${TEXTO_CINZA_BG_BRANCO}`}>Nenhum ticket em fila. A equipe está com tempo livre!</li>
        ) : null}
      </ul>
      
    </section>
  );
}