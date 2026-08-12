import { Users } from "lucide-react";
import { elapsedFromMinsAgo, formatDuration, formatHumanDuration } from "../../../utils/time.js";
import { BG_AZUL_CLARO, BG_AZUL_ESCURO, BG_LARANJA, TEXTO_AZUL_BG_AZUL_CLARO, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO, TEXTO_PRETO_BG_LARANJA } from "../../../constants/cores.constant.jsx";

function BadgeStatus({ status }) {
  if (status === "em-atendimento") {
    return (
      <span className={`flex items-center gap-1.5 rounded-full ${BG_AZUL_ESCURO} px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm`}>
        <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${BG_LARANJA}`} aria-hidden="true" />
        <span>Em atendimento</span>
      </span>
    );
  }
  else {
    return (
      <span className={`flex items-center gap-1.5 rounded-full ${BG_LARANJA} px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${TEXTO_PRETO_BG_LARANJA} shadow-sm`}>
        Disponível
      </span>
    );
  }
}

function gerarIniciais(nome) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}

export function AtendentesEquipe({ equipe, anchor, now }){
    return (
    <section aria-label="Atendentes da equipe" className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-5">
        <div className="flex items-center gap-2">
          
          <span className={`flex h-8 w-8 items-center justify-center rounded-md ${BG_AZUL_ESCURO} text-white`}>
            <Users className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className={`text-base font-semibold ${TEXTO_PRETO_BG_BRANCO}`}>Atendentes</h2>
        </div>
        <p className={`font-mono text-sm font-semibold tabular-nums ${TEXTO_CINZA_BG_BRANCO}`}>
          {equipe.atendentes.length}
        </p>
      </div>

      {/* Lista de Atendentes */}
      <ul className="divide-y divide-gray-200">
        {equipe.atendentes.map((agente) => {
          // Verifica se ele tem um ticket ativo no momento
          const emChamada = agente.status === "em-atendimento" && agente.ticketsAtuais;

          return (
            <li key={agente.id} className="flex flex-col gap-3 p-5 hover:bg-gray-50 transition-colors">
              
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${BG_AZUL_CLARO} font-mono text-sm font-semibold ${TEXTO_AZUL_BG_AZUL_CLARO}`}>
                    {gerarIniciais(agente.nome)}
                  </span>
                  
                  <div>
                    <p className={`text-sm font-medium ${TEXTO_PRETO_BG_BRANCO}`}>{agente.nome}</p>
                    <p className={`${TEXTO_CINZA_BG_BRANCO}`}>
                      {agente.atendidosHoje} concluídos · média {formatHumanDuration(agente.tempoMedioAtendimentoSegundos)}
                    </p>
                  </div>
                </div>
                
                {/* A Etiqueta (Badge) */}
                <BadgeStatus status={agente.status} />
              </div>

              {/* Informações Adicionais (Se estiver em chamada, mostra o ticket. Se não, mostra mensagem de espera) */}
              {emChamada ? 
                (agente.ticketsAtuais.map((ticket) => {
                    return (
                        <div key={ticket.protocolo} className={`flex items-center justify-between gap-3 rounded-lg ${BG_AZUL_CLARO} px-3 py-2.5`}>
                            <div className="min-w-0">
                                <p className={`truncate text-sm font-medium ${TEXTO_PRETO_BG_BRANCO}`}>
                                {ticket.assunto}
                                </p>
                                <p className={`font-mono text-xs ${TEXTO_CINZA_BG_BRANCO}`}>
                                Protocolo {ticket.protocolo}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className={`text-[11px] uppercase tracking-wide ${TEXTO_CINZA_BG_BRANCO}`}>Em atendimento há</p>
                                <p className={`font-mono text-base font-semibold tabular-nums ${TEXTO_AZUL_BG_AZUL_CLARO}`}>
                                {formatDuration(elapsedFromMinsAgo(anchor, now, ticket.iniciadoMinutosAtras))}
                                </p>
                            </div>
                        </div>
                    )
                }))
               : (
                <p className={`rounded-lg ${BG_AZUL_CLARO} px-3 py-2 text-xs ${TEXTO_CINZA_BG_BRANCO}`}>
                  {agente.status === "disponivel"
                    ? "Aguardando próximo ticket da fila..."
                    : "Fora de atendimento no momento."}
                </p>
              )}
              
            </li>
          );
        })}
      </ul>
    </section>
  );
}