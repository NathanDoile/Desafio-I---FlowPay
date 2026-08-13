export const periodo = "Últimos 30 dias";

export const periodosDisponiveis = [
  { value: "2026-08", label: "Agosto de 2026" },
  { value: "2026-07", label: "Julho de 2026" },
  { value: "2026-06", label: "Junho de 2026" },
  { value: "2026-05", label: "Maio de 2026" },
  { value: "2026-04", label: "Abril de 2026" },
];

export const equipesMetricas = [
  {
    key: "cartoes",
    nome: "Cartões",
    tempoMedioAtendimento: 8.4,
    tempoMedioEspera: 3.1,
    mediaRecusadosFilaCheia: 14.2,
    totalAtendimentos: 12840,
    totalRecusados: 426,
  },
  {
    key: "emprestimos",
    nome: "Empréstimos",
    tempoMedioAtendimento: 12.7,
    tempoMedioEspera: 5.8,
    mediaRecusadosFilaCheia: 22.6,
    totalAtendimentos: 9310,
    totalRecusados: 678,
  },
  {
    key: "outros",
    nome: "Outros Assuntos",
    tempoMedioAtendimento: 6.2,
    tempoMedioEspera: 2.4,
    mediaRecusadosFilaCheia: 9.5,
    totalAtendimentos: 15720,
    totalRecusados: 285,
  },
];

// Função auxiliar para arredondamento
function round(n, decimals = 1) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

export function getMetricsForPeriod(period) {
  // Procura o índice do período selecionado para aplicar um "fator" de variação falso
  const index = Math.max(0, periodosDisponiveis.findIndex((item) => item.value === period));
  
  // Fatores de variação para criar dados dinâmicos ao trocar o mês
  const factor = [1, 0.93, 1.08, 0.97, 1.12][index] ?? 1;
  const timeFactor = [1, 0.96, 1.04, 1.02, 0.94][index] ?? 1;

  const periodTeams = equipesMetricas.map((team) => ({
    ...team,
    tempoMedioAtendimento: round(team.tempoMedioAtendimento * timeFactor),
    tempoMedioEspera: round(team.tempoMedioEspera * timeFactor),
    mediaRecusadosFilaCheia: round(team.mediaRecusadosFilaCheia * timeFactor),
    totalAtendimentos: Math.round(team.totalAtendimentos * factor),
    totalRecusados: Math.round(team.totalRecusados * factor),
  }));

  const totalAtendimentosPeriodo = periodTeams.reduce((total, team) => total + team.totalAtendimentos, 0);
  const totalRecusadosPeriodo = periodTeams.reduce((total, team) => total + team.totalRecusados, 0);

  return {
    equipes: periodTeams,
    empresa: {
      nome: "Empresa (Geral)",
      totalAtendimentos: totalAtendimentosPeriodo,
      totalRecusados: totalRecusadosPeriodo,
      tempoMedioAtendimento: round(periodTeams.reduce((sum, team) => sum + team.tempoMedioAtendimento * team.totalAtendimentos, 0) / totalAtendimentosPeriodo),
      tempoMedioEspera: round(periodTeams.reduce((sum, team) => sum + team.tempoMedioEspera * team.totalAtendimentos, 0) / totalAtendimentosPeriodo),
      mediaRecusadosFilaCheia: round(periodTeams.reduce((sum, team) => sum + team.mediaRecusadosFilaCheia, 0) / periodTeams.length),
      taxaRecusa: round((totalRecusadosPeriodo / (totalAtendimentosPeriodo + totalRecusadosPeriodo)) * 100, 1),
    },
  };
}

// Cálculos base para a visão geral (Agregado padrão sem filtro de mês)
const totalAtendimentosBase = equipesMetricas.reduce((acc, t) => acc + t.totalAtendimentos, 0);
const totalRecusadosBase = equipesMetricas.reduce((acc, t) => acc + t.totalRecusados, 0);

/** Métricas gerais da empresa (agregado das equipes). */
export const empresa = {
  nome: "Empresa (Geral)",
  totalAtendimentos: totalAtendimentosBase,
  totalRecusados: totalRecusadosBase,
  
  // Tempo médio de atendimento ponderado pela quantidade de atendimentos
  tempoMedioAtendimento: round(
    equipesMetricas.reduce((acc, t) => acc + t.tempoMedioAtendimento * t.totalAtendimentos, 0) / totalAtendimentosBase,
  ),
  
  // Tempo médio de espera ponderado
  tempoMedioEspera: round(
    equipesMetricas.reduce((acc, t) => acc + t.tempoMedioEspera * t.totalAtendimentos, 0) / totalAtendimentosBase,
  ),
  
  mediaRecusadosFilaCheia: round(
    equipesMetricas.reduce((acc, t) => acc + t.mediaRecusadosFilaCheia, 0) / equipesMetricas.length,
  ),
  
  // Taxa de recusa geral (%)
  taxaRecusa: round((totalRecusadosBase / (totalAtendimentosBase + totalRecusadosBase)) * 100, 1),
};

// --- Utilitários de Formatação Visual ---

export function formatNumber(n) {
  return new Intl.NumberFormat("pt-BR").format(n);
}

export function formatMinutes(n) {
  const min = Math.floor(n);
  const seg = Math.round((n - min) * 60);
  
  if (seg === 0) return `${min}min`;
  return `${min}min ${seg.toString().padStart(2, "0")}s`;
}