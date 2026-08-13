import { LayoutDashboard } from "lucide-react";
import { BG_AZUL_ESCURO, BG_LARANJA, TEXTO_PRETO_BG_LARANJA, TEXTO_CINZA_BG_AZUL } from "../../../constants/cores.constant";
import { SeletorPeriodo } from "../seletorPeriodo/seletorPeriodo.component";
import { useNavigate } from "react-router-dom";

export function CabecalhoMetricas({ periodoSelecionado, setPeriodoSelecionado }){

  const navigate = useNavigate();

    return (
    <header className={`${BG_AZUL_ESCURO} text-white shadow-md`}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-3">
          
          <span onClick={() => navigate("/")} className={`flex h-11 w-11 items-center justify-center rounded-xl ${BG_LARANJA} ${TEXTO_PRETO_BG_LARANJA} cursor-pointer`}>
            <LayoutDashboard className="h-6 w-6" aria-hidden="true" />
          </span>
          
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-balance">
              Métricas de Filas de Distribuição
            </h1>
            <p className={`text-sm ${TEXTO_CINZA_BG_AZUL}`}>
              Visão gerencial comparativa entre equipes
            </p>
          </div>
        </div>

        <SeletorPeriodo value={periodoSelecionado} onChange={setPeriodoSelecionado} />
        
      </div>
    </header>
  );
}