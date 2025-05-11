import AxiosInstance from "../axiosInstance";

// Servicio para obtener delegaciones asignadas a un empleado
const getAssignedDelegations = async (employeeId) => {
  try {
    const response = await AxiosInstance.get(`/subrogations/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Servicio para obtener delegaciones asignadas por un empleado
const getDelegatedByEmployee = async (employeeId) => {
  try {
    const response = await AxiosInstance.get(`/subrogations/assigned-by/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Servicio para obtener todas las delegaciones del sistema
const getAllDelegations = async () => {
  try {
    const response = await AxiosInstance.get("/subrogations/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getAssignedDelegations, getDelegatedByEmployee, getAllDelegations };
