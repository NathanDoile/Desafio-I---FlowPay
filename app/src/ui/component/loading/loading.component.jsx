import { Loader2 } from "lucide-react";
import { TEXTO_PRETO_BG_BRANCO } from "../../../constants/cores.constant"; // Ajuste o caminho se precisar

export function Loading() {
  return (

    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm transition-all">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5">
        
        <Loader2 className="h-10 w-10 animate-spin text-[lab(78.8933%_18.386_42.2808)]" aria-hidden="true" />
        
        <p className={`text-sm font-semibold ${TEXTO_PRETO_BG_BRANCO}`}>
          Carregando...
        </p>

      </div>
    </div>
  );
}