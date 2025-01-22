import axios from "axios";

// Instancia de Axios con configuración base
const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar autenticación con Bearer Token
AxiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("token"); // Recuperar el token de almacenamiento local
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // Eliminar el token almacenado
      window.location.href = "/login"; // Redirigir al login
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
