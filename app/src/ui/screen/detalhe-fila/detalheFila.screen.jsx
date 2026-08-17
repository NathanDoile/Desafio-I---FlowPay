import {AtendentesEquipe, CabecalhoDetalheFila, FilaEspera, ResumoMetricaCard, TicketsRecusadosCard, Loading} from '../../component/index.js';
import { useClock } from '../../../hooks/useClock.js';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {useObterDetalheEquipe} from '../../../hooks/index.js';

export function DetalheFila(){

    const [carregando, setCarregando] = useState(false);

    const location = useLocation();

    const equipeDefault = location.state?.equipeDesejada;

    const [equipeSelecionada, setEquipeSelecionada] = useState(equipeDefault ?? "CARTAO");

    const { anchor, now } = useClock(1000);

    const {obterDetalheEquipe} = useObterDetalheEquipe();

    const [dadosEquipe, setDadosEquipe] = useState({});

    async function atualizarDadosEquipe(){
        setCarregando(true);
    
        const response = await obterDetalheEquipe(equipeSelecionada);
    
        setCarregando(false);
    
        setDadosEquipe(response);

      }
    
      useEffect(() => {
        atualizarDadosEquipe();
      }, [equipeSelecionada]);

    return (
        <div className="min-h-screen bg-[lab(97.6762%_-.553459_-1.78936)] pb-12">
            <CabecalhoDetalheFila 
                nomeEquipe={equipeSelecionada}
                equipe={dadosEquipe} 
                onSelecionarEquipe={setEquipeSelecionada} 
                horarioAtual={now} 
            />

            {carregando ? <Loading /> : 
                <main className="mx-auto max-w-[1400px]  px-6 py-8 md:px-8">
                    
                    <ResumoMetricaCard equipe={dadosEquipe} />

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <TicketsRecusadosCard equipe={dadosEquipe} anchor={anchor} now={now} />
                        <FilaEspera equipe={dadosEquipe} anchor={anchor} now={now} />
                    </div>

                    <div className="lg:col-span-1">
                        <AtendentesEquipe equipe={dadosEquipe} anchor={anchor} now={now} />
                    </div>
                    
                    </div>

                </main>
            }
        </div>
  );
}