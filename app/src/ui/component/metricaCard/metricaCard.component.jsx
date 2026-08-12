import { BG_AZUL_CLARO, TEXTO_AZUL_BG_AZUL_CLARO, TEXTO_CINZA_BG_BRANCO, TEXTO_PRETO_BG_BRANCO } from '../../../constants/cores.constant.jsx';

export function MetricCard({ icone, titulo, valor, descricao }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className={`flex items-center gap-2 ${TEXTO_CINZA_BG_BRANCO}`}>
        
            <span className={`flex h-8 w-8 items-center justify-center rounded-md ${BG_AZUL_CLARO} ${TEXTO_AZUL_BG_AZUL_CLARO}`}>
                {icone}
            </span>

            <span className="text-sm font-medium">{titulo}</span>
        </div>
      
        <p className={`font-mono text-3xl font-semibold tabular-nums ${TEXTO_PRETO_BG_BRANCO}`}>{valor}</p>
      
        {descricao && <p className={`text-xs ${TEXTO_CINZA_BG_BRANCO}`}>{descricao}</p>}
    </div>
  );
}