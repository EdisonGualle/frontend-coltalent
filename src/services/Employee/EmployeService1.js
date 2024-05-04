import AxiosInstance from "../axiosInstance";

const getEmployees = async () => {
    try {
      const response = await AxiosInstance.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
      throw error;
    }
  };

 const getEmployee = async (employee) => {
    try {
      const response = await AxiosInstance.get(`/employees/${employee}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el empleado:', error);
      throw error;
    }
  }

export { getEmployees, getEmployee };
