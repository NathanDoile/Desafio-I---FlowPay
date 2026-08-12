import {AtendentesEquipe, CabecalhoDetalheFila, FilaEspera, ResumoMetricaCard, TicketsRecusadosCard} from '../../component/index.js';
import { useClock } from '../../../hooks/useClock.js';
import { equipesMock } from '../../../mocks/equipes.mock.js';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export function DetalheFila(){

    const location = useLocation();

    const equipeDefault = location.state?.equipeDesejada;

    console.log(location);

    const [equipeSelecionada, setEquipeSelecionada] = useState(equipeDefault ?? "CARTOES");
    const { anchor, now } = useClock(1000)
    const equipe = equipesMock[equipeSelecionada];

    return (
        <div className="min-h-screen bg-[lab(97.6762%_-.553459_-1.78936)] pb-12">
            <CabecalhoDetalheFila 
                equipeSelecionada={equipeSelecionada} 
                onSelecionarEquipe={setEquipeSelecionada} 
                horarioAtual={now} 
            />

            <main className="mx-auto max-w-[1400px]  px-6 py-8 md:px-8">
                
                <ResumoMetricaCard equipe={equipe} />

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <TicketsRecusadosCard equipe={equipe} anchor={anchor} now={now} />
                    <FilaEspera equipe={equipe} anchor={anchor} now={now} />
                </div>

                <div className="lg:col-span-1">
                    <AtendentesEquipe equipe={equipe} anchor={anchor} now={now} />
                </div>
                
                </div>

            </main>
        </div>
  );
}