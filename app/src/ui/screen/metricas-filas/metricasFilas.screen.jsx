import { useState, useEffect } from "react";
import { CabecalhoMetricas, Graficos, MetricasGeraisCard, TabelaMetricas, Loading } from "../../component/index.js";
import { useNavigate } from "react-router-dom";
import { useObterMetricasGerais } from "../../../hooks/index.js";
import { converterDataParaSeletor } from "../../../utils/date.js";

export function MetricasFilas() {
    
    const [periodoSelecionado, setPeriodoSelecionado] = useState(new Date().toISOString().split('T')[0]);
    
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    const {obterMetricasGerais} = useObterMetricasGerais();

    const [dadosMetricas, setDadosMetricas] = useState({});

    async function atualizarDadosMetricas(){
        setCarregando(true);
    
        const response = await obterMetricasGerais(periodoSelecionado);
    
        setCarregando(false);
    
        setDadosMetricas(response);
        console.log(response)
      }
    
      useEffect(() => {
        atualizarDadosMetricas();
      }, [periodoSelecionado]);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
        
            <CabecalhoMetricas 
                periodoSelecionado={periodoSelecionado} 
                setPeriodoSelecionado={setPeriodoSelecionado} 
            />

            {carregando ? <Loading /> : 
                <main className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-8 md:px-8">
                    
                    <section>
                        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
                                Resumo geral da empresa
                            </h2>
                            {/* Destaque em Azul LAB para o mês sendo analisado */}
                            <p className="text-sm font-semibold text-[lab(20.6116_-0.0234246_-27.6176)]">
                                Análise de {converterDataParaSeletor(periodoSelecionado)}
                            </p>
                        </div>
                        
                        <MetricasGeraisCard empresa={dadosMetricas} />
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
                                Comparativo entre equipes
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Cartões, Empréstimos e Outros Assuntos
                            </p>
                        </div>
                        
                        <Graficos equipes={dadosMetricas.equipe} empresa={dadosMetricas} />
                    </section>

                    <section className="mt-4">
                        <TabelaMetricas equipes={dadosMetricas.equipe} empresa={dadosMetricas} />
                    </section>

                </main>
            }
        </div>
    );
}