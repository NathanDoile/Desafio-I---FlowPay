import { Clock, Hourglass, Ban, CheckCircle2, XCircle } from "lucide-react";
import { formatMinutes, formatNumber } from "../../../mocks/metricas.mock.js";
import { BG_AZUL_ESCURO, BG_LARANJA, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO, TEXTO_PRETO_BG_LARANJA } from "../../../constants/cores.constant.jsx";

function buildKpis(empresa) {
  return [
    {
      label: "Tempo médio de atendimento",
      value: formatMinutes(empresa.tempoMedioAtendimento/60),
      hint: "Média ponderada da empresa",
      icon: Clock,
    },
    {
      label: "Tempo médio de espera em fila",
      value: formatMinutes(empresa.tempoMedioEspera/60),
      hint: "Média ponderada da empresa",
      icon: Hourglass,
    },
    {
      label: "Total de atendimentos",
      value: formatNumber(empresa.totalAtendimentos),
      hint: "Soma de todas as equipes",
      icon: CheckCircle2,
    },
    {
      label: "Total de tickets recusados",
      value: formatNumber(empresa.totalTicketsRecusados),
      hint: `Taxa de recusa de ${Number(empresa?.taxaRecusa || 0)?.toFixed(2)}%`,
      icon: XCircle,
      accent: true, // Acende o alerta laranja!
    },
    {
      label: "Média recusados por fila cheia",
      value: `${empresa.mediaTicketsRecusadosPorDia}/dia`,
      hint: "Média entre as equipes",
      icon: Ban,
      accent: true, // Acende o alerta laranja!
    },
  ];
}

export function MetricasGeraisCard({empresa}){

    const kpis = buildKpis(empresa);
    
    return (
    <section aria-label="Métricas gerais da empresa">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          
          return (
            <div
              key={kpi.label}
              className="flex flex-col justify-between gap-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <p className={`text-sm font-medium leading-snug ${TEXTO_CINZA_BG_BRANCO} text-pretty`}>
                  {kpi.label}
                </p>
                
