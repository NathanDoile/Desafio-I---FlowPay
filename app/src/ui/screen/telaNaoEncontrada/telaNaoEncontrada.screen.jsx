import { ArrowLeft, Home, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import{ CabecalhoTelaNaoEncontrada } from '../../component/cabecalho/cabecalhoTelaNaoEncontrada.component';
import { BG_LARANJA, TEXTO_AZUL_BG_BRANCO, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO } from "../../../constants/cores.constant";

export function TelaNaoEncontrada(){

    const navigate = useNavigate();

    return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      
      <CabecalhoTelaNaoEncontrada />

      {/* Conteúdo Principal */}
      <section className="mx-auto flex min-h-[calc(100vh-89px)] max-w-6xl items-center px-6 py-16 lg:px-12">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          
          <div className="order-2 lg:order-1">
            <p className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[lab(78.8702_18.9326_41.9203)]">
              Erro 404 / Rota indisponível
            </p>
            <h1 className={`max-w-xl text-balance text-5xl font-bold tracking-[-0.06em] ${TEXTO_AZUL_BG_BRANCO} sm:text-6xl lg:text-7xl`}>
              Esta fila não está no mapa.
            </h1>
            <p className={`mt-7 max-w-md text-pretty text-base leading-7 ${TEXTO_CINZA_BG_BRANCO}`}>
              A página que você tentou acessar não existe ou foi movida. Volte ao painel para acompanhar a distribuição da sua equipe.
            </p>
            
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link 
                to="/" 
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-lg ${BG_LARANJA} px-5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500`}
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Voltar ao painel
              </Link>
              
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 text-sm font-bold ${TEXTO_CINZA_BG_BRANCO} shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300`}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Voltar à página anterior
              </button>
            </div>
            
            <div className={`mt-10 flex items-center gap-2 text-xs ${TEXTO_CINZA_BG_BRANCO}`}>
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Verifique o endereço ou tente novamente.</span>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-xl sm:p-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                  <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${TEXTO_CINZA_BG_BRANCO}`}>Visão operacional</p>
                  <p className={`mt-1 text-sm font-semibold ${TEXTO_PRETO_BG_BRANCO}`}>Filas por equipe</p>
                </div>
                <span className={`rounded-full ${BG_LARANJA} px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-orange-900`}>
                  Sem dados
                </span>
              </div>
              
              <div className="mt-7 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className={`font-mono text-[10px] uppercase ${TEXTO_CINZA_BG_BRANCO}`}>Ativas</p>
                  <p className="mt-2 text-2xl font-bold text-gray-300">—</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className={`-mono text-[10px] uppercase ${TEXTO_CINZA_BG_BRANCO}`}>Equipe</p>
                  <p className="mt-2 text-2xl font-bold text-gray-300">—</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className={`font-mono text-[10px] uppercase ${TEXTO_CINZA_BG_BRANCO}`}>SLA</p>
                  <p className="mt-2 text-2xl font-bold text-gray-300">—</p>
                </div>
              </div>
              
              <div className="mt-5 space-y-3">
                {["Atendimento geral", "Suporte técnico", "Onboarding"].map((label) => (
                  <div key={label} className="flex items-center gap-4 rounded-lg border border-gray-100 px-4 py-4">
                    <span className={`h-2 w-2 rounded-full ${BG_LARANJA}`} aria-hidden="true" />
                    <span className={`flex-1 text-sm font-medium ${TEXTO_CINZA_BG_BRANCO}`}>{label}</span>
                    <span className="font-mono text-xs text-gray-300">— / —</span>
                  </div>
                ))}
              </div>
              
              <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-orange-50" aria-hidden="true" />
            </div>
            
            <p className={`mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] ${TEXTO_CINZA_BG_BRANCO}`}>
              Painel temporariamente fora de alcance
            </p>
          </div>
          
        </div>
      </section>
    </main>
  );
}