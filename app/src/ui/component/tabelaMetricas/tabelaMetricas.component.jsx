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
      
      {/* Cabeçalho da Tabela */}
      <div className="flex flex-col gap-1 border-b border-gray-200 p-5">
        <h3 className={`text-base font-semibold ${TEXTO_PRETO_BG_BRANCO}`}>Detalhamento por equipe</h3>
        <p className={`text-sm ${TEXTO_CINZA_BG_BRANCO}`}>Comparativo completo das filas e da média geral da empresa</p>
      </div>

      {/* Container Responsivo e Tabela */}
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
            {/* Mapeando as equipes do nosso mock */}
            {equipes?.map((t) => (
              <tr key={t.nome} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <span className={`flex items-center gap-2 font-medium ${TEXTO_PRETO_BG_BRANCO}`}>
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${BG_AZUL_ESCURO}`}
                      aria-hidden="true"
                    />
                    {t.nome}
                  </span>
                </td>
                <td className={`px-5 py-3.5 text-right tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>
                  {formatMinutes(t.tempoMedioAtendimento/60)}
                </td>
                <td className={`px-5 py-3.5 text-right tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>
                  {formatMinutes(t.tempoMedioEspera/60)}
                </td>
                <td className={`px-5 py-3.5 text-right tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>
                  {formatNumber(t.totalAtendimentos)}
                </td>
                <td className={`px-5 py-3.5 text-right tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>
                  {formatNumber(t.totalTicketsRecusados)}
                </td>
                <td className={`px-5 py-3.5 text-right tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>
                  {t.mediaTicketsRecusadosPorDia}/dia
                </td>
              </tr>
            ))}
            
            {/* Linha de Total Agregado da Empresa */}
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