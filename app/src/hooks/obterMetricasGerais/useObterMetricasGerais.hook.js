import { useNavigate, useLocation } from "react-router-dom";
import { obterMetricasGeraisApi } from "../../api";
import { toast } from "react-toastify";

export function useObterMetricasGerais() {

    const navigate = useNavigate();
    const location = useLocation();

    async function obterMetricasGerais(data) {
        try {
            const response = await obterMetricasGeraisApi(data);
            
            return response;
        } catch (error) {

            const isTimeout = error.code === 'ECONNABORTED';
            const isServidorIndisponivel = error.response?.status === 503;
            const isSemInternet = !error.response && !isTimeout && error.isAxiosError;

            if (isTimeout || isServidorIndisponivel || isSemInternet) {

                navigate('/indisponivel', { 
                    state: { tentativaAcesso: location.pathname } 
                });
                return;
            }

            toast.error(error.message || "Não foi possível carregar os dados da Home.");
        }
    }

    return { obterMetricasGerais };
}