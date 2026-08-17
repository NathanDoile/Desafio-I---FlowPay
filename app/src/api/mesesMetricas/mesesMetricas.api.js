import { axiosInstance } from "../base/axiosInstance";

export async function obterMesesMetricasApi() {
  try {
    
    const response = await axiosInstance.get(`/relatorios/meses-metricas`);
    
    return response.data;
  } catch (error) {

    if (error.code === 'ECONNABORTED' || !error.response || error.response?.status === 503) {
      throw error; 
    }
    throw new Error(error.response?.data?.message || "Ocorreu um erro ao obter os dados da tela Home.");
  }
}