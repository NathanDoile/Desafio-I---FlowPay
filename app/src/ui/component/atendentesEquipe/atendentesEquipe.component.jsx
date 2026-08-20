import { Users } from "lucide-react";
import { elapsedFromMinsAgo, formatDuration, formatHumanDuration,elapsedSeconds } from "../../../utils/time.js";
import { BG_AZUL_CLARO, BG_AZUL_ESCURO, BG_LARANJA, TEXTO_AZUL_BG_AZUL_CLARO, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO, TEXTO_PRETO_BG_LARANJA } from "../../../constants/cores.constant.jsx";

function BadgeStatus({ agente }) {
  if (agente?.solicitacoes?.length > 0) {
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
          {equipe?.atendentes?.length}
        </p>
      </div>

                <BadgeStatus agente={agente} />
              </div>

