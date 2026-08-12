import { CreditCard, HandCoins, MessagesSquare } from "lucide-react";
import {CabecalhoHome, FilaTimeCard} from '../../component/index.js';
import { BG_AZUL_ESCURO, TEXTO_CINZA_BG_AZUL, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO } from '../../../constants/cores.constant.jsx';
import { useNavigate } from 'react-router-dom';

export function Home(){

  const navigate = useNavigate();

  function abrirDetalhes(idDaEquipe) {
        navigate('/detalhes-fila', { state: { equipeDesejada: idDaEquipe } });
    }

    const equipes = [
    {
      id: "CARTOES",
      categoria: "CARTÕES",
      quantidadeEmFila: 34,
      quantidadeAtendentes: 8,
      mediaTempoEspera: 12,
      icone: CreditCard
    },
    {
      id: "EMPRESTIMOS",
      categoria: "EMPRÉSTIMOS",
      quantidadeEmFila: 18,
      quantidadeAtendentes: 6,
      mediaTempoEspera: 7,
      icone: HandCoins
    },
    {
      id: "OUTROS_ASSUNTOS",
      categoria: "OUTROS ASSUNTOS",
      quantidadeEmFila: 9,
      quantidadeAtendentes: 4,
      mediaTempoEspera: 4,
      icone: MessagesSquare
    }
  ]

  const totalTickets = equipes.reduce((sum, t) => sum + t.quantidadeEmFila, 0);
  const totalAtendentes = equipes.reduce((sum, t) => sum + t.quantidadeAtendentes, 0);

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-gray-50">

      <CabecalhoHome nomeGerente="Ana Ribeiro" data={dataAtual} />

      <main className="mx-auto max-w-[1400px] px-6 py-8">
        
        <section className="mb-8" aria-label="Resumo geral">
          <div className="flex flex-col gap-1">
            <h2 className={`text-2xl font-bold ${TEXTO_PRETO_BG_BRANCO} text-balance`}>Visão geral das filas</h2>
            <p className={`text-sm ${TEXTO_CINZA_BG_BRANCO}`}>
              Acompanhe em tempo real a demanda de cada uma das suas equipes.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className={`rounded-xl ${BG_AZUL_ESCURO} p-5 text-white shadow-sm`}>
              <p className={`text-xs font-medium uppercase tracking-wide ${TEXTO_CINZA_BG_AZUL}`}>
                Total de tickets
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums">{totalTickets}</p>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className={`text-xs font-medium uppercase tracking-wide ${TEXTO_CINZA_BG_BRANCO}`}>Agentes online</p>
              <p className={`mt-1 text-3xl font-bold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>{totalAtendentes}</p>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className={`text-xs font-medium uppercase tracking-wide ${TEXTO_CINZA_BG_BRANCO}`}>Equipes ativas</p>
              <p className={`mt-1 text-3xl font-bold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>{equipes.length}</p>
            </div>
          </div>
        </section>

        <section aria-label="Filas por equipe">
          <h3 className={`mb-4 text-sm font-semibold uppercase tracking-wide ${TEXTO_CINZA_BG_BRANCO}`}>
            Suas equipes
          </h3>
          
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {equipes.map((equipe) => (
              <FilaTimeCard key={equipe.id} equipe={equipe} onClick={abrirDetalhes} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}