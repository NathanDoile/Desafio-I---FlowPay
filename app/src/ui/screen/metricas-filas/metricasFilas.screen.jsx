import { useState } from "react";
import { CabecalhoMetricas, Graficos, MetricasGeraisCard, TabelaMetricas } from "../../component/index.js";
import { periodosDisponiveis, getMetricsForPeriod } from "../../../mocks/metricas.mock.js";

export function MetricasFilas() {
    
    const [periodoSelecionado, setPeriodoSelecionado] = useState(periodosDisponiveis[0].value);
    
    const { empresa, equipes } = getMetricsForPeriod(periodoSelecionado);

    const periodoLabel = periodosDisponiveis.find(p => p.value === periodoSelecionado)?.label;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
        
            <CabecalhoMetricas 
                periodoSelecionado={periodoSelecionado} 
                setPeriodoSelecionado={setPeriodoSelecionado} 
            />

            <main className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-8 md:px-8">
                
                <section>
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-sm font-medium uppercase tracking-wide text-gray-500">
                            Resumo geral da empresa
                        </h2>
                        {/* Destaque em Azul LAB para o mês sendo analisado */}
                        <p className="text-sm font-semibold text-[lab(20.6116_-0.0234246_-27.6176)]">
                            Análise de {periodoLabel}
                        </p>
                    </div>
                    
                    <MetricasGeraisCard empresa={empresa} />
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
                    
                    <Graficos equipes={equipes} empresa={empresa} />
                </section>

                <section className="mt-4">
                    <TabelaMetricas equipes={equipes} empresa={empresa} />
                </section>

            </main>
        </div>
    );
}