import AxiosInstance from "./axiosInstance";

// Obtener estadísticas de permisos por mes
const getAprobacionesPorMes = async (employeeId) => {
  try {
    const response = await AxiosInstance.get(`/statistics/aprobaciones/mes/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener estadísticas de permisos por tipo
const getAprobacionesPorTipo = async (employeeId) => {
  try {
    const response = await AxiosInstance.get(`/statistics/aprobaciones/tipo/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener estadísticas del dashboard
const getDashboardStatistics = async () => {
  try {
    const response = await AxiosInstance.get('/dashboard-statistics');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener estadísticas de permisos para un empleado solicitante
const getSolicitudesPermisosPorEmpleado = async (employeeId) => {
  try {
    const response = await AxiosInstance.get(`/dashboard-statistics/solicitudes/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Servicio para cargar todas las estadísticas del dashboard, incluyendo aprobaciones por mes, por tipo y solicitudes de permisos por empleado
const getCompleteDashboardStatistics = async (employeeId) => {
  try {
    const [dashboardStats, aprobacionesPorMes, aprobacionesPorTipo, solicitudesPermisos] = await Promise.all([
      getDashboardStatistics(),
      getAprobacionesPorMes(employeeId),
      getAprobacionesPorTipo(employeeId),
      getSolicitudesPermisosPorEmpleado(employeeId)
    ]);
    return { ...dashboardStats, aprobacionesPorMes, aprobacionesPorTipo, solicitudesPermisos };
  } catch (error) {
    throw error;
  }
};

export { getAprobacionesPorMes, getAprobacionesPorTipo, getDashboardStatistics, getCompleteDashboardStatistics, getSolicitudesPermisosPorEmpleado };
