import axios from "axios";

// Instancia de Axios con configuración base
const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // Permite enviar cookies con las solicitudes
});

// Almacena el token CSRF en memoria para evitar múltiples solicitudes innecesarias
let csrfToken = null;
let isFetchingCsrf = false; // Bandera para evitar múltiples solicitudes concurrentes

// Función para obtener el token CSRF
const getCsrfToken = async () => {
  if (csrfToken) {
    return csrfToken;
  }

  // Si ya hay una solicitud en curso, espera a que termine
  if (isFetchingCsrf) {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (!isFetchingCsrf) {
          clearInterval(checkInterval);
          if (csrfToken) {
            resolve(csrfToken);
          } else {
            reject(new Error("Error al obtener el token CSRF."));
          }
        }
      }, 100);
    });
  }

  isFetchingCsrf = true; // Marca que la solicitud está en curso
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_CSRF_BASE_URL}/sanctum/csrf-cookie`,
      {
        withCredentials: true, // Necesario para incluir cookies en la solicitud
        headers: {
          Accept: "application/json",
        },
      }
    );

    // Intenta obtener el token directamente de las cookies
    const cookies = document.cookie.split(";");
    const token = cookies
      .find((cookie) => cookie.trim().startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (!token) {
      throw new Error("No se encontró el token CSRF en las cookies.");
    }

    csrfToken = decodeURIComponent(token); // Guarda el token en memoria
    return csrfToken;
  } catch (error) {
    throw error;
  } finally {
    isFetchingCsrf = false; // Marca que la solicitud ha finalizado
  }
};

// Función para verificar si una URL requiere CSRF
const requiresCsrf = (method) => {
  return ["post", "put", "patch", "delete"].includes(method.toLowerCase());
};

// Interceptor para manejar CSRF y autenticación
AxiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Solo para métodos que requieren CSRF
      if (requiresCsrf(config.method)) {
        const token = await getCsrfToken();
        config.headers["X-XSRF-TOKEN"] = token;
      }

      // Agregar token de autenticación si existe
      const authToken = localStorage.getItem("token");
      if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el token CSRF expiró, intenta obtener uno nuevo
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca que este intento ya fue reintentado
      try {
        csrfToken = null; // Invalida el token almacenado
        const newToken = await getCsrfToken();
        originalRequest.headers["X-XSRF-TOKEN"] = newToken;
        return AxiosInstance(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }

    // Si no está autenticado
    if (error.response?.status === 401) {
      localStorage.removeItem("token"); // Limpia el token local
      window.location.href = "/login"; // Redirige al login
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
