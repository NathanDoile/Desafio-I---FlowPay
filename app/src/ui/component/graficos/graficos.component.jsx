import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  LabelList, 
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { BG_LARANJA, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO } from "../../../constants/cores.constant";

// Função que desenha o Tooltip customizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md outline-none">
        {/* Título (ex: Empréstimos) */}
        <p className="mb-2 text-sm font-semibold text-gray-900">{label}</p>
        
        {/* Lista de itens (Tempo de atendimento, etc) */}
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                {/* O quadradinho colorido */}
                <span
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ backgroundColor: entry.color || entry.fill }}
                />
                <span className="text-gray-600">{entry.name}</span>
              </div>
              
              {/* O valor alinhado à direita (trocando ponto por vírgula no padrão BR) */}
              <span className="font-medium text-gray-900">
                {String(entry.value).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function Graficos({ equipes, empresa }){

  const tempoData = equipes.map((t) => ({
    equipe: t.nome,
    atendimento: t.tempoMedioAtendimento,
    espera: t.tempoMedioEspera,
  }));

  const atendimentosData = [
    ...equipes.map((t) => ({ equipe: t.nome, total: t.totalAtendimentos, geral: false })),
    { equipe: "Empresa", total: empresa.totalAtendimentos, geral: true },
  ];

  const recusaData = equipes.map((t) => ({
    equipe: t.nome,
    recusados: t.totalRecusados,
    filaCheia: t.mediaRecusadosFilaCheia,
  }));

    return (
    <section aria-label="Comparativos entre equipes" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      
      {/* 1º GRÁFICO: TEMPOS MÉDIOS */}
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
                <h3 className={`text-base font-semibold ${TEXTO_PRETO_BG_BRANCO}`}>Tempos médios por equipe</h3>
                <p className={`text-sm ${TEXTO_CINZA_BG_BRANCO}`}>Atendimento x espera em fila (minutos)</p>
            </div>
            
            <div className="mt-4 h-[280px] w-full">

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tempoData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="equipe" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} unit="m" tick={{ fill: '#6b7280', fontSize: 12 }} />
                        
                        <Tooltip 
                            cursor={{ fill: '#f3f4f6' }} 
                            content={<CustomTooltip />} 
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        
                        <Bar dataKey="atendimento" name="Tempo de atendimento" fill="lab(20.6116 -0.0234246 -27.6176)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="espera" name="Tempo em fila" fill="lab(78.8702 18.9326 41.9203)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      {/* 2º GRÁFICO: TOTAL DE ATENDIMENTOS */}
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
                <h3 className="text-base font-semibold text-gray-900">Total de atendimentos</h3>
                <p className="text-sm text-gray-500">Quantidade por equipe e total da empresa</p>
            </div>
            
            <div className="mt-4 h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={atendimentosData} margin={{ top: 20, right: 8, left: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="equipe" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={44} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        
                        <Tooltip 
                            cursor={{ fill: '#f3f4f6' }} 
                            content={<CustomTooltip />} 
                        />
                        
                        <Bar dataKey="total" name="Atendimentos" radius={[4, 4, 0, 0]}>
                            <LabelList dataKey="total" position="top" className="fill-gray-600 text-xs font-semibold" />
                            
                            {/* Muda a cor dinamicamente se for a coluna "Geral/Empresa" */}
                            {atendimentosData.map((entry) => (
                            <Cell
                                key={entry.equipe}
                                fill={entry.geral ? "lab(78.8702 18.9326 41.9203)" : "lab(20.6116 -0.0234246 -27.6176)"}
                            />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

      {/* 3º GRÁFICO: TICKETS RECUSADOS (Ocupa 2 colunas em telas grandes) */}
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div>
                <h3 className="text-base font-semibold text-gray-900">Tickets recusados por equipe</h3>
                <p className="text-sm text-gray-500">Total recusado no período x média diária por fila cheia</p>
            </div>
            
            <div className="mt-4 h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recusaData} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="equipe" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        
                        <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} width={44} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickMargin={8} width={36} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        
                        <Tooltip 
                            cursor={{ fill: '#f3f4f6' }} 
                            content={<CustomTooltip />} 
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        
                        <Bar yAxisId="left" dataKey="recusados" name="Total recusados" fill="lab(20.6116 -0.0234246 -27.6176)" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="filaCheia" name="Média por fila cheia / dia" fill="lab(78.8702 18.9326 41.9203)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      
    </section>
  );
}