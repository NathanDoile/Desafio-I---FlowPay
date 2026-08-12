import { CheckCircle2, Clock, Hourglass, Users } from "lucide-react";
import { formatHumanDuration } from "../../../utils/time.js";
import { MetricCard } from "../metricaCard/metricaCard.component.jsx";

export function ResumoMetricaCard({equipe}){

    const emAtendimento = equipe.atendentes.filter((a) => a.status === "em-atendimento").length;
    
    return (
    <section aria-label="Métricas gerais da equipe" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      
      <MetricCard
        icone={<Clock className="h-4 w-4" aria-hidden="true" />}
        titulo="Tempo médio"
        valor={formatHumanDuration(equipe.tempoMedioAtendimentoSegundos)}
        descricao="Média por atendimento"
      />
      
      <MetricCard
        icone={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
        titulo="Concluídos hoje"
        valor={String(equipe.concluidosHoje)}
        descricao="Atendimentos finalizados"
      />
      
      <MetricCard
        icone={<Hourglass className="h-4 w-4" aria-hidden="true" />}
        titulo="Espera média"
        valor={formatHumanDuration(equipe.tempoMedioEsperaSegundos)}
        descricao="Tempo médio na fila"
      />
      
      <MetricCard
        icone={<Users className="h-4 w-4" aria-hidden="true" />}
        titulo="Em atendimento"
        valor={`${emAtendimento}`}
        descricao={`De ${equipe.atendentes.length} atendentes na equipe`}
      />
      
    </section>
  );
}