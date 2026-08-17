import { useNavigate, useLocation } from "react-router-dom";
import { obterHomeApi } from "../../api";
import { toast } from "react-toastify";

export function useObterHome() {

    const navigate = useNavigate();
    const location = useLocation();

    async function obterHome() {
        try {
            const response = await obterHomeApi();
            
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

    return { obterHome };
}