import {CabecalhoHome, FilaTimeCard, Loading} from '../../component/index.js';
import { BG_AZUL_ESCURO, TEXTO_CINZA_BG_AZUL, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO } from '../../../constants/cores.constant.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import {useObterHome,useSmartPolling} from '../../../hooks/index.js';

export function Home(){

  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const {obterHome} = useObterHome();

  const [dadosHome, setDadosHome] = useState({});

  async function atualizarDadosHome(){
    setCarregando(true);

    const response = await obterHome();

    setCarregando(false);

    setDadosHome(response);
  }

  async function reatualizarDadosHome(){

    const response = await obterHome();

    setDadosHome(response);
  }

  useEffect(() => {
    atualizarDadosHome();
  }, []);

  function abrirDetalhes(categoriaEquipe) {
        navigate('/detalhes-fila', { state: { equipeDesejada: categoriaEquipe } });
    }

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  useSmartPolling(reatualizarDadosHome);

  return (
    <div className="min-h-screen bg-gray-50">

      <CabecalhoHome nomeGerente="Gerente FlowPay" data={dataAtual} />

      {carregando ? <Loading /> : 

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
                <p className="mt-1 text-3xl font-bold tabular-nums">{dadosHome?.totalTickets}</p>
              </div>
              
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className={`text-xs font-medium uppercase tracking-wide ${TEXTO_CINZA_BG_BRANCO}`}>Agentes online</p>
                <p className={`mt-1 text-3xl font-bold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>{dadosHome?.quantidadeAtendentes}</p>
              </div>
              
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className={`text-xs font-medium uppercase tracking-wide ${TEXTO_CINZA_BG_BRANCO}`}>Equipes ativas</p>
                <p className={`mt-1 text-3xl font-bold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>{dadosHome?.equipes?.length}</p>
              </div>
            </div>
          </section>

          <section aria-label="Filas por equipe">
            <h3 className={`mb-4 text-sm font-semibold uppercase tracking-wide ${TEXTO_CINZA_BG_BRANCO}`}>
              Suas equipes
            </h3>
            
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {dadosHome?.equipes?.map((equipe) => (
                <FilaTimeCard key={equipe.id} equipe={equipe} onClick={abrirDetalhes} />
              ))}
            </div>
          </section>

        </main>
      }
    </div>
  );
}