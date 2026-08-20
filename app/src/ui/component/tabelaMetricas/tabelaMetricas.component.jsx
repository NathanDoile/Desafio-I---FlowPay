import { BG_AZUL_ESCURO, BG_LARANJA, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO } from "../../../constants/cores.constant.jsx";
import { formatMinutes, formatNumber } from "../../../mocks/metricas.mock.js";

const columns = [
  { key: "tma", label: "T. médio atend." },
  { key: "tme", label: "T. médio espera" },
  { key: "atend", label: "Atendimentos" },
  { key: "recus", label: "Recusados" },
  { key: "fila", label: "Recusados/fila cheia" },
];

export function TabelaMetricas({ equipes, empresa }){

    return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left bg-white">
              <th className={`px-5 py-3 font-medium ${TEXTO_CINZA_BG_BRANCO}`}>Equipe</th>
              {columns.map((c) => (
                <th key={c.key} className={`px-5 py-3 text-right font-medium ${TEXTO_CINZA_BG_BRANCO}`}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            <tr className="bg-gray-50 rounded-b-xl">
              <td className="px-5 py-4">
                <span className={`flex items-center gap-2 font-semibold ${TEXTO_PRETO_BG_BRANCO}`}>
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${BG_LARANJA}`} aria-hidden="true" />
                  {"FlowPay"}
                </span>
              </td>
              <td className={`px-5 py-4 text-right font-semibold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>
                {formatMinutes(empresa.tempoMedioAtendimento/60)}
              </td>
              <td className={`px-5 py-4 text-right font-semibold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>
                {formatMinutes(empresa.tempoMedioEspera/60)}
              </td>
              <td className={`px-5 py-4 text-right font-semibold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>
                {formatNumber(empresa.totalAtendimentos)}
              </td>
              <td className={`px-5 py-4 text-right font-semibold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>
                {formatNumber(empresa.totalTicketsRecusados)}
              </td>
              <td className={`px-5 py-4 text-right font-semibold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>
                {empresa.mediaTicketsRecusadosPorDia}/dia
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  );
}