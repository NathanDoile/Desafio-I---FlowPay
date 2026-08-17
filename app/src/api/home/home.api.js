import { axiosInstance } from "../base/axiosInstance";

export async function obterHomeApi() {
  try {
    const response = await axiosInstance.get(`/relatorios/home`);

    return response.data;
  } catch (error) {

    if (error.code === 'ECONNABORTED' || !error.response || error.response?.status === 503) {
      throw error; 
    }
    throw new Error(error.response?.data?.message || "Ocorreu um erro ao obter os dados da tela Home.");
  }
}