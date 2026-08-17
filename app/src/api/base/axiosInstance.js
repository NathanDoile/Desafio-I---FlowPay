import axios from "axios";
import { API_URL } from "../../constants/api.constants.jsx";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  withCredentials: true,
});