import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  LabelList, 
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO } from "../../../constants/cores.constant";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md outline-none">
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {String(entry.value?.toFixed(2)).replace('.', ',')}
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

  const tempoData = equipes?.map((t) => ({
    equipe: t.nome,
    atendimento: t.tempoMedioAtendimento/60,
    espera: t.tempoMedioEspera/60,
  }));

  const atendimentosData = [
    ...(equipes?.map((t) => ({ 
      equipe: t.nome, 
      total: t.totalAtendimentos, 
      geral: false, 
      fill:"lab(20.6116 -0.0234246 -27.6176)" 
    })) || []),
    
    { 
      equipe: "Empresa", 
      total: empresa?.totalAtendimentos || 0, 
      geral: true, 
      fill:"lab(78.8702 18.9326 41.9203)" 
    },
  ];

  const recusaData = equipes?.map((t) => ({
    equipe: t.nome,
    recusados: t.totalTicketsRecusados,
    filaCheia: t.mediaTicketsRecusadosPorDia,
  }));

    return (
    <section aria-label="Comparativos entre equipes" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      
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
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

